"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { CalculatorOutput, CalculatorInput } from "@/types/calculator";
import type { DepreciationOverrideValues } from "@/types/form";
import RecommendationCard from "./RecommendationCard";
import ComparisonTable from "./ComparisonTable";
import CostBreakdownChart from "./CostBreakdownChart";
import CumulativeCostChart from "./CumulativeCostChart";
import DepreciationOverride from "./DepreciationOverride";
import PeriodSelector from "./PeriodSelector";
import AdUnit from "@/components/AdUnit";

interface ResultsDashboardProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  results: CalculatorOutput;
  input: CalculatorInput;
  periodYears: number;
  onPeriodChange: (years: number) => void;
  isRecalculating: boolean;
  depreciationOverride: DepreciationOverrideValues | null;
  onDepreciationChange: (values: DepreciationOverrideValues | null) => void;
  onRecalculate: () => void;
  depreciationDefaults: DepreciationOverrideValues;
}

export default function ResultsDashboard({
  t,
  locale,
  results,
  input,
  periodYears,
  onPeriodChange,
  isRecalculating,
  depreciationOverride,
  onDepreciationChange,
  onRecalculate,
  depreciationDefaults,
}: ResultsDashboardProps) {
  return (
    <section id="results" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t.results.title}
        </h2>
        <PeriodSelector
          t={t}
          selected={periodYears}
          onChange={onPeriodChange}
          disabled={isRecalculating}
        />
      </div>

      {isRecalculating && (
        <div className="flex items-center justify-center gap-2 py-3 text-sm text-zinc-400 dark:text-zinc-500">
          <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t.wizard.calculating}
        </div>
      )}

      {/* Main results */}
      <RecommendationCard t={t} locale={locale} results={results} />
      <ComparisonTable t={t} locale={locale} results={results} input={input} />

      {/* Ad */}
      <AdUnit slot="results-top" format="horizontal" className="my-4" />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CostBreakdownChart
          t={t}
          locale={locale}
          buyBreakdown={results.buy.breakdown}
          leaseBreakdown={results.lease.breakdown}
        />
        <CumulativeCostChart
          t={t}
          locale={locale}
          buyYearly={results.buy.yearlyBreakdown}
          leaseYearly={results.lease.yearlyBreakdown}
        />
      </div>

      {/* Advanced */}
      <DepreciationOverride
        t={t}
        override={depreciationOverride}
        onChange={onDepreciationChange}
        defaults={depreciationDefaults}
      />

      {depreciationOverride && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onRecalculate}
            disabled={isRecalculating}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isRecalculating ? t.wizard.calculating : t.wizard.calculate}
          </button>
        </div>
      )}

      {/* Data source */}
      <div className="text-center text-[11px] text-zinc-400 dark:text-zinc-500 pt-2">
        {t.results.marketData.source} ({results.marketDataUsed.year}) · {t.results.marketData.lastUpdated}: {new Date(results.marketDataUsed.lastUpdated).toLocaleDateString(locale === "he" ? "he-IL" : "en-IL")}
      </div>
    </section>
  );
}
