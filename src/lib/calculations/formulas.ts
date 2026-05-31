import type {
  FuelType,
  FuelPrices,
  RegistrationTier,
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
export function calcRegistrationFee(
  catalogPrice: number,
  years: number,
  tiers: RegistrationTier[],
  radioFee: number,
  feeGroup?: number,
  feeByGroup?: Record<number, number>,
): number {
  let annualFee: number;

  if (feeGroup !== undefined && feeByGroup && feeByGroup[feeGroup] !== undefined) {
    // Preferred: lookup by MoT fee group
    annualFee = feeByGroup[feeGroup];
  } else {
    // Fallback: price-banded tiers
    const tier = tiers.find((t) => catalogPrice <= t.maxPrice);
    annualFee = tier ? tier.fee : tiers[tiers.length - 1].fee;
  }

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

export const MAINTENANCE_MULTIPLIERS: Record<FuelType, number> = {
  gasoline: 1.0,
  diesel: 1.1,
  hybrid: 1.2,
  electric: 0.8,
};

export const BASE_MAINTENANCE_RATE = 0.15; // ILS per km

export function calcMaintenance(
  annualKm: number,
  years: number,
  fuelType: FuelType,
  override?: { ratePerKm?: number; multipliers?: Partial<Record<FuelType, number>> },
): number {
  const rate = override?.ratePerKm ?? BASE_MAINTENANCE_RATE;
  const multiplier =
    override?.multipliers?.[fuelType] ?? MAINTENANCE_MULTIPLIERS[fuelType];
  return Math.round(annualKm * rate * multiplier * years);
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

// ---- Investment Opportunity Cost ----

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
