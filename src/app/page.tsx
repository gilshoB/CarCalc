import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale, getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import CalculatorWizard from "@/components/calculator/CalculatorWizard";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const t = getTranslations(locale);
  const b = t.bento;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pt-4 pb-6 flex flex-col gap-4">
      {/* Hero bento */}
      <section className="flex flex-wrap gap-4">
        <div className="flex-[2_1_560px] min-w-0 rounded-[28px] bg-ink text-white p-8 sm:p-14 flex flex-col justify-between gap-12 min-h-[420px]">
          <span className="text-sm font-medium text-[#b5b5ae]">{b.eyebrow}</span>
          <div className="flex flex-col gap-4">
            <h1 className="text-[40px] sm:text-[60px] font-extrabold leading-[1.05] tracking-[-0.04em] text-balance">
              {b.headline}
            </h1>
            <p className="text-[44px] sm:text-[72px] font-extrabold leading-[0.98] tracking-[-0.045em] text-lime">
              {b.tagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-5">
            <p className="max-w-[420px] text-[17px] leading-relaxed text-[#c8c8c1]">{b.heroText}</p>
            <a
              href="#start"
              className="rounded-[14px] bg-lime px-7 py-4 text-[17px] font-bold text-ink hover:brightness-95 transition"
            >
              {b.cta} ←
            </a>
          </div>
        </div>
        <div className="flex-[1_1_300px] min-w-0 rounded-[28px] bg-lime p-10 flex flex-col justify-between gap-8">
          <span className="text-[120px] font-extrabold leading-[0.85] tracking-[-0.06em]">3</span>
          <div className="flex flex-col gap-2.5">
            <span className="text-[22px] font-bold">{b.optionsTitle}</span>
            <span className="flex flex-col gap-1.5 text-base font-medium">
              <span>← {t.options.buyNew}</span>
              <span>← {t.options.buyUsed}</span>
              <span>← {t.options.leasing}</span>
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-4">
        <div className="flex-[1.6_1_480px] min-w-0 rounded-[28px] bg-white p-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="text-xl font-bold">{b.chartTitle}</span>
            <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-muted">{b.sampleLabel}</span>
          </div>
          <svg viewBox="0 0 520 200" className="w-full h-auto" role="img" aria-label={b.chartTitle}>
            <path d="M0 199H520M0 133H520M0 66H520" stroke="#ECECE6" strokeWidth="1" />
            <path d="M0 186L104 150L208 118L312 94L416 70L520 48" fill="none" stroke="#9A9A92" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
            <path d="M0 180L104 140L208 116L312 98L416 84L520 72" fill="none" stroke="#0E0E0E" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div className="flex flex-wrap gap-5 text-sm font-medium">
            <span className="flex items-center gap-2"><span className="h-1 w-4 bg-ink" />{t.results.charts.buyLabel}</span>
            <span className="flex items-center gap-2"><span className="h-[3px] w-4 bg-[#9A9A92]" />{t.results.charts.leaseLabel}</span>
          </div>
        </div>
        <div className="flex-[1_1_280px] min-w-0 flex flex-col gap-4">
          <div className="flex-1 rounded-[28px] bg-white p-8 flex flex-col gap-2.5">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0E0E0E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <ellipse cx="16" cy="8" rx="10" ry="4" />
              <path d="M6 8v8c0 2.2 4.5 4 10 4s10-1.8 10-4V8M6 16v8c0 2.2 4.5 4 10 4s10-1.8 10-4v-8" />
            </svg>
            <span className="text-xl font-bold">{b.dataTitle}</span>
            <span className="text-[15px] leading-relaxed text-muted">{b.dataText}</span>
          </div>
          <div className="flex-1 rounded-[28px] bg-ink text-white p-8 flex flex-col gap-2.5">
            <span className="text-xl font-bold">{b.opportunityTitle}</span>
            <span className="text-[15px] leading-relaxed text-[#c8c8c1]">{b.opportunityText}</span>
          </div>
        </div>
      </section>

      {/* Calculator Wizard */}
      <section id="start" className="scroll-mt-24 pt-8">
        <CalculatorWizard locale={locale} translations={t} />
      </section>

      {/* Editorial content + FAQ (SEO / crawlable content) */}
      <HomeContent t={t} />
    </main>
  );
}
