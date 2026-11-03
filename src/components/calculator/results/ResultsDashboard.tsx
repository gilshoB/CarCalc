"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { CalculatorOutput, CalculatorInput } from "@/types/calculator";
import type { MaintenanceOverrideValues } from "@/types/form";
import RecommendationCard from "./RecommendationCard";
import ComparisonTable from "./ComparisonTable";
import CostBreakdownChart from "./CostBreakdownChart";
import CumulativeCostChart from "./CumulativeCostChart";
import MaintenanceOverride from "./MaintenanceOverride";
import SendResultsEmail from "./SendResultsEmail";
import AdUnit from "@/components/AdUnit";

interface ResultsDashboardProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  results: CalculatorOutput;
  input: CalculatorInput;
  periodYears: number;
  isRecalculating: boolean;
  onRecalculate: () => void;
  residualOverride?: number;
  onApplyResidual: (v: number | null) => void;
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
  isRecalculating,
  onRecalculate,
  residualOverride,
  onApplyResidual,
  maintenanceOverride,
  onMaintenanceChange,
  maintenanceDefaults,
}: ResultsDashboardProps) {
  return (
    <section id="results" className="flex flex-col gap-5">
      {/* Results intro — explains the period selector, the table, and the caveat */}
      <p className="mx-auto max-w-[720px] text-center text-sm text-muted leading-[1.7]">
        {t.results.pageIntro}
      </p>

      {/* Comparison period = one lease contract (set in the leasing step) */}
      <div className="mx-auto w-full max-w-[720px] rounded-[24px] bg-white p-7 flex flex-col items-center gap-4 text-center">
        <div className="w-full max-w-[360px] rounded-[22px] bg-ink px-8 py-6 flex flex-col items-center gap-1.5 text-white">
          <span className="text-sm font-semibold text-[#c8c8c1]">{t.bento.periodBoxLabel}</span>
          <span className="text-[56px] font-extrabold leading-[1.05] tracking-[-0.03em] text-lime whitespace-nowrap">
            {periodYears} {t.results.years}
          </span>
          <span className="text-sm text-[#c8c8c1]">{t.bento.periodBoxSub}</span>
        </div>
        <p className="max-w-[560px] text-sm leading-[1.7] text-muted">{t.results.periodNote}</p>
      </div>

      {isRecalculating && (
        <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted">
          <svg className="animate-spin h-4 w-4 text-ink" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t.wizard.calculating}
        </div>
      )}

      {/* Main results */}
      <RecommendationCard t={t} locale={locale} results={results} />
      <ComparisonTable
        t={t}
        locale={locale}
        results={results}
        input={input}
        residualOverride={residualOverride}
        onApplyResidual={onApplyResidual}
        isRecalculating={isRecalculating}
      />

      <SendResultsEmail t={t} locale={locale} input={input} maintenanceOverride={maintenanceOverride} />

      {/* Ad */}
      <AdUnit slot="results-top" format="horizontal" className="my-4" />

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2">
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
      <MaintenanceOverride
        t={t}
        locale={locale}
        annualKm={input.annualKm}
        override={maintenanceOverride}
        onChange={onMaintenanceChange}
        defaults={maintenanceDefaults}
      />

      {maintenanceOverride && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onRecalculate}
            disabled={isRecalculating}
            className="h-14 rounded-[14px] bg-ink px-8 text-base font-bold text-white hover:bg-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {isRecalculating ? t.wizard.calculating : t.wizard.calculate}
          </button>
        </div>
      )}

      {/* Data source */}
      <div className="text-center text-xs text-[#6b6b65] pt-2">
        {t.results.marketData.source} ({results.marketDataUsed.year}) · {t.results.marketData.lastUpdated}: {new Date(results.marketDataUsed.lastUpdated).toLocaleDateString(locale === "he" ? "he-IL" : "en-IL")}
      </div>
    </section>
  );
}
