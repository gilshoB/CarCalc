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

export function calcDepreciation(
  carPrice: number,
  years: number,
  fuelType: FuelType,
  isUsed: boolean,
  usedCarAge: number = 0,
  overrideRates?: { yr1: number; yr2: number; yr3Plus: number },
): DepreciationResult {
  const curve = overrideRates
    ? { yr1: overrideRates.yr1 / 100, yr2: overrideRates.yr2 / 100, yr3Plus: overrideRates.yr3Plus / 100 }
    : DEPRECIATION_CURVES[fuelType];
  const startAge = isUsed ? usedCarAge : 0;

  // Calculate value from new to determine starting value
  let valueFromNew = carPrice;
  if (!isUsed) {
    // For new car, carPrice IS the starting value
    valueFromNew = carPrice;
  }

  // For used car, carPrice is what the user pays — we use it as starting value directly
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

  const residualValue = Math.round(currentValue);
  const totalDepreciation = carPrice - residualValue;

  return { totalDepreciation, residualValue, yearlyValues };
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

export function calcRegistrationFee(
  catalogPrice: number,
  years: number,
  tiers: RegistrationTier[],
  radioFee: number,
): number {
  // Find the matching tier
  const tier = tiers.find((t) => catalogPrice <= t.maxPrice);
  const annualFee = tier ? tier.fee : tiers[tiers.length - 1].fee;
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

const MAINTENANCE_MULTIPLIERS: Record<FuelType, number> = {
  gasoline: 1.0,
  diesel: 1.1,
  hybrid: 1.2,
  electric: 0.8,
};

const BASE_MAINTENANCE_RATE = 0.15; // ILS per km

export function calcMaintenance(
  annualKm: number,
  years: number,
  fuelType: FuelType,
): number {
  const multiplier = MAINTENANCE_MULTIPLIERS[fuelType];
  return Math.round(annualKm * BASE_MAINTENANCE_RATE * multiplier * years);
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
