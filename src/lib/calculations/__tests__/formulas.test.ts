import { describe, it, expect } from "vitest";
import {
  calcDepreciation,
  calcFuelCost,
  calcRegistrationFee,
  calcTestFee,
  calcMaintenance,
  calcLoanCost,
  calcBusinessTaxBenefits,
  calcCarVatReclaim,
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
  const bands = market.registrationFeeBands;
  const radioFee = market.radioFee; // 135

  it("group 1 (≤117k), new car (2024-26)", () => {
    const result = calcRegistrationFee(100000, 1, bands, radioFee, 2025);
    expect(result).toBe(Math.round(1266 + 135));
  });

  it("group 5 (188k-244k), new car — matches real Kodiaq case (2,651 + 135 = 2,786)", () => {
    const result = calcRegistrationFee(204500, 1, bands, radioFee, 2024);
    expect(result).toBe(2786);
  });

  it("group 5, mid-age cohort (2021-2023)", () => {
    const result = calcRegistrationFee(204500, 1, bands, radioFee, 2022);
    expect(result).toBe(Math.round(2184 + 135));
  });

  it("most expensive group (>347k), 3 years", () => {
    const result = calcRegistrationFee(400000, 3, bands, radioFee, 2025);
    expect(result).toBe(Math.round((5364 + 135) * 3));
  });

  it("exact boundary — 117k falls in group 1", () => {
    const result = calcRegistrationFee(117000, 1, bands, radioFee, 2025);
    expect(result).toBe(Math.round(1266 + 135));
  });

  it("just above boundary — 117001 falls in group 2", () => {
    const result = calcRegistrationFee(117001, 1, bands, radioFee, 2025);
    expect(result).toBe(Math.round(1610 + 135));
  });

  it("old car (≤2016) pays the lowest cohort fee", () => {
    const result = calcRegistrationFee(204500, 1, bands, radioFee, 2010);
    expect(result).toBe(Math.round(1490 + 135));
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
  it("gasoline — default service (1,500 ₪ / 10,000 km)", () => {
    // (15000 / 10000) * 1500 * 3 = 6750  (== old 0.15 ₪/km baseline)
    expect(calcMaintenance(15000, 3, "gasoline")).toBe(6750);
  });

  it("electric — cheaper service (1,200 ₪)", () => {
    // (15000 / 10000) * 1200 * 3 = 5400
    expect(calcMaintenance(15000, 3, "electric")).toBe(5400);
  });

  it("diesel — pricier service (1,650 ₪)", () => {
    // (15000 / 10000) * 1650 * 3 = 7425
    expect(calcMaintenance(15000, 3, "diesel")).toBe(7425);
  });

  it("hybrid — pricier service (1,800 ₪)", () => {
    // (15000 / 10000) * 1800 * 3 = 8100
    expect(calcMaintenance(15000, 3, "hybrid")).toBe(8100);
  });

  it("zero km — zero cost", () => {
    expect(calcMaintenance(0, 3, "gasoline")).toBe(0);
  });

  it("override — custom service cost", () => {
    // (15000 / 10000) * 2000 * 3 = 9000
    expect(
      calcMaintenance(15000, 3, "gasoline", { serviceIntervalKm: 10000, costPerService: 2000 }),
    ).toBe(9000);
  });

  it("override — longer interval lowers annual cost", () => {
    // (15000 / 20000) * 1500 * 3 = 3375
    expect(
      calcMaintenance(15000, 3, "gasoline", { serviceIntervalKm: 20000, costPerService: 1500 }),
    ).toBe(3375);
  });

  it("override — zero interval guards against divide-by-zero", () => {
    expect(
      calcMaintenance(15000, 3, "gasoline", { serviceIntervalKm: 0, costPerService: 1500 }),
    ).toBe(0);
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

// ---- calcCarVatReclaim ----

describe("calcCarVatReclaim", () => {
  it("reclaims 2/3 of the 18% VAT embedded in running expenses", () => {
    // 10,000 ₪ incl. VAT → embedded VAT 10000×18/118 ≈ 1525.4 → ×2/3 ≈ 1017
    expect(calcCarVatReclaim(10000)).toBe(Math.round(10000 * (0.18 / 1.18) * (2 / 3)));
  });

  it("zero expenses — zero reclaim", () => {
    expect(calcCarVatReclaim(0)).toBe(0);
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
