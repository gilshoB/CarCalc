"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { CalculatorOutput } from "@/types/calculator";
import { formatNumber } from "@/lib/formatters";

interface RecommendationCardProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  results: CalculatorOutput;
}

export default function RecommendationCard({ t, locale, results }: RecommendationCardProps) {
  const { recommendation, buy, lease, periodYears } = results;
  const r = t.results.recommendation;
  const isBuy = recommendation.winner === "buy";
  const winnerName = isBuy ? r.buyName : r.leaseName;
  const winnerColor = isBuy ? "brand" : "amber";

  return (
    <>
      {/* Main recommendation card */}
      <div className={`relative rounded-2xl p-[1.5px] shadow-lg ${
        isBuy
          ? "bg-gradient-to-br from-brand-500 via-brand-400 to-sky-500"
          : "bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500"
      }`}>
        <div className="rounded-[13px] bg-white dark:bg-zinc-900 p-5 sm:p-6">
          {/* Winner hero */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <h3 className={`text-4xl sm:text-5xl font-extrabold tracking-tight leading-none ${
                  winnerColor === "brand"
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}>
                  {winnerName}
                </h3>
                <span className="text-3xl sm:text-4xl leading-none" aria-hidden="true">🏆</span>
              </div>
              <div className="text-base sm:text-lg font-semibold text-zinc-600 dark:text-zinc-400">
                {r.bestDeal}
              </div>
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {locale === "he" ? recommendation.explanationHe : recommendation.explanation}
              </p>
            </div>

            {/* Savings badge */}
            <div className="shrink-0 rounded-xl px-5 py-3.5 text-center shadow-sm bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-200/60 dark:ring-emerald-800/40">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">
                {r.savings}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                {formatNumber(recommendation.savingsAmount, locale)} ₪
              </div>
              <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                {r.overPeriod} {periodYears} {t.results.years}
              </div>
            </div>
          </div>

          {/* Monthly comparison */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className={`rounded-xl px-4 py-4 text-center transition-shadow ${
              isBuy
                ? "bg-brand-50/80 shadow-sm ring-1 ring-brand-200/50 dark:bg-brand-950/30 dark:ring-brand-800/30"
                : "bg-zinc-50 dark:bg-zinc-800/40"
            }`}>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                {r.monthlyCostBuy}
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums whitespace-nowrap ${
                isBuy ? "text-brand-700 dark:text-brand-300" : "text-zinc-700 dark:text-zinc-300"
              }`}>
                {formatNumber(buy.monthlyCost, locale)} ₪
              </div>
            </div>
            <div className={`rounded-xl px-4 py-4 text-center transition-shadow ${
              !isBuy
                ? "bg-amber-50/80 shadow-sm ring-1 ring-amber-200/50 dark:bg-amber-950/30 dark:ring-amber-800/30"
                : "bg-zinc-50 dark:bg-zinc-800/40"
            }`}>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                {r.monthlyCostLease}
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums whitespace-nowrap ${
                !isBuy ? "text-amber-700 dark:text-amber-300" : "text-zinc-700 dark:text-zinc-300"
              }`}>
                {formatNumber(lease.monthlyCost, locale)} ₪
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
