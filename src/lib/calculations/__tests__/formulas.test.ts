import { describe, it, expect } from "vitest";
import {
  calcDepreciation,
  calcFuelCost,
  calcRegistrationFee,
  calcTestFee,
  calcMaintenance,
  calcLoanCost,
  calcBusinessTaxBenefits,
  calcInvestmentReturn,
  calcInsurance,
} from "../formulas";
import { getTestMarketData } from "./testHelpers";

const market = getTestMarketData();

// ---- calcDepreciation ----

describe("calcDepreciation", () => {
  it("new gasoline car, 3 years", () => {
    const result = calcDepreciation(200000, 3, "gasoline", false);
    // year 1: 200000 * 0.85 = 170000
    // year 2: 170000 * 0.88 = 149600
    // year 3: 149600 * 0.90 = 134640
    expect(result.residualValue).toBe(Math.round(200000 * 0.85 * 0.88 * 0.90));
    expect(result.totalDepreciation).toBe(200000 - result.residualValue);
    expect(result.yearlyValues).toHaveLength(3);
  });

  it("new electric car, 3 years — higher depreciation", () => {
    const result = calcDepreciation(200000, 3, "electric", false);
    // year 1: 200000 * 0.75 = 150000
    // year 2: 150000 * 0.80 = 120000
    // year 3: 120000 * 0.85 = 102000
    expect(result.residualValue).toBe(Math.round(200000 * 0.75 * 0.80 * 0.85));
    expect(result.totalDepreciation).toBe(200000 - result.residualValue);
  });

  it("used car (age 2) — starts at yr3Plus rate", () => {
    const result = calcDepreciation(100000, 3, "gasoline", true, 2);
    // car age 3,4,5 → all yr3Plus (0.10)
    // year 1: 100000 * 0.90 = 90000
    // year 2: 90000 * 0.90 = 81000
    // year 3: 81000 * 0.90 = 72900
    expect(result.residualValue).toBe(Math.round(100000 * 0.9 * 0.9 * 0.9));
  });

  it("used car (age 0, really new) — same as new", () => {
    const newResult = calcDepreciation(100000, 3, "gasoline", false);
    const usedAge0 = calcDepreciation(100000, 3, "gasoline", true, 0);
    expect(usedAge0.residualValue).toBe(newResult.residualValue);
  });

  it("override rates", () => {
    const override = { yr1: 20, yr2: 15, yr3Plus: 12 };
    const result = calcDepreciation(200000, 3, "gasoline", false, 0, override);
    // year 1: 200000 * 0.80 = 160000
    // year 2: 160000 * 0.85 = 136000
    // year 3: 136000 * 0.88 = 119680
    expect(result.residualValue).toBe(Math.round(200000 * 0.80 * 0.85 * 0.88));
  });

  it("1 year period", () => {
    const result = calcDepreciation(100000, 1, "gasoline", false);
    expect(result.residualValue).toBe(Math.round(100000 * 0.85));
    expect(result.yearlyValues).toHaveLength(1);
  });

  it("zero price", () => {
    const result = calcDepreciation(0, 3, "gasoline", false);
    expect(result.residualValue).toBe(0);
    expect(result.totalDepreciation).toBe(0);
  });

  // ---- New: used-car adjustments ----

  it("applies hands penalty (3 previous hands ≈ −6%)", () => {
    const baseline = calcDepreciation(150000, 3, "gasoline", true, 3);
    const withHands = calcDepreciation(150000, 3, "gasoline", true, 3, undefined, {
      previousHands: 3,
    });
    expect(withHands.residualValue).toBeLessThan(baseline.residualValue);
    expect(withHands.adjustments?.handsAdj).toBeCloseTo(1 - 0.06, 5);
    expect(withHands.adjustments?.leaseAdj).toBe(1);
  });

  it("applies wasLeased penalty (−7%)", () => {
    const baseline = calcDepreciation(150000, 3, "gasoline", true, 2);
    const withLease = calcDepreciation(150000, 3, "gasoline", true, 2, undefined, {
      wasLeased: true,
    });
    expect(withLease.adjustments?.leaseAdj).toBe(0.93);
    expect(withLease.residualValue).toBeLessThan(baseline.residualValue);
  });

  it("applies km penalty (above-average mileage)", () => {
    const expected = 2 * 15000; // baseline km for a 2-year-old car
    // 50% above average (clamped to 25%) → kmAdj = 1 - 0.25*0.15 = 0.9625
    const result = calcDepreciation(150000, 3, "gasoline", true, 2, undefined, {
      odometerKm: expected * 1.5,
    });
    expect(result.adjustments?.kmAdj).toBeCloseTo(0.9625, 4);
  });

  it("composite: 3 hands + leased + 80k extra km", () => {
    const result = calcDepreciation(150000, 3, "gasoline", true, 2, undefined, {
      previousHands: 3,
      wasLeased: true,
      odometerKm: 110000, // 2 yr × 15k = 30k baseline; 110k is ≫ avg → clamped to +25%
    });
    // hands 0.94 × lease 0.93 × km 0.9625 ≈ 0.8413
    expect(result.adjustments?.composite).toBeCloseTo(0.94 * 0.93 * 0.9625, 3);
  });

  it("no adjustments: baseline behavior unchanged", () => {
    const a = calcDepreciation(150000, 3, "gasoline", false);
    const b = calcDepreciation(150000, 3, "gasoline", false, 0, undefined, undefined);
    expect(a.residualValue).toBe(b.residualValue);
    expect(b.adjustments?.composite).toBe(1);
  });
});

// ---- calcFuelCost ----

describe("calcFuelCost", () => {
  it("gasoline — uses benzine95 price", () => {
    // 15000 km/yr / 14 km/L * 7.13 ILS/L * 3 years
    const expected = Math.round((15000 / 14) * 7.13 * 3);
    expect(calcFuelCost(15000, 3, "gasoline", 14, market.fuelPrices)).toBe(expected);
  });

  it("electric — uses electricity price", () => {
    // 15000 km/yr / 6 km/kWh * 0.55 ILS/kWh * 3 years
    const expected = Math.round((15000 / 6) * 0.55 * 3);
    expect(calcFuelCost(15000, 3, "electric", 6, market.fuelPrices)).toBe(expected);
  });

  it("diesel — uses diesel price", () => {
    const expected = Math.round((15000 / 16) * 9.37 * 3);
    expect(calcFuelCost(15000, 3, "diesel", 16, market.fuelPrices)).toBe(expected);
  });

  it("hybrid — uses benzine95 price", () => {
    const expected = Math.round((15000 / 18) * 7.13 * 3);
    expect(calcFuelCost(15000, 3, "hybrid", 18, market.fuelPrices)).toBe(expected);
  });

  it("different annual km values", () => {
    const cost5k = calcFuelCost(5000, 1, "gasoline", 14, market.fuelPrices);
    const cost30k = calcFuelCost(30000, 1, "gasoline", 14, market.fuelPrices);
    expect(cost30k).toBeGreaterThan(cost5k);
    expect(cost30k).toBeCloseTo(cost5k * 6, -1); // 30k/5k = 6x
  });
});

// ---- calcRegistrationFee ----

describe("calcRegistrationFee", () => {
  const tiers = market.registrationFeeTiers;
  const radioFee = market.radioFee; // 141

  it("cheapest tier (< 114k)", () => {
    const result = calcRegistrationFee(100000, 1, tiers, radioFee);
    expect(result).toBe(Math.round(1335 + 141));
  });

  it("mid tier (162k-183k) — 3 years", () => {
    const result = calcRegistrationFee(170000, 3, tiers, radioFee);
    expect(result).toBe(Math.round((2326 + 141) * 3));
  });

  it("most expensive tier (> 338k)", () => {
    const result = calcRegistrationFee(400000, 1, tiers, radioFee);
    expect(result).toBe(Math.round(5203 + 141));
  });

  it("exact boundary — 114k falls in first tier", () => {
    const result = calcRegistrationFee(114000, 1, tiers, radioFee);
    expect(result).toBe(Math.round(1335 + 141));
  });

  it("just above boundary — 114001 falls in second tier", () => {
    const result = calcRegistrationFee(114001, 1, tiers, radioFee);
    expect(result).toBe(Math.round(1660 + 141));
  });

  // ---- New: lookup by feeGroup (kvuzat_agra_cd) ----

  it("uses feeGroup when provided (preferred over price-banding)", () => {
    const feeByGroup = market.registrationFeeByGroup!;
    // group 7 should map to fee from the table; ignore price tier
    const result = calcRegistrationFee(500000, 1, tiers, radioFee, 7, feeByGroup);
    expect(result).toBe(Math.round(feeByGroup[7] + radioFee));
  });

  it("falls back to price tiers when feeGroup is missing from the table", () => {
    const feeByGroup = { 1: 1000 };
    // group 99 doesn't exist → fall back to price tier (170k → 2326)
    const result = calcRegistrationFee(170000, 1, tiers, radioFee, 99, feeByGroup);
    expect(result).toBe(Math.round(2326 + radioFee));
  });

  it("falls back to price tiers when no feeByGroup table supplied", () => {
    const result = calcRegistrationFee(170000, 1, tiers, radioFee, 7, undefined);
    expect(result).toBe(Math.round(2326 + radioFee));
  });
});

// ---- calcTestFee ----

describe("calcTestFee", () => {
  const testFees = market.testFees;

  it("new car, 3 years — no test needed", () => {
    // car ages 1, 2, 3 — none > testStartAge(3)
    expect(calcTestFee(3, 0, "gasoline", testFees, 3)).toBe(0);
  });

  it("new car, 5 years — 2 years of fees (years 4-5)", () => {
    const result = calcTestFee(5, 0, "gasoline", testFees, 3);
    expect(result).toBeCloseTo(117.6 * 2, 1);
  });

  it("used car age 2, 3 years — 2 years of fees", () => {
    // ages: 3, 4, 5 — ages 4 and 5 are > 3
    const result = calcTestFee(3, 2, "gasoline", testFees, 3);
    expect(result).toBeCloseTo(117.6 * 2, 1);
  });

  it("electric car — lower fee", () => {
    const result = calcTestFee(5, 0, "electric", testFees, 3);
    expect(result).toBeCloseTo(99.95 * 2, 1);
  });

  it("old car (age 5) — every year needs test", () => {
    const result = calcTestFee(3, 5, "gasoline", testFees, 3);
    expect(result).toBeCloseTo(117.6 * 3, 1);
  });
});

// ---- calcMaintenance ----

describe("calcMaintenance", () => {
  it("gasoline — base rate", () => {
    // 15000 * 0.15 * 1.0 * 3 = 6750
    expect(calcMaintenance(15000, 3, "gasoline")).toBe(6750);
  });

  it("electric — 0.8x multiplier", () => {
    // 15000 * 0.15 * 0.8 * 3 = 5400
    expect(calcMaintenance(15000, 3, "electric")).toBe(5400);
  });

  it("diesel — 1.1x multiplier", () => {
    // 15000 * 0.15 * 1.1 * 3 = 7425
    expect(calcMaintenance(15000, 3, "diesel")).toBe(7425);
  });

  it("hybrid — 1.2x multiplier", () => {
    // 15000 * 0.15 * 1.2 * 3 = 8100
    expect(calcMaintenance(15000, 3, "hybrid")).toBe(8100);
  });

  it("zero km — zero cost", () => {
    expect(calcMaintenance(0, 3, "gasoline")).toBe(0);
  });

  it("override ratePerKm — uses user value", () => {
    // 15000 × 0.20 × 1.0 × 3 = 9000
    expect(calcMaintenance(15000, 3, "gasoline", { ratePerKm: 0.2 })).toBe(9000);
  });

  it("override multiplier — uses user value", () => {
    // 15000 × 0.15 × 1.5 × 3 = 10125
    expect(
      calcMaintenance(15000, 3, "gasoline", { ratePerKm: 0.15, multipliers: { gasoline: 1.5 } }),
    ).toBe(10125);
  });
});

// ---- calcLoanCost ----

describe("calcLoanCost", () => {
  it("standard loan — 60000 @ 4.5% for 5 years", () => {
    const result = calcLoanCost(60000, 4.5, 5, 0);
    // Monthly rate = 0.045 / 12 = 0.00375
    // Payments = 60
    // Monthly payment ≈ 1118.77
    expect(result.monthlyPayment).toBeCloseTo(1118.77, 0);
    expect(result.totalPaid).toBeGreaterThan(60000);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalInterest).toBe(result.totalPaid - 60000);
    expect(result.totalWithFee).toBe(result.totalPaid); // no fee
  });

  it("zero principal — all zeros", () => {
    const result = calcLoanCost(0, 4.5, 5, 0);
    expect(result.monthlyPayment).toBe(0);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPaid).toBe(0);
  });

  it("with origination fee", () => {
    const result = calcLoanCost(60000, 4.5, 5, 500);
    expect(result.totalWithFee).toBe(result.totalPaid + 500);
  });

  it("zero interest — simple division", () => {
    const result = calcLoanCost(60000, 0, 5, 0);
    expect(result.monthlyPayment).toBe(1000); // 60000 / 60
    expect(result.totalInterest).toBe(0);
  });
});

// ---- calcBusinessTaxBenefits ----

describe("calcBusinessTaxBenefits", () => {
  it("standard calculation — 45% recognition", () => {
    // 100000 * 0.45 * 0.47 = 21150
    expect(calcBusinessTaxBenefits(100000, 47)).toBe(Math.round(100000 * 0.45 * 0.47));
  });

  it("zero expenses — zero benefit", () => {
    expect(calcBusinessTaxBenefits(0, 47)).toBe(0);
  });

  it("zero tax rate — zero benefit", () => {
    expect(calcBusinessTaxBenefits(100000, 0)).toBe(0);
  });
});

// ---- calcInvestmentReturn ----

describe("calcInvestmentReturn", () => {
  it("compound interest — 100000 @ 10.5% for 3 years", () => {
    const result = calcInvestmentReturn(100000, 3, 10.5);
    const expectedFinal = 100000 * Math.pow(1.105, 3);
    expect(result.finalValue).toBe(Math.round(expectedFinal));
    expect(result.gain).toBe(Math.round(expectedFinal - 100000));
  });

  it("zero principal — zero gain", () => {
    const result = calcInvestmentReturn(0, 3, 10.5);
    expect(result.gain).toBe(0);
    expect(result.finalValue).toBe(0);
  });

  it("zero years — zero gain", () => {
    const result = calcInvestmentReturn(100000, 0, 10.5);
    expect(result.gain).toBe(0);
  });
});

// ---- calcInsurance ----

describe("calcInsurance", () => {
  it("standard — 1500 mandatory + 5000 comprehensive, 3 years", () => {
    const result = calcInsurance(1500, 5000, 3);
    expect(result.mandatory).toBe(4500);
    expect(result.comprehensive).toBe(15000);
    expect(result.total).toBe(19500);
  });

  it("zero quotes — zero insurance", () => {
    const result = calcInsurance(0, 0, 3);
    expect(result.total).toBe(0);
  });

  it("1 year", () => {
    const result = calcInsurance(1500, 5000, 1);
    expect(result.mandatory).toBe(1500);
    expect(result.comprehensive).toBe(5000);
    expect(result.total).toBe(6500);
  });
});
