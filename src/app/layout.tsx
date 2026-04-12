import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { cookies } from "next/headers";
import { defaultLocale, getDirection, getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import LanguageToggle from "@/components/LanguageToggle";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "CarCalc - השוואת עלויות רכב בישראל",
  description:
    "השוו בין קניית רכב חדש, רכב יד שנייה או ליסינג תפעולי וגלו מה הכי משתלם",
  openGraph: {
    title: "CarCalc - השוואת עלויות רכב בישראל",
    description: "השוו בין קניית רכב חדש, רכב יד שנייה או ליסינג תפעולי וגלו מה הכי משתלם",
    type: "website",
    locale: "he_IL",
  },
  other: {
    "theme-color": "#2563eb",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const dir = getDirection(locale);
  const t = getTranslations(locale);

  return (
    <html lang={locale} dir={dir}>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${heebo.variable} font-sans antialiased`}>
        <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {t.app.title}
              </span>
              <span className="hidden text-sm text-zinc-500 sm:inline">
                {t.app.subtitle}
              </span>
            </a>
            <div className="flex items-center gap-3">
              <nav className="hidden sm:flex items-center gap-1">
                <a href="/" className="rounded-md px-2.5 py-1.5 text-sm text-zinc-600 hover:text-blue-600 hover:bg-blue-50 dark:text-zinc-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/30 transition-colors">
                  {t.nav.calculator}
                </a>
                <details className="relative group">
                  <summary className="list-none cursor-pointer rounded-md px-2.5 py-1.5 text-sm text-zinc-600 hover:text-blue-600 hover:bg-blue-50 dark:text-zinc-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/30 transition-colors flex items-center gap-1">
                    {t.nav.guides}
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="absolute end-0 top-full mt-1 w-56 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900 z-50 py-1">
                    <a href="/guides/buy-vs-lease" className="block px-4 py-2 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400">{t.nav.guideBuyVsLease}</a>
                    <a href="/guides/depreciation" className="block px-4 py-2 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400">{t.nav.guideDepreciation}</a>
                    <a href="/guides/car-loans" className="block px-4 py-2 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400">{t.nav.guideCarLoans}</a>
                    <a href="/guides/insurance" className="block px-4 py-2 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400">{t.nav.guideInsurance}</a>
                    <a href="/guides/electric-vs-gasoline" className="block px-4 py-2 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400">{t.nav.guideElectricVsGasoline}</a>
                    <a href="/guides/tax-benefits" className="block px-4 py-2 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400">{t.nav.guideTaxBenefits}</a>
                  </div>
                </details>
                <a href="/about" className="rounded-md px-2.5 py-1.5 text-sm text-zinc-600 hover:text-blue-600 hover:bg-blue-50 dark:text-zinc-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/30 transition-colors">
                  {t.nav.about}
                </a>
              </nav>
              <LanguageToggle locale={locale} label={t.nav.language} />
            </div>
          </div>
        </header>
        {children}
        <footer className="border-t border-zinc-200/60 dark:border-zinc-800 mt-12 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <div className="mx-auto max-w-5xl px-4 flex items-center justify-center gap-4">
            <span>&copy; {new Date().getFullYear()} CarCalc</span>
            <a href="/about" className="hover:text-zinc-600 dark:hover:text-zinc-300 underline">{t.nav.about}</a>
            <a href="/privacy" className="hover:text-zinc-600 dark:hover:text-zinc-300 underline">{t.nav.privacy}</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
