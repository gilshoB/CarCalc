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
          {/* Icon */}
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${
            isBuy
              ? "bg-blue-50 dark:bg-blue-950/40"
              : "bg-amber-50 dark:bg-amber-950/40"
          }`}>
            <svg className={`h-6 w-6 ${isBuy ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.52.587 6.023 6.023 0 01-2.52-.587" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold ${
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

          {/* Savings badge */}
          <div className={`shrink-0 rounded-xl px-5 py-3.5 text-center shadow-sm ${
            isBuy
              ? "bg-blue-50 dark:bg-blue-950/40"
              : "bg-amber-50 dark:bg-amber-950/40"
          }`}>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-1">{r.savings}</div>
            <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isBuy
                ? "text-blue-700 dark:text-blue-300"
                : "text-amber-700 dark:text-amber-300"
            }`}>
              {formatNumber(recommendation.savingsAmount, locale)} ₪
            </div>
            <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              {r.overPeriod} {periodYears} {t.results.years}
            </div>
          </div>
        </div>

        {/* Monthly comparison */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className={`rounded-xl px-4 py-3 text-center transition-shadow ${
            isBuy
              ? "bg-blue-50/80 shadow-sm ring-1 ring-blue-200/50 dark:bg-blue-950/30 dark:ring-blue-800/30"
              : "bg-zinc-50 dark:bg-zinc-800/40"
          }`}>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-1">{t.results.comparison.buy}</div>
            <div className={`text-xl font-bold tabular-nums ${
              isBuy ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"
            }`}>
              {formatNumber(buy.monthlyCost, locale)} ₪
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500">{r.perMonth}</div>
          </div>
          <div className={`rounded-xl px-4 py-3 text-center transition-shadow ${
            !isBuy
              ? "bg-amber-50/80 shadow-sm ring-1 ring-amber-200/50 dark:bg-amber-950/30 dark:ring-amber-800/30"
              : "bg-zinc-50 dark:bg-zinc-800/40"
          }`}>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-1">{t.results.comparison.lease}</div>
            <div className={`text-xl font-bold tabular-nums ${
              !isBuy ? "text-amber-700 dark:text-amber-300" : "text-zinc-700 dark:text-zinc-300"
            }`}>
              {formatNumber(lease.monthlyCost, locale)} ₪
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500">{r.perMonth}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
