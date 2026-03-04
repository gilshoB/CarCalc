"use client";

import type { getTranslations } from "@/i18n/config";

interface PeriodSelectorProps {
  t: ReturnType<typeof getTranslations>;
  selected: number;
  onChange: (years: number) => void;
  disabled?: boolean;
}

const PERIODS = [3, 5, 7, 10];

export default function PeriodSelector({ t, selected, onChange, disabled }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        {t.results.periodLabel}:
      </span>
      <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 shadow-inner dark:bg-zinc-800">
        {PERIODS.map((years) => (
          <button
            key={years}
            onClick={() => onChange(years)}
            disabled={disabled}
            className={`
              rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all
              ${selected === years
                ? "bg-white text-blue-700 shadow-sm dark:bg-zinc-700 dark:text-blue-300"
                : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {years} {t.results.years}
          </button>
        ))}
      </div>
    </div>
  );
}
