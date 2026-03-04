"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { YearlyBreakdown } from "@/types/calculator";
import { formatCurrency } from "@/lib/formatters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CumulativeCostChartProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  buyYearly: YearlyBreakdown[];
  leaseYearly: YearlyBreakdown[];
}

export default function CumulativeCostChart({
  t,
  locale,
  buyYearly,
  leaseYearly,
}: CumulativeCostChartProps) {
  const data = buyYearly.map((buyYear, i) => ({
    name: `${t.results.charts.yearLabel} ${buyYear.year}`,
    [t.results.charts.buyLabel]: buyYear.cumulativeCost,
    [t.results.charts.leaseLabel]: leaseYearly[i]?.cumulativeCost ?? 0,
  }));

  return (
    <div className="rounded-2xl bg-white shadow-md ring-1 ring-zinc-200/60 p-5 dark:bg-zinc-900 dark:ring-zinc-700/50">
      <h3 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-50">
        {t.results.charts.cumulativeTitle}
      </h3>
      <div style={{ direction: "ltr" }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ left: 20, right: 20 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#a1a1aa" }} />
            <YAxis
              tickFormatter={(v) => formatCurrency(v, locale)}
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value), locale)}
              contentStyle={{ borderRadius: "12px", border: "1px solid #e4e4e7", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={t.results.charts.buyLabel}
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#2563eb" }}
            />
            <Line
              type="monotone"
              dataKey={t.results.charts.leaseLabel}
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#f59e0b" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
