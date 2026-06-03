"use client";

import { useState, useEffect, useCallback } from "react";
import type { getTranslations } from "@/i18n/config";
import type { VehicleIdentity } from "@/types/calculator";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";

const COMMON_TRIM = "__common__";
const DRIVE_ALL = "__all__";

interface VehiclePickerProps {
  t: ReturnType<typeof getTranslations>;
  vehicle?: VehicleIdentity;
  /** Called whenever the picker resolves a full vehicle (fuelType/consumption/catalogPrice auto-fill). */
  onResolve: (vehicle: VehicleIdentity) => void;
  /** Called when the user switches to manual entry (clears the vehicle). */
  onManualEntry: () => void;
}

async function fetchOp<T>(params: Record<string, string>): Promise<T | null> {
  const qs = new URLSearchParams(params);
  try {
    const res = await fetch(`/api/vehicle?${qs.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return data as T;
  } catch {
    return null;
  }
}

export default function VehiclePicker({ t, vehicle, onResolve, onManualEntry }: VehiclePickerProps) {
  const f = t.form.vehiclePicker;

  // Cascade selections — seeded from an existing vehicle if present.
  const [manufacturer, setManufacturer] = useState(vehicle?.manufacturer ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [year, setYear] = useState(vehicle?.modelYear ? String(vehicle.modelYear) : "");
  const [trim, setTrim] = useState(vehicle?.trim ?? "");
  const [drive, setDrive] = useState(vehicle?.drivetrain ?? DRIVE_ALL);

  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [trims, setTrims] = useState<string[]>([]);
  const [drivetrains, setDrivetrains] = useState<string[]>([]);

  const [loading, setLoading] = useState<"manufacturers" | "models" | "years" | "trims" | "resolve" | null>(null);
  const [resolveError, setResolveError] = useState(false);

  // Load manufacturers on mount.
  useEffect(() => {
    let active = true;
    setLoading("manufacturers");
    fetchOp<{ manufacturers: string[] }>({ op: "manufacturers" }).then((data) => {
      if (!active) return;
      setManufacturers(data?.manufacturers ?? []);
      setLoading(null);
    });
    return () => {
      active = false;
    };
  }, []);

  const placeholderOpt = { value: "", label: f.selectPlaceholder };
  const toOptions = (xs: (string | number)[]) => [
    placeholderOpt,
    ...xs.map((x) => ({ value: String(x), label: String(x) })),
  ];

  const trimOptions = [
    placeholderOpt,
    { value: COMMON_TRIM, label: f.trimCommon },
    ...trims.filter((x) => x !== COMMON_TRIM).map((x) => ({ value: x, label: x })),
  ];

  const resolve = useCallback(
    async (mfr: string, mdl: string, yr: string, trm: string, drv: string) => {
      setLoading("resolve");
      setResolveError(false);
      const data = await fetchOp<{ vehicle: VehicleIdentity; drivetrains?: string[] }>({
        op: "resolve",
        manufacturer: mfr,
        model: mdl,
        year: yr,
        trim: trm || COMMON_TRIM,
        drive: drv || DRIVE_ALL,
      });
      setLoading(null);
      if (data?.vehicle) {
        setDrivetrains(data.drivetrains ?? []);
        onResolve(data.vehicle);
      } else {
        setResolveError(true);
      }
    },
    [onResolve],
  );

  const handleManufacturer = useCallback(async (value: string) => {
    setManufacturer(value);
    setModel("");
    setYear("");
    setTrim("");
    setDrive(DRIVE_ALL);
    setModels([]);
    setYears([]);
    setTrims([]);
    setDrivetrains([]);
    if (!value) return;
    setLoading("models");
    const data = await fetchOp<{ models: string[] }>({ op: "models", manufacturer: value });
    setModels(data?.models ?? []);
    setLoading(null);
  }, []);

  const handleModel = useCallback(
    async (value: string) => {
      setModel(value);
      setYear("");
      setTrim("");
      setDrive(DRIVE_ALL);
      setYears([]);
      setTrims([]);
      setDrivetrains([]);
      if (!value) return;
      setLoading("years");
      const data = await fetchOp<{ years: number[] }>({ op: "years", manufacturer, model: value });
      setYears(data?.years ?? []);
      setLoading(null);
    },
    [manufacturer],
  );

  const handleYear = useCallback(
    async (value: string) => {
      setYear(value);
      setTrim("");
      setTrims([]);
      setDrive(DRIVE_ALL);
      setDrivetrains([]);
      if (!value) return;
      setLoading("trims");
      const data = await fetchOp<{ trims: string[] }>({
        op: "trims",
        manufacturer,
        model,
        year: value,
      });
      const list = data?.trims ?? [];
      setTrims(list);
      setLoading(null);
      // Auto-resolve with the Common aggregate as soon as the year is picked.
      await resolve(manufacturer, model, value, COMMON_TRIM, DRIVE_ALL);
      setTrim(COMMON_TRIM);
    },
    [manufacturer, model, resolve],
  );

  const handleTrim = useCallback(
    async (value: string) => {
      setTrim(value);
      setDrive(DRIVE_ALL); // drivetrain options depend on the trim — reset
      if (!value) return;
      await resolve(manufacturer, model, year, value, DRIVE_ALL);
    },
    [manufacturer, model, year, resolve],
  );

  const handleDrive = useCallback(
    async (value: string) => {
      setDrive(value);
      await resolve(manufacturer, model, year, trim || COMMON_TRIM, value);
    },
    [manufacturer, model, year, trim, resolve],
  );

  const showAmbiguous = vehicle?.ambiguous;
  const isCommon = !vehicle?.trim || vehicle.trim === COMMON_TRIM;

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-700 dark:bg-zinc-800/40">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{f.title}</h3>
        <button
          type="button"
          onClick={onManualEntry}
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          {f.manualEntry}
        </button>
      </div>
      <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">{f.hint}</p>

      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <FormField label={f.manufacturer}>
          <Select
            value={manufacturer}
            onChange={handleManufacturer}
            options={toOptions(manufacturers)}
          />
        </FormField>

        <FormField label={f.model}>
          <Select
            value={model}
            onChange={handleModel}
            options={toOptions(models)}
          />
        </FormField>

        <FormField label={f.year}>
          <Select
            value={year}
            onChange={handleYear}
            options={toOptions(years)}
          />
        </FormField>

        <FormField label={f.trim}>
          <Select
            value={trim}
            onChange={handleTrim}
            options={trimOptions}
          />
        </FormField>

        {drivetrains.length > 1 && (
          <FormField label={f.drivetrain}>
            <Select
              value={drive}
              onChange={handleDrive}
              options={[
                { value: DRIVE_ALL, label: f.drivetrainAll },
                ...drivetrains.map((d) => ({ value: d, label: d })),
              ]}
            />
          </FormField>
        )}
      </div>

      {loading && (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{f.loading}</p>
      )}

      {resolveError && (
        <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">{f.resolveError}</p>
      )}

      {!loading && showAmbiguous && (
        <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
          {isCommon ? f.ambiguousCommonNote : f.ambiguousNote}
        </p>
      )}

      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">{f.manualEntryHint}</p>
    </div>
  );
}
