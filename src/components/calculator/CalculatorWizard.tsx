"use client";

import { useState, useEffect } from "react";
import type { Locale, getTranslations } from "@/i18n/config";
import type { FuelType } from "@/types/calculator";
import { useCalculator } from "@/hooks/useCalculator";
import StepIndicator from "@/components/ui/StepIndicator";
import InstructionsStep from "./steps/InstructionsStep";
import PersonalDetailsStep from "./steps/PersonalDetailsStep";
import AnnualKmStep from "./steps/AnnualKmStep";
import PurchaseFinanceStep from "./steps/PurchaseFinanceStep";
import InvestStep from "./steps/InvestStep";
import BusinessStep from "./steps/BusinessStep";
import LeasingStep from "./steps/LeasingStep";
import BuyingStep from "./steps/BuyingStep";
import ResultsDashboard from "./results/ResultsDashboard";

interface CalculatorWizardProps {
  locale: Locale;
  translations: ReturnType<typeof getTranslations>;
}

// Mirrors DEFAULT_SERVICE_COST in formulas.ts (1,500 ₪ / 10,000 km == 0.15 ₪/km baseline)
const MAINTENANCE_SERVICE_COST: Record<FuelType, number> = {
  gasoline: 1500,
  diesel: 1650,
  hybrid: 1800,
  plugin_hybrid: 1900,
  electric: 1200,
};
const MAINTENANCE_INTERVAL_KM = 10000;

const DEFAULT_INVESTMENT_RETURN = 10.5;

export default function CalculatorWizard({ locale, translations: t }: CalculatorWizardProps) {
  const calc = useCalculator();
  const { currentStep, input, errors, updateField } = calc;

  const maintDefaults = {
    serviceIntervalKm: MAINTENANCE_INTERVAL_KM,
    costPerService: MAINTENANCE_SERVICE_COST[input.buy.fuelType],
  };

  // Fetch default investment return from market data
  const [defaultReturn, setDefaultReturn] = useState(DEFAULT_INVESTMENT_RETURN);
  useEffect(() => {
    fetch("/api/market-data")
      .then((r) => r.json())
      .then((data) => {
        if (data.defaultInvestmentReturn) {
          setDefaultReturn(data.defaultInvestmentReturn);
        }
      })
      .catch(() => {});
  }, []);

  // While results are shown, hide the home hero tiles (see globals.css) so
  // scrolling up from the results doesn't land back on the landing page.
  const showingResults = calc.showResults && !!calc.results;
  useEffect(() => {
    document.documentElement.toggleAttribute("data-results", showingResults);
    return () => document.documentElement.removeAttribute("data-results");
  }, [showingResults]);

  return (
    <div>
      {/* Wizard Form */}
      {!calc.showResults && (
        <div className="mx-auto max-w-[720px]">
          {currentStep > 1 && (
            <StepIndicator
              currentStep={currentStep}
              stepLabel={t.wizard.step}
              ofLabel={t.wizard.of}
            />
          )}

          <div className={`rounded-[28px] p-7 sm:p-9 ${
            currentStep === 1 ? "bg-ink text-white" : currentStep === 3 ? "bg-lime" : "bg-white"
          }`}>
            {currentStep === 1 && (
              <InstructionsStep
                t={t}
                onStart={() => calc.nextStep()}
              />
            )}

            {currentStep === 2 && (
              <PersonalDetailsStep
                t={t}
                name={input.name}
                email={input.email}
                errors={errors}
                onChange={updateField}
              />
            )}

            {currentStep === 3 && (
              <AnnualKmStep
                t={t}
                locale={locale}
                annualKm={input.annualKm}
                onChange={updateField}
              />
            )}

            {currentStep === 4 && (
              <BuyingStep
                t={t}
                locale={locale}
                buy={input.buy}
                errors={errors}
                onChange={updateField}
              />
            )}

            {currentStep === 5 && (
              <PurchaseFinanceStep
                t={t}
                locale={locale}
                cashOnHand={input.cashOnHand}
                oldCarValue={input.oldCarValue}
                carPrice={input.buy.carPrice}
                interestRate={input.financing.interestRate}
                loanTermYears={input.financing.loanTermYears}
                errors={errors}
                onChange={updateField}
              />
            )}

            {currentStep === 6 && (
              <LeasingStep
                t={t}
                locale={locale}
                lease={input.lease}
                errors={errors}
                onChange={updateField}
              />
            )}

            {currentStep === 7 && (
              <InvestStep
                t={t}
                locale={locale}
                cashOnHand={input.cashOnHand}
                oldCarValue={input.oldCarValue}
                carPrice={input.buy.carPrice}
                leaseDownPayment={input.lease.leaseDownPayment}
                includeInvestment={input.includeInvestment}
                investmentReturnRate={input.investmentReturnRate}
                defaultInvestmentReturn={defaultReturn}
                onChange={updateField}
              />
            )}

            {currentStep === 8 && (
              <BusinessStep
                t={t}
                isBusinessUse={input.isBusinessUse}
                marginalTaxRate={input.marginalTaxRate}
                buyWorkplaceBenefit={input.buy.workplaceBenefitMonthly}
                leaseWorkplaceBenefit={input.lease.workplaceBenefitMonthly}
                errors={errors}
                onChange={updateField}
              />
            )}

            {/* Error message */}
            {calc.apiError && (
              <div className="mt-4 rounded-[14px] bg-red-50 p-4 text-sm font-medium text-red-700">
                {calc.apiError}
              </div>
            )}

            {/* Navigation buttons */}
            {currentStep > 1 && (
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={calc.prevStep}
                  className={`h-14 rounded-[14px] px-6 text-base font-bold transition-colors ${currentStep === 3 ? "bg-white/70 hover:bg-white" : "bg-soft hover:bg-[#e8e8e2]"} text-ink`}
                >
                  {t.wizard.back}
                </button>

                {currentStep < 8 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (calc.nextStep()) return;
                      // Blocked: bring the first error message into view.
                      requestAnimationFrame(() =>
                        document.querySelector("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" }),
                      );
                    }}
                    className="h-14 rounded-[14px] bg-ink px-9 text-base font-bold text-white hover:bg-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                  >
                    {t.wizard.next}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={calc.calculate}
                    disabled={calc.isCalculating}
                    className="h-16 rounded-[14px] bg-lime px-10 text-lg font-extrabold text-ink ring-2 ring-inset ring-ink hover:brightness-95 transition focus:outline-none focus-visible:ring-4 disabled:opacity-50"
                  >
                    {calc.isCalculating ? t.wizard.calculating : t.wizard.calculate}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {calc.showResults && calc.results && (
        <div className="mx-auto max-w-[1072px]">
          <div className="mb-6">
            <button
              type="button"
              onClick={calc.backToForm}
              className="h-11 rounded-xl bg-white px-5 text-[15px] font-semibold text-ink hover:bg-soft transition-colors"
            >
              {t.wizard.back}
            </button>
          </div>

          <ResultsDashboard
            t={t}
            locale={locale}
            results={calc.results}
            input={input}
            periodYears={input.comparisonPeriodYears}
            isRecalculating={calc.isCalculating}
            onRecalculate={calc.recalculate}
            residualOverride={input.residualOverride}
            onApplyResidual={calc.applyResidual}
            maintenanceOverride={calc.maintenanceOverride}
            onMaintenanceChange={calc.setMaintenanceOverride}
            maintenanceDefaults={maintDefaults}
          />

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={calc.resetAll}
              className="h-14 rounded-[14px] bg-lime px-10 text-base font-extrabold text-ink ring-2 ring-inset ring-ink hover:brightness-95 transition focus:outline-none focus-visible:ring-4"
            >
              {t.wizard.startOver}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
