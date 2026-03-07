import type { CalculatorInput } from "@/types/calculator";

export const DEFAULT_INPUT: CalculatorInput = {
  name: "",
  email: "",
  buy: {
    carPrice: 170000,
    catalogPrice: 170000,
    isUsed: true,
    usedCarAge: 2,
    fuelType: "hybrid",
    consumptionKmPerUnit: 18,
  },
  lease: {
    monthlyPayment: 3500,
    leaseTerm: 3,
    leaseDownPayment: 7900,
    fuelType: "hybrid",
    consumptionKmPerUnit: 18,
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
  useLoan: true,
  financing: {
    interestRate: 4.5,
    loanTermYears: 5,
    originationFee: 0,
  },
  comparisonPeriodYears: 3,
  includeInvestment: false,
};
