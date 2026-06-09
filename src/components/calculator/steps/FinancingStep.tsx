"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { FormErrors } from "@/types/form";
import { formatNumber } from "@/lib/formatters";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Toggle from "@/components/ui/Toggle";

interface FinancingStepProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  cashOnHand: number;
  oldCarValue: number;
  isBusinessUse: boolean;
  marginalTaxRate?: number;
  carPrice: number;
  interestRate: number;
  loanTermYears: number;
  includeInvestment: boolean;
  investmentReturnRate?: number;
  defaultInvestmentReturn: number;
  leaseDownPayment: number;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function FinancingStep({
  t,
  locale,
  cashOnHand,
  oldCarValue,
  isBusinessUse,
  marginalTaxRate,
  carPrice,
  interestRate,
  loanTermYears,
  includeInvestment,
  investmentReturnRate,
  defaultInvestmentReturn,
  leaseDownPayment,
  errors,
  onChange,
}: FinancingStepProps) {
  const f = t.form.finance;
  const fin = t.form.financing;
  const pd = t.form.personalDetails;
  const buy = t.form.buying;
  const lease = t.form.leasing;

  const availableCapital = cashOnHand + oldCarValue;
  // A loan is needed only when capital doesn't cover the buy price.
  const loanNeeded = carPrice > 0 && carPrice > availableCapital;
  const loanAmount = loanNeeded ? carPrice - availableCapital : 0;
  // Investment opportunity is capped at the car price (only car-relevant capital).
  const relevantCapital = Math.min(availableCapital, carPrice || availableCapital);
  const investableAmount = Math.max(0, relevantCapital - leaseDownPayment);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.subtitle}</p>
      </div>

      {/* Capital */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">{f.capitalSection}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={fin.cashOnHand} hint={fin.cashOnHandHint} error={errors["cashOnHand"]} required validationMessages={t.form.validation}>
            <NumberInput
              value={cashOnHand}
              onChange={(v) => onChange("cashOnHand", v)}
              prefix="₪"
              error={!!errors["cashOnHand"]}
            />
          </FormField>
          <FormField label={fin.oldCarValue} hint={fin.oldCarValueHint} error={errors["oldCarValue"]} required validationMessages={t.form.validation}>
            <NumberInput
              value={oldCarValue}
              onChange={(v) => onChange("oldCarValue", v)}
              prefix="₪"
              error={!!errors["oldCarValue"]}
            />
          </FormField>
        </div>
        <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          {fin.capitalHint}
        </p>
      </div>

      {/* Loan — auto, only when capital doesn't cover the price */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2">{buy.loanSection}</h3>
        {!loanNeeded ? (
          <p className="text-xs text-emerald-600 dark:text-emerald-400">{buy.loanNotNeeded}</p>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{buy.loanExplain}</p>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
              {buy.loanAmount}: {formatNumber(loanAmount, locale)} ₪
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={buy.interestRate} error={errors["financing.interestRate"]}>
                <NumberInput
                  value={interestRate}
                  onChange={(v) => onChange("financing.interestRate", v)}
                  suffix="%"
                  step={0.1}
                  error={!!errors["financing.interestRate"]}
                />
              </FormField>
              <FormField label={buy.loanTerm} error={errors["financing.loanTermYears"]}>
                <NumberInput
                  value={loanTermYears}
                  onChange={(v) => onChange("financing.loanTermYears", v)}
                  min={1}
                  max={10}
                  error={!!errors["financing.loanTermYears"]}
                />
              </FormField>
            </div>
          </div>
        )}
      </div>

      {/* Investment — keeping car-money liquid when leasing */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{lease.investmentSection}</h3>
        <Toggle
          checked={includeInvestment}
          onChange={(v) => onChange("includeInvestment", v)}
          label={lease.investmentQuestion}
        />
        {includeInvestment && (
          <div className="mt-3 space-y-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{lease.investmentExplain}</p>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
              {lease.investmentAmount}: {formatNumber(investableAmount, locale)} ₪
            </p>
            <FormField label={lease.investmentReturn} hint={lease.investmentHint}>
              <NumberInput
                value={investmentReturnRate ?? defaultInvestmentReturn}
                onChange={(v) => onChange("investmentReturnRate", v)}
                suffix="%"
                step={0.1}
                placeholder={String(defaultInvestmentReturn)}
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Business use + marginal tax */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2">{f.businessSection}</h3>
        <Toggle
          checked={isBusinessUse}
          onChange={(v) => onChange("isBusinessUse", v)}
          label={pd.isOsekMurshe}
        />
        {isBusinessUse && (
          <>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{pd.isOsekMursheHint}</p>
            <div className="mt-3">
              <FormField label={pd.marginalTaxRate} hint={pd.marginalTaxRateHint} error={errors["marginalTaxRate"]} required>
                <NumberInput
                  value={marginalTaxRate ?? 0}
                  onChange={(v) => onChange("marginalTaxRate", v)}
                  placeholder="47"
                  suffix="%"
                  min={0}
                  max={100}
                  error={!!errors["marginalTaxRate"]}
                />
              </FormField>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
