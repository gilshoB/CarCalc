"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
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
  onChange,
}: InvestStepProps) {
  const f = t.form.finance;
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
    </div>
  );
}
