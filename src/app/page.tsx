import { cookies } from "next/headers";
import { defaultLocale, getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import CalculatorWizard from "@/components/calculator/CalculatorWizard";

export default async function Home() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const t = getTranslations(locale);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <section className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {t.app.subtitle}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
          {t.app.description}
        </p>
      </section>

      {/* Calculator Wizard */}
      <CalculatorWizard locale={locale} translations={t} />

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
        <p className="mb-2">{t.footer.disclaimer}</p>
        <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
      </footer>
    </main>
  );
}
