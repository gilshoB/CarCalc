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
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {t.app.title}
              </span>
              <span className="hidden text-sm text-zinc-500 sm:inline">
                {t.app.subtitle}
              </span>
            </div>
            <LanguageToggle locale={locale} label={t.nav.language} />
          </div>
        </header>
        {children}
        <footer className="border-t border-zinc-200/60 dark:border-zinc-800 mt-12 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <div className="mx-auto max-w-5xl px-4 flex items-center justify-center gap-4">
            <span>&copy; {new Date().getFullYear()} CarCalc</span>
            <a href="/privacy" className="hover:text-zinc-600 dark:hover:text-zinc-300 underline">{t.nav.privacy}</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
