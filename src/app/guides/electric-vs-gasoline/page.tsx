import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import GuideHero from "@/components/GuideHero";

export default async function ElectricVsGasolinePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {isHe
          ? "רכב חשמלי מול בנזין — מה באמת משתלם?"
          : "Electric vs Gasoline — What Really Costs Less?"}
      </h1>

      <GuideHero illustration="electric-vs-gasoline" />

      <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
        {isHe ? (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              המהפכה החשמלית בישראל
            </h2>
            <p>
              בשנים האחרונות חלה מהפכה של ממש בשוק הרכב הישראלי. כלי רכב
              חשמליים, שפעם נחשבו לנישה קטנה ויקרה, הפכו לחלק משמעותי מהמכירות
              בישראל. הממשלה מעודדת את המעבר לרכב חשמלי באמצעות הטבות מס רכישה
              משמעותיות — מס מופחת של 10% בלבד לעומת 83% לרכבי בנזין — מה שמוריד
              את מחיר הרכישה בצורה דרמטית. בנוסף, מחירי הדלק בישראל ממשיכים
              לעלות, ותחנות טעינה חדשות נפתחות כל יום ברחבי הארץ. אבל השאלה
              הגדולה נשארת: האם רכב חשמלי באמת משתלם יותר כשמסתכלים על התמונה
              הכוללת? כדי לענות על כך, צריך לבחון שלושה מרכיבים מרכזיים — עלויות
              דלק, תחזוקה ופחת — ולהבין כיצד הם משתלבים יחד לאורך תקופת הבעלות
              על הרכב.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              עלויות דלק — יתרון ברור לחשמלי
            </h2>
            <p>
              ההבדל הבולט ביותר בין רכב חשמלי לרכב בנזין הוא עלות האנרגיה
              לקילומטר. רכב בנזין ממוצע צורך כליטר לכל 14 קילומטר, ועם מחיר של
              כ-7.5 ש&quot;ח לליטר, העלות יוצאת כ-0.54 ש&quot;ח לקילומטר. לעומת
              זאת, רכב חשמלי ממוצע נוסע כ-6 קילומטר על כל קוט&quot;ש, ועם מחיר
              חשמל של כ-0.6 ש&quot;ח לקוט&quot;ש (טעינה ביתית), העלות היא כ-0.10
              ש&quot;ח בלבד לקילומטר.
            </p>
            <p>
              בואו נתרגם את זה למספרים מוחשיים. נניח נהיגה של 15,000 קילומטר
              בשנה לאורך 3 שנים — סך הכל 45,000 קילומטר. עלות הדלק לרכב בנזין
              תהיה כ-24,107 ש&quot;ח (45,000 ÷ 14 × 7.5). עלות הטעינה לרכב חשמלי
              תהיה כ-4,500 ש&quot;ח בלבד (45,000 ÷ 6 × 0.6). ההפרש הוא כ-19,600
              ש&quot;ח לטובת הרכב החשמלי! מדובר בחיסכון עצום שמורגש כל חודש
              בארנק. ככל שנוהגים יותר קילומטרים בשנה, היתרון של הרכב החשמלי גדל
              עוד יותר. לנהגים שנוסעים 25,000 קילומטר ומעלה בשנה, החיסכון יכול
              להגיע לעשרות אלפי שקלים.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              תחזוקה — עוד יתרון לחשמלי
            </h2>
            <p>
              מנוע חשמלי הוא מנגנון פשוט בהרבה ממנוע בעירה פנימית. אין בו שמן
              מנוע שצריך להחליף כל 10,000-15,000 קילומטר, אין רצועת תזמון שעלולה
              להיקרע ולגרום לנזק כבד, אין מערכת פליטה מורכבת עם ממיר קטליטי, ואין
              תיבת הילוכים מסורתית שדורשת תחזוקה. ברכב חשמלי, רוב הבלימה נעשית
              באמצעות &quot;בלימה רגנרטיבית&quot; — המנוע החשמלי עצמו מאט את הרכב
              ובמקביל טוען את הסוללה — ולכן גם רפידות הבלמים מחזיקות הרבה יותר
              זמן.
            </p>
            <p>
              בממוצע, עלות התחזוקה של רכב חשמלי נמוכה בכ-20% מעלות התחזוקה של רכב
              בנזין מקביל. במחשבון CarCalc אנחנו משתמשים במכפיל 0.8 לרכב חשמלי
              לעומת 1.0 לרכב בנזין כדי לשקף הבדל זה. על פני שלוש שנים, החיסכון
              בתחזוקה יכול להגיע לכמה אלפי שקלים נוספים, בהתאם לרכב הספציפי
              ולהיקף הנסיעה.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              פחת — החיסרון הגדול של חשמלי
            </h2>
            <p>
              כאן מגיע הצד הפחות נעים של הבעלות על רכב חשמלי. שוק הרכב החשמלי
              מתפתח במהירות: דגמים חדשים עם טווח ארוך יותר, טכנולוגיית סוללות
              משופרת וירידת מחירים מתמדת. כל אלה גורמים לכך שרכב חשמלי משומש
              מאבד מערכו מהר יותר מרכב בנזין.
            </p>
            <p>
              שיעורי הפחת הנהוגים בשוק הם כ-25% בשנה הראשונה, 20% בשנה השנייה
              ו-15% בשנה השלישית לרכב חשמלי, לעומת 15%, 12% ו-10% בהתאמה לרכב
              בנזין. בואו נראה דוגמה מספרית: נניח רכב בשווי 200,000 ש&quot;ח. רכב
              בנזין: לאחר שנה — 170,000, לאחר שנתיים — 149,600, לאחר שלוש שנים —
              134,640. סך הפחת: 65,360 ש&quot;ח. רכב חשמלי: לאחר שנה — 150,000,
              לאחר שנתיים — 120,000, לאחר שלוש שנים — 102,000. סך הפחת: 98,000
              ש&quot;ח. ההפרש הוא 32,640 ש&quot;ח לרעת הרכב החשמלי! זהו מספר
              משמעותי שיכול לאיין חלק ניכר מהחיסכון בדלק ובתחזוקה.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              סיכום ההשוואה
            </h2>
            <p>
              אז מה באמת משתלם יותר? התשובה תלויה בנסיבות האישיות שלכם. רכב חשמלי
              מנצח בבירור בעלויות הדלק — עם חיסכון של כ-19,600 ש&quot;ח על פני
              שלוש שנים ב-15,000 קילומטר בשנה. גם בתחזוקה יש יתרון לחשמלי עם
              חיסכון של כ-20%. אולם הפחת המואץ של הרכב החשמלי, שיכול להגיע
              ל-32,640 ש&quot;ח יותר מרכב בנזין, מצמצם את הפער.
            </p>
            <p>
              לנהגים שנוסעים הרבה — 20,000 קילומטר בשנה ומעלה — הרכב החשמלי
              כמעט תמיד משתלם יותר, כי החיסכון בדלק גדל בהתאם לקילומטראז&#39;.
              לנהגים שנוסעים מעט ומחליפים רכב כל שנתיים-שלוש, הפחת הגבוה עלול
              להפוך את הרכב החשמלי ליקר יותר בסיכומו של דבר. גם מחיר הרכב משפיע:
              ככל שהרכב יקר יותר, הפחת בערכים מוחלטים גדול יותר, ולכן ההפסד
              מהפחת המואץ גדל.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              נסו את ההשוואה במחשבון
            </h2>
            <p>
              במחשבון CarCalc ניתן להשוות את אותו הרכב עם סוגי דלק שונים. הזינו
              את הנתונים פעם אחת עם בנזין ופעם עם חשמלי, וראו את ההבדל בעלות
              הכוללת. כך תוכלו לקבל תמונה מדויקת ומותאמת אישית, על בסיס המחיר
              של הרכב שאתם שוקלים, היקף הנסיעה השנתי שלכם ותקופת הבעלות המתוכננת.
              ההשוואה האישית היא הדרך הטובה ביותר לקבל החלטה מושכלת.
            </p>

            <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-900 dark:bg-brand-950/30">
              <p className="font-semibold text-brand-800 dark:text-brand-300">
                רוצים להשוות חשמלי מול בנזין עם הנתונים שלכם?
              </p>
              <p className="mt-1 text-brand-700 dark:text-brand-400">
                <a href="/" className="underline hover:no-underline">
                  הריצו את המחשבון פעמיים — פעם לכל סוג דלק — והשוו
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              The Electric Revolution in Israel
            </h2>
            <p>
              In recent years, a genuine revolution has taken place in the Israeli
              car market. Electric vehicles, once considered a small and expensive
              niche, have become a significant portion of car sales in Israel. The
              government encourages the transition to electric vehicles through
              substantial purchase tax benefits — a reduced tax rate of just 10%
              compared to 83% for gasoline cars — which dramatically lowers the
              purchase price. On top of that, fuel prices in Israel continue to
              climb, and new charging stations are opening every day across the
              country. But the big question remains: is an electric car truly more
              cost-effective when you look at the full picture? To answer that, we
              need to examine three core components — fuel costs, maintenance, and
              depreciation — and understand how they combine over the ownership
              period.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Fuel Costs — A Clear Advantage for Electric
            </h2>
            <p>
              The most striking difference between an electric car and a gasoline
              car is the energy cost per kilometer. An average gasoline car
              consumes about one liter per 14 kilometers, and at a price of
              approximately 7.5 ILS per liter, the cost works out to about 0.54
              ILS per kilometer. By contrast, an average electric car travels
              about 6 kilometers per kWh, and with an electricity price of about
              0.6 ILS per kWh (home charging), the cost is only about 0.10 ILS
              per kilometer.
            </p>
            <p>
              Let&apos;s translate that into concrete numbers. Assume annual
              driving of 15,000 kilometers over 3 years — a total of 45,000
              kilometers. The fuel cost for a gasoline car would be approximately
              24,107 ILS (45,000 / 14 x 7.5). The charging cost for an electric
              car would be only about 4,500 ILS (45,000 / 6 x 0.6). The
              difference is roughly 19,600 ILS in favor of the electric car!
              That is an enormous saving that you feel in your wallet every single
              month. The more kilometers you drive per year, the greater the
              electric car&apos;s advantage grows. For drivers covering 25,000
              kilometers or more annually, the savings can reach tens of thousands
              of shekels over the ownership period.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Maintenance — Another Win for Electric
            </h2>
            <p>
              An electric motor is a far simpler mechanism than an internal
              combustion engine. There is no engine oil that needs replacing every
              10,000 to 15,000 kilometers, no timing belt that can snap and cause
              severe damage, no complex exhaust system with a catalytic converter,
              and no traditional gearbox requiring maintenance. In electric cars,
              most braking is done through &quot;regenerative braking&quot; — the
              electric motor itself slows the car while simultaneously charging
              the battery — so brake pads also last significantly longer.
            </p>
            <p>
              On average, the maintenance cost of an electric car is about 20%
              lower than that of a comparable gasoline car. In the CarCalc
              calculator, we use a multiplier of 0.8 for electric cars versus 1.0
              for gasoline cars to reflect this difference. Over three years, the
              maintenance savings can add up to several thousand shekels more,
              depending on the specific vehicle and driving volume. Fewer trips to
              the garage, fewer unexpected repair bills, and a generally simpler
              ownership experience make electric cars attractive from a
              maintenance perspective.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Depreciation — The Big Downside of Electric
            </h2>
            <p>
              Here comes the less pleasant side of electric car ownership. The
              electric vehicle market is evolving rapidly: new models with longer
              range, improved battery technology, and continually falling prices.
              All of these factors cause a used electric car to lose its value
              faster than a gasoline car.
            </p>
            <p>
              The depreciation rates common in the market are approximately 25%
              in the first year, 20% in the second year, and 15% in the third
              year for electric cars, compared to 15%, 12%, and 10% respectively
              for gasoline cars. Let&apos;s look at a numerical example: assume a
              car worth 200,000 ILS. Gasoline car: after one year — 170,000,
              after two years — 149,600, after three years — 134,640. Total
              depreciation: 65,360 ILS. Electric car: after one year — 150,000,
              after two years — 120,000, after three years — 102,000. Total
              depreciation: 98,000 ILS. The difference is 32,640 ILS to the
              detriment of the electric car! This is a significant figure that can
              offset a considerable portion of the fuel and maintenance savings.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Comparison Summary
            </h2>
            <p>
              So what really costs less? The answer depends on your personal
              circumstances. Electric cars clearly win on fuel costs — with
              savings of approximately 19,600 ILS over three years at 15,000
              kilometers per year. Maintenance also favors electric with about 20%
              lower costs. However, the accelerated depreciation of electric cars,
              which can amount to 32,640 ILS more than a gasoline car, narrows the
              gap considerably.
            </p>
            <p>
              For high-mileage drivers — 20,000 kilometers per year and above —
              the electric car is almost always more cost-effective, because the
              fuel savings scale with mileage. For drivers who travel less and
              trade in their car every two to three years, the high depreciation
              may make the electric car more expensive overall. The car&apos;s
              price also matters: the more expensive the car, the greater the
              depreciation in absolute terms, so the loss from accelerated
              depreciation grows accordingly. Each driver&apos;s break-even point
              is different, making a personalized calculation essential.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Try the Comparison in the Calculator
            </h2>
            <p>
              In the CarCalc calculator, you can compare the same car with
              different fuel types. Enter the data once with gasoline and once
              with electric, and see the difference in total cost of ownership.
              This way you can get an accurate, personalized picture based on the
              price of the car you are considering, your annual driving distance,
              and your planned ownership period. A personal comparison is the best
              way to make an informed decision about which fuel type truly makes
              more financial sense for your situation.
            </p>

            <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-900 dark:bg-brand-950/30">
              <p className="font-semibold text-brand-800 dark:text-brand-300">
                Want to compare electric vs gasoline with your own numbers?
              </p>
              <p className="mt-1 text-brand-700 dark:text-brand-400">
                <a href="/" className="underline hover:no-underline">
                  Run the calculator twice — once for each fuel type — and compare
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
