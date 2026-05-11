import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { cookies } from "next/headers";
import { defaultLocale, getDirection, getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import Image from "next/image";
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
    "theme-color": "#328b82",
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
    <html lang={locale} dir={dir} className="bg-zinc-50">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${heebo.variable} font-sans antialiased bg-zinc-50`}>
        {/* Professional header with inline logo */}
        <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-16">
            {/* Logo - positioned at the start (right in RTL) */}
            <a href="/" className="flex items-center gap-3 group">
              <Image 
                src="/images/logo_new.png" 
                alt="CarCalc" 
                width={140} 
                height={42} 
                className="h-9 w-auto" 
                priority 
              />
            </a>

            {/* Navigation - center */}
            <nav className="hidden md:flex items-center gap-1">
              <a href="/" className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-brand-600 transition-colors">
                {t.nav.calculator}
              </a>
              <details className="relative group">
                <summary className="list-none cursor-pointer px-4 py-2 text-sm font-medium text-zinc-700 hover:text-brand-600 transition-colors flex items-center gap-1.5">
                  {t.nav.guides}
                  <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="absolute end-0 top-full mt-2 w-56 rounded-xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <a href="/guides/buy-vs-lease" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideBuyVsLease}</a>
                  <a href="/guides/depreciation" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideDepreciation}</a>
                  <a href="/guides/car-loans" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideCarLoans}</a>
                  <a href="/guides/insurance" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideInsurance}</a>
                  <a href="/guides/electric-vs-gasoline" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideElectricVsGasoline}</a>
                  <a href="/guides/tax-benefits" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideTaxBenefits}</a>
                </div>
              </details>
              <a href="/about" className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-brand-600 transition-colors">
                {t.nav.about}
              </a>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <LanguageToggle locale={locale} label={t.nav.language} />
              
              {/* Mobile hamburger menu */}
              <details className="relative md:hidden">
                <summary className="list-none cursor-pointer rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </summary>
                <div className="absolute end-0 top-full mt-2 w-64 rounded-xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <a href="/" className="block px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.calculator}</a>
                  <div className="mx-3 my-2 border-t border-zinc-100" />
                  <p className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">{t.nav.guides}</p>
                  <a href="/guides/buy-vs-lease" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideBuyVsLease}</a>
                  <a href="/guides/depreciation" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideDepreciation}</a>
                  <a href="/guides/car-loans" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideCarLoans}</a>
                  <a href="/guides/insurance" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideInsurance}</a>
                  <a href="/guides/electric-vs-gasoline" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideElectricVsGasoline}</a>
                  <a href="/guides/tax-benefits" className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.guideTaxBenefits}</a>
                  <div className="mx-3 my-2 border-t border-zinc-100" />
                  <a href="/about" className="block px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-brand-600 transition-colors">{t.nav.about}</a>
                </div>
              </details>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-12rem)]">
          {children}
        </main>

        {/* Clean footer */}
        <footer className="border-t border-zinc-200 bg-white mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image 
                  src="/images/logo_new.png" 
                  alt="CarCalc" 
                  width={100} 
                  height={30} 
                  className="h-6 w-auto opacity-60" 
                />
                <span className="text-sm text-zinc-400">&copy; {new Date().getFullYear()}</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="/about" className="text-sm text-zinc-500 hover:text-brand-600 transition-colors">{t.nav.about}</a>
                <a href="/privacy" className="text-sm text-zinc-500 hover:text-brand-600 transition-colors">{t.nav.privacy}</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
