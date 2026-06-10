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

// Mirrors DEFAULT_SERVICE_COST in formulas.ts (1,500 ₪ / 10,000 km == 0.15 ₪/km baseline)
const MAINTENANCE_SERVICE_COST: Record<FuelType, number> = {
  gasoline: 1500,
  diesel: 1650,
  hybrid: 1800,
  electric: 1200,
};
const MAINTENANCE_INTERVAL_KM = 10000;

const DEFAULT_INVESTMENT_RETURN = 10.5;

export default function CalculatorWizard({ locale, translations: t }: CalculatorWizardProps) {
  const calc = useCalculator();
  const { currentStep, input, errors, updateField } = calc;

  const depDefaults = DEPRECIATION_DEFAULTS[input.buy.fuelType];
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
                isBusinessUse={input.isBusinessUse}
                marginalTaxRate={input.marginalTaxRate}
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

                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={calc.nextStep}
                    className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {t.wizard.next}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={calc.calculate}
                    disabled={calc.isCalculating}
                    className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
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
            onRecalculate={calc.recalculate}
            depreciationDefaults={depDefaults}
            maintenanceOverride={calc.maintenanceOverride}
            onMaintenanceChange={calc.setMaintenanceOverride}
            maintenanceDefaults={maintDefaults}
          />

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={calc.resetAll}
              className="rounded-xl bg-brand-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {t.wizard.startOver}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
