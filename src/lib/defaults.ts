import type { CalculatorInput } from "@/types/calculator";

export const DEFAULT_INPUT: CalculatorInput = {
  name: "",
  email: "",
  buy: {
    carPrice: 0,
    isUsed: true,
    usedCarAge: 2,
    fuelType: "hybrid",
    consumptionKmPerUnit: 0,
    mandatoryInsuranceQuote: 0,
    comprehensiveInsuranceQuote: 0,
  },
  lease: {
    monthlyPayment: 0,
    leaseTerm: 3,
    leaseDownPayment: 0,
    fuelType: "hybrid",
    consumptionKmPerUnit: 0,
    mandatoryInsuranceQuote: 1500,
    comprehensiveInsuranceQuote: 5000,
    leaseIncludes: {
      maintenance: true,
      mandatoryInsurance: true,
      comprehensiveInsurance: true,
      registration: true,
    },
  },
  cashOnHand: 0,
  oldCarValue: 0,
  mandatoryInsuranceQuote: 1500,
  comprehensiveInsuranceQuote: 5000,
  annualKm: 15000,
  isBusinessUse: false,
  useLoan: true,
  financing: {
    interestRate: 4.5,
    loanTermYears: 5,
    originationFee: 0,
  },
  comparisonPeriodYears: 3,
  includeInvestment: false,
};
