import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMarketData } from "@/lib/calculations/marketData";
import { calcBuyScenario } from "@/lib/calculations/buyCalculator";
import { calcLeaseScenario } from "@/lib/calculations/leaseCalculator";
import { compareScenarios } from "@/lib/calculations/compare";
import type { CalculatorInput, CalculatorOutput } from "@/types/calculator";

const FuelTypeSchema = z.enum(["gasoline", "diesel", "electric", "hybrid"]);

const CalculatorInputSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),

  buy: z.object({
    carPrice: z.number().positive(),
    catalogPrice: z.number().min(0).optional(),
    isUsed: z.boolean(),
    usedCarAge: z.number().int().min(0).optional(),
    fuelType: FuelTypeSchema,
    consumptionKmPerUnit: z.number().positive(),
  }),

  lease: z.object({
    monthlyPayment: z.number().positive(),
    leaseTerm: z.number().int().min(0).default(0),
    leaseDownPayment: z.number().min(0).default(0),
    leaseCarAge: z.number().int().min(0).optional(),
    fuelType: FuelTypeSchema,
    consumptionKmPerUnit: z.number().positive(),
    leaseIncludes: z.object({
      maintenance: z.boolean(),
      mandatoryInsurance: z.boolean(),
      comprehensiveInsurance: z.boolean(),
      registration: z.boolean(),
    }),
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
  depreciationOverride: z.object({
    yr1: z.number().min(0).max(100),
    yr2: z.number().min(0).max(100),
    yr3Plus: z.number().min(0).max(100),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = CalculatorInputSchema.parse(body) as CalculatorInput;

    const marketData = await getMarketData();

    // If user didn't override investment return, use market default
    if (input.includeInvestment && input.investmentReturnRate == null) {
      input.investmentReturnRate = marketData.defaultInvestmentReturn;
    }

    const buyResult = calcBuyScenario(input, marketData);
    const leaseResult = calcLeaseScenario(input, marketData);
    const comparison = compareScenarios(buyResult, leaseResult, input.comparisonPeriodYears);

    const output: CalculatorOutput = {
      periodYears: input.comparisonPeriodYears,
      buy: buyResult,
      lease: leaseResult,
      recommendation: comparison,
      marketDataUsed: {
        year: marketData.year,
        lastUpdated: marketData.lastUpdated,
      },
    };

    return NextResponse.json(output);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
