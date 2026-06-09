"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/lib/formatters";

const MIN_KM = 5000;
const MAX_KM = 60000;
const STEP_KM = 1000;

interface AnnualKmStepProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  annualKm: number;
  onChange: (path: string, value: unknown) => void;
}

export default function AnnualKmStep({ t, locale, annualKm, onChange }: AnnualKmStepProps) {
  const f = t.form.annualKmStep;
  const value = annualKm || 15000;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.subtitle}</p>
      </div>

      <div className="text-center">
        <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 tabular-nums">
          {f.valueLabel.replace("{km}", formatNumber(value, locale))}
        </span>
      </div>

      <div className="px-1">
        <input
          type="range"
          min={MIN_KM}
          max={MAX_KM}
          step={STEP_KM}
          value={value}
          onChange={(e) => onChange("annualKm", Number(e.target.value))}
          className="w-full h-2 cursor-pointer rounded-full accent-brand-600"
        />
        <div className="mt-2 flex justify-between text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
          <span>{formatNumber(MIN_KM, locale)}</span>
          <span>{formatNumber(MAX_KM, locale)}+</span>
        </div>
      </div>
    </div>
  );
}
