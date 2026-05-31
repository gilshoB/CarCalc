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

// ---- Registration Fee Table (2025, effective April 1) ----

const REGISTRATION_TIERS = [
  { maxPrice: 114_000, fee: 1_335 },
  { maxPrice: 138_000, fee: 1_660 },
  { maxPrice: 162_000, fee: 1_972 },
  { maxPrice: 183_000, fee: 2_326 },
  { maxPrice: 238_000, fee: 2_643 },
  { maxPrice: 338_000, fee: 3_693 },
  { maxPrice: Infinity, fee: 5_203 },
];

/**
 * Israeli MoT registration fee by "fee group" (kvuzat_agra_cd).
 *
 * Each vehicle model is assigned a fee group in the WLTP dataset. The
 * mapping from group -> annual fee is published yearly by the Ministry of
 * Transportation. This is the preferred lookup over our older price-tier
 * approximation, because it uses the actual classification the MoT itself
 * uses for billing.
 *
 * Numbers below are placeholders calibrated against the price-tier values
 * for the same price range — they should be refreshed against the
 * official MoT publication. Until that's done, calcRegistrationFee falls
 * back to the price tiers when no feeGroup is provided.
 */
const REGISTRATION_FEE_BY_GROUP: Record<number, number> = {
  1: 1_335,
  2: 1_460,
  3: 1_660,
  4: 1_810,
  5: 1_972,
  6: 2_120,
  7: 2_326,
  8: 2_490,
  9: 2_643,
  10: 2_900,
  11: 3_180,
  12: 3_500,
  13: 3_693,
  14: 4_400,
  15: 5_203,
};

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
    registrationFeeTiers: REGISTRATION_TIERS,
    registrationFeeByGroup: REGISTRATION_FEE_BY_GROUP,
    radioFee: 141,
    testFees: {
      combustion: 117.6,
      electric: 99.95,
      retest: 27.8,
    },
    testStartAge: 3,
    defaultInvestmentReturn: investmentReturn,
    year: 2025,
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
    registrationFeeTiers: REGISTRATION_TIERS,
    registrationFeeByGroup: REGISTRATION_FEE_BY_GROUP,
    radioFee: 141,
    testFees: {
      combustion: 117.6,
      electric: 99.95,
      retest: 27.8,
    },
    testStartAge: 3,
    defaultInvestmentReturn: FALLBACK_INVESTMENT_RETURN,
    year: 2025,
    lastUpdated: new Date().toISOString(),
  };
}
