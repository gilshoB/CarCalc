"use client";

import type { getTranslations } from "@/i18n/config";
import type { FormErrors } from "@/types/form";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Toggle from "@/components/ui/Toggle";

interface BusinessStepProps {
  t: ReturnType<typeof getTranslations>;
  isBusinessUse: boolean;
  marginalTaxRate?: number;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function BusinessStep({
  t,
  isBusinessUse,
  marginalTaxRate,
  errors,
  onChange,
}: BusinessStepProps) {
  const f = t.form.finance;
  const pd = t.form.personalDetails;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.businessTitle}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.businessSubtitle}</p>
      </div>

      <Toggle
        checked={isBusinessUse}
        onChange={(v) => onChange("isBusinessUse", v)}
        label={pd.isOsekMurshe}
      />

      {isBusinessUse && (
        <>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{pd.isOsekMursheHint}</p>
          <FormField label={pd.marginalTaxRate} hint={pd.marginalTaxRateHint} error={errors["marginalTaxRate"]} required>
            <NumberInput
              value={marginalTaxRate ?? 0}
              onChange={(v) => onChange("marginalTaxRate", v)}
              suffix="%"
              min={0}
              max={100}
              error={!!errors["marginalTaxRate"]}
            />
          </FormField>
        </>
      )}
    </div>
  );
}
