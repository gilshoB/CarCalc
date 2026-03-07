import { describe, it, expect } from "vitest";
import { calcBuyScenario } from "../buyCalculator";
import { getTestMarketData, makeInput } from "./testHelpers";

const market = getTestMarketData();

describe("calcBuyScenario", () => {
  it("basic scenario — no loan, no business, no investment", () => {
    const input = makeInput();
    const result = calcBuyScenario(input, market);

    expect(result.totalCost).toBeDefined();
    expect(result.monthlyCost).toBe(Math.round(result.totalCost / (3 * 12)));
    expect(result.breakdown.carPayment).toBe(170000);
    expect(result.breakdown.loanInterest).toBe(0);
    expect(result.breakdown.taxBenefits).toBe(0);
    expect(result.breakdown.investmentResult).toBe(0);
    expect(result.yearlyBreakdown).toHaveLength(3);
  });

  it("with loan — adds interest to total cost", () => {
    const input = makeInput({
      useLoan: true,
      cashOnHand: 50000,
      oldCarValue: 60000,
      buy: { carPrice: 200000, catalogPrice: 200000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
    });
    const result = calcBuyScenario(input, market);

    // Loan needed: 200000 - (50000 + 60000) = 90000
    expect(result.breakdown.loanInterest).toBeGreaterThan(0);
    // Total cost includes loan interest but also subtracts old car value and residual
    // So just verify loan interest adds cost vs no-loan scenario
    const inputNoLoan = makeInput({
      useLoan: false,
      cashOnHand: 50000,
      oldCarValue: 60000,
      buy: { carPrice: 200000, catalogPrice: 200000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
    });
    const resultNoLoan = calcBuyScenario(inputNoLoan, market);
    expect(result.totalCost).toBeGreaterThan(resultNoLoan.totalCost);
  });

  it("no loan needed — car price <= available capital", () => {
    const input = makeInput({
      useLoan: true,
      cashOnHand: 100000,
      oldCarValue: 100000,
      buy: { carPrice: 150000, catalogPrice: 150000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
    });
    const result = calcBuyScenario(input, market);

    expect(result.breakdown.loanInterest).toBe(0);
  });

  it("with business use — tax benefits deducted", () => {
    const input = makeInput({
      isBusinessUse: true,
      marginalTaxRate: 47,
    });
    const result = calcBuyScenario(input, market);

    expect(result.breakdown.taxBenefits).toBeGreaterThan(0);

    // Compare to same input without business use
    const inputNoBusiness = makeInput({ isBusinessUse: false });
    const resultNoBusiness = calcBuyScenario(inputNoBusiness, market);

    expect(result.totalCost).toBeLessThan(resultNoBusiness.totalCost);
  });

  it("with investment — free capital invested", () => {
    const input = makeInput({
      includeInvestment: true,
      investmentReturnRate: 10,
      cashOnHand: 100000,
      oldCarValue: 100000,
      buy: { carPrice: 150000, catalogPrice: 150000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
    });
    const result = calcBuyScenario(input, market);

    // Free capital: (100000 + 100000) - 150000 = 50000
    expect(result.breakdown.investmentResult).toBeGreaterThan(0);
  });

  it("no free capital — no investment gain", () => {
    const input = makeInput({
      includeInvestment: true,
      investmentReturnRate: 10,
      cashOnHand: 50000,
      oldCarValue: 50000,
      buy: { carPrice: 200000, catalogPrice: 200000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
    });
    const result = calcBuyScenario(input, market);

    // Free capital: (50000 + 50000) - 200000 = -100000 → 0
    expect(result.breakdown.investmentResult).toBe(0);
  });

  it("electric car — different depreciation and fuel costs", () => {
    const gasInput = makeInput({
      buy: { carPrice: 170000, catalogPrice: 170000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 },
    });
    const elecInput = makeInput({
      buy: { carPrice: 170000, catalogPrice: 170000, isUsed: false, fuelType: "electric", consumptionKmPerUnit: 6 },
    });

    const gasResult = calcBuyScenario(gasInput, market);
    const elecResult = calcBuyScenario(elecInput, market);

    // Electric has higher depreciation
    expect(elecResult.breakdown.depreciation).toBeGreaterThan(gasResult.breakdown.depreciation);
    // Electric has much lower fuel costs
    expect(elecResult.breakdown.fuel).toBeLessThan(gasResult.breakdown.fuel);
    // Electric has lower maintenance
    expect(elecResult.breakdown.maintenance).toBeLessThan(gasResult.breakdown.maintenance);
  });

  it("used car — depreciation uses yr3Plus rates", () => {
    const newResult = calcBuyScenario(
      makeInput({ buy: { carPrice: 170000, catalogPrice: 170000, isUsed: false, fuelType: "gasoline", consumptionKmPerUnit: 14 } }),
      market,
    );
    const usedResult = calcBuyScenario(
      makeInput({ buy: { carPrice: 170000, catalogPrice: 170000, isUsed: true, usedCarAge: 3, fuelType: "gasoline", consumptionKmPerUnit: 14 } }),
      market,
    );

    // Used car (age 3) depreciates slower (all yr3Plus) than new car (yr1, yr2, yr3Plus)
    expect(usedResult.breakdown.depreciation).toBeLessThan(newResult.breakdown.depreciation);
  });

  it("depreciation override changes total cost", () => {
    const input = makeInput();
    const resultDefault = calcBuyScenario(input, market);

    const inputOverride = makeInput({ depreciationOverride: { yr1: 30, yr2: 25, yr3Plus: 20 } });
    const resultOverride = calcBuyScenario(inputOverride, market);

    // Higher depreciation rates → lower residual value → higher total cost
    expect(resultOverride.breakdown.depreciation).toBeGreaterThan(resultDefault.breakdown.depreciation);
    expect(resultOverride.breakdown.residualValue).toBeLessThan(resultDefault.breakdown.residualValue);
  });

  it("old car value reduces total cost", () => {
    const inputNoOldCar = makeInput({ oldCarValue: 0 });
    const inputWithOldCar = makeInput({ oldCarValue: 60000 });

    const resultNoOldCar = calcBuyScenario(inputNoOldCar, market);
    const resultWithOldCar = calcBuyScenario(inputWithOldCar, market);

    expect(resultWithOldCar.totalCost).toBeLessThan(resultNoOldCar.totalCost);
  });

  it("yearly breakdown has correct number of entries", () => {
    const input = makeInput({ comparisonPeriodYears: 5 });
    const result = calcBuyScenario(input, market);
    expect(result.yearlyBreakdown).toHaveLength(5);
  });

  it("yearly breakdown cumulative cost increases", () => {
    const input = makeInput();
    const result = calcBuyScenario(input, market);
    for (let i = 1; i < result.yearlyBreakdown.length; i++) {
      expect(result.yearlyBreakdown[i].cumulativeCost).toBeGreaterThan(
        result.yearlyBreakdown[i - 1].cumulativeCost,
      );
    }
  });
});
