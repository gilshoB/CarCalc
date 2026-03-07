import { describe, it, expect } from "vitest";
import { compareScenarios } from "../compare";
import type { OptionResult } from "@/types/calculator";

function makeResult(totalCost: number, monthlyCost: number): OptionResult {
  return {
    totalCost,
    monthlyCost,
    breakdown: {
      carPayment: 0, loanInterest: 0, loanOriginationFee: 0,
      registrationFees: 0, mandatoryInsurance: 0, comprehensiveInsurance: 0,
      testFees: 0, fuel: 0, maintenance: 0, depreciation: 0,
      residualValue: 0, taxBenefits: 0, investmentResult: 0,
    },
    yearlyBreakdown: [],
  };
}

describe("compareScenarios", () => {
  it("buy cheaper — winner is buy", () => {
    const result = compareScenarios(makeResult(50000, 1389), makeResult(60000, 1667), 3);
    expect(result.winner).toBe("buy");
    expect(result.savingsAmount).toBe(10000);
  });

  it("lease cheaper — winner is lease", () => {
    const result = compareScenarios(makeResult(80000, 2222), makeResult(60000, 1667), 3);
    expect(result.winner).toBe("lease");
    expect(result.savingsAmount).toBe(20000);
  });

  it("equal costs — winner is buy (<=)", () => {
    const result = compareScenarios(makeResult(50000, 1389), makeResult(50000, 1389), 3);
    expect(result.winner).toBe("buy");
    expect(result.savingsAmount).toBe(0);
  });

  it("savings percentage calculated correctly", () => {
    const result = compareScenarios(makeResult(80000, 2222), makeResult(100000, 2778), 3);
    // savings = 20000, loser = 100000, percent = 20%
    expect(result.savingsPercent).toBe(20);
  });

  it("monthly savings correct", () => {
    const result = compareScenarios(makeResult(50000, 1389), makeResult(86000, 2389), 3);
    // savings = 36000, months = 36, monthly = 1000
    const expectedMonthly = Math.round(36000 / 36);
    expect(result.explanation).toContain(expectedMonthly.toLocaleString());
  });

  it("Hebrew explanation contains correct numbers", () => {
    const result = compareScenarios(makeResult(50000, 1389), makeResult(60000, 1667), 3);
    expect(result.explanationHe).toContain("10,000");
    expect(result.explanationHe).toContain("3");
    expect(result.explanationHe).toContain("קניית");
  });

  it("English explanation for lease winner", () => {
    const result = compareScenarios(makeResult(80000, 2222), makeResult(60000, 1667), 3);
    expect(result.explanation).toContain("Leasing saves");
    expect(result.explanationHe).toContain("ליסינג");
  });
});
