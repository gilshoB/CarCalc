"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { FormErrors } from "@/types/form";
import { formatNumber } from "@/lib/formatters";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";

interface PurchaseFinanceStepProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  cashOnHand: number;
  oldCarValue: number;
  carPrice: number;
  interestRate: number;
  loanTermYears: number;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function PurchaseFinanceStep({
  t,
  locale,
  cashOnHand,
  oldCarValue,
  carPrice,
  interestRate,
  loanTermYears,
  errors,
  onChange,
}: PurchaseFinanceStepProps) {
  const f = t.form.finance;
  const fin = t.form.financing;
  const buy = t.form.buying;

  const availableCapital = cashOnHand + oldCarValue;
  const loanNeeded = carPrice > 0 && carPrice > availableCapital;
  const loanAmount = loanNeeded ? carPrice - availableCapital : 0;

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[34px] sm:text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em]">{f.purchaseTitle}</h2>
        <p className="mt-2 text-base leading-relaxed text-muted">{f.purchaseSubtitle}</p>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">{f.capitalSection}</h3>
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
        <p className="mt-3 rounded-[14px] bg-soft px-4 py-3 text-sm leading-relaxed text-[#3d3d38]">
          {fin.capitalHint}
        </p>
      </div>

      <div className="pt-2">
        <h3 className="text-lg font-bold mb-3">{buy.loanSection}</h3>
        {!loanNeeded ? (
          <p className="rounded-[14px] bg-brand-100 px-4 py-3 text-sm font-medium text-ink">✓ {buy.loanNotNeeded}</p>
        ) : (
          <div className="space-y-4 rounded-[18px] bg-ink p-5 sm:p-6 text-white [&_.text-red-700]:text-red-300">
            <p className="text-sm text-[#c8c8c1]">{buy.loanExplain}</p>
            <p className="text-xl font-extrabold">
              {buy.loanAmount}: <span className="text-lime">{formatNumber(loanAmount, locale)} ₪</span>
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
    </div>
  );
}
