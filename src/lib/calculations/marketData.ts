import type { MarketData, FuelPrices } from "@/types/calculator";

// ---- Cache ----

let cachedMarketData: MarketData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---- Hardcoded Fallbacks (Feb 2026) ----

const FALLBACK_FUEL_PRICES: FuelPrices = {
  benzine95: 7.13,
  benzine98: 9.20,
  diesel: 9.37,
  lpg: 3.78,
  electricityPerKwh: 0.55,
};

const FALLBACK_INVESTMENT_RETURN = 10.5; // 5-year S&P 500 avg ~10.5%

// ---- Official Registration Fee Table (אגרת רישוי, April 2026) ----
//
// The annual licensing fee is a fixed government table indexed by the car's
// ORIGINAL new-car catalog price (price group 1–7) AND its manufacture-year
// cohort. Source: Israeli Ministry of Transportation publication (2026).
// `fees` is ordered: [2024–2026, 2021–2023, 2017–2020, ≤2016].
const REGISTRATION_FEE_BANDS = [
  { maxPrice: 117_000, fees: [1_266, 1_109, 972, 849] as [number, number, number, number] },
  { maxPrice: 141_000, fees: [1_610, 1_404, 1_230, 1_076] as [number, number, number, number] },
  { maxPrice: 167_000, fees: [1_941, 1_698, 1_487, 1_297] as [number, number, number, number] },
  { maxPrice: 188_000, fees: [2_315, 1_968, 1_674, 1_422] as [number, number, number, number] },
  { maxPrice: 244_000, fees: [2_651, 2_184, 1_802, 1_490] as [number, number, number, number] },
  { maxPrice: 347_000, fees: [3_764, 2_823, 2_117, 1_585] as [number, number, number, number] },
  { maxPrice: Infinity, fees: [5_364, 3_753, 2_627, 1_840] as [number, number, number, number] },
];

// ---- Fuel Price Scraping ----

async function fetchFuelPrices(): Promise<FuelPrices> {
  try {
    const response = await fetch("https://www.delek.co.il/", {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CarCalc/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Try to extract fuel prices from the page
    // Delek.co.il typically shows prices in a structured format
    const benzine95 = extractPrice(html, /בנזין\s*95[^]*?(\d+\.\d+)/i) ?? FALLBACK_FUEL_PRICES.benzine95;
    const benzine98 = extractPrice(html, /בנזין\s*98[^]*?(\d+\.\d+)/i) ?? FALLBACK_FUEL_PRICES.benzine98;
    const diesel = extractPrice(html, /סולר[^]*?(\d+\.\d+)/i) ?? FALLBACK_FUEL_PRICES.diesel;
    const lpg = extractPrice(html, /גפ"מ|LPG[^]*?(\d+\.\d+)/i) ?? FALLBACK_FUEL_PRICES.lpg;

    return {
      benzine95,
      benzine98,
      diesel,
      lpg,
      electricityPerKwh: FALLBACK_FUEL_PRICES.electricityPerKwh, // no scraping source for electricity
    };
  } catch {
    console.warn("Failed to fetch fuel prices from delek.co.il, using fallback values");
    return FALLBACK_FUEL_PRICES;
  }
}

function extractPrice(html: string, pattern: RegExp): number | null {
  const match = html.match(pattern);
  if (match && match[1]) {
    const price = parseFloat(match[1]);
    if (price > 0 && price < 50) return price; // sanity check
  }
  return null;
}

// ---- S&P 500 Return Fetching ----

async function fetchSP500Return(): Promise<number> {
  try {
    // Use a public financial data endpoint
    // Yahoo Finance chart API for ^GSPC (S&P 500), 5-year range
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?range=5y&interval=1mo";
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CarCalc/1.0)",
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const closes = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
    if (!closes || closes.length < 2) throw new Error("No price data");

    const firstPrice = closes[0];
    const lastPrice = closes[closes.length - 1];
    if (!firstPrice || !lastPrice) throw new Error("Missing price data");

    // Calculate annualized return over 5 years
    const totalReturn = lastPrice / firstPrice;
    const annualReturn = (Math.pow(totalReturn, 1 / 5) - 1) * 100;

    // Sanity check: between -10% and 40%
    if (annualReturn > -10 && annualReturn < 40) {
      return Math.round(annualReturn * 10) / 10;
    }

    throw new Error("Return out of expected range");
  } catch {
    console.warn("Failed to fetch S&P 500 return, using fallback");
    return FALLBACK_INVESTMENT_RETURN;
  }
}

// ---- Public API ----

export async function getMarketData(): Promise<MarketData> {
  const now = Date.now();

  if (cachedMarketData && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedMarketData;
  }

  const [fuelPrices, investmentReturn] = await Promise.all([
    fetchFuelPrices(),
    fetchSP500Return(),
  ]);

  const marketData: MarketData = {
    fuelPrices,
    registrationFeeBands: REGISTRATION_FEE_BANDS,
    radioFee: 135,
    testFees: {
      combustion: 117.6,
      electric: 99.95,
      retest: 27.8,
    },
    testStartAge: 3,
    defaultInvestmentReturn: investmentReturn,
    year: 2026,
    lastUpdated: new Date().toISOString(),
  };

  cachedMarketData = marketData;
  cacheTimestamp = now;

  return marketData;
}

// For use in tests or when you need just the static data without fetching
export function getStaticMarketData(): MarketData {
  return {
    fuelPrices: FALLBACK_FUEL_PRICES,
    registrationFeeBands: REGISTRATION_FEE_BANDS,
    radioFee: 135,
    testFees: {
      combustion: 117.6,
      electric: 99.95,
      retest: 27.8,
    },
    testStartAge: 3,
    defaultInvestmentReturn: FALLBACK_INVESTMENT_RETURN,
    year: 2026,
    lastUpdated: new Date().toISOString(),
  };
}
