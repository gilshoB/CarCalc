import type {
  CalculatorInput,
  MarketData,
  OptionResult,
  CostBreakdown,
  YearlyBreakdown,
} from "@/types/calculator";
import {
  calcFuelCost,
  calcRegistrationFee,
  calcTestFee,
  calcMaintenance,
  calcBusinessTaxBenefits,
  calcInvestmentReturn,
  calcInsurance,
} from "./formulas";

export function calcLeaseScenario(
  input: CalculatorInput,
  marketData: MarketData,
): OptionResult {
  const { lease, annualKm, comparisonPeriodYears: years } = input;
  const leaseCarAge = lease.leaseCarAge ?? 0;
  // Manufacture year for the registration-fee cohort: prefer the picked
  // vehicle's model year; otherwise derive from the lease car's age.
  const manufactureYear = lease.vehicle?.modelYear ?? (new Date().getFullYear() - leaseCarAge);

  // 1. Total lease payments (lease spans the full comparison period)
  const totalLeasePayments =
    lease.monthlyPayment * 12 * years + lease.leaseDownPayment;

  // 2. Costs NOT included in lease — add separately
  let additionalMaintenance = 0;
  if (!lease.leaseIncludes.maintenance) {
    additionalMaintenance = calcMaintenance(annualKm, years, lease.fuelType, input.maintenanceOverride);
  }

  let additionalInsurance = { mandatory: 0, comprehensive: 0, total: 0 };
  if (!lease.leaseIncludes.mandatoryInsurance || !lease.leaseIncludes.comprehensiveInsurance) {
    // Prefer per-scenario override (lease.*) before top-level
    const baseMandatory = lease.mandatoryInsuranceQuote ?? input.mandatoryInsuranceQuote;
    const baseComprehensive = lease.comprehensiveInsuranceQuote ?? input.comprehensiveInsuranceQuote;
    const mandatoryQuote = lease.leaseIncludes.mandatoryInsurance ? 0 : baseMandatory;
    const comprehensiveQuote = lease.leaseIncludes.comprehensiveInsurance ? 0 : baseComprehensive;
    additionalInsurance = calcInsurance(mandatoryQuote, comprehensiveQuote, years);
  }

  let additionalRegistration = 0;
  if (!lease.leaseIncludes.registration) {
    // Use lease vehicle's catalog price + fee group if available, else fall back to buy car
    const leaseCatalogPrice =
      lease.vehicle?.catalogPrice ?? input.buy.catalogPrice ?? input.buy.carPrice;
    additionalRegistration = calcRegistrationFee(
      leaseCatalogPrice,
      years,
      marketData.registrationFeeBands,
      marketData.radioFee,
      manufactureYear,
    );
  }

  // 3. Fuel (never included in lease)
  const fuel = calcFuelCost(
    annualKm,
    years,
    lease.fuelType,
    lease.consumptionKmPerUnit,
    marketData.fuelPrices,
  );

  // 4. טסט
  const testFees = calcTestFee(
    years,
    leaseCarAge,
    lease.fuelType,
    marketData.testFees,
    marketData.testStartAge,
  );

  // 5. Tax benefits (business)
  let taxBenefits = 0;
  if (input.isBusinessUse && input.marginalTaxRate) {
    const deductibleExpenses =
      totalLeasePayments + // lease payments are deductible
      additionalInsurance.total +
      additionalRegistration +
      additionalMaintenance +
      fuel;
    taxBenefits = calcBusinessTaxBenefits(deductibleExpenses, input.marginalTaxRate);
  }

  // 6. Investment — car-relevant capital stays liquid when leasing.
  // The capital "at stake" in the decision is only the amount up to the price of
  // buying the car. When leasing you don't sink that into a vehicle, so it stays
  // invested (minus the lease down payment). Capital beyond the car price would be
  // invested whether you buy or lease, so it's excluded from both sides.
  let investmentResult = 0;
  if (input.includeInvestment) {
    const returnRate = input.investmentReturnRate ?? marketData.defaultInvestmentReturn;
    const availableCapital = input.cashOnHand + input.oldCarValue;
    const carValue = input.buy.carPrice; // cost of owning — the alternative to leasing
    const relevantCapital = Math.min(availableCapital, carValue);

    const investableCapital = Math.max(0, relevantCapital - lease.leaseDownPayment);
    if (investableCapital > 0) {
      const result = calcInvestmentReturn(investableCapital, years, returnRate);
      investmentResult = result.gain; // positive = gain for lessee
    }
  }

  // 7. Total cost
  const totalCost =
    totalLeasePayments +
    additionalMaintenance +
    additionalInsurance.total +
    additionalRegistration +
    fuel +
    testFees -
    taxBenefits -
    investmentResult; // investment gain reduces effective cost

  const monthlyCost = Math.round(totalCost / (years * 12));

  // 8. Yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = [];
  let cumulative = lease.leaseDownPayment;

  const annualLeasePayment = lease.monthlyPayment * 12;
  const annualFuel = calcFuelCost(annualKm, 1, lease.fuelType, lease.consumptionKmPerUnit, marketData.fuelPrices);
  const annualMaintenance = !lease.leaseIncludes.maintenance
    ? calcMaintenance(annualKm, 1, lease.fuelType, input.maintenanceOverride)
    : 0;

  const annualRegistration = !lease.leaseIncludes.registration
    ? calcRegistrationFee(
        lease.vehicle?.catalogPrice ?? input.buy.catalogPrice ?? input.buy.carPrice,
        1,
        marketData.registrationFeeBands,
        marketData.radioFee,
        manufactureYear,
      )
    : 0;

  const annualInsurance =
    (!lease.leaseIncludes.mandatoryInsurance
      ? lease.mandatoryInsuranceQuote ?? input.mandatoryInsuranceQuote
      : 0) +
    (!lease.leaseIncludes.comprehensiveInsurance
      ? lease.comprehensiveInsuranceQuote ?? input.comprehensiveInsuranceQuote
      : 0);

  for (let i = 0; i < years; i++) {
    const ageAtEnd = leaseCarAge + i + 1;
    const annualTest =
      ageAtEnd > marketData.testStartAge
        ? (lease.fuelType === "electric" ? marketData.testFees.electric : marketData.testFees.combustion)
        : 0;

    const yearCost = annualLeasePayment + annualRegistration + annualInsurance + annualTest + annualFuel + annualMaintenance;
    cumulative += yearCost;

    yearlyBreakdown.push({
      year: i + 1,
      registration: annualRegistration,
      insurance: annualInsurance,
      test: annualTest,
      fuel: annualFuel,
      maintenance: annualMaintenance,
      loanPayment: 0,
      leasePayment: annualLeasePayment,
      cumulativeCost: Math.round(cumulative),
    });
  }

  const breakdown: CostBreakdown = {
    carPayment: totalLeasePayments,
    loanInterest: 0,
    loanOriginationFee: 0,
    registrationFees: additionalRegistration,
    mandatoryInsurance: additionalInsurance.mandatory,
    comprehensiveInsurance: additionalInsurance.comprehensive,
    testFees,
    fuel,
    maintenance: additionalMaintenance,
    depreciation: 0, // no depreciation risk for lessee
    residualValue: 0, // car returned at end of lease
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
