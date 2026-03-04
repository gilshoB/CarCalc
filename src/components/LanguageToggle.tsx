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
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      {label}
    </button>
  );
}
