"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { CostBreakdown } from "@/types/calculator";
import { formatCurrency } from "@/lib/formatters";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CostBreakdownChartProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  buyBreakdown: CostBreakdown;
  leaseBreakdown: CostBreakdown;
}

export default function CostBreakdownChart({
  t,
  locale,
  buyBreakdown,
  leaseBreakdown,
}: CostBreakdownChartProps) {
  const c = t.results.comparison;

  const categories = [
    { key: "carPayment", label: c.carPayment },
    { key: "registration", label: c.registration },
    { key: "fuel", label: c.fuel },
    { key: "insurance", label: c.mandatoryInsurance },
    { key: "maintenance", label: c.maintenance },
    { key: "loanInterest", label: c.loanInterest },
  ];

  const data = categories.map((cat) => {
    let buyVal = 0;
    let leaseVal = 0;

    switch (cat.key) {
      case "carPayment":
        buyVal = buyBreakdown.carPayment; leaseVal = leaseBreakdown.carPayment; break;
      case "registration":
        buyVal = buyBreakdown.registrationFees; leaseVal = leaseBreakdown.registrationFees; break;
      case "fuel":
        buyVal = buyBreakdown.fuel; leaseVal = leaseBreakdown.fuel; break;
      case "insurance":
        buyVal = buyBreakdown.mandatoryInsurance + buyBreakdown.comprehensiveInsurance;
        leaseVal = leaseBreakdown.mandatoryInsurance + leaseBreakdown.comprehensiveInsurance; break;
      case "maintenance":
        buyVal = buyBreakdown.maintenance; leaseVal = leaseBreakdown.maintenance; break;
      case "loanInterest":
        buyVal = buyBreakdown.loanInterest + buyBreakdown.loanOriginationFee; leaseVal = 0; break;
    }

    return {
      name: cat.label,
      [t.results.charts.buyLabel]: buyVal,
      [t.results.charts.leaseLabel]: leaseVal,
    };
  }).filter((d) => d[t.results.charts.buyLabel] !== 0 || d[t.results.charts.leaseLabel] !== 0);

  return (
    <div className="rounded-2xl bg-white shadow-md ring-1 ring-zinc-200/60 p-5 dark:bg-zinc-900 dark:ring-zinc-700/50">
      <h3 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-50">
        {t.results.charts.breakdownTitle}
      </h3>
      <div style={{ direction: "ltr" }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis
              type="number"
              tickFormatter={(v) => formatCurrency(v, locale)}
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11, fill: "#71717a" }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value), locale)}
              contentStyle={{ borderRadius: "12px", border: "1px solid #e4e4e7", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
            />
            <Legend />
            <Bar dataKey={t.results.charts.buyLabel} fill="#2563eb" radius={[0, 4, 4, 0]} />
            <Bar dataKey={t.results.charts.leaseLabel} fill="#f59e0b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
