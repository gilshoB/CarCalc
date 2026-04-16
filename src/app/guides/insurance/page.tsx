import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import GuideHero from "@/components/GuideHero";

export default async function InsuranceGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {isHe
          ? "ביטוח רכב בישראל — חובה ומקיף"
          : "Car Insurance in Israel — Mandatory and Comprehensive"}
      </h1>

      <GuideHero illustration="insurance" />

      <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
        {isHe ? (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              סוגי ביטוח רכב בישראל
            </h2>
            <p>
              בישראל קיימים שני סוגי ביטוח רכב עיקריים שכל בעל רכב צריך להכיר:
              ביטוח חובה וביטוח מקיף. ביטוח חובה, כשמו כן הוא — חובה על פי חוק,
              והוא מכסה נזקי גוף לכל מי שנפגע בתאונת דרכים, בין אם מדובר בנהג,
              נוסעים או הולכי רגל. ביטוח מקיף, לעומת זאת, הוא ביטוח רשות שמכסה
              נזקים לרכב שלכם — כולל גניבה, שריפה, הצפה, ונדליזם — וכן נזקי רכוש
              לצד שלישי (צד ג&apos;). שני סוגי הביטוח האלה משלימים זה את זה
              ויחד מעניקים כיסוי מלא שמגן עליכם מבחינה כלכלית בכל תרחיש אפשרי
              על הכביש. חשוב להבין את ההבדלים ביניהם כדי לקבל החלטה מושכלת
              בנוגע לכיסוי הביטוחי שלכם.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              ביטוח חובה
            </h2>
            <p>
              ביטוח חובה נדרש על פי חוק הפיצויים לנפגעי תאונות דרכים, ובלעדיו
              אסור לנהוג על הכביש. הביטוח מכסה הוצאות רפואיות, אשפוז, שיקום
              ופיצויים עבור כל מי שנפגע בתאונת דרכים — ללא קשר לשאלת האשמה.
              העלות השנתית הממוצעת של ביטוח חובה נעה בין 1,200 ל-2,500 ש&quot;ח,
              בהתאם לגיל הנהג, ניסיון הנהיגה, היסטוריית התביעות ומספר הנהגים
              הרשומים על הפוליסה. נהגים צעירים או נהגים חדשים ישלמו בדרך כלל
              פרמיה גבוהה יותר. חשוב לדעת שנהיגה ללא ביטוח חובה בתוקף היא
              עבירה פלילית שעלולה לגרור קנסות כבדים, שלילת רישיון ואף מאסר.
              בנוסף, אם תהיו מעורבים בתאונה ללא ביטוח, תיאלצו לשאת בכל
              ההוצאות הרפואיות מכיסכם הפרטי.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              ביטוח מקיף
            </h2>
            <p>
              ביטוח מקיף הוא ביטוח רשות, אך הוא מומלץ מאוד, בייחוד לבעלי רכבים
              חדשים או יקרים. הביטוח מכסה מגוון רחב של מקרים: גניבה מלאה או
              חלקית של הרכב, נזק לרכב שלכם כתוצאה מתאונה (גם אם אתם האשמים),
              שריפה, הצפה מגשם או שטפון, נדליזם ונזק זדוני, וכן נזקי רכוש לצד
              שלישי (צד ג&apos;). העלות השנתית של ביטוח מקיף נעה בדרך כלל בין
              3,000 ל-8,000 ש&quot;ח, בהתאם לשווי הרכב, גיל הנהג, ניסיון
              הנהיגה, היסטוריית תביעות, ורמת ההשתתפות העצמית שבחרתם. ככל שהרכב
              חדש ויקר יותר, כך הפרמיה תהיה גבוהה יותר, אך גם הכיסוי חשוב יותר
              — כי עלות תיקון או החלפה של רכב יקר עלולה להיות הרסנית מבחינה
              כלכלית. לרכבים ישנים יותר, חלק מהנהגים בוחרים רק בביטוח צד ג&apos;
              ללא מקיף, כדי לחסוך בעלויות.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              ביטוח בליסינג vs קנייה
            </h2>
            <p>
              כאשר לוקחים רכב בליסינג, הביטוח לרוב כלול בתשלום החודשי — אך חשוב
              מאוד לבדוק בדיוק מה כלול! חלק מעסקאות הליסינג כוללות גם ביטוח
              חובה וגם ביטוח מקיף, בעוד שאחרות כוללות רק ביטוח חובה. כאשר
              הביטוח כלול בליסינג, אתם לא משלמים עליו בנפרד — העלות כבר מגולמת
              בתשלום החודשי. לעומת זאת, כאשר קונים רכב, אתם חייבים לסדר את שני
              סוגי הביטוח בעצמכם ולשלם עליהם בנפרד, מה שיכול להוסיף אלפי שקלים
              לעלות השנתית של הרכב. במחשבון CarCalc תוכלו לסמן אילו ביטוחים
              כלולים בליסינג, והמחשבון יוסיף את העלות של מה שלא כלול. כך תוכלו
              לבצע השוואה אמיתית ומדויקת בין עלות הליסינג לעלות הרכישה.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              איך לחסוך בביטוח
            </h2>
            <p>
              יש מספר דרכים מוכחות לחסוך בעלויות הביטוח. ראשית, השוו הצעות מחיר
              בין חברות ביטוח שונות — ההבדלים יכולים להגיע לאלפי שקלים בשנה.
              שנית, שקלו לרכוש ביטוח חובה ומקיף מאותה חברה (חבילה משולבת) כדי
              לקבל הנחה. שלישית, העלו את סכום ההשתתפות העצמית — ככל שתסכימו לשלם
              יותר מכיסכם במקרה של תביעה, כך הפרמיה החודשית תהיה נמוכה יותר.
              רביעית, התקינו אמצעי מיגון מאושרים (אימובילייזר, מערכת איתור GPS)
              — חברות ביטוח מעניקות הנחות משמעותיות לרכבים ממוגנים. חמישית, שמרו
              על היסטוריית נהיגה נקייה ללא תביעות — נהגים עם היסטוריה נקייה
              זוכים לבונוס (הנחה מצטברת). לבסוף, שאלו על הנחות לבעלי מספר רכבים
              — חלק מהחברות מציעות הנחה כשמבטחים יותר מרכב אחד באותה פוליסה.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              דוגמה מספרית
            </h2>
            <p>
              בואו נסתכל על דוגמה מספרית כדי להמחיש את המשמעות הכלכלית של ביטוח
              הרכב. נניח שעלות ביטוח החובה השנתית היא 1,500 ש&quot;ח, ועלות
              הביטוח המקיף השנתית היא 5,000 ש&quot;ח. סה&quot;כ עלות ביטוח שנתית:
              6,500 ש&quot;ח. על פני 3 שנים, מדובר ב-19,500 ש&quot;ח — סכום
              משמעותי שרבים שוכחים להביא בחשבון כשמשווים בין קנייה לליסינג. אם
              בליסינג הביטוח כלול, זה אומר שהעלות הזו כבר מגולמת בתשלום החודשי,
              ואילו בקנייה תצטרכו להוסיף אותה מעל מחיר הרכב, ההלוואה והטסט. לכן,
              כשאתם משווים בין האפשרויות, ודאו שאתם כוללים את כל עלויות הביטוח
              בחישוב — אחרת ההשוואה לא תהיה מדויקת.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Types of Car Insurance in Israel
            </h2>
            <p>
              There are two main types of car insurance in Israel that every car
              owner needs to understand: mandatory insurance (Bituach Hova) and
              comprehensive insurance (Bituach Makif). Mandatory insurance, as
              the name implies, is required by law and covers bodily injury to
              anyone involved in a traffic accident — whether they are the
              driver, passengers, or pedestrians. Comprehensive insurance, on
              the other hand, is optional and covers damage to your own vehicle,
              including theft, fire, flooding, and vandalism, as well as
              third-party property damage. These two types of insurance
              complement each other and together provide full coverage that
              protects you financially in any scenario on the road. Understanding
              the differences between them is essential for making an informed
              decision about your insurance coverage.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Mandatory Insurance (Bituach Hova)
            </h2>
            <p>
              Mandatory insurance is required under Israeli traffic accident
              compensation law, and without it, you are not permitted to drive
              on the road. This insurance covers medical expenses, hospitalization,
              rehabilitation, and compensation for anyone injured in a traffic
              accident — regardless of who was at fault. The average annual cost
              of mandatory insurance ranges from 1,200 to 2,500 ILS, depending
              on the driver&apos;s age, driving experience, claims history, and
              the number of drivers listed on the policy. Young or new drivers
              typically pay a higher premium. It is important to know that
              driving without valid mandatory insurance is a criminal offense
              that can result in heavy fines, license suspension, and even
              imprisonment. Additionally, if you are involved in an accident
              without insurance, you will have to bear all medical expenses out
              of your own pocket, which can be financially devastating.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Comprehensive Insurance (Bituach Makif)
            </h2>
            <p>
              Comprehensive insurance is optional, but it is highly recommended,
              especially for owners of new or expensive vehicles. This insurance
              covers a wide range of scenarios: full or partial theft of the
              vehicle, damage to your car resulting from an accident (even if you
              are at fault), fire, flooding from rain or storms, vandalism and
              malicious damage, and third-party property damage. The annual cost
              of comprehensive insurance typically ranges from 3,000 to 8,000
              ILS, depending on the car&apos;s value, the driver&apos;s age,
              driving experience, claims history, and the deductible level you
              choose. The newer and more expensive the car, the higher the
              premium — but the coverage is also more critical, since the cost
              of repairing or replacing an expensive vehicle can be financially
              devastating. For older vehicles, some drivers choose to carry only
              third-party property insurance without comprehensive coverage in
              order to save on costs.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Insurance in Leasing vs Buying
            </h2>
            <p>
              When you lease a car, insurance is often included in the monthly
              payment — but it is very important to check exactly what is
              included! Some leasing deals include both mandatory and
              comprehensive insurance, while others include only mandatory
              insurance. When insurance is included in the lease, you do not pay
              for it separately — the cost is already factored into your monthly
              payment. In contrast, when you buy a car, you must arrange both
              types of insurance yourself and pay for them separately, which can
              add thousands of shekels to the annual cost of car ownership. In
              the CarCalc calculator, you can mark which insurance types are
              included in the lease, and the calculator will add the cost of
              whatever is not included. This way, you can make a truly accurate
              comparison between the cost of leasing and the cost of buying.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              How to Save on Insurance
            </h2>
            <p>
              There are several proven ways to save on insurance costs. First,
              compare quotes from different insurance companies — the
              differences can amount to thousands of shekels per year. Second,
              consider purchasing mandatory and comprehensive insurance from the
              same company (a bundled package) to receive a discount. Third,
              increase your deductible amount — the more you agree to pay out
              of pocket in the event of a claim, the lower your monthly premium
              will be. Fourth, install approved anti-theft devices (immobilizer,
              GPS tracking system) — insurance companies offer significant
              discounts for vehicles with security features. Fifth, maintain a
              clean driving record with no claims — drivers with a clean history
              receive a cumulative bonus discount that grows over the years.
              Finally, ask about multi-car discounts — some companies offer
              reduced rates when you insure more than one vehicle on the same
              policy.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              A Numerical Example
            </h2>
            <p>
              Let&apos;s look at a numerical example to illustrate the financial
              significance of car insurance. Suppose the annual mandatory
              insurance cost is 1,500 ILS, and the annual comprehensive
              insurance cost is 5,000 ILS. Total annual insurance cost: 6,500
              ILS. Over 3 years, that amounts to 19,500 ILS — a significant sum
              that many people forget to factor in when comparing buying versus
              leasing. If insurance is included in the lease, this cost is
              already built into the monthly payment, whereas when buying you
              need to add it on top of the car price, the loan, and the annual
              inspection. So when you compare your options, make sure you include
              all insurance costs in the calculation — otherwise the comparison
              will not be accurate.
            </p>
          </>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-900 dark:bg-brand-950/30">
        <p className="font-semibold text-brand-800 dark:text-brand-300">
          {isHe
            ? "רוצים לראות איך הביטוח משפיע על העלות הכוללת?"
            : "Want to see how insurance affects the total cost?"}
        </p>
        <p className="mt-1 text-brand-700 dark:text-brand-400">
          <a href="/" className="underline hover:no-underline">
            {isHe
              ? "הזינו את הצעות הביטוח שלכם במחשבון ותראו את ההשפעה"
              : "Enter your insurance quotes in the calculator to see the impact"}
          </a>
        </p>
      </div>
    </main>
  );
}
