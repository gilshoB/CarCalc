"use client";

import { useState } from "react";
import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { CalculatorOutput, CalculatorInput } from "@/types/calculator";
import { formatNumber } from "@/lib/formatters";

interface ComparisonTableProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  results: CalculatorOutput;
  input: CalculatorInput;
}

interface Row {
  key: string;
  label: string;
  buyValue: number;
  leaseValue: number;
  isSubtraction?: boolean;
  buyFormula?: string;
  leaseFormula?: string;
}

function tpl(template: string, values: Record<string, string | number>): string {
  let result = template;
  for (const [k, v] of Object.entries(values)) {
    result = result.replace(`{${k}}`, String(v));
  }
  return result;
}

function buildFormulas(
  t: ReturnType<typeof getTranslations>,
  input: CalculatorInput,
  results: CalculatorOutput,
): Record<string, { buy: string; lease: string }> {
  const f = t.results.formulas;
  const years = results.periodYears;
  const buyBreak = results.buy.breakdown;
  const leaseBreak = results.lease.breakdown;
  const fmt = (n: number) => n.toLocaleString();

  const formulas: Record<string, { buy: string; lease: string }> = {};

  const leaseMonths = years * 12;
  let leaseFormulaStr = tpl(f.leasePayments, { monthly: fmt(input.lease.monthlyPayment), months: leaseMonths });
  if (input.lease.leaseDownPayment > 0) {
    leaseFormulaStr += " " + tpl(f.plusDownPayment, { amount: fmt(input.lease.leaseDownPayment) });
  }
  formulas.carPayment = {
    buy: `${fmt(input.buy.carPrice)} ₪ — ${f.purchasePrice}`,
    lease: leaseFormulaStr,
  };

  if (buyBreak.loanInterest > 0) {
    const loanAmount = Math.max(0, input.buy.carPrice - (input.cashOnHand + input.oldCarValue));
    formulas.loanInterest = {
      buy: tpl(f.loanFormula, { amount: fmt(loanAmount), rate: input.financing.interestRate, years: input.financing.loanTermYears }),
      lease: "",
    };
  }

  if (buyBreak.registrationFees > 0 || leaseBreak.registrationFees > 0) {
    const annualBuy = Math.round(buyBreak.registrationFees / years);
    formulas.registration = {
      buy: buyBreak.registrationFees > 0 ? tpl(f.annualTimesYears, { annual: fmt(annualBuy), years }) : "",
      lease: leaseBreak.registrationFees > 0
        ? tpl(f.notIncludedInLease, { annual: fmt(Math.round(leaseBreak.registrationFees / years)), years })
        : f.includedInLease,
    };
  }

  if (buyBreak.mandatoryInsurance > 0 || leaseBreak.mandatoryInsurance > 0) {
    formulas.mandatoryIns = {
      buy: buyBreak.mandatoryInsurance > 0 ? tpl(f.annualTimesYears, { annual: fmt(input.mandatoryInsuranceQuote), years }) : "",
      lease: leaseBreak.mandatoryInsurance > 0 ? tpl(f.annualTimesYears, { annual: fmt(input.mandatoryInsuranceQuote), years }) : f.includedInLease,
    };
  }

  if (buyBreak.comprehensiveInsurance > 0 || leaseBreak.comprehensiveInsurance > 0) {
    formulas.comprehensiveIns = {
      buy: buyBreak.comprehensiveInsurance > 0 ? tpl(f.annualTimesYears, { annual: fmt(input.comprehensiveInsuranceQuote), years }) : "",
      lease: leaseBreak.comprehensiveInsurance > 0 ? tpl(f.annualTimesYears, { annual: fmt(input.comprehensiveInsuranceQuote), years }) : f.includedInLease,
    };
  }

  formulas.testFees = {
    buy: buyBreak.testFees > 0
      ? tpl(f.testFormula, { fee: input.buy.fuelType === "electric" ? "99.95" : "117.6" })
      : f.newCarNoTest,
    lease: leaseBreak.testFees > 0
      ? tpl(f.testFormula, { fee: input.lease.fuelType === "electric" ? "99.95" : "117.6" })
      : f.noTestNeeded,
  };

  formulas.fuel = {
    buy: tpl(f.fuelFormula, { km: fmt(input.annualKm), consumption: input.buy.consumptionKmPerUnit, years }),
    lease: tpl(f.fuelFormula, { km: fmt(input.annualKm), consumption: input.lease.consumptionKmPerUnit, years }),
  };

  formulas.maintenance = {
    buy: tpl(f.maintenanceFormula, { km: fmt(input.annualKm), years }),
    lease: leaseBreak.maintenance > 0
      ? tpl(f.maintenanceFormula, { km: fmt(input.annualKm), years })
      : f.includedInLease,
  };

  if (buyBreak.residualValue > 0) {
    formulas.residualValue = {
      buy: tpl(f.carValueAtEndDetailed, {
        from: fmt(input.buy.carPrice),
        to: fmt(buyBreak.residualValue),
        years,
      }),
      lease: f.noResidual,
    };
  }

  if (buyBreak.taxBenefits > 0 || leaseBreak.taxBenefits > 0) {
    formulas.taxBenefits = {
      buy: buyBreak.taxBenefits > 0 ? tpl(f.taxFormula, { rate: input.marginalTaxRate ?? 0, amount: fmt(buyBreak.taxBenefits) }) : "",
      lease: leaseBreak.taxBenefits > 0 ? tpl(f.taxFormula, { rate: input.marginalTaxRate ?? 0, amount: fmt(leaseBreak.taxBenefits) }) : "",
    };
  }

  if (buyBreak.investmentResult !== 0 || leaseBreak.investmentResult !== 0) {
    const rate = input.investmentReturnRate ?? 10.5;
    formulas.investment = {
      buy: buyBreak.investmentResult !== 0 ? tpl(f.investmentGain, { rate, amount: fmt(buyBreak.investmentResult) }) : f.noFreeCapital,
      lease: leaseBreak.investmentResult !== 0 ? tpl(f.investmentGain, { rate, amount: fmt(leaseBreak.investmentResult) }) : "",
    };
  }

  return formulas;
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

function ChevronIcon({ className, expanded }: { className?: string; expanded: boolean }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function ComparisonTable({ t, locale, results, input }: ComparisonTableProps) {
  const c = t.results.comparison;
  const { buy, lease, recommendation, periodYears } = results;
  const buyWins = recommendation.winner === "buy";
  const months = periodYears * 12;
  const monthlyDelta = Math.round(Math.abs(buy.totalCost - lease.totalCost) / months);

  const [openRow, setOpenRow] = useState<string | null>(null);

  const formulas = buildFormulas(t, input, results);

  const toggleRow = (key: string) =>
    setOpenRow((prev) => (prev === key ? null : key));

  const rows: Row[] = [
    { key: "carPayment", label: c.carPayment, buyValue: buy.breakdown.carPayment, leaseValue: lease.breakdown.carPayment, buyFormula: formulas.carPayment?.buy, leaseFormula: formulas.carPayment?.lease },
    { key: "loanInterest", label: c.loanInterest, buyValue: buy.breakdown.loanInterest, leaseValue: lease.breakdown.loanInterest, buyFormula: formulas.loanInterest?.buy, leaseFormula: formulas.loanInterest?.lease },
    { key: "registration", label: c.registration, buyValue: buy.breakdown.registrationFees, leaseValue: lease.breakdown.registrationFees, buyFormula: formulas.registration?.buy, leaseFormula: formulas.registration?.lease },
    { key: "mandatoryIns", label: c.mandatoryInsurance, buyValue: buy.breakdown.mandatoryInsurance, leaseValue: lease.breakdown.mandatoryInsurance, buyFormula: formulas.mandatoryIns?.buy, leaseFormula: formulas.mandatoryIns?.lease },
    { key: "comprehensiveIns", label: c.comprehensiveInsurance, buyValue: buy.breakdown.comprehensiveInsurance, leaseValue: lease.breakdown.comprehensiveInsurance, buyFormula: formulas.comprehensiveIns?.buy, leaseFormula: formulas.comprehensiveIns?.lease },
    { key: "testFees", label: c.testFees, buyValue: buy.breakdown.testFees, leaseValue: lease.breakdown.testFees, buyFormula: formulas.testFees?.buy, leaseFormula: formulas.testFees?.lease },
    { key: "fuel", label: c.fuel, buyValue: buy.breakdown.fuel, leaseValue: lease.breakdown.fuel, buyFormula: formulas.fuel?.buy, leaseFormula: formulas.fuel?.lease },
    { key: "maintenance", label: c.maintenance, buyValue: buy.breakdown.maintenance, leaseValue: lease.breakdown.maintenance, buyFormula: formulas.maintenance?.buy, leaseFormula: formulas.maintenance?.lease },
    { key: "residualValue", label: c.residualValue, buyValue: -buy.breakdown.residualValue, leaseValue: -lease.breakdown.residualValue, isSubtraction: true, buyFormula: formulas.residualValue?.buy, leaseFormula: formulas.residualValue?.lease },
    { key: "taxBenefits", label: c.taxBenefits, buyValue: -buy.breakdown.taxBenefits, leaseValue: -lease.breakdown.taxBenefits, isSubtraction: true, buyFormula: formulas.taxBenefits?.buy, leaseFormula: formulas.taxBenefits?.lease },
    { key: "investment", label: c.investmentResult, buyValue: -buy.breakdown.investmentResult, leaseValue: -lease.breakdown.investmentResult, isSubtraction: true, buyFormula: formulas.investment?.buy, leaseFormula: formulas.investment?.lease },
  ];

  const visibleRows = rows.filter((row) => row.buyValue !== 0 || row.leaseValue !== 0);

  const fmtVal = (value: number, isSub?: boolean) => {
    if (value === 0) return "—";
    const formatted = formatNumber(Math.abs(value), locale);
    if (isSub && value < 0) return `−${formatted}`;
    return formatted;
  };

  return (
    <div className="rounded-2xl bg-white shadow-md ring-1 ring-zinc-200/60 dark:bg-zinc-900 dark:ring-zinc-700/50 overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 sm:px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{c.title}</h3>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 px-4 sm:px-5 py-3 bg-zinc-50/80 dark:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {c.category}
        </div>
        <div className={`w-24 sm:w-28 text-center text-xs font-bold uppercase tracking-wider ${
          buyWins ? "text-brand-600 dark:text-brand-400" : "text-zinc-400 dark:text-zinc-500"
        }`}>
          <div className="flex items-center justify-center gap-1">
            {buyWins && <CheckIcon className="h-3.5 w-3.5" />}
            {c.buy}
          </div>
        </div>
        <div className={`w-24 sm:w-28 text-center text-xs font-bold uppercase tracking-wider ${
          !buyWins ? "text-amber-600 dark:text-amber-400" : "text-zinc-400 dark:text-zinc-500"
        }`}>
          <div className="flex items-center justify-center gap-1">
            {!buyWins && <CheckIcon className="h-3.5 w-3.5" />}
            {c.lease}
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-100/80 dark:divide-zinc-800/50">
        {visibleRows.map((row) => {
          const hasFormula = !!(row.buyFormula || row.leaseFormula);
          const isExpanded = openRow === row.key;
          const isCredit = row.isSubtraction;

          return (
            <div key={row.key} className="group">
              {/* Main row */}
              <div
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-2 px-4 sm:px-5 py-3 ${
                  hasFormula ? "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30" : ""
                }`}
                onClick={() => hasFormula && toggleRow(row.key)}
                role={hasFormula ? "button" : undefined}
                tabIndex={hasFormula ? 0 : undefined}
                onKeyDown={hasFormula ? (e) => e.key === "Enter" && toggleRow(row.key) : undefined}
              >
                {/* Category label with info icon */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {row.label}
                  </span>
                  {hasFormula && (
                    <div className="flex items-center gap-1 shrink-0">
                      <InfoIcon className={`h-4 w-4 transition-colors ${
                        isExpanded 
                          ? "text-brand-600 dark:text-brand-400" 
                          : "text-zinc-400 dark:text-zinc-500 group-hover:text-brand-500"
                      }`} />
                      <ChevronIcon 
                        className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" 
                        expanded={isExpanded} 
                      />
                    </div>
                  )}
                  {row.key === "residualValue" && (
                    <a
                      href="#depreciation-section"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 text-[10px] font-medium text-brand-700 dark:text-brand-300 ring-1 ring-brand-200/60 dark:ring-brand-800/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors"
                    >
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                      {c.editDepreciation}
                    </a>
                  )}
                </div>

                {/* Buy value */}
                <div className={`w-24 sm:w-28 text-center text-sm tabular-nums font-semibold ${
                  isCredit && row.buyValue < 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}>
                  {fmtVal(row.buyValue, isCredit)}
                </div>

                {/* Lease value */}
                <div className={`w-24 sm:w-28 text-center text-sm tabular-nums font-semibold ${
                  isCredit && row.leaseValue < 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}>
                  {fmtVal(row.leaseValue, isCredit)}
                </div>
              </div>

              {/* Expandable formula section */}
              {isExpanded && hasFormula && (
                <div className="px-4 sm:px-5 pb-3 -mt-1">
                  <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 px-3 py-2.5 text-xs leading-relaxed space-y-1.5">
                    {row.buyFormula && (
                      <div className="flex gap-2">
                        <span className={`font-bold shrink-0 ${buyWins ? "text-brand-600 dark:text-brand-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                          {c.buy}:
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{row.buyFormula}</span>
                      </div>
                    )}
                    {row.leaseFormula && (
                      <div className="flex gap-2">
                        <span className={`font-bold shrink-0 ${!buyWins ? "text-amber-600 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                          {c.lease}:
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{row.leaseFormula}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with totals */}
      <div className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40">
        {/* Total row */}
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 px-4 sm:px-5 py-4">
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {c.total}
          </div>
          <div className={`w-24 sm:w-28 text-center text-lg tabular-nums font-extrabold whitespace-nowrap ${
            buyWins ? "text-brand-700 dark:text-brand-300" : "text-zinc-800 dark:text-zinc-200"
          }`}>
            {formatNumber(buy.totalCost, locale)} ₪
          </div>
          <div className={`w-24 sm:w-28 text-center text-lg tabular-nums font-extrabold whitespace-nowrap ${
            !buyWins ? "text-amber-700 dark:text-amber-300" : "text-zinc-800 dark:text-zinc-200"
          }`}>
            {formatNumber(lease.totalCost, locale)} ₪
          </div>
        </div>

        {/* Monthly cost row */}
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 px-4 sm:px-5 pb-3">
          <div className="text-sm text-zinc-400 dark:text-zinc-500">
            {c.monthlyCost}
          </div>
          <div className="w-24 sm:w-28 text-center text-sm tabular-nums font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
            {formatNumber(buy.monthlyCost, locale)} ₪
          </div>
          <div className="w-24 sm:w-28 text-center text-sm tabular-nums font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
            {formatNumber(lease.monthlyCost, locale)} ₪
          </div>
        </div>

        {/* Savings pill */}
        {monthlyDelta > 0 && (
          <div className="px-4 sm:px-5 pb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 ring-1 ring-emerald-200/60 dark:ring-emerald-800/40 px-4 py-2">
              <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {tpl(c.monthlySavings, {
                  option: buyWins ? c.buy : c.lease,
                  amount: formatNumber(monthlyDelta, locale),
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
