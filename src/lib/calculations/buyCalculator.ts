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

  // 1. Available capital
  const availableCapital = input.cashOnHand + input.oldCarValue;

  // 2. Loan calculation (only if user toggled on)
  const loanNeeded = input.useLoan ? Math.max(0, buy.carPrice - availableCapital) : 0;
  const loan = loanNeeded > 0
    ? calcLoanCost(
        loanNeeded,
        input.financing.interestRate,
        input.financing.loanTermYears,
        input.financing.originationFee,
      )
    : { monthlyPayment: 0, totalInterest: 0, totalPaid: 0, totalWithFee: 0 };

  // 3. Depreciation
  const depreciation = calcDepreciation(
    buy.carPrice,
    years,
    buy.fuelType,
    buy.isUsed,
    buy.usedCarAge,
  );

  // 4. Annual recurring costs
  const registration = calcRegistrationFee(
    catalogPrice,
    years,
    marketData.registrationFeeTiers,
    marketData.radioFee,
  );

  const insurance = calcInsurance(
    input.mandatoryInsuranceQuote,
    input.comprehensiveInsuranceQuote,
    years,
  );

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

  const maintenance = calcMaintenance(annualKm, years, buy.fuelType);

  // 5. Tax benefits (business)
  let taxBenefits = 0;
  if (input.isBusinessUse && input.marginalTaxRate) {
    const deductibleExpenses =
      insurance.total +
      registration +
      maintenance +
      fuel +
      depreciation.totalDepreciation +
      loan.totalInterest;
    taxBenefits = calcBusinessTaxBenefits(deductibleExpenses, input.marginalTaxRate);
  }

  // 6. Investment opportunity cost / gain
  let investmentResult = 0;
  if (input.includeInvestment) {
    const returnRate = input.investmentReturnRate ?? marketData.defaultInvestmentReturn;

    // Capital tied in car = what user actually pays upfront (not loaned)
    const capitalTiedInCar = Math.min(availableCapital, buy.carPrice);

    // Opportunity cost: what this capital could have earned
    const opportunityCost = calcInvestmentReturn(capitalTiedInCar, years, returnRate);
    investmentResult = -opportunityCost.gain; // negative = cost to buyer

    // If there's excess capital (available > car price), that can be invested
    const excessCapital = Math.max(0, availableCapital - buy.carPrice);
    if (excessCapital > 0) {
      const excessGain = calcInvestmentReturn(excessCapital, years, returnRate);
      investmentResult += excessGain.gain; // positive = gain
    }
  }

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
    taxBenefits + // subtract: tax savings
    Math.abs(investmentResult) * (investmentResult < 0 ? 1 : -1); // add opportunity cost or subtract investment gain

  const monthlyCost = Math.round(totalCost / (years * 12));

  // 8. Build yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = [];
  let cumulative = buy.carPrice; // start with purchase price

  const annualRegistration = calcRegistrationFee(
    catalogPrice,
    1,
    marketData.registrationFeeTiers,
    marketData.radioFee,
  );
  const annualInsurance = input.mandatoryInsuranceQuote + input.comprehensiveInsuranceQuote;
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
