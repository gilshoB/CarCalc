import type { Locale } from "@/i18n/config";

export function formatCurrency(value: number, locale: Locale): string {
  const loc = locale === "he" ? "he-IL" : "en-IL";
  return new Intl.NumberFormat(loc, {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, locale: Locale): string {
  const loc = locale === "he" ? "he-IL" : "en-IL";
  return new Intl.NumberFormat(loc, {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value}%`;
}
