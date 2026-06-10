import type {
  FuelType,
  FuelPrices,
  RegistrationFeeBand,
  DepreciationResult,
  LoanResult,
  InvestmentResult,
} from "@/types/calculator";

// ---- Depreciation ----

const DEPRECIATION_CURVES: Record<FuelType, { yr1: number; yr2: number; yr3Plus: number }> = {
  gasoline: { yr1: 0.15, yr2: 0.12, yr3Plus: 0.10 },
  diesel: { yr1: 0.15, yr2: 0.12, yr3Plus: 0.10 },
  hybrid: { yr1: 0.15, yr2: 0.12, yr3Plus: 0.10 },
  electric: { yr1: 0.25, yr2: 0.20, yr3Plus: 0.15 },
};

export interface DepreciationAdjustments {
  odometerKm?: number;
  previousHands?: number; // 1 = first hand (no penalty)
  wasLeased?: boolean;
}

const ASSUMED_KM_PER_YEAR = 15_000; // baseline used to compute expected km from age

function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}

/**
 * Compute the depreciation adjustment multiplier from used-car attributes.
 *
 *  - hands:  −3% per previous owner beyond the first
 *  - lease:  −7% if previously leased/rented
 *  - km:     ±0–3.75% based on km vs expected (±25% km swing → ±15% × 25% = ±3.75%)
 */
export function calcDepreciationAdjustments(
  startAge: number,
  adj: DepreciationAdjustments | undefined,
): { handsAdj: number; leaseAdj: number; kmAdj: number; composite: number } {
  const hands = adj?.previousHands ?? 1;
  const handsAdj = 1 - 0.03 * Math.max(0, hands - 1);
  const leaseAdj = adj?.wasLeased ? 0.93 : 1;

  let kmAdj = 1;
  if (adj?.odometerKm !== undefined && startAge > 0) {
    const expectedKm = ASSUMED_KM_PER_YEAR * startAge;
    const delta = (adj.odometerKm - expectedKm) / expectedKm;
    kmAdj = 1 - clamp(delta, -0.25, 0.25) * 0.15;
  }

  return {
    handsAdj,
    leaseAdj,
    kmAdj,
    composite: handsAdj * leaseAdj * kmAdj,
  };
}

export function calcDepreciation(
  carPrice: number,
  years: number,
  fuelType: FuelType,
  isUsed: boolean,
  usedCarAge: number = 0,
  overrideRates?: { yr1: number; yr2: number; yr3Plus: number },
  adjustments?: DepreciationAdjustments,
): DepreciationResult {
  const curve = overrideRates
    ? { yr1: overrideRates.yr1 / 100, yr2: overrideRates.yr2 / 100, yr3Plus: overrideRates.yr3Plus / 100 }
    : DEPRECIATION_CURVES[fuelType];
  const startAge = isUsed ? usedCarAge : 0;

  let currentValue = carPrice;
  const yearlyValues: number[] = [];

  for (let i = 0; i < years; i++) {
    const carAge = startAge + i + 1; // age at end of this year
    let rate: number;
    if (carAge === 1) rate = curve.yr1;
    else if (carAge === 2) rate = curve.yr2;
    else rate = curve.yr3Plus;

    currentValue = currentValue * (1 - rate);
    yearlyValues.push(Math.round(currentValue));
  }

  // Apply used-car adjustments to the FINAL residual value
  const adjustmentBreakdown = calcDepreciationAdjustments(startAge, adjustments);
  const adjustedResidual = currentValue * adjustmentBreakdown.composite;

  // Scale yearly values proportionally so chart looks consistent
  const adjustedYearly = yearlyValues.map((v) =>
    Math.round(v * adjustmentBreakdown.composite),
  );

  const residualValue = Math.round(adjustedResidual);
  const totalDepreciation = carPrice - residualValue;

  return {
    totalDepreciation,
    residualValue,
    yearlyValues: adjustedYearly,
    adjustments: adjustmentBreakdown,
  };
}

// ---- Fuel Cost ----

export function calcFuelCost(
  annualKm: number,
  years: number,
  fuelType: FuelType,
  consumptionKmPerUnit: number,
  fuelPrices: FuelPrices,
): number {
  let pricePerUnit: number;

  if (fuelType === "electric") {
    pricePerUnit = fuelPrices.electricityPerKwh;
  } else if (fuelType === "diesel") {
    pricePerUnit = fuelPrices.diesel;
  } else {
    // gasoline and hybrid use benzine 95
    pricePerUnit = fuelPrices.benzine95;
  }

  // consumptionKmPerUnit = km per liter (or km per kWh for electric)
  const annualCost = (annualKm / consumptionKmPerUnit) * pricePerUnit;
  return Math.round(annualCost * years);
}

// ---- Registration Fee ----

/**
 * Look up the annual registration fee.
 *
 * Preferred path: if `feeGroup` is provided AND `feeByGroup` table is
 * available, look up the fee directly by group (kvuzat_agra_cd). This
 * mirrors how the Israeli MoT actually bills.
 *
 * Fallback path: bucket by catalog price against the legacy 7-tier table.
 * This is what the calculator did before the gov.il integration.
 */
/**
 * Maps a manufacture year to the official fee-table year cohort index:
 *   0 → 2024–2026, 1 → 2021–2023, 2 → 2017–2020, 3 → ≤2016
 */
export function registrationYearCohort(manufactureYear: number): 0 | 1 | 2 | 3 {
  if (manufactureYear >= 2024) return 0;
  if (manufactureYear >= 2021) return 1;
  if (manufactureYear >= 2017) return 2;
  return 3;
}

/**
 * Annual licensing fee (אגרת רישוי) — fixed government table indexed by the
 * car's ORIGINAL new-car catalog price (price group) and its manufacture-year
 * cohort. Adds the radio fee. Returns the total over `years`.
 */
export function calcRegistrationFee(
  catalogPrice: number,
  years: number,
  bands: RegistrationFeeBand[],
  radioFee: number,
  manufactureYear: number,
): number {
  const cohort = registrationYearCohort(manufactureYear);
  const band = bands.find((b) => catalogPrice <= b.maxPrice) ?? bands[bands.length - 1];
  const annualFee = band.fees[cohort];
  return Math.round((annualFee + radioFee) * years);
}

// ---- טסט (Annual Vehicle Test) ----

export function calcTestFee(
  years: number,
  carAgeAtStart: number,
  fuelType: FuelType,
  testFees: { combustion: number; electric: number },
  testStartAge: number = 3,
): number {
  const feePerYear = fuelType === "electric" ? testFees.electric : testFees.combustion;
  let total = 0;

  for (let i = 0; i < years; i++) {
    const ageAtEndOfYear = carAgeAtStart + i + 1;
    if (ageAtEndOfYear > testStartAge) {
      total += feePerYear;
    }
  }

  return Math.round(total * 100) / 100;
}

// ---- Maintenance ----

// Maintenance is modeled the way drivers actually think about it: a routine
// service every N kilometers, at an average cost per service. The cost is
// "all-in" — it folds in ongoing wear (tires, brakes) amortized across the km,
// matching the old 0.15 ₪/km baseline (1,500 ₪ / 10,000 km = 0.15 ₪/km).
export const DEFAULT_SERVICE_INTERVAL_KM = 10000;

export const DEFAULT_SERVICE_COST: Record<FuelType, number> = {
  gasoline: 1500,
  diesel: 1650,
  hybrid: 1800,
  electric: 1200,
};

export function calcMaintenance(
  annualKm: number,
  years: number,
  fuelType: FuelType,
  override?: { serviceIntervalKm?: number; costPerService?: number },
): number {
  const intervalKm = override?.serviceIntervalKm ?? DEFAULT_SERVICE_INTERVAL_KM;
  const costPerService = override?.costPerService ?? DEFAULT_SERVICE_COST[fuelType];
  if (intervalKm <= 0) return 0;
  const servicesPerYear = annualKm / intervalKm;
  return Math.round(servicesPerYear * costPerService * years);
}

// ---- Loan / Financing ----

export function calcLoanCost(
  principal: number,
  interestRate: number,
  termYears: number,
  originationFee: number,
): LoanResult {
  if (principal <= 0) {
    return { monthlyPayment: 0, totalInterest: 0, totalPaid: 0, totalWithFee: 0 };
  }

  const monthlyRate = interestRate / 100 / 12;
  const numPayments = termYears * 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / numPayments;
  } else {
    // Standard amortization formula
    monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
    totalWithFee: Math.round(totalPaid + originationFee),
  };
}

// ---- Tax Benefits (Business) ----

const BUSINESS_RECOGNITION_RATE = 0.45; // 45% of expenses recognized

export function calcBusinessTaxBenefits(
  deductibleExpenses: number,
  marginalTaxRate: number,
): number {
  const recognized = deductibleExpenses * BUSINESS_RECOGNITION_RATE;
  return Math.round(recognized * (marginalTaxRate / 100));
}

// ---- VAT reclaim (business, private car) ----
// A licensed business (Osek Murshe) using the car mainly for work reclaims 2/3
// of the input VAT on RUNNING expenses (fuel + maintenance/repairs). VAT is NOT
// reclaimable on: the car purchase, lease payments (private car <3.5t), or
// insurance (VAT-exempt). Prices we use are VAT-inclusive, so the embedded VAT
// is amount × rate/(1+rate).
export const VAT_RATE = 0.18; // Israel, since 2025
export const CAR_INPUT_VAT_SHARE = 2 / 3; // deductible share for a business car

/** Reclaimable input VAT (2/3) embedded in VAT-inclusive running expenses. */
export function calcCarVatReclaim(vatableExpenses: number): number {
  const embeddedVat = vatableExpenses * (VAT_RATE / (1 + VAT_RATE));
  return Math.round(embeddedVat * CAR_INPUT_VAT_SHARE);
}

// ---- Investment Opportunity Cost ----

// Israeli capital-gains tax on securities (real gain). Applied to the
// investment *gain* — not the principal — when comparing the liquid-capital
// opportunity of leasing vs. sinking the money into a car.
export const CAPITAL_GAINS_TAX_RATE = 0.25;

export function calcInvestmentReturn(
  principal: number,
  years: number,
  annualReturnRate: number,
): InvestmentResult {
  if (principal <= 0 || years <= 0) {
    return { gain: 0, finalValue: principal };
  }

  const rate = annualReturnRate / 100;
  const finalValue = principal * Math.pow(1 + rate, years);
  const gain = finalValue - principal;

  return {
    gain: Math.round(gain),
    finalValue: Math.round(finalValue),
  };
}

// ---- Insurance (passthrough — user enters quotes) ----

export function calcInsurance(
  mandatoryQuote: number,
  comprehensiveQuote: number,
  years: number,
): { mandatory: number; comprehensive: number; total: number } {
  return {
    mandatory: Math.round(mandatoryQuote * years),
    comprehensive: Math.round(comprehensiveQuote * years),
    total: Math.round((mandatoryQuote + comprehensiveQuote) * years),
  };
}
