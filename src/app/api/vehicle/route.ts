import { NextRequest, NextResponse } from "next/server";
import type { FuelType, VehicleIdentity } from "@/types/calculator";

// Israeli gov.il data.gov.il public datasets — free, no auth.
const WLTP_RESOURCE = "142afde2-6228-49f9-8a29-9b6c3a0cbe40"; // models + specs
const PRICE_RESOURCE = "39f455bf-6db0-4926-859d-017f34eacbcb"; // importer price list (catalog price)

const REVALIDATE_SECONDS = 24 * 60 * 60; // 24h cache for vehicle metadata
const GOV_TIMEOUT_MS = 15_000;
const COMMON_TRIM = "__common__";
const DRIVE_ALL = "__all__";
// sug_degem: "P" = private passenger car, "M" = commercial. We only ever want
// private cars — this drops vans/trucks/commercial junk from the picker lists.
const PRIVATE_CAR = "P";
// Pre-2000s rows in the dataset are legacy Hebrew/code junk ("סקודה צ'כיה 5דלתות").
// Real models run to the current year, so we only list cars from the last ~20
// years — plenty for a used-car comparison, and it drops the junk.
const MODEL_MIN_YEAR = new Date().getFullYear() - 20;

interface DatastoreRecord {
  [k: string]: unknown;
}

interface DatastoreResponse {
  success: boolean;
  result?: { records: DatastoreRecord[] };
}

async function fetchGov(
  resourceId: string,
  params: Record<string, string>,
  tag: string,
): Promise<DatastoreRecord[]> {
  const qs = new URLSearchParams({ resource_id: resourceId, ...params });
  const url = `https://data.gov.il/api/3/action/datastore_search?${qs.toString()}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(GOV_TIMEOUT_MS),
    next: { revalidate: REVALIDATE_SECONDS, tags: [tag, "vehicle-data"] },
  });
  if (!res.ok) {
    throw new Error(`gov.il ${resourceId} returned ${res.status}`);
  }
  const data = (await res.json()) as DatastoreResponse;
  if (!data.success || !data.result) {
    throw new Error(`gov.il ${resourceId} unsuccessful response`);
  }
  return data.result.records;
}

function mapFuelType(raw: string | undefined): FuelType | undefined {
  if (!raw) return undefined;
  const h = raw.trim();
  if (h.includes("חשמל") && !h.includes("היבריד")) return "electric";
  if (h.includes("היבריד")) return "hybrid";
  if (h.includes("דיזל")) return "diesel";
  if (h.includes("בנזין")) return "gasoline";
  return undefined;
}

function mostCommon<T>(values: T[]): { value: T | undefined; share: number } {
  if (values.length === 0) return { value: undefined, share: 0 };
  const counts = new Map<T, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best: { value: T; count: number } | null = null;
  for (const [value, count] of counts) {
    if (!best || count > best.count) best = { value, count };
  }
  return best
    ? { value: best.value, share: best.count / values.length }
    : { value: undefined, share: 0 };
}

function median(nums: number[]): number | undefined {
  const xs = nums.filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
  if (xs.length === 0) return undefined;
  const mid = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[mid] : Math.round((xs[mid - 1] + xs[mid]) / 2);
}

function avg(nums: number[]): number | undefined {
  const xs = nums.filter((n) => Number.isFinite(n) && n > 0);
  if (xs.length === 0) return undefined;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/**
 * Derive km/L from CO2 emissions (g/km).
 *  - Gasoline: 1 L of gasoline produces ~2310 g CO2 → km/L ≈ 2310 / CO2(g/km)
 *  - Diesel: 1 L produces ~2680 g CO2 → km/L ≈ 2680 / CO2
 *  - Hybrid: gasoline factor (the WLTP CO2 already reflects the hybrid system)
 *  - Electric: no CO2 emissions; can't derive km/kWh from CO2.
 */
function deriveKmPerLiter(co2: number | undefined, fuelType: FuelType | undefined): number | undefined {
  if (!co2 || co2 <= 0) return undefined;
  if (fuelType === "diesel") return Math.round((2680 / co2) * 10) / 10;
  if (fuelType === "gasoline" || fuelType === "hybrid") return Math.round((2310 / co2) * 10) / 10;
  return undefined;
}

// Model names are presented exactly as they appear in the WLTP table — but only
// the clean English ones. The legacy junk in this dataset is Hebrew-script
// descriptions/codes; real modern models use Latin commercial names. So we drop
// any name containing Hebrew characters, and require at least one Latin letter.
export function isLatinModel(name: string): boolean {
  const s = String(name ?? "").trim();
  if (s.length < 2) return false; // drop single-char strays like "P"
  if (/[֐-׿]/.test(s)) return false; // contains Hebrew → drop
  if (!/[A-Za-z]/.test(s)) return false; // must have a Latin letter (drops pure codes)
  return true;
}

// ---- Operations ----

async function opManufacturers() {
  const records = await fetchGov(
    WLTP_RESOURCE,
    {
      distinct: "true",
      fields: "tozar",
      filters: JSON.stringify({ sug_degem: PRIVATE_CAR }),
      limit: "1000",
    },
    "vehicle-makes",
  );
  const list = records
    .map((r) => String(r.tozar ?? "").trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "he"));
  // Deduplicate (in case distinct didn't fully de-dupe across whitespace variants)
  return Array.from(new Set(list));
}

async function opModels(manufacturer: string) {
  const records = await fetchGov(
    WLTP_RESOURCE,
    {
      distinct: "true",
      fields: "kinuy_mishari,shnat_yitzur",
      filters: JSON.stringify({ tozar: manufacturer, sug_degem: PRIVATE_CAR }),
      limit: "2000",
    },
    `vehicle-models:${manufacturer}`,
  );
  // Names presented exactly as they appear — kept filters: private cars only,
  // recent years, and English names (drops Hebrew/single-char junk). No name
  // editing — the user picks the model (and skips obvious typo entries).
  const list = records
    .filter((r) => Number(r.shnat_yitzur) >= MODEL_MIN_YEAR)
    .map((r) => String(r.kinuy_mishari ?? "").trim())
    .filter(isLatinModel);
  return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
}

async function opYears(manufacturer: string, model: string) {
  const records = await fetchGov(
    WLTP_RESOURCE,
    {
      distinct: "true",
      fields: "shnat_yitzur",
      filters: JSON.stringify({ tozar: manufacturer, kinuy_mishari: model, sug_degem: PRIVATE_CAR }),
      limit: "200",
    },
    `vehicle-years:${manufacturer}:${model}`,
  );
  const years = records
    .map((r) => Number(r.shnat_yitzur))
    .filter((y) => Number.isFinite(y) && y >= MODEL_MIN_YEAR)
    .sort((a, b) => b - a); // newest first
  return Array.from(new Set(years));
}

async function opTrims(manufacturer: string, model: string, year: number) {
  const records = await fetchGov(
    WLTP_RESOURCE,
    {
      distinct: "true",
      fields: "ramat_gimur",
      filters: JSON.stringify({ tozar: manufacturer, kinuy_mishari: model, shnat_yitzur: year, sug_degem: PRIVATE_CAR }),
      limit: "200",
    },
    `vehicle-trims:${manufacturer}:${model}:${year}`,
  );
  const trims = records
    .map((r) => String(r.ramat_gimur ?? "").trim())
    .filter(Boolean);
  // "__common__" always first option
  return [COMMON_TRIM, ...Array.from(new Set(trims)).sort()];
}

async function opResolve(
  manufacturer: string,
  model: string,
  year: number,
  trim: string | undefined,
  drive: string | undefined,
): Promise<{ vehicle: VehicleIdentity; drivetrains: string[] }> {
  const isCommon = !trim || trim === COMMON_TRIM;
  const hasDrive = !!drive && drive !== DRIVE_ALL;

  const tag = `vehicle:${manufacturer}:${model}:${year}:${trim ?? "all"}`;
  // `model` is the exact commercial name from the table. Match it directly.
  const baseFilters: Record<string, unknown> = {
    tozar: manufacturer,
    kinuy_mishari: model,
    shnat_yitzur: year,
    sug_degem: PRIVATE_CAR,
  };
  const filters = isCommon ? baseFilters : { ...baseFilters, ramat_gimur: trim };

  // Fetch specs (WLTP) and price in parallel.
  const [allWltpRecords, priceRecordsRaw] = await Promise.all([
    fetchGov(
      WLTP_RESOURCE,
      { filters: JSON.stringify(filters), limit: "200" },
      `${tag}:wltp`,
    ),
    fetchGov(
      PRICE_RESOURCE,
      { filters: JSON.stringify({ kinuy_mishari: model, shnat_yitzur: year }), limit: "100" },
      `${tag}:price`,
    ).catch(() => [] as DatastoreRecord[]),
  ]);

  // Drivetrain (4X2 / 4X4) is the biggest within-model price driver — expose it
  // as an optional narrowing axis, then narrow the working set to the chosen one.
  const drivetrains = Array.from(
    new Set(allWltpRecords.map((r) => String(r.hanaa_nm ?? "").trim()).filter(Boolean)),
  ).sort();
  const wltpRecords = hasDrive
    ? allWltpRecords.filter((r) => String(r.hanaa_nm ?? "").trim() === drive)
    : allWltpRecords;
  const degemCds = new Set(
    wltpRecords.map((r) => String(r.degem_cd ?? "")).filter(Boolean),
  );
  let priceRecords = priceRecordsRaw.filter((r) =>
    degemCds.has(String(r.degem_cd ?? "")),
  );
  // Fallback: if no degem_cd overlap, fall back to brand-name substring match.
  if (priceRecords.length === 0) {
    priceRecords = priceRecordsRaw.filter((r) =>
      String(r.tozeret_nm ?? "").includes(manufacturer),
    );
  }

  // Aggregate WLTP fields
  const fuelTypesRaw = wltpRecords.map((r) => String(r.delek_nm ?? ""));
  const fuelTypeRaw = mostCommon(fuelTypesRaw.filter(Boolean)).value;
  const fuelType = mapFuelType(fuelTypeRaw);

  const feeGroups = wltpRecords
    .map((r) => Number(r.kvuzat_agra_cd))
    .filter((n): n is number => Number.isFinite(n));
  const { value: feeGroup, share: feeGroupShare } = mostCommon(feeGroups);

  const pollutionGroups = wltpRecords
    .map((r) => Number(r.kvutzat_zihum))
    .filter((n): n is number => Number.isFinite(n) && n > 0);
  const { value: pollutionGroup } = mostCommon(pollutionGroups);

  const co2s = wltpRecords
    .map((r) => Number(r.CO2_WLTP ?? r.kamut_CO2 ?? 0))
    .filter((n) => Number.isFinite(n) && n > 0);
  const co2 = avg(co2s);
  const kmPerLiter = deriveKmPerLiter(co2, fuelType);

  // Aggregate price
  const prices = priceRecords
    .map((r) => Number(r.mehir))
    .filter((n) => Number.isFinite(n) && n > 0);
  const catalogPrice = median(prices);

  // Ambiguity: either using common trim OR feeGroup spread <70%
  const ambiguous = isCommon || (feeGroups.length > 1 && feeGroupShare < 0.7);

  return {
    vehicle: {
      manufacturer,
      model,
      modelYear: year,
      trim: isCommon ? COMMON_TRIM : trim,
      drivetrain: hasDrive ? drive : undefined,
      fuelType,
      fuelTypeRaw,
      pollutionGroup,
      feeGroup,
      co2WltpGramsPerKm: co2 ? Math.round(co2) : undefined,
      kmPerLiter,
      catalogPrice,
      ambiguous,
      source: "gov.il" as const,
    },
    drivetrains,
  };
}

// ---- HTTP entry ----

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const op = searchParams.get("op");

  try {
    if (op === "manufacturers") {
      const list = await opManufacturers();
      return NextResponse.json({ manufacturers: list });
    }

    if (op === "models") {
      const manufacturer = searchParams.get("manufacturer");
      if (!manufacturer) {
        return NextResponse.json({ error: "manufacturer is required" }, { status: 400 });
      }
      const list = await opModels(manufacturer);
      return NextResponse.json({ models: list });
    }

    if (op === "years") {
      const manufacturer = searchParams.get("manufacturer");
      const model = searchParams.get("model");
      if (!manufacturer || !model) {
        return NextResponse.json({ error: "manufacturer and model are required" }, { status: 400 });
      }
      const list = await opYears(manufacturer, model);
      return NextResponse.json({ years: list });
    }

    if (op === "trims") {
      const manufacturer = searchParams.get("manufacturer");
      const model = searchParams.get("model");
      const yearStr = searchParams.get("year");
      const year = Number(yearStr);
      if (!manufacturer || !model || !Number.isFinite(year)) {
        return NextResponse.json(
          { error: "manufacturer, model and year are required" },
          { status: 400 },
        );
      }
      const list = await opTrims(manufacturer, model, year);
      return NextResponse.json({ trims: list, commonOption: COMMON_TRIM });
    }

    if (op === "resolve") {
      const manufacturer = searchParams.get("manufacturer");
      const model = searchParams.get("model");
      const yearStr = searchParams.get("year");
      const trim = searchParams.get("trim") ?? undefined;
      const drive = searchParams.get("drive") ?? undefined;
      const year = Number(yearStr);
      if (!manufacturer || !model || !Number.isFinite(year)) {
        return NextResponse.json(
          { error: "manufacturer, model and year are required" },
          { status: 400 },
        );
      }
      const { vehicle, drivetrains } = await opResolve(manufacturer, model, year, trim, drive);
      return NextResponse.json({ vehicle, drivetrains });
    }

    return NextResponse.json({ error: "unknown op" }, { status: 400 });
  } catch (err) {
    // Graceful soft-fail: HTTP 200 with { error } so the UI can degrade
    // to manual entry without surfacing a scary 500 to the user.
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("[/api/vehicle]", op, message);
    return NextResponse.json(
      { error: message, source: "gov.il" },
      { status: 200 },
    );
  }
}
