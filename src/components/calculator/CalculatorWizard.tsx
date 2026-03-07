"use client";

import { useState, useEffect } from "react";
import type { Locale, getTranslations } from "@/i18n/config";
import type { FuelType } from "@/types/calculator";
import { useCalculator } from "@/hooks/useCalculator";
import StepIndicator from "@/components/ui/StepIndicator";
import InstructionsStep from "./steps/InstructionsStep";
import PersonalDetailsStep from "./steps/PersonalDetailsStep";
import FinancingStep from "./steps/FinancingStep";
import LeasingStep from "./steps/LeasingStep";
import BuyingStep from "./steps/BuyingStep";
import ResultsDashboard from "./results/ResultsDashboard";

interface CalculatorWizardProps {
  locale: Locale;
  translations: ReturnType<typeof getTranslations>;
}

const DEPRECIATION_DEFAULTS: Record<FuelType, { yr1: number; yr2: number; yr3Plus: number }> = {
  gasoline: { yr1: 15, yr2: 12, yr3Plus: 10 },
  diesel: { yr1: 15, yr2: 12, yr3Plus: 10 },
  hybrid: { yr1: 15, yr2: 12, yr3Plus: 10 },
  electric: { yr1: 25, yr2: 20, yr3Plus: 15 },
};

const DEFAULT_INVESTMENT_RETURN = 10.5;

export default function CalculatorWizard({ locale, translations: t }: CalculatorWizardProps) {
  const calc = useCalculator();
  const { currentStep, input, errors, updateField } = calc;

  const depDefaults = DEPRECIATION_DEFAULTS[input.buy.fuelType];

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

  return (
    <div>
      {/* Wizard Form */}
      {!calc.showResults && (
        <div className="mx-auto max-w-2xl">
          {currentStep > 1 && (
            <StepIndicator
              currentStep={currentStep}
              stepLabel={t.wizard.step}
              ofLabel={t.wizard.of}
            />
          )}

          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-zinc-200/60 dark:bg-zinc-900 dark:ring-zinc-700/50 sm:p-8">
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
                isBusinessUse={input.isBusinessUse}
                marginalTaxRate={input.marginalTaxRate}
                errors={errors}
                onChange={updateField}
              />
            )}

            {currentStep === 3 && (
              <FinancingStep
                t={t}
                cashOnHand={input.cashOnHand}
                oldCarValue={input.oldCarValue}
                errors={errors}
                onChange={updateField}
              />
            )}

            {currentStep === 4 && (
              <LeasingStep
                t={t}
                locale={locale}
                lease={input.lease}
                annualKm={input.annualKm}
                mandatoryInsuranceQuote={input.mandatoryInsuranceQuote}
                comprehensiveInsuranceQuote={input.comprehensiveInsuranceQuote}
                includeInvestment={input.includeInvestment}
                investmentReturnRate={input.investmentReturnRate}
                defaultInvestmentReturn={defaultReturn}
                cashOnHand={input.cashOnHand}
                oldCarValue={input.oldCarValue}
                errors={errors}
                onChange={updateField}
              />
            )}

            {currentStep === 5 && (
              <BuyingStep
                t={t}
                locale={locale}
                buy={input.buy}
                cashOnHand={input.cashOnHand}
                oldCarValue={input.oldCarValue}
                mandatoryInsuranceQuote={input.mandatoryInsuranceQuote}
                comprehensiveInsuranceQuote={input.comprehensiveInsuranceQuote}
                useLoan={input.useLoan}
                interestRate={input.financing.interestRate}
                loanTermYears={input.financing.loanTermYears}
                errors={errors}
                onChange={updateField}
              />
            )}

            {/* Error message */}
            {calc.apiError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                {calc.apiError}
              </div>
            )}

            {/* Navigation buttons */}
            {currentStep > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={calc.prevStep}
                  className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {t.wizard.back}
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={calc.nextStep}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {t.wizard.next}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={calc.calculate}
                    disabled={calc.isCalculating}
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
        <div className="mt-8">
          <div className="mb-6">
            <button
              type="button"
              onClick={calc.backToForm}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
            onPeriodChange={calc.changePeriod}
            isRecalculating={calc.isCalculating}
            depreciationOverride={calc.depreciationOverride}
            onDepreciationChange={calc.setDepreciationOverride}
            depreciationDefaults={depDefaults}
          />

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={calc.resetAll}
              className="rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {t.wizard.startOver}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
