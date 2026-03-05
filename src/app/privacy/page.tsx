import { cookies } from "next/headers";
import { defaultLocale, getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {isHe ? "מדיניות פרטיות" : "Privacy Policy"}
      </h1>

      <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
        {isHe ? (
          <>
            <p>
              CarCalc ("האתר") מספק כלי להשוואת עלויות רכב. אנו מחויבים להגן על פרטיותכם.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">מידע שאנו אוספים</h2>
            <p>
              האתר אינו אוסף מידע אישי מזהה. הנתונים שתזינו במחשבון (מחיר רכב, הלוואה וכו') מעובדים בצד השרת ואינם נשמרים.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">עוגיות (Cookies)</h2>
            <p>
              האתר משתמש בעוגיות לשמירת העדפת השפה שלכם. בנוסף, אנו משתמשים בשירותי פרסום של Google AdSense,
              אשר עשויים להשתמש בעוגיות כדי להציג פרסומות רלוונטיות. Google עשויה לאסוף ולהשתמש במידע
              (שאינו כולל את שמכם, כתובתכם, כתובת הדוא"ל או מספר הטלפון שלכם) על ביקורכם באתר זה
              ובאתרים אחרים כדי לספק פרסומות על מוצרים ושירותים שמעניינים אתכם.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">פרסומות של צד שלישי</h2>
            <p>
              אנו משתמשים ב-Google AdSense להצגת פרסומות. Google, כספק צד שלישי, משתמשת בעוגיות להצגת
              מודעות באתר שלנו. השימוש של Google בעוגיות מאפשר לה להציג מודעות למשתמשים על סמך ביקוריהם
              באתר שלנו ובאתרים אחרים באינטרנט. ניתן לבטל את השימוש בעוגיות בהגדרות המודעות של Google.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">שינויים במדיניות</h2>
            <p>
              אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים יפורסמו בעמוד זה.
            </p>
          </>
        ) : (
          <>
            <p>
              CarCalc ("the site") provides a car cost comparison tool. We are committed to protecting your privacy.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">Information We Collect</h2>
            <p>
              The site does not collect personally identifiable information. Data you enter in the calculator
              (car price, loan details, etc.) is processed server-side and is not stored.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">Cookies</h2>
            <p>
              The site uses cookies to store your language preference. Additionally, we use Google AdSense
              advertising services, which may use cookies to display relevant advertisements. Google may collect
              and use information (not including your name, address, email, or phone number) about your visits
              to this and other websites to provide advertisements about goods and services of interest to you.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">Third-Party Advertising</h2>
            <p>
              We use Google AdSense to serve ads. Google, as a third-party vendor, uses cookies to serve ads
              on our site. Google's use of cookies enables it to serve ads to users based on their visit to
              our site and other sites on the internet. You may opt out of personalized advertising by visiting
              Google Ads Settings.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
