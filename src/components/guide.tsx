import type { ReactNode } from "react";
import GuideHero from "@/components/GuideHero";
import ArticleJsonLd from "@/components/ArticleJsonLd";

type Illustration = Parameters<typeof GuideHero>[0]["illustration"];

// Shared building blocks for the guide pages, so every guide reads and looks
// the same: title, definitions box, examples, tables and calculator links.

export function GuideShell({
  locale,
  path,
  title,
  description,
  illustration,
  children,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  illustration: Illustration;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <ArticleJsonLd locale={locale} path={path} headline={title} description={description} />
      <h1 className="mb-6 text-[30px] sm:text-[40px] font-extrabold leading-[1.12] tracking-[-0.03em] text-ink text-balance">
        {title}
      </h1>
      <GuideHero illustration={illustration} />
      <div className="space-y-4 text-[17px] leading-[1.75] text-[#3d3d38]">{children}</div>
    </main>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="!mt-10 text-[23px] font-extrabold leading-snug tracking-[-0.02em] text-ink">{children}</h2>;
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="!mt-6 text-lg font-bold text-ink">{children}</h3>;
}

/** Inline link to the calculator. */
export function Calc({ children }: { children: ReactNode }) {
  return (
    <a href="/#start" className="font-bold text-ink underline underline-offset-4 hover:no-underline">
      {children}
    </a>
  );
}

/** Lime strip near the top of a guide that sends the reader to the calculator. */
export function CalcLink({ children }: { children: ReactNode }) {
  return (
    <a
      href="/#start"
      className="flex items-center justify-between gap-4 rounded-[18px] bg-lime px-5 py-4 text-base font-bold leading-snug text-ink transition hover:brightness-95"
    >
      <span>{children}</span>
      <span aria-hidden="true" className="rtl:rotate-180">→</span>
    </a>
  );
}

/** Closing call-to-action box. */
export function CalcCta({ title, text, button }: { title: string; text: string; button: string }) {
  return (
    <div className="!mt-12 rounded-[24px] bg-ink p-6 sm:p-8 text-white">
      <p className="text-2xl font-extrabold leading-snug">{title}</p>
      <p className="mt-2 text-base leading-relaxed text-[#c8c8c1]">{text}</p>
      <a
        href="/#start"
        className="mt-5 inline-block rounded-[14px] bg-lime px-7 py-3.5 text-base font-bold text-ink transition hover:brightness-95"
      >
        {button}
      </a>
    </div>
  );
}

/** Glossary box: plain-language definitions of the terms the guide uses. */
export function Terms({ title, items }: { title: string; items: [string, ReactNode][] }) {
  return (
    <section className="!mt-8 rounded-[20px] bg-white p-5 sm:p-7">
      <h2 className="text-[21px] font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
      <dl className="mt-4 space-y-4">
        {items.map(([term, def]) => (
          <div key={term}>
            <dt className="font-bold text-ink">{term}</dt>
            <dd className="mt-0.5">{def}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Example({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="!mt-6 rounded-[20px] border border-line bg-soft p-5 sm:p-6 space-y-3">
      <p className="font-extrabold text-ink">{title}</p>
      {children}
    </div>
  );
}

export function Bullets({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 ps-6 marker:text-ink">{children}</ul>;
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="list-decimal space-y-2 ps-6 marker:font-bold marker:text-ink">{children}</ol>;
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="!mt-5 overflow-x-auto rounded-[16px] bg-white">
      <table className="w-full min-w-[480px] border-collapse text-[15px] leading-snug">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="border-b-2 border-ink px-4 py-3 text-start font-bold text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 align-top ${j === 0 ? "font-semibold text-ink" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-muted">{children}</p>;
}

/** Inline link to another guide. */
export function Ref({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a href={`/guides/${to}`} className="font-bold text-ink underline underline-offset-4 hover:no-underline">
      {children}
    </a>
  );
}
