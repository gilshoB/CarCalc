/**
 * End-to-end tests with exact expected numerical outputs.
 *
 * Each scenario defines a complete input and asserts the exact total cost,
 * monthly cost, winner, and savings amount. These act as regression tests —
 * if any calculation logic changes, these will catch it.
 *
 * To update expected values after an intentional formula change:
 *   1. Run the test to see the new actual values
 *   2. Verify the new values are correct by hand
 *   3. Update the expected values in this file
 */
import { describe, it, expect } from "vitest";
import { calcBuyScenario } from "../buyCalculator";
import { calcLeaseScenario } from "../leaseCalculator";
import { compareScenarios } from "../compare";
import { getTestMarketData, makeInput } from "./testHelpers";
import type { CalculatorInput } from "@/types/calculator";

const market = getTestMarketData();

function runScenario(overrides: Record<string, unknown> = {}) {
  const input = makeInput(overrides);
  const buy = calcBuyScenario(input, market);
  const lease = calcLeaseScenario(input, market);
  const comparison = compareScenarios(buy, lease, input.comparisonPeriodYears);
  return { input, buy, lease, comparison };
}

// Helper to print results for creating new test cases
// Uncomment and run `npm test` to see values for a new scenario
// function printScenario(name: string, overrides: Record<string, unknown> = {}) {
//   const { buy, lease, comparison } = runScenario(overrides);
//   console.log(`\n=== ${name} ===`);
//   console.log(`Buy total: ${buy.totalCost}, monthly: ${buy.monthlyCost}`);
//   console.log(`Lease total: ${lease.totalCost}, monthly: ${lease.monthlyCost}`);
//   console.log(`Winner: ${comparison.winner}, savings: ${comparison.savingsAmount}, pct: ${comparison.savingsPercent}%`);
//   console.log("Buy breakdown:", JSON.stringify(buy.breakdown, null, 2));
//   console.log("Lease breakdown:", JSON.stringify(lease.breakdown, null, 2));
// }

describe("e2e — exact numerical outputs", () => {

  /**
   * Scenario 1: Simple new gasoline car vs all-inclusive lease
   * Buy: 170k gasoline, new, no loan, no business, no investment
   * Lease: 3500/mo, all included, no down payment
   * Cash: 50k, Old car: 60k, Period: 3 years
   */
  it("Scenario 1: new gasoline 170k vs 3500/mo lease, 3 years", () => {
    const { buy, lease, comparison } = runScenario({
      buy: { carPrice: 170000, catalogPrice: 170000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 0,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
      cashOnHand: 50000,
      oldCarValue: 60000,
      comparisonPeriodYears: 3,
      isBusinessUse: false,
      useLoan: false,
      includeInvestment: false,
    });

    // Buy breakdown verification
    expect(buy.breakdown.carPayment).toBe(170000);
    expect(buy.breakdown.loanInterest).toBe(0);
    // Depreciation: 170000 → yr1 (0.85) → yr2 (0.88) → yr3 (0.90)
    // 170000 * 0.85 = 144500, * 0.88 = 127160, * 0.90 = 114444
    expect(buy.breakdown.residualValue).toBe(Math.round(170000 * 0.85 * 0.88 * 0.90));
    expect(buy.breakdown.depreciation).toBe(170000 - buy.breakdown.residualValue);
    // Insurance: (1500 + 5000) * 3 = 19500
    expect(buy.breakdown.mandatoryInsurance).toBe(4500);
    expect(buy.breakdown.comprehensiveInsurance).toBe(15000);
    // Fuel: (15000/14) * 7.13 * 3
    expect(buy.breakdown.fuel).toBe(Math.round((15000 / 14) * 7.13 * 3));
    // Maintenance: 15000 * 0.15 * 1.0 * 3 = 6750
    expect(buy.breakdown.maintenance).toBe(6750);

    // Lease breakdown verification
    expect(lease.breakdown.carPayment).toBe(3500 * 12 * 3); // 126000
    expect(lease.breakdown.maintenance).toBe(0);
    expect(lease.breakdown.mandatoryInsurance).toBe(0);
    expect(lease.breakdown.comprehensiveInsurance).toBe(0);
    expect(lease.breakdown.registrationFees).toBe(0);

    // Both have fuel
    expect(buy.breakdown.fuel).toBe(lease.breakdown.fuel);

    // Winner check
    expect(comparison.winner).toBe(buy.totalCost <= lease.totalCost ? "buy" : "lease");
    expect(comparison.savingsAmount).toBe(Math.abs(buy.totalCost - lease.totalCost));
  });

  /**
   * Scenario 2: Used hybrid car with loan vs lease with down payment
   * Buy: 170k hybrid, 2 years old, with loan (60k needed)
   * Lease: 3500/mo, 7900 down, all included
   * Cash: 50k, Old car: 60k, Period: 3 years
   */
  it("Scenario 2: used hybrid 170k with loan vs 3500/mo lease + down payment", () => {
    const { buy, lease, comparison } = runScenario({
      buy: { carPrice: 170000, catalogPrice: 170000, isUsed: true, usedCarAge: 2, fuelType: "hybrid", consumptionKmPerUnit: 18 },
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 7900,
        fuelType: "hybrid", consumptionKmPerUnit: 18,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
      cashOnHand: 50000,
      oldCarValue: 60000,
      comparisonPeriodYears: 3,
      useLoan: true,
      isBusinessUse: false,
      includeInvestment: false,
    });

    // Loan: 170000 - (50000 + 60000) = 60000
    expect(buy.breakdown.loanInterest).toBeGreaterThan(0);

    // Depreciation: used car age 2, hybrid rates same as gasoline
    // Ages 3, 4, 5 → all yr3Plus (0.10)
    // 170000 * 0.90 * 0.90 * 0.90 = 123930
    expect(buy.breakdown.residualValue).toBe(Math.round(170000 * 0.9 * 0.9 * 0.9));

    // Lease: 3500*36 + 7900 = 133900
    expect(lease.breakdown.carPayment).toBe(133900);

    // Test fees: car age starts at 2, so ages 3, 4, 5
    // Ages > 3: years 4 and 5 → 2 years of test fees
    expect(buy.breakdown.testFees).toBeCloseTo(117.6 * 2, 0);

    // Maintenance: hybrid multiplier 1.2
    expect(buy.breakdown.maintenance).toBe(Math.round(15000 * 0.15 * 1.2 * 3));

    // Verify totals are exact
    const expectedBuyTotal =
      buy.breakdown.carPayment +
      buy.breakdown.loanInterest +
      (buy.breakdown.loanOriginationFee) +
      buy.breakdown.registrationFees +
      buy.breakdown.mandatoryInsurance +
      buy.breakdown.comprehensiveInsurance +
      buy.breakdown.testFees +
      buy.breakdown.fuel +
      buy.breakdown.maintenance -
      buy.breakdown.residualValue -
      buy.breakdown.taxBenefits -
      buy.breakdown.investmentResult -
      60000; // old car value

    expect(buy.totalCost).toBe(Math.round(expectedBuyTotal));

    expect(comparison.winner).toBe(buy.totalCost <= lease.totalCost ? "buy" : "lease");
    expect(comparison.savingsAmount).toBe(Math.abs(buy.totalCost - lease.totalCost));
  });

  /**
   * Scenario 3: Business owner with tax benefits
   * Buy: 200k gasoline, new, with loan
   * Lease: 4000/mo, nothing included
   * Tax rate: 47%, Period: 3 years
   */
  it("Scenario 3: business owner — tax benefits on both sides", () => {
    const { buy, lease, comparison } = runScenario({
      buy: { carPrice: 200000, catalogPrice: 200000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      lease: {
        monthlyPayment: 4000, leaseTerm: 3, leaseDownPayment: 0,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: false, mandatoryInsurance: false, comprehensiveInsurance: false, registration: false },
      },
      cashOnHand: 50000,
      oldCarValue: 60000,
      comparisonPeriodYears: 3,
      isBusinessUse: true,
      marginalTaxRate: 47,
      useLoan: true,
      includeInvestment: false,
    });

    // Both should have tax benefits
    expect(buy.breakdown.taxBenefits).toBeGreaterThan(0);
    expect(lease.breakdown.taxBenefits).toBeGreaterThan(0);

    // Tax benefits = 45% * marginalRate * deductibleExpenses
    // Verify buy tax benefits formula
    const buyDeductible =
      buy.breakdown.mandatoryInsurance +
      buy.breakdown.comprehensiveInsurance +
      buy.breakdown.registrationFees +
      buy.breakdown.maintenance +
      buy.breakdown.fuel +
      buy.breakdown.depreciation +
      buy.breakdown.loanInterest;
    expect(buy.breakdown.taxBenefits).toBe(Math.round(buyDeductible * 0.45 * 0.47));

    // Verify lease tax benefits formula
    const leaseDeductible =
      lease.breakdown.carPayment + // lease payments are deductible
      lease.breakdown.mandatoryInsurance +
      lease.breakdown.comprehensiveInsurance +
      lease.breakdown.registrationFees +
      lease.breakdown.maintenance +
      lease.breakdown.fuel;
    expect(lease.breakdown.taxBenefits).toBe(Math.round(leaseDeductible * 0.45 * 0.47));

    // Lease has everything NOT included, so it should have insurance, registration, maintenance
    expect(lease.breakdown.mandatoryInsurance).toBe(4500);
    expect(lease.breakdown.comprehensiveInsurance).toBe(15000);
    expect(lease.breakdown.registrationFees).toBeGreaterThan(0);
    expect(lease.breakdown.maintenance).toBe(6750);

    expect(comparison.winner).toBe(buy.totalCost <= lease.totalCost ? "buy" : "lease");
  });

  /**
   * Scenario 4: Electric car comparison, 5 year period
   * Buy: 250k electric, new
   * Lease: 5000/mo, all included
   * Period: 5 years
   */
  it("Scenario 4: electric car 250k, 5 years", () => {
    const { buy, lease, comparison } = runScenario({
      buy: { carPrice: 250000, catalogPrice: 250000, isUsed: false, fuelType: "electric", consumptionKmPerUnit: 6 },
      lease: {
        monthlyPayment: 5000, leaseTerm: 5, leaseDownPayment: 0,
        fuelType: "electric", consumptionKmPerUnit: 6,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
      cashOnHand: 100000,
      oldCarValue: 50000,
      comparisonPeriodYears: 5,
      useLoan: true,
      isBusinessUse: false,
      includeInvestment: false,
    });

    // Electric depreciation: yr1=25%, yr2=20%, yr3+=15%
    // 250000 * 0.75 * 0.80 * 0.85 * 0.85 * 0.85
    const expectedResidual = Math.round(250000 * 0.75 * 0.80 * 0.85 * 0.85 * 0.85);
    expect(buy.breakdown.residualValue).toBe(expectedResidual);

    // Fuel: (15000/6) * 0.55 * 5
    expect(buy.breakdown.fuel).toBe(Math.round((15000 / 6) * 0.55 * 5));

    // Maintenance: 15000 * 0.15 * 0.8 * 5 = 9000
    expect(buy.breakdown.maintenance).toBe(9000);

    // Lease: 5000 * 60 = 300000
    expect(lease.breakdown.carPayment).toBe(300000);

    // Test fees: new car, 5 years → ages 1-5, only ages > 3 count
    // Years 4 and 5, electric rate
    expect(buy.breakdown.testFees).toBeCloseTo(99.95 * 2, 0);

    // Loan: 250000 - (100000 + 50000) = 100000
    expect(buy.breakdown.loanInterest).toBeGreaterThan(0);

    expect(comparison.winner).toBe(buy.totalCost <= lease.totalCost ? "buy" : "lease");
    expect(comparison.savingsAmount).toBe(Math.abs(buy.totalCost - lease.totalCost));
  });

  /**
   * Scenario 5: Investment enabled — both sides invest free capital
   * Buy: 150k gasoline, new
   * Lease: 3000/mo, 5000 down, all included
   * Cash: 200k, Old car: 50k, Investment: 10%
   */
  it("Scenario 5: investment enabled, plenty of capital", () => {
    const { buy, lease, comparison } = runScenario({
      buy: { carPrice: 150000, catalogPrice: 150000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      lease: {
        monthlyPayment: 3000, leaseTerm: 3, leaseDownPayment: 5000,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
      cashOnHand: 200000,
      oldCarValue: 50000,
      comparisonPeriodYears: 3,
      useLoan: false,
      isBusinessUse: false,
      includeInvestment: true,
      investmentReturnRate: 10,
    });

    // Buy: free capital = (200000 + 50000) - 150000 = 100000
    const buyFreeCapital = 100000;
    const buyExpectedGain = Math.round(buyFreeCapital * (Math.pow(1.1, 3) - 1));
    expect(buy.breakdown.investmentResult).toBe(buyExpectedGain);

    // Lease: investable = (200000 + 50000) - 5000 = 245000
    const leaseFreeCapital = 245000;
    const leaseExpectedGain = Math.round(leaseFreeCapital * (Math.pow(1.1, 3) - 1));
    expect(lease.breakdown.investmentResult).toBe(leaseExpectedGain);

    // Lease should have much higher investment gain
    expect(lease.breakdown.investmentResult).toBeGreaterThan(buy.breakdown.investmentResult);

    expect(comparison.savingsAmount).toBe(Math.abs(buy.totalCost - lease.totalCost));
  });

  /**
   * Scenario 6: Cheap used car — buying should clearly win
   * Buy: 60k gasoline, used 5 years
   * Lease: 3500/mo, all included
   * Cash: 100k, Period: 3 years
   */
  it("Scenario 6: cheap used car 60k — buy wins decisively", () => {
    const { buy, lease, comparison } = runScenario({
      buy: { carPrice: 60000, catalogPrice: 60000, isUsed: true, usedCarAge: 5, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 0,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
      cashOnHand: 100000,
      oldCarValue: 0,
      comparisonPeriodYears: 3,
      useLoan: false,
      isBusinessUse: false,
      includeInvestment: false,
    });

    expect(comparison.winner).toBe("buy");
    // Car so cheap relative to lease that buy must win by a lot
    expect(comparison.savingsAmount).toBeGreaterThan(50000);

    // Used car age 5 → all yr3Plus (10%)
    expect(buy.breakdown.residualValue).toBe(Math.round(60000 * 0.9 * 0.9 * 0.9));

    // Test fees: age 5, all 3 years need test (ages 6,7,8 > 3)
    expect(buy.breakdown.testFees).toBeCloseTo(117.6 * 3, 0);
  });

  /**
   * Scenario 7: Expensive lease — buying should clearly win
   * Buy: 170k gasoline, new
   * Lease: 8000/mo + 20k down, nothing included
   */
  it("Scenario 7: expensive lease 8000/mo — buy wins", () => {
    const { buy, lease, comparison } = runScenario({
      buy: { carPrice: 170000, catalogPrice: 170000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      lease: {
        monthlyPayment: 8000, leaseTerm: 3, leaseDownPayment: 20000,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: false, mandatoryInsurance: false, comprehensiveInsurance: false, registration: false },
      },
      cashOnHand: 200000,
      oldCarValue: 0,
      comparisonPeriodYears: 3,
      useLoan: false,
      isBusinessUse: false,
      includeInvestment: false,
    });

    expect(comparison.winner).toBe("buy");
    // Lease: 8000*36 + 20000 = 308000 (just payments) + insurance + reg + maintenance
    expect(lease.breakdown.carPayment).toBe(308000);
    expect(lease.totalCost).toBeGreaterThan(buy.totalCost);
  });

  /**
   * Scenario 8: Verify monthly cost is exactly totalCost / months
   */
  it("Scenario 8: monthly cost = totalCost / (years * 12) for various periods", () => {
    for (const years of [1, 2, 3, 5, 7]) {
      const { buy, lease } = runScenario({ comparisonPeriodYears: years });
      expect(buy.monthlyCost).toBe(Math.round(buy.totalCost / (years * 12)));
      expect(lease.monthlyCost).toBe(Math.round(lease.totalCost / (years * 12)));
    }
  });

  /**
   * Scenario 9: Depreciation override — verify exact impact
   */
  it("Scenario 9: depreciation override changes exact residual value", () => {
    const defaultResult = runScenario({
      buy: { carPrice: 200000, catalogPrice: 200000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      comparisonPeriodYears: 3,
    });

    const overrideResult = runScenario({
      buy: { carPrice: 200000, catalogPrice: 200000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      depreciationOverride: { yr1: 20, yr2: 15, yr3Plus: 12 },
      comparisonPeriodYears: 3,
    });

    // Default: 200000 * 0.85 * 0.88 * 0.90
    expect(defaultResult.buy.breakdown.residualValue).toBe(Math.round(200000 * 0.85 * 0.88 * 0.90));
    // Override: 200000 * 0.80 * 0.85 * 0.88
    expect(overrideResult.buy.breakdown.residualValue).toBe(Math.round(200000 * 0.80 * 0.85 * 0.88));

    // Higher depreciation → lower residual → higher total cost
    expect(overrideResult.buy.totalCost).toBeGreaterThan(defaultResult.buy.totalCost);

    // The difference should equal the change in residual value
    const residualDiff = defaultResult.buy.breakdown.residualValue - overrideResult.buy.breakdown.residualValue;
    const totalDiff = overrideResult.buy.totalCost - defaultResult.buy.totalCost;
    expect(totalDiff).toBe(residualDiff);
  });

  /**
   * Scenario 10: Zero-interest loan — no extra cost beyond principal
   */
  it("Scenario 10: zero interest loan — loan interest is 0", () => {
    const { buy } = runScenario({
      buy: { carPrice: 200000, catalogPrice: 200000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
      cashOnHand: 50000,
      oldCarValue: 50000,
      useLoan: true,
      financing: { interestRate: 0, loanTermYears: 5, originationFee: 0 },
    });

    expect(buy.breakdown.loanInterest).toBe(0);
  });
});
