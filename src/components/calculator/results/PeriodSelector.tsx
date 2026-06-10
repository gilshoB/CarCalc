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
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
        {t.results.periodLabel}
      </span>
      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 shadow-inner dark:bg-zinc-800">
        {PERIODS.map((years) => (
          <button
            key={years}
            onClick={() => onChange(years)}
            disabled={disabled}
            title={`${years} ${t.results.years}`}
            className={`
              rounded-md px-2.5 py-1 text-sm font-bold transition-all
              ${selected === years
                ? "bg-white text-brand-700 shadow-sm ring-1 ring-brand-500/30 dark:bg-zinc-700 dark:text-brand-300 dark:ring-brand-400/30"
                : "text-zinc-400 hover:text-zinc-700 hover:bg-white/50 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-700/50"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {years}
          </button>
        ))}
      </div>
    </div>
  );
}
