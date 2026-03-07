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

  if (buyBreak.depreciation > 0) {
    formulas.depreciation = {
      buy: tpl(f.depreciationExplain, { from: fmt(input.buy.carPrice), to: fmt(buyBreak.residualValue), years }),
      lease: "",
    };
  }

  if (buyBreak.residualValue > 0) {
    formulas.residualValue = {
      buy: tpl(f.carValueAtEnd, { value: fmt(buyBreak.residualValue), years }),
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

export default function ComparisonTable({ t, locale, results, input }: ComparisonTableProps) {
  const c = t.results.comparison;
  const { buy, lease, recommendation } = results;
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const buyWins = recommendation.winner === "buy";

  const formulas = buildFormulas(t, input, results);

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const rows: Row[] = [
    { key: "carPayment", label: c.carPayment, buyValue: buy.breakdown.carPayment, leaseValue: lease.breakdown.carPayment, buyFormula: formulas.carPayment?.buy, leaseFormula: formulas.carPayment?.lease },
    { key: "loanInterest", label: c.loanInterest, buyValue: buy.breakdown.loanInterest, leaseValue: lease.breakdown.loanInterest, buyFormula: formulas.loanInterest?.buy, leaseFormula: formulas.loanInterest?.lease },
    { key: "registration", label: c.registration, buyValue: buy.breakdown.registrationFees, leaseValue: lease.breakdown.registrationFees, buyFormula: formulas.registration?.buy, leaseFormula: formulas.registration?.lease },
    { key: "mandatoryIns", label: c.mandatoryInsurance, buyValue: buy.breakdown.mandatoryInsurance, leaseValue: lease.breakdown.mandatoryInsurance, buyFormula: formulas.mandatoryIns?.buy, leaseFormula: formulas.mandatoryIns?.lease },
    { key: "comprehensiveIns", label: c.comprehensiveInsurance, buyValue: buy.breakdown.comprehensiveInsurance, leaseValue: lease.breakdown.comprehensiveInsurance, buyFormula: formulas.comprehensiveIns?.buy, leaseFormula: formulas.comprehensiveIns?.lease },
    { key: "testFees", label: c.testFees, buyValue: buy.breakdown.testFees, leaseValue: lease.breakdown.testFees, buyFormula: formulas.testFees?.buy, leaseFormula: formulas.testFees?.lease },
    { key: "fuel", label: c.fuel, buyValue: buy.breakdown.fuel, leaseValue: lease.breakdown.fuel, buyFormula: formulas.fuel?.buy, leaseFormula: formulas.fuel?.lease },
    { key: "maintenance", label: c.maintenance, buyValue: buy.breakdown.maintenance, leaseValue: lease.breakdown.maintenance, buyFormula: formulas.maintenance?.buy, leaseFormula: formulas.maintenance?.lease },
    { key: "depreciation", label: c.depreciation, buyValue: buy.breakdown.depreciation, leaseValue: lease.breakdown.depreciation, buyFormula: formulas.depreciation?.buy, leaseFormula: formulas.depreciation?.lease },
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
    <div className="rounded-2xl bg-white shadow-md ring-1 ring-zinc-200/60 dark:bg-zinc-900 dark:ring-zinc-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{c.title}</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50/80 dark:bg-zinc-800/40">
              <th className="text-start text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 py-3 ps-6 pe-4">
                {c.category}
              </th>
              <th className="text-end text-xs font-bold uppercase tracking-wider py-3 px-4 w-[130px]">
                <div className={`inline-flex items-center gap-1.5 ${buyWins ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                  {buyWins && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  {c.buy}
                </div>
              </th>
              <th className="text-end text-xs font-bold uppercase tracking-wider py-3 ps-4 pe-6 w-[130px]">
                <div className={`inline-flex items-center gap-1.5 ${!buyWins ? "text-amber-600 dark:text-amber-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                  {!buyWins && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  {c.lease}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => {
              const hasFormula = row.buyFormula || row.leaseFormula;
              const isExpanded = expandedRows.has(row.key);

              return (
                <tr
                  key={row.key}
                  className={`border-b border-zinc-100/80 dark:border-zinc-800/50 ${hasFormula ? "cursor-pointer" : ""} ${
                    i % 2 === 0
                      ? "bg-white dark:bg-zinc-900"
                      : "bg-zinc-50/40 dark:bg-zinc-800/20"
                  }`}
                  onClick={() => hasFormula && toggleRow(row.key)}
                >
                  {/* Category label */}
                  <td className="ps-6 pe-4 py-3.5 align-top">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{row.label}</span>
                      {hasFormula && (
                        <svg className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                          isExpanded ? "rotate-180 text-blue-500 dark:text-blue-400" : "text-zinc-300 dark:text-zinc-600"
                        }`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      )}
                    </div>

                    {/* Collapsible formula */}
                    {isExpanded && hasFormula && (
                      <div className="mt-2 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 px-3 py-2 text-[11px] leading-relaxed space-y-1">
                        {row.buyFormula && (
                          <div className="flex gap-1.5">
                            <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0">{c.buy}:</span>
                            <span className="text-zinc-500 dark:text-zinc-400">{row.buyFormula}</span>
                          </div>
                        )}
                        {row.leaseFormula && (
                          <div className="flex gap-1.5">
                            <span className="font-semibold text-amber-600 dark:text-amber-400 shrink-0">{c.lease}:</span>
                            <span className="text-zinc-500 dark:text-zinc-400">{row.leaseFormula}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Buy value */}
                  <td className={`text-end px-4 py-3.5 align-top text-sm tabular-nums font-bold ${
                    row.isSubtraction && row.buyValue < 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-800 dark:text-zinc-200"
                  }`}>
                    {fmtVal(row.buyValue, row.isSubtraction)}
                  </td>

                  {/* Lease value */}
                  <td className={`text-end ps-4 pe-6 py-3.5 align-top text-sm tabular-nums font-bold ${
                    row.isSubtraction && row.leaseValue < 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-800 dark:text-zinc-200"
                  }`}>
                    {fmtVal(row.leaseValue, row.isSubtraction)}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Totals */}
          <tfoot>
            <tr className="bg-zinc-50 dark:bg-zinc-800/40 border-t-2 border-zinc-200 dark:border-zinc-700">
              <td className="ps-6 pe-4 py-4">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{c.total}</span>
              </td>
              <td className={`text-end px-4 py-4 text-lg tabular-nums font-extrabold whitespace-nowrap ${
                buyWins ? "text-blue-700 dark:text-blue-300" : "text-zinc-800 dark:text-zinc-200"
              }`}>
                {formatNumber(buy.totalCost, locale)} ₪
              </td>
              <td className={`text-end ps-4 pe-6 py-4 text-lg tabular-nums font-extrabold whitespace-nowrap ${
                !buyWins ? "text-amber-700 dark:text-amber-300" : "text-zinc-800 dark:text-zinc-200"
              }`}>
                {formatNumber(lease.totalCost, locale)} ₪
              </td>
            </tr>
            <tr className="bg-zinc-50 dark:bg-zinc-800/40">
              <td className="ps-6 pe-4 pb-4">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">{c.monthlyCost}</span>
              </td>
              <td className="text-end px-4 pb-4 text-sm tabular-nums font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {formatNumber(buy.monthlyCost, locale)} ₪
              </td>
              <td className="text-end ps-4 pe-6 pb-4 text-sm tabular-nums font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {formatNumber(lease.monthlyCost, locale)} ₪
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
