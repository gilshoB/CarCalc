import { describe, it, expect } from "vitest";
import { calcLeaseScenario } from "../leaseCalculator";
import { getTestMarketData, makeInput } from "./testHelpers";

const market = getTestMarketData();

describe("calcLeaseScenario", () => {
  it("basic scenario — all included, no down payment", () => {
    const input = makeInput({
      lease: {
        monthlyPayment: 3500,
        leaseTerm: 3,
        leaseDownPayment: 0,
        fuelType: "gasoline",
        consumptionKmPerUnit: 14,
        leaseIncludes: {
          maintenance: true,
          mandatoryInsurance: true,
          comprehensiveInsurance: true,
          registration: true,
        },
      },
    });
    const result = calcLeaseScenario(input, market);

    // Total lease payments: 3500 * 12 * 3 = 126000
    expect(result.breakdown.carPayment).toBe(126000);
    expect(result.breakdown.maintenance).toBe(0); // included
    expect(result.breakdown.mandatoryInsurance).toBe(0); // included
    expect(result.breakdown.comprehensiveInsurance).toBe(0); // included
    expect(result.breakdown.registrationFees).toBe(0); // included
    expect(result.breakdown.depreciation).toBe(0); // no depreciation for lessee
    expect(result.breakdown.residualValue).toBe(0); // car returned
    expect(result.monthlyCost).toBe(Math.round(result.totalCost / 36));
  });

  it("with down payment — added to total", () => {
    const inputNoDown = makeInput({
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 0,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
    });
    const inputWithDown = makeInput({
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 10000,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
    });

    const resultNoDown = calcLeaseScenario(inputNoDown, market);
    const resultWithDown = calcLeaseScenario(inputWithDown, market);

    expect(resultWithDown.breakdown.carPayment).toBe(resultNoDown.breakdown.carPayment + 10000);
  });

  it("maintenance not included — adds maintenance cost", () => {
    const input = makeInput({
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 0,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: false, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
    });
    const result = calcLeaseScenario(input, market);

    // 15000 * 0.15 * 1.0 * 3 = 6750
    expect(result.breakdown.maintenance).toBe(6750);
  });

  it("insurance not included — adds insurance cost", () => {
    const input = makeInput({
      mandatoryInsuranceQuote: 1500,
      comprehensiveInsuranceQuote: 5000,
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 0,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: false, comprehensiveInsurance: false, registration: true },
      },
    });
    const result = calcLeaseScenario(input, market);

    expect(result.breakdown.mandatoryInsurance).toBe(4500);
    expect(result.breakdown.comprehensiveInsurance).toBe(15000);
  });

  it("registration not included — adds registration cost", () => {
    const input = makeInput({
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 0,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: false },
      },
    });
    const result = calcLeaseScenario(input, market);

    expect(result.breakdown.registrationFees).toBeGreaterThan(0);
  });

  it("with business use — tax benefits applied", () => {
    const input = makeInput({
      isBusinessUse: true,
      marginalTaxRate: 47,
    });
    const result = calcLeaseScenario(input, market);

    expect(result.breakdown.taxBenefits).toBeGreaterThan(0);

    const inputNoBusiness = makeInput({ isBusinessUse: false });
    const resultNoBusiness = calcLeaseScenario(inputNoBusiness, market);

    expect(result.totalCost).toBeLessThan(resultNoBusiness.totalCost);
  });

  it("with investment — remaining capital invested", () => {
    const input = makeInput({
      includeInvestment: true,
      investmentReturnRate: 10,
      cashOnHand: 50000,
      oldCarValue: 60000,
      lease: {
        monthlyPayment: 3500, leaseTerm: 3, leaseDownPayment: 10000,
        fuelType: "gasoline", consumptionKmPerUnit: 14,
        leaseIncludes: { maintenance: true, mandatoryInsurance: true, comprehensiveInsurance: true, registration: true },
      },
    });
    const result = calcLeaseScenario(input, market);

    // Investable: (50000 + 60000) - 10000 = 100000
    expect(result.breakdown.investmentResult).toBeGreaterThan(0);
  });

  it("old car value reduces total cost", () => {
    const inputNoOldCar = makeInput({ oldCarValue: 0 });
    const inputWithOldCar = makeInput({ oldCarValue: 60000 });

    const resultNoOldCar = calcLeaseScenario(inputNoOldCar, market);
    const resultWithOldCar = calcLeaseScenario(inputWithOldCar, market);

    expect(resultWithOldCar.totalCost).toBeLessThan(resultNoOldCar.totalCost);
  });

  it("yearly breakdown cumulative cost increases", () => {
    const input = makeInput();
    const result = calcLeaseScenario(input, market);
    for (let i = 1; i < result.yearlyBreakdown.length; i++) {
      expect(result.yearlyBreakdown[i].cumulativeCost).toBeGreaterThan(
        result.yearlyBreakdown[i - 1].cumulativeCost,
      );
    }
  });

  it("fuel is never included in lease", () => {
    const input = makeInput();
    const result = calcLeaseScenario(input, market);
    expect(result.breakdown.fuel).toBeGreaterThan(0);
  });
});
