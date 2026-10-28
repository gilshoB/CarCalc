import { z } from "zod";
import { getMarketData } from "./marketData";
import { calcBuyScenario } from "./buyCalculator";
import { calcLeaseScenario } from "./leaseCalculator";
import { compareScenarios } from "./compare";
import type { CalculatorInput, CalculatorOutput } from "@/types/calculator";

// Shared by /api/calculate and /api/send-results so both validate the same
// input and produce the exact same numbers.

const FuelTypeSchema = z.enum(["gasoline", "diesel", "electric", "hybrid", "plugin_hybrid"]);

const VehicleIdentitySchema = z.object({
  manufacturer: z.string(),
  manufacturerCode: z.number().optional(),
  model: z.string(),
  modelCode: z.string().optional(),
  modelYear: z.number(),
  trim: z.string().optional(),
  fuelType: FuelTypeSchema.optional(),
  fuelTypeRaw: z.string().optional(),
  pollutionGroup: z.number().optional(),
  feeGroup: z.number().optional(),
  co2WltpGramsPerKm: z.number().optional(),
  kmPerLiter: z.number().optional(),
  catalogPrice: z.number().optional(),
  ambiguous: z.boolean().optional(),
  source: z.enum(["gov.il", "manual"]),
});

export const CalculatorInputSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),

  buy: z.object({
    carPrice: z.number().positive(),
    catalogPrice: z.number().min(0).optional(),
    isUsed: z.boolean(),
    usedCarAge: z.number().int().min(0).optional(),
    fuelType: FuelTypeSchema,
    consumptionKmPerUnit: z.number().positive(),
    plugElectricSharePct: z.number().min(0).max(100).optional(),
    vehicle: VehicleIdentitySchema.optional(),
    odometerKm: z.number().min(0).optional(),
    previousHands: z.number().int().min(1).optional(),
    wasLeased: z.boolean().optional(),
    mandatoryInsuranceQuote: z.number().min(0).optional(),
    comprehensiveInsuranceQuote: z.number().min(0).optional(),
    workplaceBenefitMonthly: z.number().min(0).optional(),
  }),

  lease: z.object({
    monthlyPayment: z.number().positive(),
    leaseTerm: z.number().int().min(0).default(0),
    leaseDownPayment: z.number().min(0).default(0),
    leaseCarAge: z.number().int().min(0).optional(),
    fuelType: FuelTypeSchema,
    consumptionKmPerUnit: z.number().positive(),
    plugElectricSharePct: z.number().min(0).max(100).optional(),
    leaseIncludes: z.object({
      maintenance: z.boolean(),
      mandatoryInsurance: z.boolean(),
      comprehensiveInsurance: z.boolean(),
      registration: z.boolean(),
    }),
    vehicle: VehicleIdentitySchema.optional(),
    mandatoryInsuranceQuote: z.number().min(0).optional(),
    comprehensiveInsuranceQuote: z.number().min(0).optional(),
    workplaceBenefitMonthly: z.number().min(0).optional(),
  }),

  cashOnHand: z.number().min(0),
  oldCarValue: z.number().min(0).default(0),

  mandatoryInsuranceQuote: z.number().min(0),
  comprehensiveInsuranceQuote: z.number().min(0),

  annualKm: z.number().positive(),

  isBusinessUse: z.boolean(),
  marginalTaxRate: z.number().min(0).max(100).optional(),

  useLoan: z.boolean(),
  financing: z.object({
    interestRate: z.number().min(0),
    loanTermYears: z.number().int().positive(),
    originationFee: z.number().min(0).default(0),
  }),

  comparisonPeriodYears: z.number().int().min(1).max(10),
  includeInvestment: z.boolean(),
  investmentReturnRate: z.number().min(0).optional(),
  residualOverride: z.number().min(0).optional(),
  depreciationOverride: z.object({
    yr1: z.number().min(0).max(100),
    yr2: z.number().min(0).max(100),
    yr3Plus: z.number().min(0).max(100),
  }).optional(),
  maintenanceOverride: z.object({
    serviceIntervalKm: z.number().min(1),
    costPerService: z.number().min(0),
  }).optional(),
});

/** Run the full buy-vs-lease comparison for an already-validated input. */
export async function runCalculation(input: CalculatorInput): Promise<CalculatorOutput> {
  // The comparison always covers one lease contract — people re-decide when
  // it ends, and we can't know the terms of a future lease.
  if (input.lease.leaseTerm > 0) {
    input.comparisonPeriodYears = input.lease.leaseTerm;
  }

  const marketData = await getMarketData();

  // If the user didn't override the investment return, use the market default.
  if (input.includeInvestment && input.investmentReturnRate == null) {
    input.investmentReturnRate = marketData.defaultInvestmentReturn;
  }

  const buyResult = calcBuyScenario(input, marketData);
  const leaseResult = calcLeaseScenario(input, marketData);
  const comparison = compareScenarios(buyResult, leaseResult, input.comparisonPeriodYears);

  return {
    periodYears: input.comparisonPeriodYears,
    buy: buyResult,
    lease: leaseResult,
    recommendation: comparison,
    marketDataUsed: {
      year: marketData.year,
      lastUpdated: marketData.lastUpdated,
    },
  };
}
