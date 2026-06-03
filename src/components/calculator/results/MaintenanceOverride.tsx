"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { MaintenanceOverrideValues } from "@/types/form";
import { formatNumber } from "@/lib/formatters";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Toggle from "@/components/ui/Toggle";

interface MaintenanceOverrideProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  annualKm: number;
  override: MaintenanceOverrideValues | null;
  onChange: (values: MaintenanceOverrideValues | null) => void;
  defaults: MaintenanceOverrideValues;
}

export default function MaintenanceOverride({
  t,
  locale,
  annualKm,
  override,
  onChange,
  defaults,
}: MaintenanceOverrideProps) {
  const m = t.results.maintenance;
  const isOverriding = override !== null;
  const values = override ?? defaults;

  const annual =
    values.serviceIntervalKm > 0
      ? Math.round((annualKm / values.serviceIntervalKm) * values.costPerService)
      : 0;

  return (
    <div id="maintenance-section" className="scroll-mt-20 rounded-2xl bg-white shadow-md ring-1 ring-zinc-200/60 p-5 dark:bg-zinc-900 dark:ring-zinc-700/50">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{m.title}</h3>
        {isOverriding && (
          <button
            onClick={() => onChange(null)}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
          >
            {m.reset}
          </button>
        )}
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{m.subtitle}</p>

      <Toggle
        checked={isOverriding}
        onChange={(checked) => {
          if (checked) {
            onChange({ ...defaults });
          } else {
            onChange(null);
          }
        }}
        label={m.override}
      />

      {isOverriding && (
        <div className="mt-4 space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={m.serviceInterval}>
              <NumberInput
                value={values.serviceIntervalKm}
                onChange={(v) => onChange({ ...values, serviceIntervalKm: v })}
                suffix="km"
                step={1000}
                min={1000}
              />
            </FormField>
            <FormField label={m.costPerService}>
              <NumberInput
                value={values.costPerService}
                onChange={(v) => onChange({ ...values, costPerService: v })}
                prefix="₪"
                step={100}
                min={0}
              />
            </FormField>
          </div>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            {m.annualEstimate.replace("{amount}", formatNumber(annual, locale))}
          </p>
        </div>
      )}
    </div>
  );
}
