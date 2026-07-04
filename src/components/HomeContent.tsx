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
    <section className="mx-auto mt-16 max-w-2xl space-y-12">
      {/* About */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{h.aboutTitle}</h2>
        {h.aboutParagraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {p}
          </p>
        ))}
      </div>

      {/* FAQ */}
      <div className="space-y-2">
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{h.faqTitle}</h2>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {h.faq.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {f.q}
                <span className="text-zinc-400 transition-transform group-open:rotate-180" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </section>
  );
}
