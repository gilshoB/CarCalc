import type { getTranslations } from "@/i18n/config";

/**
 * Static, crawlable content for the landing page: an explanatory "about" section
 * and an FAQ, plus FAQPage structured data. This gives the calculator homepage
 * real editorial content (helps SEO / AdSense content requirements).
 */
export default function HomeContent({ t }: { t: ReturnType<typeof getTranslations> }) {
  const h = t.home;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: h.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="mt-12 flex flex-wrap items-start gap-4">
      {/* About */}
      <div className="flex-[1_1_360px] min-w-0 rounded-[28px] bg-lime p-7 sm:p-10 flex flex-col gap-4">
        <h2 className="text-[32px] sm:text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em]">{h.aboutTitle}</h2>
        <p className="text-base leading-[1.7]">{h.aboutParagraphs[0]}</p>
        <a href="/guides/buy-vs-lease" className="font-bold underline underline-offset-4">
          {t.bento.guideLink} ←
        </a>
      </div>

      {/* FAQ */}
      <div className="flex-[1.7_1_520px] min-w-0 rounded-[28px] bg-white p-6 sm:p-8 flex flex-col gap-2">
        <h2 className="mb-2 text-2xl font-extrabold tracking-[-0.02em]">{h.faqTitle}</h2>
        {h.faq.map((f, i) => (
          <details key={i} className="group rounded-xl bg-soft px-4 py-3.5">
            <summary className="flex cursor-pointer items-center justify-between gap-3 text-[15px] font-semibold">
              {f.q}
              <span className="text-lg leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-[#3d3d38]">{f.a}</p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </section>
  );
}
