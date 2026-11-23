import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { GUIDES } from "@/lib/guides";
import { CalcCta } from "@/components/guide";

export const metadata: Metadata = {
  title: "מדריכים לקניית רכב, ליסינג, הלוואות וביטוח | CarCalc",
  description:
    "כל המדריכים של CarCalc במקום אחד: קנייה מול ליסינג, כמה עולה להחזיק רכב, הלוואת רכב, ביטוח, פחת, חשמלי מול בנזין והטבות מס.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesIndexPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-[30px] sm:text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
        {isHe ? "המדריכים שלנו" : "Our guides"}
      </h1>
      <p className="mt-3 text-[17px] leading-[1.75] text-[#3d3d38]">
        {isHe
          ? "הסברים בשפה פשוטה על כל מה שקשור לעלות של רכב, עם דוגמאות במספרים אמיתיים."
          : "Plain-language explanations of everything that goes into the cost of a car, with real-number examples."}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => {
          const text = isHe ? g.he : g.en;
          return (
            <a
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group block rounded-[20px] bg-white p-5 transition hover:ring-2 hover:ring-ink"
            >
              <span className="block text-lg font-extrabold leading-snug text-ink">{text.nav}</span>
              <span className="mt-1.5 block text-[15px] leading-relaxed text-[#3d3d38]">{text.summary}</span>
            </a>
          );
        })}
      </div>

      <CalcCta
        title={isHe ? "מוכנים לחשב?" : "Ready to calculate?"}
        text={
          isHe
            ? "המחשבון משווה בין קנייה חדשה, יד שנייה וליסינג, לפי הנתונים שלכם."
            : "The calculator compares buying new, buying used and leasing, using your own numbers."
        }
        button={isHe ? "למחשבון" : "Open the calculator"}
      />
    </main>
  );
}
