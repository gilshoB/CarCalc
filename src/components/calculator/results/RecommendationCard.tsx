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
  const otherName = isBuy ? r.leaseName : r.buyName;
  const monthlySavings = Math.round(recommendation.savingsAmount / (periodYears * 12));
  const shortLine = t.bento.shortSavings
    .replace("{monthly}", formatNumber(monthlySavings, locale))
    .replace("{pct}", String(recommendation.savingsPercent))
    .replace("{other}", otherName);

  const box = (label: string, value: number, winner: boolean) => (
    <div
      className={`rounded-2xl p-4 text-center flex flex-col gap-1.5 border-2 ${
        winner ? "border-ink bg-white" : "border-[#f2f2ee] bg-[#f2f2ee]"
      }`}
    >
      <span className={`text-[13px] font-semibold ${winner ? "text-[#3d3d38]" : "text-muted"}`}>{label}</span>
      <span className={`text-[22px] sm:text-[28px] font-extrabold tabular-nums whitespace-nowrap ${winner ? "" : "text-[#3d3d38]"}`}>
        {formatNumber(value, locale)} ₪
      </span>
    </div>
  );

  return (
    <section aria-label={r.title} className="mx-auto w-full max-w-[720px] rounded-[24px] bg-white p-5 sm:p-7 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row items-stretch gap-5">
        <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1.5 text-center">
          <span className="rounded-full bg-lime px-3 py-1 text-[13px] font-bold">{r.bestDeal}</span>
          <h3 className="mt-1 text-[56px] font-extrabold leading-none tracking-[-0.04em]">{winnerName}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted tabular-nums">{shortLine}</p>
        </div>
        <div className="w-full sm:w-auto shrink-0 sm:min-w-[180px] rounded-[18px] bg-ink px-6 py-[18px] flex flex-col items-center justify-center gap-1 text-white">
          <span className="text-xs font-semibold text-[#c8c8c1]">{r.savings}</span>
          <span className="text-[32px] font-extrabold tracking-[-0.02em] text-lime tabular-nums whitespace-nowrap">
            {formatNumber(recommendation.savingsAmount, locale)} ₪
          </span>
          <span className="text-xs text-[#c8c8c1]">
            {r.overPeriod} {periodYears} {t.results.years}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {box(r.monthlyCostBuy, buy.monthlyCost, isBuy)}
        {box(r.monthlyCostLease, lease.monthlyCost, !isBuy)}
      </div>
    </section>
  );
}
