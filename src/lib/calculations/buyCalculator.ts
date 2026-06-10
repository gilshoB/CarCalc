import type {
  CalculatorInput,
  MarketData,
  OptionResult,
  CostBreakdown,
  YearlyBreakdown,
} from "@/types/calculator";
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
} from "./formulas";

export function calcBuyScenario(
  input: CalculatorInput,
  marketData: MarketData,
): OptionResult {
  const { buy, annualKm, comparisonPeriodYears: years } = input;
  const catalogPrice = buy.catalogPrice ?? buy.carPrice;
  const carAgeAtStart = buy.isUsed ? (buy.usedCarAge ?? 0) : 0;
  // Manufacture year drives the registration-fee cohort. Prefer the picked
  // vehicle's model year; otherwise derive from the used-car age.
  const manufactureYear = buy.vehicle?.modelYear ?? (new Date().getFullYear() - carAgeAtStart);

  // 1. Available capital
  const availableCapital = input.cashOnHand + input.oldCarValue;

  // 2. Loan calculation — a loan is needed (and only needed) when the available
  // capital doesn't cover the price. Derived purely from the numbers; there's no
  // separate "use loan" flag to keep in sync.
  const loanNeeded = Math.max(0, buy.carPrice - availableCapital);
  const loan = loanNeeded > 0
    ? calcLoanCost(
        loanNeeded,
        input.financing.interestRate,
        input.financing.loanTermYears,
        input.financing.originationFee,
      )
    : { monthlyPayment: 0, totalInterest: 0, totalPaid: 0, totalWithFee: 0 };

  // 3. Depreciation (with used-car adjustments if applicable)
  const depreciation = calcDepreciation(
    buy.carPrice,
    years,
    buy.fuelType,
    buy.isUsed,
    buy.usedCarAge,
    input.depreciationOverride,
    {
      odometerKm: buy.odometerKm,
      previousHands: buy.previousHands,
      wasLeased: buy.wasLeased,
    },
  );

  // 4. Annual recurring costs
  const registration = calcRegistrationFee(
    catalogPrice,
    years,
    marketData.registrationFeeBands,
    marketData.radioFee,
    manufactureYear,
  );

  // Insurance: prefer per-scenario override if set, else top-level
  const mandatoryQuote = buy.mandatoryInsuranceQuote ?? input.mandatoryInsuranceQuote;
  const comprehensiveQuote = buy.comprehensiveInsuranceQuote ?? input.comprehensiveInsuranceQuote;
  const insurance = calcInsurance(mandatoryQuote, comprehensiveQuote, years);

  const testFees = calcTestFee(
    years,
    carAgeAtStart,
    buy.fuelType,
    marketData.testFees,
    marketData.testStartAge,
  );

  const fuel = calcFuelCost(
    annualKm,
    years,
    buy.fuelType,
    buy.consumptionKmPerUnit,
    marketData.fuelPrices,
  );

  const maintenance = calcMaintenance(annualKm, years, buy.fuelType, input.maintenanceOverride);

  // 5. Tax benefits (business): VAT reclaim (2/3 on fuel + maintenance) plus
  // income-tax recognition. The reclaimed VAT is netted out of the income-tax
  // base so it isn't counted twice.
  let taxBenefits = 0;
  if (input.isBusinessUse && input.marginalTaxRate) {
    const vatReclaim = calcCarVatReclaim(fuel + maintenance);
    const deductibleExpenses =
      insurance.total +
      registration +
      maintenance +
      fuel +
      depreciation.totalDepreciation +
      loan.totalInterest -
      vatReclaim;
    taxBenefits = vatReclaim + calcBusinessTaxBenefits(deductibleExpenses, input.marginalTaxRate);
  }

  // 6. Investment / opportunity cost.
  // Only the capital "at stake" in the buy-vs-lease decision counts — that's the
  // amount up to the car's price. When buying, that capital is sunk into the car,
  // so none of it stays invested → 0. (Any capital the user holds *beyond* the car
  // price would be invested identically whether they buy or lease, so it cancels
  // out and is deliberately excluded from both sides rather than inflating them.)
  const investmentResult = 0;

  // 7. Total cost
  // Net cost of ownership = what you pay - what you get back
  const totalCost =
    buy.carPrice + // purchase price
    loan.totalInterest + // interest on loan
    loan.totalWithFee - loan.totalPaid + // origination fee (totalWithFee - totalPaid = fee)
    registration +
    insurance.total +
    testFees +
    fuel +
    maintenance -
    depreciation.residualValue - // subtract: car still has value
    taxBenefits -
    investmentResult; // subtract: investment gain on free capital

  const monthlyCost = Math.round(totalCost / (years * 12));

  // 8. Build yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = [];
  let cumulative = buy.carPrice; // start with purchase price

  const annualRegistration = calcRegistrationFee(
    catalogPrice,
    1,
    marketData.registrationFeeBands,
    marketData.radioFee,
    manufactureYear,
  );
  const annualInsurance =
    (buy.mandatoryInsuranceQuote ?? input.mandatoryInsuranceQuote) +
    (buy.comprehensiveInsuranceQuote ?? input.comprehensiveInsuranceQuote);
  const annualFuel = calcFuelCost(annualKm, 1, buy.fuelType, buy.consumptionKmPerUnit, marketData.fuelPrices);
  const annualMaintenance = calcMaintenance(annualKm, 1, buy.fuelType);
  const annualLoanPayment = loan.monthlyPayment * 12;

  for (let i = 0; i < years; i++) {
    const ageAtEnd = carAgeAtStart + i + 1;
    const annualTest =
      ageAtEnd > marketData.testStartAge
        ? (buy.fuelType === "electric" ? marketData.testFees.electric : marketData.testFees.combustion)
        : 0;

    const yearCost = annualRegistration + annualInsurance + annualTest + annualFuel + annualMaintenance + annualLoanPayment;
    cumulative += yearCost;

    yearlyBreakdown.push({
      year: i + 1,
      registration: annualRegistration,
      insurance: annualInsurance,
      test: annualTest,
      fuel: annualFuel,
      maintenance: annualMaintenance,
      loanPayment: annualLoanPayment,
      leasePayment: 0,
      cumulativeCost: Math.round(cumulative),
    });
  }

  const breakdown: CostBreakdown = {
    carPayment: buy.carPrice,
    loanInterest: loan.totalInterest,
    loanOriginationFee: input.financing.originationFee,
    registrationFees: registration,
    mandatoryInsurance: insurance.mandatory,
    comprehensiveInsurance: insurance.comprehensive,
    testFees,
    fuel,
    maintenance,
    depreciation: depreciation.totalDepreciation,
    residualValue: depreciation.residualValue,
    taxBenefits,
    investmentResult,
  };

  return {
    totalCost: Math.round(totalCost),
    monthlyCost,
    breakdown,
    yearlyBreakdown,
  };
}
