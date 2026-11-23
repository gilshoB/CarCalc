import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "העמוד לא נמצא | CarCalc",
  robots: { index: false },
};

export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-extrabold tracking-[-0.04em] text-ink">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">{isHe ? "העמוד לא נמצא" : "Page not found"}</h1>
      <p className="mt-2 text-[17px] text-[#3d3d38]">
        {isHe ? "ייתכן שהקישור שגוי או שהעמוד הועבר." : "The link may be wrong, or the page has moved."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href="/" className="rounded-[14px] bg-lime px-6 py-3 text-base font-bold text-ink transition hover:brightness-95">
          {isHe ? "למחשבון" : "To the calculator"}
        </a>
        <a href="/guides" className="rounded-[14px] bg-white px-6 py-3 text-base font-bold text-ink transition hover:bg-soft">
          {isHe ? "לכל המדריכים" : "All guides"}
        </a>
      </div>
    </main>
  );
}
