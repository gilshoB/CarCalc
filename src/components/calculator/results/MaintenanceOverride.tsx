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
    <div id="maintenance-section" className="scroll-mt-24 rounded-[24px] bg-white p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold">{m.title}</h3>
        {isOverriding && (
          <button
            onClick={() => onChange(null)}
            className="text-sm font-semibold text-ink underline underline-offset-4"
          >
            {m.reset}
          </button>
        )}
      </div>
      <p className="text-[13px] leading-relaxed text-muted mb-4">{m.subtitle}</p>

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
          <p className="text-sm font-semibold text-ink">
            {m.annualEstimate.replace("{amount}", formatNumber(annual, locale))}
          </p>
        </div>
      )}
    </div>
  );
}
