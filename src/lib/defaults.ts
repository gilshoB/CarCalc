import type { CalculatorInput } from "@/types/calculator";

export const DEFAULT_INPUT: CalculatorInput = {
  name: "",
  email: "",
  buy: {
    carPrice: 0,
    isUsed: false,
    fuelType: "gasoline",
    consumptionKmPerUnit: 14,
  },
  lease: {
    monthlyPayment: 0,
    leaseTerm: 0,
    leaseDownPayment: 0,
    fuelType: "gasoline",
    consumptionKmPerUnit: 14,
    leaseIncludes: {
      maintenance: true,
      mandatoryInsurance: false,
      comprehensiveInsurance: false,
      registration: true,
    },
  },
  cashOnHand: 0,
  oldCarValue: 0,
  mandatoryInsuranceQuote: 0,
  comprehensiveInsuranceQuote: 0,
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
