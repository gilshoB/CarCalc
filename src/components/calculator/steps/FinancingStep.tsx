"use client";

import type { getTranslations } from "@/i18n/config";
import type { FormErrors } from "@/types/form";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";

interface FinancingStepProps {
  t: ReturnType<typeof getTranslations>;
  cashOnHand: number;
  oldCarValue: number;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function FinancingStep({
  t,
  cashOnHand,
  oldCarValue,
  errors,
  onChange,
}: FinancingStepProps) {
  const f = t.form.financing;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.cashOnHand} hint={f.cashOnHandHint} error={errors["cashOnHand"]} required validationMessages={t.form.validation}>
          <NumberInput
            value={cashOnHand}
            onChange={(v) => onChange("cashOnHand", v)}
            prefix="₪"
            error={!!errors["cashOnHand"]}
          />
        </FormField>

        <FormField label={f.oldCarValue} hint={f.oldCarValueHint} error={errors["oldCarValue"]} required validationMessages={t.form.validation}>
          <NumberInput
            value={oldCarValue}
            onChange={(v) => onChange("oldCarValue", v)}
            prefix="₪"
            error={!!errors["oldCarValue"]}
          />
        </FormField>
      </div>

      <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700 dark:bg-brand-950 dark:text-brand-300">
        {f.capitalHint}
      </p>
    </div>
  );
}
