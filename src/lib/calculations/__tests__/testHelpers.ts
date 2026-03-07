import type { CalculatorInput, MarketData } from "@/types/calculator";
import { getStaticMarketData } from "../marketData";

export function getTestMarketData(): MarketData {
  return getStaticMarketData();
}

const BASE_INPUT: CalculatorInput = {
  name: "",
  email: "",
  buy: {
    carPrice: 170000,
    catalogPrice: 170000,
    isUsed: false,
    fuelType: "gasoline",
    consumptionKmPerUnit: 14,
  },
  lease: {
    monthlyPayment: 3500,
    leaseTerm: 3,
    leaseDownPayment: 0,
    fuelType: "gasoline",
    consumptionKmPerUnit: 14,
    leaseIncludes: {
      maintenance: true,
      mandatoryInsurance: true,
      comprehensiveInsurance: true,
      registration: true,
    },
  },
  cashOnHand: 50000,
  oldCarValue: 60000,
  mandatoryInsuranceQuote: 1500,
  comprehensiveInsuranceQuote: 5000,
  annualKm: 15000,
  isBusinessUse: false,
  useLoan: false,
  financing: {
    interestRate: 4.5,
    loanTermYears: 5,
    originationFee: 0,
  },
  comparisonPeriodYears: 3,
  includeInvestment: false,
};

export function makeInput(overrides: Record<string, unknown> = {}): CalculatorInput {
  return deepMerge(structuredClone(BASE_INPUT), overrides) as CalculatorInput;
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object"
    ) {
      deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
