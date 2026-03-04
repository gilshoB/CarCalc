import he from "./he";
import en from "./en";

export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

const translations = { he, en } as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr";
}
