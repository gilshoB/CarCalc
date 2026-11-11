import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale, getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "צרו קשר | CarCalc",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const t = getTranslations(locale);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-[34px] sm:text-[44px] font-extrabold leading-[1.05] tracking-[-0.035em]">{t.contact.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted">{t.contact.subtitle}</p>
      </div>
      <ContactForm t={t} />
    </main>
  );
}
