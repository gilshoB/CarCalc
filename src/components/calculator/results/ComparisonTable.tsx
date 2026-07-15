"use client";

import { useState, Fragment } from "react";
import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { CalculatorOutput, CalculatorInput, VehicleIdentity } from "@/types/calculator";
import { formatNumber } from "@/lib/formatters";
import NumberInput from "@/components/ui/NumberInput";

function vehicleLabel(
  vehicle: VehicleIdentity | undefined,
  t: ReturnType<typeof getTranslations>,
): string {
  if (!vehicle) return t.results.comparison.manuallyEntered;
  const base = `${vehicle.manufacturer} ${vehicle.model} ${vehicle.modelYear}`.trim();
  const isCommon = !vehicle.trim || vehicle.trim === "__common__";
  const trimPart = isCommon ? "" : ` ${vehicle.trim}`;
  const fuel = vehicle.fuelType ? ` — ${t.form.fuelTypes[vehicle.fuelType]}` : "";
  return `${base}${trimPart}${fuel}`;
}

interface ComparisonTableProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  results: CalculatorOutput;
  input: CalculatorInput;
  residualOverride?: number;
  onApplyResidual?: (v: number | null) => void;
  isRecalculating?: boolean;
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

  // Maintenance is a service-interval model: every N km at an avg cost.
  // The override (if set) wins; otherwise per-fuel-type service cost is used.
  const SERVICE_COST: Record<string, number> = {
    gasoline: 1500, diesel: 1650, hybrid: 1800, electric: 1200,
  };
  const mo = input.maintenanceOverride;
  const maintInterval = mo?.serviceIntervalKm ?? 10000;
  const buyCost = mo?.costPerService ?? SERVICE_COST[input.buy.fuelType] ?? 1500;
  const leaseCost = mo?.costPerService ?? SERVICE_COST[input.lease.fuelType] ?? 1500;
  formulas.maintenance = {
    buy: tpl(f.maintenanceFormula, { interval: fmt(maintInterval), cost: fmt(buyCost), km: fmt(input.annualKm), years }),
    lease: leaseBreak.maintenance > 0
      ? tpl(f.maintenanceFormula, { interval: fmt(maintInterval), cost: fmt(leaseCost), km: fmt(input.annualKm), years })
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

function ChevronToggleIcon({ expanded, className }: { expanded: boolean; className?: string }) {
  return (
    <svg
      className={`${className ?? ""} transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
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

export default function ComparisonTable({ t, locale, results, input, residualOverride, onApplyResidual, isRecalculating }: ComparisonTableProps) {
  const [editingResidual, setEditingResidual] = useState(false);
  const [residualDraft, setResidualDraft] = useState<number>(0);

  const openResidualEditor = () => {
    setResidualDraft(residualOverride ?? results.buy.breakdown.residualValue);
    setEditingResidual((v) => !v);
  };
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
    { key: "workplaceBenefit", label: c.workplaceBenefit, buyValue: -buy.breakdown.workplaceBenefit, leaseValue: -lease.breakdown.workplaceBenefit, isSubtraction: true },
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
    <div className="rounded-2xl bg-white shadow-md ring-1 ring-zinc-200/60 dark:bg-zinc-900 dark:ring-zinc-700/50 max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 sm:px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{c.title}</h3>
      </div>

      {/* Table */}
      <div>
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky top-[4.5rem] z-10 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 text-start text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-3 ps-4 pe-3 whitespace-nowrap">
                {input.comparisonPeriodYears} {t.results.years}
              </th>
              <th className="sticky top-[4.5rem] z-10 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 text-end text-xs font-bold uppercase tracking-wider py-3 px-3 w-[140px]">
                <div className={`inline-flex items-center gap-1.5 ${buyWins ? "text-brand-600 dark:text-brand-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                  {buyWins && <CheckIcon className="h-4 w-4" />}
                  {c.buy}
                </div>
              </th>
              <th className="sticky top-[4.5rem] z-10 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 text-end text-xs font-bold uppercase tracking-wider py-3 ps-3 pe-4 w-[140px]">
                <div className={`inline-flex items-center gap-1.5 ${!buyWins ? "text-amber-600 dark:text-amber-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                  {!buyWins && <CheckIcon className="h-4 w-4" />}
                  {c.lease}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Vehicle identity row — echoes the cars chosen at the top */}
            <tr className="border-b border-zinc-100/80 dark:border-zinc-800/50 bg-zinc-50/60 dark:bg-zinc-800/30">
              <td className="ps-4 pe-3 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {c.vehicleRowLabel}
                </span>
              </td>
              <td className="text-end px-3 py-3 align-top text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {vehicleLabel(input.buy.vehicle, t)}
              </td>
              <td className="text-end ps-3 pe-4 py-3 align-top text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {vehicleLabel(input.lease.vehicle, t)}
              </td>
            </tr>
            {visibleRows.map((row, i) => {
              const hasFormula = !!(row.buyFormula || row.leaseFormula);
              const isExpanded = openRow === row.key;
              const isCredit = row.isSubtraction;

              return (
                <Fragment key={row.key}>
                <tr
                  className={`border-b border-zinc-100/80 dark:border-zinc-800/50 ${
                    i % 2 === 0
                      ? "bg-white dark:bg-zinc-900"
                      : "bg-zinc-50/40 dark:bg-zinc-800/20"
                  }`}
                >
                  <td className="ps-4 pe-3 py-3.5 align-top">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span className="text-sm sm:text-base font-medium text-zinc-700 dark:text-zinc-300">
                        {row.label}
                      </span>
                      {hasFormula && (
                        <button
                          type="button"
                          onClick={() => toggleRow(row.key)}
                          aria-label={isExpanded ? "collapse" : "expand"}
                          aria-expanded={isExpanded}
                          className="shrink-0 rounded-full p-0.5 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 dark:text-zinc-500 dark:hover:text-brand-400 dark:hover:bg-brand-900/30 transition-colors"
                        >
                          <ChevronToggleIcon expanded={isExpanded} className={`h-4 w-4 ${isExpanded ? "text-brand-600 dark:text-brand-400" : ""}`} />
                        </button>
                      )}
                      {row.key === "residualValue" && onApplyResidual && (
                        <button
                          type="button"
                          onClick={openResidualEditor}
                          className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:text-brand-300 ring-1 ring-brand-200/60 dark:ring-brand-800/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          </svg>
                          {c.editDepreciation}
                        </button>
                      )}
                      {row.key === "maintenance" && (
                        <a
                          href="#maintenance-section"
                          className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:text-brand-300 ring-1 ring-brand-200/60 dark:ring-brand-800/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          </svg>
                          {c.maintenance}
                        </a>
                      )}
                    </div>
                  </td>

                  <td className={`text-end px-3 py-3.5 align-top text-base tabular-nums font-bold ${
                    isCredit && row.buyValue < 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-800 dark:text-zinc-200"
                  }`}>
                    {fmtVal(row.buyValue, isCredit)}
                  </td>

                  <td className={`text-end ps-3 pe-4 py-3.5 align-top text-base tabular-nums font-bold ${
                    isCredit && row.leaseValue < 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-800 dark:text-zinc-200"
                  }`}>
                    {fmtVal(row.leaseValue, isCredit)}
                  </td>
                </tr>

                {isExpanded && hasFormula && (
                  <tr className="border-b border-zinc-100/80 dark:border-zinc-800/50 bg-zinc-50/60 dark:bg-zinc-800/30">
                    <td colSpan={3} className="px-4 pb-3 pt-0">
                      <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 px-3 py-2.5 text-xs leading-relaxed space-y-1.5">
                        {row.buyFormula && (
                          <div className="flex gap-1.5">
                            <span className="font-semibold text-brand-600 dark:text-brand-400 shrink-0">{c.buy}:</span>
                            <span className="text-zinc-600 dark:text-zinc-300">{row.buyFormula}</span>
                          </div>
                        )}
                        {row.leaseFormula && (
                          <div className="flex gap-1.5">
                            <span className="font-semibold text-amber-600 dark:text-amber-400 shrink-0">{c.lease}:</span>
                            <span className="text-zinc-600 dark:text-zinc-300">{row.leaseFormula}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {row.key === "residualValue" && editingResidual && onApplyResidual && (
                  <tr className="border-b border-zinc-100/80 dark:border-zinc-800/50 bg-brand-50/50 dark:bg-brand-950/20">
                    <td colSpan={3} className="px-4 py-3">
                      <div className="rounded-lg bg-white dark:bg-zinc-800/80 ring-1 ring-brand-200/70 dark:ring-brand-800/50 px-3 py-3 space-y-2">
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-200">
                          {c.residualEditLabel}
                        </label>
                        <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                          {c.residualEditHint}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <NumberInput
                              value={residualDraft}
                              onChange={setResidualDraft}
                              min={0}
                              step={1000}
                              showZero
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => { onApplyResidual(residualDraft); setEditingResidual(false); }}
                            disabled={isRecalculating}
                            className="shrink-0 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
                          >
                            {c.applyBtn}
                          </button>
                          {residualOverride != null && (
                            <button
                              type="button"
                              onClick={() => { onApplyResidual(null); setEditingResidual(false); }}
                              disabled={isRecalculating}
                              className="shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-700 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600 disabled:opacity-50 transition-colors"
                            >
                              {c.resetBtn}
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="bg-zinc-50 dark:bg-zinc-800/40 [&>td]:border-t-2 [&>td]:border-zinc-200 dark:[&>td]:border-zinc-700">
              <td className="ps-4 pe-3 py-4">
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">{c.total}</span>
              </td>
              <td className={`text-end px-3 py-4 text-xl tabular-nums font-extrabold whitespace-nowrap ${
                buyWins ? "text-brand-700 dark:text-brand-300" : "text-zinc-800 dark:text-zinc-200"
              }`}>
                {formatNumber(buy.totalCost, locale)} ₪
              </td>
              <td className={`text-end ps-3 pe-4 py-4 text-xl tabular-nums font-extrabold whitespace-nowrap ${
                !buyWins ? "text-amber-700 dark:text-amber-300" : "text-zinc-800 dark:text-zinc-200"
              }`}>
                {formatNumber(lease.totalCost, locale)} ₪
              </td>
            </tr>
            <tr className="bg-zinc-50 dark:bg-zinc-800/40">
              <td className="ps-4 pe-3 pb-4">
                <span className="text-sm text-zinc-400 dark:text-zinc-500">{c.monthlyCost}</span>
              </td>
              <td className="text-end px-3 pb-4 text-base tabular-nums font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {formatNumber(buy.monthlyCost, locale)} ₪
              </td>
              <td className="text-end ps-3 pe-4 pb-4 text-base tabular-nums font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {formatNumber(lease.monthlyCost, locale)} ₪
              </td>
            </tr>
            {monthlyDelta > 0 && (
              <tr className="bg-zinc-50 dark:bg-zinc-800/40">
                <td colSpan={3} className="px-4 sm:px-5 pb-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-200/60 dark:ring-emerald-800/40 px-3.5 py-1.5">
                    <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {tpl(c.monthlySavings, {
                        option: buyWins ? c.buy : c.lease,
                        amount: formatNumber(monthlyDelta, locale),
                      })}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>

      {(buy.breakdown.taxBenefits > 0 || lease.breakdown.taxBenefits > 0) && (
        <p className="px-4 sm:px-5 py-3 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800">
          {c.taxNote}
        </p>
      )}
    </div>
  );
}
