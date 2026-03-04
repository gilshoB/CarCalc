"use client";

import type { getTranslations } from "@/i18n/config";
import type { DepreciationOverrideValues } from "@/types/form";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Toggle from "@/components/ui/Toggle";

interface DepreciationOverrideProps {
  t: ReturnType<typeof getTranslations>;
  override: DepreciationOverrideValues | null;
  onChange: (values: DepreciationOverrideValues | null) => void;
  defaults: DepreciationOverrideValues;
}

export default function DepreciationOverride({
  t,
  override,
  onChange,
  defaults,
}: DepreciationOverrideProps) {
  const d = t.results.depreciation;
  const isOverriding = override !== null;
  const values = override ?? defaults;

  return (
    <div className="rounded-2xl bg-white shadow-md ring-1 ring-zinc-200/60 p-5 dark:bg-zinc-900 dark:ring-zinc-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{d.title}</h3>
        {isOverriding && (
          <button
            onClick={() => onChange(null)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
          >
            {d.reset}
          </button>
        )}
      </div>

      <Toggle
        checked={isOverriding}
        onChange={(checked) => {
          if (checked) {
            onChange({ ...defaults });
          } else {
            onChange(null);
          }
        }}
        label={d.override}
      />

      {isOverriding && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <FormField label={d.year1}>
            <NumberInput
              value={values.yr1}
              onChange={(v) => onChange({ ...values, yr1: v })}
              suffix="%"
              step={1}
              min={0}
              max={50}
            />
          </FormField>
          <FormField label={d.year2}>
            <NumberInput
              value={values.yr2}
              onChange={(v) => onChange({ ...values, yr2: v })}
              suffix="%"
              step={1}
              min={0}
              max={50}
            />
          </FormField>
          <FormField label={d.year3Plus}>
            <NumberInput
              value={values.yr3Plus}
              onChange={(v) => onChange({ ...values, yr3Plus: v })}
              suffix="%"
              step={1}
              min={0}
              max={50}
            />
          </FormField>
        </div>
      )}
    </div>
  );
}
