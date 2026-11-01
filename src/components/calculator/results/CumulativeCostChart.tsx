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
    <div className="rounded-[24px] bg-white p-6">
      <h3 className="mb-4 text-base font-bold">
        {t.results.charts.cumulativeTitle}
      </h3>
      <div style={{ direction: "ltr" }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ left: 20, right: 20 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b6b65" }} />
            <YAxis
              tickFormatter={(v) => formatCurrency(v, locale)}
              tick={{ fontSize: 11, fill: "#6b6b65" }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value), locale)}
              contentStyle={{ borderRadius: "12px", border: "1px solid #e4e4e7", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={t.results.charts.buyLabel}
              stroke="#0e0e0e"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#0e0e0e" }}
            />
            <Line
              type="monotone"
              dataKey={t.results.charts.leaseLabel}
              stroke="#b5b5ae"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#b5b5ae" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
