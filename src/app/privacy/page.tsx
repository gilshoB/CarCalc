import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale, getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | CarCalc",
  description: "איזה מידע CarCalc אוסף, איך משתמשים בעוגיות ובפרסומות של Google, ואיך לבטל פרסום מותאם אישית.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {isHe ? "מדיניות פרטיות" : "Privacy Policy"}
      </h1>
      <p className="-mt-4 mb-6 text-sm text-zinc-500">
        {isHe ? "עודכן לאחרונה: 23 בנובמבר 2026" : "Last updated: November 23, 2026"}
      </p>

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
            <p>
              אם תבקשו לשלוח לכם את התוצאות במייל, כתובת המייל (והשם, אם הזנתם) ישמשו אך ורק לשליחת אותו מייל אחד.
              איננו שומרים אותם ואיננו שולחים מיילים נוספים. השליחה מתבצעת דרך ספק שליחת המיילים Resend, ששומר
              רישום טכני של המיילים שנשלחו.
            </p>
            <p>
              הודעות שנשלחות דרך טופס יצירת הקשר, כולל השם והמייל, מגיעות אלינו במייל ומשמשות רק כדי לענות לכם.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">מדידת שימוש</h2>
            <p>
              אנו משתמשים ב-Vercel Web Analytics כדי לדעת כמה אנשים מבקרים באתר ובאילו עמודים. הכלי לא משתמש
              בעוגיות, לא מזהה אתכם באופן אישי ולא עוקב אחריכם באתרים אחרים. בנוסף, אנו משתמשים ב-Google Search
              Console, שמראה לנו נתונים מצטברים על החיפושים בגוגל שהובילו לאתר.
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
              באתר שלנו ובאתרים אחרים באינטרנט.
            </p>
            <p>
              ניתן לבטל פרסום מותאם אישית ב<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="font-bold text-zinc-800 dark:text-zinc-200 underline underline-offset-4">הגדרות המודעות של Google</a>,
              או לבטל שימוש בעוגיות של ספקי פרסום אחרים באתר <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="font-bold text-zinc-800 dark:text-zinc-200 underline underline-offset-4">aboutads.info</a>.
              מידע נוסף על האופן שבו Google משתמשת בנתונים מאתרים שמשתמשים בשירותיה נמצא{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="font-bold text-zinc-800 dark:text-zinc-200 underline underline-offset-4">בעמוד של Google</a>.
              ניתן גם לחסום או למחוק עוגיות בהגדרות הדפדפן שלכם.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">הזכויות שלכם</h2>
            <p>
              מאחר שאיננו שומרים את הנתונים שאתם מזינים במחשבון, אין לנו מידע אישי עליכם למחוק או למסור. אם שלחתם
              לנו הודעה וברצונכם שנמחק אותה, או שיש לכם שאלה על הפרטיות, כתבו לנו דרך{" "}
              <a href="/contact" className="font-bold text-zinc-800 dark:text-zinc-200 underline underline-offset-4">עמוד צור קשר</a>.
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
            <p>
              If you ask us to email you your results, your email address (and name, if you entered one) is used
              only to send that single email. We don&apos;t store it and won&apos;t email you again. Emails are sent
              through our email provider, Resend, which keeps a technical log of sent messages.
            </p>
            <p>
              Messages sent through the contact form, including your name and email, reach us by email and are used
              only to reply to you.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">Usage Measurement</h2>
            <p>
              We use Vercel Web Analytics to see how many people visit and which pages. It uses no cookies, doesn&apos;t
              identify you personally and doesn&apos;t track you across other sites. We also use Google Search Console,
              which shows us aggregate data about the Google searches that led to the site.
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
              our site and other sites on the internet.
            </p>
            <p>
              You can opt out of personalized advertising in <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="font-bold text-zinc-800 dark:text-zinc-200 underline underline-offset-4">Google Ads Settings</a>,
              or opt out of other vendors&apos; cookies at <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="font-bold text-zinc-800 dark:text-zinc-200 underline underline-offset-4">aboutads.info</a>.
              Learn how Google uses data from sites that use its services on{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="font-bold text-zinc-800 dark:text-zinc-200 underline underline-offset-4">Google&apos;s page</a>.
              You can also block or delete cookies in your browser settings.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">Your Rights</h2>
            <p>
              Since we don&apos;t store what you enter in the calculator, we hold no personal data about you to delete or
              hand over. If you sent us a message and want it deleted, or have a privacy question, write to us through
              the <a href="/contact" className="font-bold text-zinc-800 dark:text-zinc-200 underline underline-offset-4">contact page</a>.
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
