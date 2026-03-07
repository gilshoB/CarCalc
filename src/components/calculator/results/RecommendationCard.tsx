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

  return (
    <div className={`relative rounded-2xl p-[1.5px] shadow-lg ${
      isBuy
        ? "bg-gradient-to-br from-blue-500 via-blue-400 to-sky-500"
        : "bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500"
    }`}>
      <div className="rounded-[13px] bg-white dark:bg-zinc-900 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-bold ${
              isBuy
                ? "text-blue-800 dark:text-blue-200"
                : "text-amber-800 dark:text-amber-200"
            }`}>
              {isBuy ? r.buyWins : r.leaseWins}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {locale === "he" ? recommendation.explanationHe : recommendation.explanation}
            </p>
          </div>

          {/* Savings badge — always green */}
          <div className="shrink-0 rounded-xl px-5 py-3.5 text-center shadow-sm bg-emerald-50 dark:bg-emerald-950/40">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">{r.savings}</div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
              {formatNumber(recommendation.savingsAmount, locale)} ₪
            </div>
            <div className="text-[11px] text-emerald-500 dark:text-emerald-500 mt-0.5">
              {r.overPeriod} {periodYears} {t.results.years}
            </div>
          </div>
        </div>

        {/* Monthly comparison */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className={`rounded-xl px-4 py-4 text-center transition-shadow ${
            isBuy
              ? "bg-blue-50/80 shadow-sm ring-1 ring-blue-200/50 dark:bg-blue-950/30 dark:ring-blue-800/30"
              : "bg-zinc-50 dark:bg-zinc-800/40"
          }`}>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">{r.monthlyCostBuy}</div>
            <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums whitespace-nowrap ${
              isBuy ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"
            }`}>
              {formatNumber(buy.monthlyCost, locale)} ₪
            </div>
          </div>
          <div className={`rounded-xl px-4 py-4 text-center transition-shadow ${
            !isBuy
              ? "bg-amber-50/80 shadow-sm ring-1 ring-amber-200/50 dark:bg-amber-950/30 dark:ring-amber-800/30"
              : "bg-zinc-50 dark:bg-zinc-800/40"
          }`}>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">{r.monthlyCostLease}</div>
            <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums whitespace-nowrap ${
              !isBuy ? "text-amber-700 dark:text-amber-300" : "text-zinc-700 dark:text-zinc-300"
            }`}>
              {formatNumber(lease.monthlyCost, locale)} ₪
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
