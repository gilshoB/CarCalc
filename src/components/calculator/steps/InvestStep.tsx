"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { FormErrors } from "@/types/form";
import { formatNumber } from "@/lib/formatters";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Toggle from "@/components/ui/Toggle";

interface InvestStepProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  cashOnHand: number;
  oldCarValue: number;
  carPrice: number;
  leaseDownPayment: number;
  includeInvestment: boolean;
  investmentReturnRate?: number;
  defaultInvestmentReturn: number;
  isBusinessUse: boolean;
  marginalTaxRate?: number;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function InvestStep({
  t,
  locale,
  cashOnHand,
  oldCarValue,
  carPrice,
  leaseDownPayment,
  includeInvestment,
  investmentReturnRate,
  defaultInvestmentReturn,
  isBusinessUse,
  marginalTaxRate,
  errors,
  onChange,
}: InvestStepProps) {
  const f = t.form.finance;
  const pd = t.form.personalDetails;
  const lease = t.form.leasing;

  const availableCapital = cashOnHand + oldCarValue;
  // Only capital up to the car price is "at stake" in the buy-vs-lease decision.
  const relevantCapital = Math.min(availableCapital, carPrice || availableCapital);
  const investableAmount = Math.max(0, relevantCapital - leaseDownPayment);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.investTitle}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.investSubtitle}</p>
      </div>

      {/* Investment */}
      <div>
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
