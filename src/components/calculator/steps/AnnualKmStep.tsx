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
        <h2 className="text-[34px] sm:text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em]">{f.title}</h2>
        <p className="mt-2 text-base leading-relaxed">{f.subtitle}</p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-[72px] sm:text-[96px] font-extrabold leading-none tracking-[-0.05em] tabular-nums">
          {formatNumber(value, locale)}
        </span>
        <span className="text-xl font-bold">{f.valueLabel.replace("{km}", "").trim()}</span>
      </div>

      <div className="px-1">
        <input
          type="range"
          min={MIN_KM}
          max={MAX_KM}
          step={STEP_KM}
          value={value}
          onChange={(e) => onChange("annualKm", Number(e.target.value))}
          aria-label={f.title}
          className="w-full h-2 cursor-pointer rounded-full accent-ink"
        />
        <div className="mt-2 flex justify-between text-[13px] font-medium tabular-nums">
          <span>{formatNumber(MIN_KM, locale)}</span>
          <span>{formatNumber(MAX_KM, locale)}+</span>
        </div>
      </div>
    </div>
  );
}
