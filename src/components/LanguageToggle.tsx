"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";

export default function LanguageToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const router = useRouter();

  function toggleLocale() {
    const next = locale === "he" ? "en" : "he";
    document.cookie = `locale=${next};path=/;max-age=31536000`;
    router.refresh();
  }

  return (
    <button
      onClick={toggleLocale}
      className="rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-lime"
    >
      {label}
    </button>
  );
}
