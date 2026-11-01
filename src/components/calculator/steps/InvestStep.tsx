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
    <div className="space-y-7">
      <div>
        <h2 className="text-[34px] sm:text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em]">{f.investTitle}</h2>
        <p className="mt-2 text-base leading-relaxed text-muted">{f.investSubtitle}</p>
      </div>

      {/* Investment */}
      <div>
        <Toggle
          checked={includeInvestment}
          onChange={(v) => onChange("includeInvestment", v)}
          label={lease.investmentQuestion}
        />
        {includeInvestment && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-[#3d3d38]">{lease.investmentExplain}</p>
            <div className="rounded-[14px] border-2 border-line px-4 py-3.5 flex flex-col gap-1">
              <span className="text-[13px] text-muted">{lease.investmentAmount}</span>
              <span className="text-[22px] font-extrabold">{formatNumber(investableAmount, locale)} ₪</span>
            </div>
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
