import { describe, it, expect } from "vitest";
import { buildResultsEmail } from "../resultsEmail";
import { calcBuyScenario } from "@/lib/calculations/buyCalculator";
import { calcLeaseScenario } from "@/lib/calculations/leaseCalculator";
import { compareScenarios } from "@/lib/calculations/compare";
import { getTestMarketData, makeInput } from "@/lib/calculations/__tests__/testHelpers";
import { formatNumber } from "@/lib/formatters";
import type { CalculatorInput, CalculatorOutput } from "@/types/calculator";

function run(input: CalculatorInput): CalculatorOutput {
  const market = getTestMarketData();
  const buy = calcBuyScenario(input, market);
  const lease = calcLeaseScenario(input, market);
  return {
    periodYears: input.comparisonPeriodYears,
    buy,
    lease,
    recommendation: compareScenarios(buy, lease, input.comparisonPeriodYears),
    marketDataUsed: { year: market.year, lastUpdated: market.lastUpdated },
  };
}

describe("buildResultsEmail", () => {
  it("includes the winner, totals and monthly costs", () => {
    const input = makeInput();
    const results = run(input);
    const { subject, html, text } = buildResultsEmail(input, results, "he");

    expect(subject).toContain("CarCalc");
    expect(html).toContain('dir="rtl"');
    expect(html).toContain(formatNumber(results.buy.totalCost, "he"));
    expect(html).toContain(formatNumber(results.lease.monthlyCost, "he"));
    expect(text).toContain(formatNumber(results.recommendation.savingsAmount, "he"));
  });

  it("escapes HTML in the user's name", () => {
    const input = { ...makeInput(), name: '<script>alert("x")</script>' };
    const { html } = buildResultsEmail(input, run(input), "en");

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders left-to-right in English", () => {
    const input = makeInput();
    const { html } = buildResultsEmail(input, run(input), "en");
    expect(html).toContain('dir="ltr"');
    expect(html).toContain("Cost breakdown");
  });
});
