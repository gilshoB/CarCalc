import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { cookies } from "next/headers";
import { defaultLocale, getDirection, getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { Analytics } from "@vercel/analytics/next";
import LanguageToggle from "@/components/LanguageToggle";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-rubik",
});

const OG_IMAGE = {
  url: "/images/logo_new.png",
  width: 1992,
  height: 941,
  alt: "CarCalc",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "oerkeM7Iz2TPNyYALrHOvVEf8s9ybijNwUeclnlL4zY",
  },
  title: "CarCalc — קנייה או ליסינג: מה משתלם יותר?",
  description:
    "השוו בין קניית רכב חדש, רכב יד שנייה או ליסינג תפעולי וגלו מה הכי משתלם",
  openGraph: {
    title: "CarCalc — קנייה או ליסינג: מה משתלם יותר?",
    description: "השוו בין קניית רכב חדש, רכב יד שנייה או ליסינג תפעולי וגלו מה הכי משתלם",
    type: "website",
    locale: "he_IL",
    siteName: "CarCalc",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarCalc — קנייה או ליסינג: מה משתלם יותר?",
    description: "השוו בין קניית רכב חדש, רכב יד שנייה או ליסינג תפעולי וגלו מה הכי משתלם",
    images: [OG_IMAGE.url],
  },
  other: {
    "theme-color": "#0e0e0e",
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
      <body className={`${rubik.variable} font-sans antialiased`}>
        <header className="sticky top-0 z-50 bg-[#ededE8]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-6 h-20">
            <a href="/" aria-label="CarCalc" className="flex items-center gap-1 shrink-0 text-[22px] font-extrabold tracking-[-0.04em] text-ink" dir="ltr">
              CARCALC
              <span aria-hidden="true" className="ms-1 inline-block h-[9px] w-[9px] border-2 border-ink bg-lime" />
            </a>
            <nav className="hidden sm:flex items-center gap-1">
                <a href="/" className="rounded-xl px-3 py-2 text-[15px] font-medium text-ink hover:bg-white transition-colors">
                  {t.nav.calculator}
                </a>
                <details className="relative group">
                  <summary className="cursor-pointer rounded-xl px-3 py-2 text-[15px] font-medium text-ink hover:bg-white transition-colors flex items-center gap-1">
                    {t.nav.guides}
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="absolute end-0 top-full mt-2 w-60 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 z-50 p-2">
                    <a href="/guides/buy-vs-lease" className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-soft">{t.nav.guideBuyVsLease}</a>
                    <a href="/guides/depreciation" className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-soft">{t.nav.guideDepreciation}</a>
                    <a href="/guides/car-loans" className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-soft">{t.nav.guideCarLoans}</a>
                    <a href="/guides/insurance" className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-soft">{t.nav.guideInsurance}</a>
                    <a href="/guides/electric-vs-gasoline" className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-soft">{t.nav.guideElectricVsGasoline}</a>
                    <a href="/guides/tax-benefits" className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-soft">{t.nav.guideTaxBenefits}</a>
                  </div>
                </details>
                <a href="/about" className="rounded-xl px-3 py-2 text-[15px] font-medium text-ink hover:bg-white transition-colors">
                  {t.nav.about}
                </a>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageToggle locale={locale} label={t.nav.language} />
              {/* Mobile hamburger menu */}
              <details className="relative sm:hidden">
                <summary aria-label="Menu" className="cursor-pointer rounded-xl p-2.5 text-ink hover:bg-white transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </summary>
                <div className="absolute end-0 top-full mt-2 w-64 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 z-50 p-2">
                  <a href="/" className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-soft">{t.nav.calculator}</a>
                  <div className="mx-3 my-1 border-t border-line" />
                  <p className="px-4 py-1.5 text-xs font-semibold text-muted">{t.nav.guides}</p>
                  <a href="/guides/buy-vs-lease" className="block rounded-xl px-6 py-2 text-sm text-ink hover:bg-soft">{t.nav.guideBuyVsLease}</a>
                  <a href="/guides/depreciation" className="block rounded-xl px-6 py-2 text-sm text-ink hover:bg-soft">{t.nav.guideDepreciation}</a>
                  <a href="/guides/car-loans" className="block rounded-xl px-6 py-2 text-sm text-ink hover:bg-soft">{t.nav.guideCarLoans}</a>
                  <a href="/guides/insurance" className="block rounded-xl px-6 py-2 text-sm text-ink hover:bg-soft">{t.nav.guideInsurance}</a>
                  <a href="/guides/electric-vs-gasoline" className="block rounded-xl px-6 py-2 text-sm text-ink hover:bg-soft">{t.nav.guideElectricVsGasoline}</a>
                  <a href="/guides/tax-benefits" className="block rounded-xl px-6 py-2 text-sm text-ink hover:bg-soft">{t.nav.guideTaxBenefits}</a>
                  <div className="mx-3 my-1 border-t border-line" />
                  <a href="/about" className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-soft">{t.nav.about}</a>
                </div>
              </details>
            </div>
          </div>
        </header>
        {children}
        <footer className="mx-auto mt-12 max-w-[1240px] px-6 pb-6">
          <div className="rounded-[28px] bg-ink px-8 py-10 sm:px-12 flex flex-wrap items-end justify-between gap-6 text-[#b5b5ae]">
            <div className="flex flex-col gap-3 min-w-0">
              <span dir="ltr" className="flex items-center gap-1 self-start rtl:self-end text-[40px] font-extrabold tracking-[-0.045em] text-white leading-none">
                CARCALC
                <span aria-hidden="true" className="ms-1.5 inline-block h-3.5 w-3.5 bg-lime" />
              </span>
              <span className="text-[13px] leading-relaxed max-w-xl">{t.footer.disclaimer}</span>
            </div>
            <nav aria-label="footer" className="flex flex-wrap items-center gap-5 text-sm">
              <a href="/about" className="text-white hover:text-lime">{t.nav.about}</a>
              <a href="/privacy" className="text-white hover:text-lime">{t.nav.privacy}</a>
              <span>&copy; {new Date().getFullYear()} CarCalc</span>
            </nav>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
