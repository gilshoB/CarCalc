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
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.cashOnHand} hint={f.cashOnHandHint} error={errors["cashOnHand"]}>
          <NumberInput
            value={cashOnHand}
            onChange={(v) => onChange("cashOnHand", v)}
            prefix="₪"
            error={!!errors["cashOnHand"]}
          />
        </FormField>

        <FormField label={f.oldCarValue} hint={f.oldCarValueHint}>
          <NumberInput
            value={oldCarValue}
            onChange={(v) => onChange("oldCarValue", v)}
            prefix="₪"
          />
        </FormField>
      </div>
    </div>
  );
}
