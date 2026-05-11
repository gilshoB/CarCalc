"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

  const monthlyDelta = Math.round(
    Math.abs(buy.totalCost - lease.totalCost) / (periodYears * 12),
  );

  // Sticky banner appears when the main card scrolls out of view
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel — tracks main card visibility */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

      {/* Compact sticky banner — slides in when scrolled past the main card */}
      <div
        className={`sticky top-16 z-30 transition-all duration-200 ${
          pinned ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!pinned}
      >
        <div className={`mx-auto max-w-2xl rounded-xl shadow-lg ring-1 backdrop-blur-md ${
          isBuy
            ? "bg-brand-50/95 ring-brand-200 dark:bg-brand-950/80 dark:ring-brand-800"
            : "bg-amber-50/95 ring-amber-200 dark:bg-amber-950/80 dark:ring-amber-800"
        }`}>
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <Image 
                src="/images/trophy.jpg" 
                alt="Winner" 
                width={32} 
                height={32} 
                className="h-8 w-8 object-contain"
              />
              <div className="min-w-0 leading-tight">
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {r.bestDeal}
                </div>
                <div className={`text-base sm:text-lg font-extrabold truncate ${
                  isBuy ? "text-brand-700 dark:text-brand-300" : "text-amber-700 dark:text-amber-300"
                }`}>
                  {winnerName}
                </div>
              </div>
            </div>
            <div className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 px-3 py-1 ring-1 ring-emerald-200/80 dark:ring-emerald-800/60">
              <svg className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                {locale === "he" ? "חוסך" : "saves"} {formatNumber(monthlyDelta, locale)} ₪ {r.perMonth}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main recommendation card */}
      <div className="rounded-2xl bg-white shadow-lg ring-1 ring-zinc-200/60 dark:bg-zinc-900 dark:ring-zinc-700/50 overflow-hidden">
        {/* Trophy hero section */}
        <div className={`px-6 py-8 text-center ${
          isBuy
            ? "bg-gradient-to-b from-brand-50 to-white dark:from-brand-950/40 dark:to-zinc-900"
            : "bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-zinc-900"
        }`}>
          {/* Trophy image */}
          <div className="mx-auto mb-5">
            <Image 
              src="/images/trophy.jpg" 
              alt="Winner trophy" 
              width={120} 
              height={120} 
              className="h-24 w-24 sm:h-28 sm:w-28 object-contain drop-shadow-lg"
              priority
            />
          </div>

          {/* Best deal label */}
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
            {r.bestDeal}
          </div>

          {/* Winner name - huge and bold */}
          <h3 className={`text-5xl sm:text-6xl font-black tracking-tight leading-none mb-4 ${
            isBuy
              ? "text-brand-700 dark:text-brand-300"
              : "text-amber-700 dark:text-amber-300"
          }`}>
            {winnerName}
          </h3>

          {/* Savings amount in green */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 px-5 py-2.5 ring-1 ring-emerald-200/60 dark:ring-emerald-800/40">
            <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300">
              {formatNumber(recommendation.savingsAmount, locale)} ₪ {r.savings}
            </span>
            <span className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
              {r.overPeriod} {periodYears} {t.results.years}
            </span>
          </div>
        </div>

        {/* Monthly cost comparison cards */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Buy card - always teal/brand color */}
            <div className={`relative rounded-xl px-4 py-5 text-center transition-all ${
              isBuy
                ? "bg-brand-50/80 ring-2 ring-brand-500 shadow-md dark:bg-brand-950/30 dark:ring-brand-400"
                : "bg-brand-50/50 ring-1 ring-brand-200/60 dark:bg-brand-950/20 dark:ring-brand-700/50"
            }`}>
              {/* Winner indicator ring */}
              {isBuy && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
              <div className="text-xs font-semibold mb-2 text-brand-600 dark:text-brand-400">
                {r.monthlyCostBuy}
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums whitespace-nowrap ${
                isBuy ? "text-brand-700 dark:text-brand-300" : "text-brand-600 dark:text-brand-400"
              }`}>
                {formatNumber(buy.monthlyCost, locale)} ₪
              </div>
            </div>

            {/* Lease card - always amber color */}
            <div className={`relative rounded-xl px-4 py-5 text-center transition-all ${
              !isBuy
                ? "bg-amber-50/80 ring-2 ring-amber-500 shadow-md dark:bg-amber-950/30 dark:ring-amber-400"
                : "bg-amber-50/50 ring-1 ring-amber-200/60 dark:bg-amber-950/20 dark:ring-amber-700/50"
            }`}>
              {/* Winner indicator ring */}
              {!isBuy && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
              <div className="text-xs font-semibold mb-2 text-amber-600 dark:text-amber-400">
                {r.monthlyCostLease}
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums whitespace-nowrap ${
                !isBuy ? "text-amber-700 dark:text-amber-300" : "text-amber-600 dark:text-amber-400"
              }`}>
                {formatNumber(lease.monthlyCost, locale)} ₪
              </div>
            </div>
          </div>

          {/* Explanation */}
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed text-center">
            {locale === "he" ? recommendation.explanationHe : recommendation.explanation}
          </p>
        </div>
      </div>
    </>
  );
}
