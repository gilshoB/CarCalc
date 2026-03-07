"use client";

import type { getTranslations } from "@/i18n/config";
import type { FormErrors } from "@/types/form";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Toggle from "@/components/ui/Toggle";

interface PersonalDetailsStepProps {
  t: ReturnType<typeof getTranslations>;
  name: string;
  email: string;
  isBusinessUse: boolean;
  marginalTaxRate?: number;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function PersonalDetailsStep({
  t,
  name,
  email,
  isBusinessUse,
  marginalTaxRate,
  errors,
  onChange,
}: PersonalDetailsStepProps) {
  const f = t.form.personalDetails;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.name} error={errors["name"]}>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            className={`
              w-full rounded-lg border bg-white px-3 py-2 text-sm
              dark:bg-zinc-900 dark:text-zinc-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors["name"] ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"}
            `}
          />
        </FormField>

        <FormField label={f.email} hint={f.emailHint} error={errors["email"]}>
          <input
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`
              w-full rounded-lg border bg-white px-3 py-2 text-sm
              dark:bg-zinc-900 dark:text-zinc-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors["email"] ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"}
            `}
          />
        </FormField>
      </div>

      <div className="pt-2">
        <Toggle
          checked={isBusinessUse}
          onChange={(v) => onChange("isBusinessUse", v)}
          label={f.isOsekMurshe}
        />
        {isBusinessUse && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{f.isOsekMursheHint}</p>
        )}
      </div>

      {isBusinessUse && (
        <FormField
          label={f.marginalTaxRate}
          hint={f.marginalTaxRateHint}
          error={errors["marginalTaxRate"]}
          required
        >
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
      )}
    </div>
  );
}
