import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "תנאי שימוש | CarCalc",
  description: "תנאי השימוש באתר CarCalc ובמחשבון קנייה מול ליסינג.",
  alternates: { canonical: "/terms" },
};

const UPDATED_HE = "עודכן לאחרונה: 23 בנובמבר 2026";
const UPDATED_EN = "Last updated: November 23, 2026";

export default async function TermsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  const h2 = "!mt-8 text-[21px] font-extrabold tracking-[-0.02em] text-ink";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
        {isHe ? "תנאי שימוש" : "Terms of Use"}
      </h1>
      <p className="mt-2 text-sm text-muted">{isHe ? UPDATED_HE : UPDATED_EN}</p>

      <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#3d3d38]">
        {isHe ? (
          <>
            <p>
              ברוכים הבאים ל-CarCalc (״האתר״). השימוש באתר, במחשבון ובמדריכים מהווה הסכמה לתנאים האלה. אם אינכם
              מסכימים להם, אנא אל תשתמשו באתר.
            </p>

            <h2 className={h2}>המידע באתר אינו ייעוץ</h2>
            <p>
              המחשבון והמדריכים נועדו לעזור לכם להבין ולהשוות עלויות של רכב. הם מבוססים על הנתונים שהזנתם ועל
              הנחות כלליות, כמו מחירי דלק, שיעורי ירידת ערך וריביות, שעשויות להשתנות. התוצאות הן הערכה בלבד.
            </p>
            <p>
              המידע באתר אינו ייעוץ פיננסי, ייעוץ השקעות, ייעוץ מס או ייעוץ משפטי, ואינו מחליף פנייה לאיש מקצוע.
              לפני החלטה על קנייה, ליסינג או הלוואה, בדקו את התנאים מול הגורם שמציע לכם את העסקה.
            </p>

            <h2 className={h2}>דיוק המידע</h2>
            <p>
              אנחנו משתדלים שהמידע יהיה מדויק ומעודכן, אבל איננו מתחייבים לכך. ייתכנו טעויות, השמטות או נתונים
              שהתיישנו. האתר ניתן לשימוש ״כמות שהוא״ (AS IS).
            </p>

            <h2 className={h2}>אחריות</h2>
            <p>
              CarCalc ומפעיליו לא יהיו אחראים לכל נזק, הפסד או הוצאה שייגרמו כתוצאה מהשימוש באתר או מהסתמכות על
              המידע שבו, במידה המרבית שהחוק מתיר.
            </p>

            <h2 className={h2}>קישורים ופרסומות</h2>
            <p>
              האתר עשוי לכלול קישורים לאתרים אחרים ופרסומות של צד שלישי, כולל Google AdSense. איננו אחראים לתוכן,
              למוצרים או לשירותים של אתרים ומפרסמים אלה.
            </p>

            <h2 className={h2}>קניין רוחני</h2>
            <p>
              התכנים באתר, כולל הטקסטים, האיורים, העיצוב והמחשבון, שייכים ל-CarCalc. מותר לשתף קישורים לאתר
              ולצטט קטעים קצרים עם קישור למקור. אין להעתיק את האתר או חלקים משמעותיים ממנו בלי אישור.
            </p>

            <h2 className={h2}>פרטיות</h2>
            <p>
              המידע על השימוש בנתונים שלכם מופיע ב<a href="/privacy" className="font-bold text-ink underline underline-offset-4">מדיניות הפרטיות</a>.
            </p>

            <h2 className={h2}>שינויים בתנאים</h2>
            <p>אנחנו עשויים לעדכן את התנאים מעת לעת. הגרסה העדכנית תפורסם תמיד בעמוד הזה, עם תאריך העדכון.</p>

            <h2 className={h2}>יצירת קשר</h2>
            <p>
              שאלות על התנאים? כתבו לנו דרך <a href="/contact" className="font-bold text-ink underline underline-offset-4">עמוד צור קשר</a>.
            </p>
          </>
        ) : (
          <>
            <p>
              Welcome to CarCalc (“the site”). By using the site, the calculator or the guides you agree to these
              terms. If you don't agree, please don't use the site.
            </p>

            <h2 className={h2}>Not advice</h2>
            <p>
              The calculator and guides are here to help you understand and compare car costs. They rely on the data
              you enter and on general assumptions, such as fuel prices, depreciation rates and interest rates, which
              can change. Results are estimates only.
            </p>
            <p>
              Nothing on the site is financial, investment, tax or legal advice, and it doesn't replace a
              professional. Before deciding on buying, leasing or a loan, check the terms with whoever offers you the deal.
            </p>

            <h2 className={h2}>Accuracy</h2>
            <p>We try to keep the information accurate and current but don't guarantee it. There may be errors, omissions or outdated figures. The site is provided “as is”.</p>

            <h2 className={h2}>Liability</h2>
            <p>To the fullest extent permitted by law, CarCalc and its operators are not liable for any damage, loss or expense arising from use of the site or reliance on its information.</p>

            <h2 className={h2}>Links and ads</h2>
            <p>The site may include links to other sites and third-party ads, including Google AdSense. We're not responsible for their content, products or services.</p>

            <h2 className={h2}>Intellectual property</h2>
            <p>The site's content, including text, illustrations, design and the calculator, belongs to CarCalc. You may share links and quote short passages with a link back. Don't copy the site or substantial parts of it without permission.</p>

            <h2 className={h2}>Privacy</h2>
            <p>
              How we handle your data is described in the <a href="/privacy" className="font-bold text-ink underline underline-offset-4">privacy policy</a>.
            </p>

            <h2 className={h2}>Changes</h2>
            <p>We may update these terms from time to time. The current version, with its date, is always on this page.</p>

            <h2 className={h2}>Contact</h2>
            <p>
              Questions about these terms? Reach us through the <a href="/contact" className="font-bold text-ink underline underline-offset-4">contact page</a>.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
