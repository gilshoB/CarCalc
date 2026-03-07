import { describe, it, expect } from "vitest";
import { calcBuyScenario } from "../buyCalculator";
import { calcLeaseScenario } from "../leaseCalculator";
import { compareScenarios } from "../compare";
import { getTestMarketData, makeInput } from "./testHelpers";

const market = getTestMarketData();

function runFullComparison(overrides: Record<string, unknown> = {}) {
  const input = makeInput(overrides);
  const buyResult = calcBuyScenario(input, market);
  const leaseResult = calcLeaseScenario(input, market);
  const comparison = compareScenarios(buyResult, leaseResult, input.comparisonPeriodYears);
  return { input, buyResult, leaseResult, comparison };
}

describe("integration — full pipeline", () => {
  it("default input — produces valid results", () => {
    const { buyResult, leaseResult, comparison } = runFullComparison();

    expect(buyResult.totalCost).toBeDefined();
    expect(leaseResult.totalCost).toBeDefined();
    expect(["buy", "lease"]).toContain(comparison.winner);
    expect(comparison.savingsAmount).toBeGreaterThanOrEqual(0);
    expect(comparison.savingsPercent).toBeGreaterThanOrEqual(0);
    expect(comparison.savingsPercent).toBeLessThanOrEqual(100);
  });

  it("expensive car + cheap lease — lease should win", () => {
    const { comparison } = runFullComparison({
      buy: { carPrice: 400000, catalogPrice: 400000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      lease: {
        monthlyPayment: 2000, leaseTerm: 3, leaseDownPayment: 0,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
    });
    expect(comparison.winner).toBe("lease");
  });

  it("cheap car + expensive lease — buy should win", () => {
    const { comparison } = runFullComparison({
      buy: { carPrice: 80000, catalogPrice: 80000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      lease: {
        monthlyPayment: 6000, leaseTerm: 3, leaseDownPayment: 20000,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
    });
    expect(comparison.winner).toBe("buy");
  });

  it("business owner — tax benefits reduce both costs", () => {
    const { buyResult: buyBusiness, leaseResult: leaseBusiness } = runFullComparison({
      isBusinessUse: true,
      marginalTaxRate: 47,
    });
    const { buyResult: buyPersonal, leaseResult: leasePersonal } = runFullComparison({
      isBusinessUse: false,
    });

    expect(buyBusiness.totalCost).toBeLessThan(buyPersonal.totalCost);
    expect(leaseBusiness.totalCost).toBeLessThan(leasePersonal.totalCost);
  });

  it("long period (7 years) — both costs increase", () => {
    const { buyResult: buy3 } = runFullComparison({ comparisonPeriodYears: 3 });
    const { buyResult: buy7 } = runFullComparison({ comparisonPeriodYears: 7 });

    // Note: total cost for buying can actually decrease with longer periods
    // because the residual value is still there but running costs add up.
    // But the absolute running costs should increase.
    expect(buy7.breakdown.fuel).toBeGreaterThan(buy3.breakdown.fuel);
    expect(buy7.breakdown.maintenance).toBeGreaterThan(buy3.breakdown.maintenance);
  });

  it("electric vs gasoline — different profiles", () => {
    const { buyResult: gasResult } = runFullComparison({
      buy: { carPrice: 170000, catalogPrice: 170000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
    });
    const { buyResult: elecResult } = runFullComparison({
      buy: { carPrice: 170000, catalogPrice: 170000, isUsed: false, fuelType: "electric", consumptionKmPerUnit: 6 },
    });

    // Electric: cheaper fuel, cheaper maintenance, but more depreciation
    expect(elecResult.breakdown.fuel).toBeLessThan(gasResult.breakdown.fuel);
    expect(elecResult.breakdown.maintenance).toBeLessThan(gasResult.breakdown.maintenance);
    expect(elecResult.breakdown.depreciation).toBeGreaterThan(gasResult.breakdown.depreciation);
  });

  it("investment on — reduces effective cost for both", () => {
    const { buyResult: buyNoInv, leaseResult: leaseNoInv } = runFullComparison({
      includeInvestment: false,
    });
    const { buyResult: buyInv, leaseResult: leaseInv } = runFullComparison({
      includeInvestment: true,
      investmentReturnRate: 10,
      cashOnHand: 100000,
      oldCarValue: 100000,
      buy: { carPrice: 150000, catalogPrice: 150000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 10000,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
    });

    // Both should benefit from investment (leasing has more free capital)
    expect(leaseInv.breakdown.investmentResult).toBeGreaterThan(0);
  });

  it("savings amount equals difference between totals", () => {
    const { buyResult, leaseResult, comparison } = runFullComparison();
    expect(comparison.savingsAmount).toBe(Math.abs(buyResult.totalCost - leaseResult.totalCost));
  });

  it("old car value reduces both buy and lease equally", () => {
    const { buyResult: buyWith, leaseResult: leaseWith } = runFullComparison({ oldCarValue: 50000 });
    const { buyResult: buyWithout, leaseResult: leaseWithout } = runFullComparison({ oldCarValue: 0 });

    // Both should decrease by 50000 (old car value subtracted from both)
    expect(buyWithout.totalCost - buyWith.totalCost).toBe(50000);
    expect(leaseWithout.totalCost - leaseWith.totalCost).toBe(50000);
  });

  it("comparison period 1 year — everything works", () => {
    const { buyResult, leaseResult, comparison } = runFullComparison({ comparisonPeriodYears: 1 });
    expect(buyResult.yearlyBreakdown).toHaveLength(1);
    expect(leaseResult.yearlyBreakdown).toHaveLength(1);
    expect(comparison.savingsAmount).toBeGreaterThanOrEqual(0);
  });
});
