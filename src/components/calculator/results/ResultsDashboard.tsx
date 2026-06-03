"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { CalculatorOutput, CalculatorInput } from "@/types/calculator";
import type { DepreciationOverrideValues, MaintenanceOverrideValues } from "@/types/form";
import RecommendationCard from "./RecommendationCard";
import ComparisonTable from "./ComparisonTable";
import CostBreakdownChart from "./CostBreakdownChart";
import CumulativeCostChart from "./CumulativeCostChart";
import DepreciationOverride from "./DepreciationOverride";
import MaintenanceOverride from "./MaintenanceOverride";
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
  maintenanceOverride: MaintenanceOverrideValues | null;
  onMaintenanceChange: (values: MaintenanceOverrideValues | null) => void;
  maintenanceDefaults: MaintenanceOverrideValues;
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
  maintenanceOverride,
  onMaintenanceChange,
  maintenanceDefaults,
}: ResultsDashboardProps) {
  return (
    <section id="results" className="space-y-6">
      {/* Period selector - centered and prominent */}
      <div className="flex justify-center">
        <PeriodSelector
          t={t}
          selected={periodYears}
          onChange={onPeriodChange}
          disabled={isRecalculating}
        />
      </div>

      {isRecalculating && (
        <div className="flex items-center justify-center gap-2 py-3 text-sm text-zinc-400 dark:text-zinc-500">
          <svg className="animate-spin h-4 w-4 text-brand-500" viewBox="0 0 24 24" fill="none">
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

      <MaintenanceOverride
        t={t}
        locale={locale}
        annualKm={input.annualKm}
        override={maintenanceOverride}
        onChange={onMaintenanceChange}
        defaults={maintenanceDefaults}
      />

      {(depreciationOverride || maintenanceOverride) && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onRecalculate}
            disabled={isRecalculating}
            className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
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
