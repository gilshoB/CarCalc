import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import GuideHero from "@/components/GuideHero";

export default async function BuyVsLeasePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {isHe
          ? "קנייה מול ליסינג — מה באמת משתלם?"
          : "Buying vs Leasing — What Really Saves You More?"}
      </h1>

      <GuideHero illustration="buy-vs-lease" />

      <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
        {isHe ? (
          <>
            {/* --- Section 1 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              מה ההבדל בין קנייה לליסינג?
            </h2>
            <p>
              כשאתם רוכשים רכב, הוא שלכם לכל דבר ועניין. אתם משלמים את מלוא
              המחיר — בין אם במזומן, בהעברה בנקאית או באמצעות הלוואה — ומקבלים
              בעלות מלאה על הרכב. מרגע הרכישה, הרכב מאבד מערכו (פחת), אך הוא
              נשאר אצלכם עד שתחליטו למכור אותו. אתם אחראים על הביטוח, הטיפולים,
              הטסט, ההרשמה וכל ההוצאות הנלוות. היתרון הגדול: אחרי שהרכב נפרע,
              אין יותר תשלומים חודשיים, והרכב ממשיך לשרת אתכם.
            </p>
            <p>
              בליסינג, לעומת זאת, אתם לא הבעלים של הרכב. אתם משלמים תשלום חודשי
              קבוע לחברת הליסינג, ובתמורה מקבלים רכב לשימוש לתקופה מוגדרת —
              בדרך כלל 3 עד 4 שנים. בתום התקופה, אתם מחזירים את הרכב ויכולים
              לקחת רכב חדש. בליסינג תפעולי, התשלום החודשי כולל בדרך כלל ביטוח
              מקיף וצד ג׳, טיפולים שוטפים, רכב חלופי במקרה של תקלה, וטסט שנתי.
              מבחינת תזרים מזומנים, אין צורך בהון עצמי גבוה — אלא רק בתשלום
              חודשי קבוע וידוע מראש.
            </p>

            {/* --- Section 2 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              מתי קנייה משתלמת יותר?
            </h2>
            <p>
              קנייה תהיה לרוב הבחירה הנכונה כשמתקיימים כמה תנאים: ראשית, כשמחיר
              הרכב נמוך יחסית — למשל, רכב שעולה עד 150,000 ₪. ככל שהרכב זול
              יותר, כך הפער בין עלות הקנייה הכוללת לעלות הליסינג הכוללת גדל
              לטובת הקנייה. שנית, כשיש לכם הון עצמי מספיק ואתם לא צריכים לקחת
              הלוואה — או לפחות הלוואה קטנה. ריבית על הלוואת רכב יכולה להוסיף
              עשרות אלפי שקלים לעלות הכוללת.
            </p>
            <p>
              שלישית, כשאתם מתכננים לשמור את הרכב לטווח ארוך — 5 שנים ומעלה.
              הפחת הגדול ביותר מתרחש בשנתיים-שלוש הראשונות, ואחרי שהרכב כבר
              איבד את עיקר ערכו, כל שנה נוספת שאתם נוהגים בו &quot;מפחיתה&quot;
              את העלות השנתית הממוצעת. רביעית, כשהרכב שומר על ערך שארית (residual
              value) גבוה — מותגים כמו טויוטה, מאזדה או סובארו ידועים בשמירת ערך
              טובה.
            </p>
            <p>
              <strong>דוגמה:</strong> רכב בשווי 80,000 ₪ עם הון עצמי — הקנייה
              תהיה זולה בעשרות אלפי שקלים מליסינג. אם תשמרו עליו 6 שנים ותמכרו
              ב-25,000 ₪, העלות הכוללת נטו תהיה כ-55,000 ₪ בתוספת ביטוח
              וטיפולים. בליסינג, גם על רכב צנוע, תשלמו לפחות 2,000 ₪ לחודש —
              כלומר 144,000 ₪ על 6 שנים.
            </p>

            {/* --- Section 3 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              מתי ליסינג משתלם יותר?
            </h2>
            <p>
              ליסינג הופך למשתלם יותר במספר מצבים ספציפיים. ראשית, כשמדובר ברכב
              יקר — 300,000 ₪ ומעלה. רכבים יקרים מאבדים סכומי עתק בפחת, ובמקרה
              כזה ה&quot;סיכון&quot; של ירידת הערך עובר לחברת הליסינג במקום
              אליכם. שנית, כשאתם אוהבים להחליף רכב כל 3 שנים — ליסינג מאפשר לכם
              לעבור לרכב חדש בתום כל תקופה בלי להתעסק עם מכירת הרכב הישן.
            </p>
            <p>
              שלישית, ואולי הסיבה המשמעותית ביותר — לבעלי עסקים ועצמאים. בישראל,
              ניתן לנכות עד 45% מהוצאות הליסינג כהוצאה מוכרת לצורכי מס. עבור
              עצמאי עם מס שולי גבוה, החיסכון הוא עצום. עצמאי עם מס שולי 47%
              יכול לחסוך עד 45% מהוצאות הליסינג כהוצאה מוכרת — מה שיכול להגיע
              לאלפי שקלים בחודש בחיסכון מס בלבד.
            </p>
            <p>
              רביעית, כשאתם מעדיפים עלות חודשית קבועה וידועה מראש, ללא הפתעות.
              בליסינג תפעולי, כמעט הכל כלול: ביטוח, טיפולים, רכב חלופי. אם משהו
              מתקלקל — זו הבעיה של חברת הליסינג, לא שלכם. השקט הנפשי הזה שווה
              כסף, במיוחד למי שלא רוצה להתעסק עם ניהול הרכב.
            </p>

            {/* --- Section 4 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              עלויות נסתרות שכדאי להכיר
            </h2>
            <p>
              בין אם אתם קונים או לוקחים ליסינג, יש עלויות שרבים מתעלמים מהן
              ושיכולות להטות את הכף בצורה משמעותית. העלות הנסתרת הגדולה ביותר
              בקנייה היא <strong>הפחת</strong> — ירידת ערך הרכב לאורך זמן. רכב
              חדש מאבד בממוצע 20%-30% מערכו בשנה הראשונה בלבד, ועד 50%-60% תוך 4
              שנים. רכב שקניתם ב-200,000 ₪ עלול להיות שווה רק 80,000 ₪ אחרי 4
              שנים — הפרש של 120,000 ₪ שהלכו לאיבוד.
            </p>
            <p>
              עלות נוספת היא <strong>ריבית על הלוואה</strong>. אם אתם ממנים את
              הרכישה באמצעות הלוואה, הריבית יכולה להוסיף 10%-20% לעלות הכוללת,
              תלוי בתנאים. <strong>ביטוח</strong> הוא עלות שקונים שוכחים לחשב —
              ביטוח מקיף לרכב חדש יכול לעלות 5,000-10,000 ₪ בשנה, סכום שבליסינג
              כבר כלול בתשלום החודשי. <strong>אגרת רישוי</strong> שנתית, טסט
              (חובה מגיל 3 שנים), ו<strong>טיפולים שוטפים</strong> שהולכים
              ומתייקרים ככל שהרכב מזדקן — החלפת צמיגים, בלמים, רצועת תזמון,
              ועוד.
            </p>
            <p>
              בליסינג, העלויות הנסתרות שונות: עמלת יציאה מוקדמת אם אתם רוצים
              להפסיק לפני הזמן, חיוב על קילומטרז׳ עודף מעבר למכסה שנקבעה
              בחוזה, ותשלום על שחיקה חריגה של הרכב בהחזרה.
            </p>

            {/* --- Section 5 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              דוגמה מעשית
            </h2>
            <p>
              בואו נבחן דוגמה קונקרטית: רכב במחיר מחירון 170,000 ₪. נשווה בין
              קנייה לליסינג תפעולי לתקופה של 3 שנים.
            </p>
            <p>
              <strong>ליסינג:</strong> תשלום חודשי של 3,500 ₪ למשך 36 חודשים,
              הכולל ביטוח, טיפולים, רכב חלופי וטסט. העלות הכוללת: 3,500 × 36 =
              126,000 ₪, בתוספת דלק (שאינו כלול). בתום התקופה, מחזירים את הרכב
              ויוצאים נקיים.
            </p>
            <p>
              <strong>קנייה:</strong> מחיר רכישה 170,000 ₪. ביטוח מקיף לשלוש
              שנים — כ-18,000 ₪. טיפולים ואחזקה — כ-6,000 ₪. אגרות ורישוי —
              כ-3,000 ₪. ערך שארית אחרי 3 שנים — כ-100,000 ₪. סה&quot;כ עלות
              נטו: 170,000 + 18,000 + 6,000 + 3,000 - 100,000 = 97,000 ₪
              בתוספת דלק. אם לקחתם הלוואה, הוסיפו ריבית של 10,000-20,000 ₪.
            </p>
            <p>
              במקרה הזה, הקנייה זולה יותר — אבל רק אם יש לכם הון עצמי ואתם
              מוכנים לקחת את הסיכון שערך השארית יהיה נמוך מהצפוי. במחשבון CarCalc
              תוכלו להזין את הנתונים שלכם ולקבל תוצאה מדויקת, מותאמת אישית
              למצב שלכם.
            </p>

            {/* --- Section 6 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              טיפ חשוב
            </h2>
            <p>
              אל תשוו רק את התשלום החודשי! זו טעות נפוצה שגורמת לאנשים לקבל
              החלטות שגויות. מה שחשוב הוא <strong>העלות הכוללת על פני כל התקופה</strong>
              {" "} — כולל כל ההוצאות, מהראשונה ועד האחרונה.
            </p>
            <p>
              בנוסף, אל תשכחו את <strong>עלות ההזדמנות</strong> (opportunity
              cost). כסף שקשור ברכב — בין אם שילמתם 170,000 ₪ במזומן ובין אם
              אתם מחזירים הלוואה — הוא כסף שהיה יכול לעבוד בשבילכם. השקעה של
              170,000 ₪ בתשואה שנתית ממוצעת של 7% תניב כ-38,000 ₪ תוך 3 שנים.
              זה סכום שצריך לקחת בחשבון כשמשווים בין קנייה לליסינג.
            </p>
            <p>
              לכן, ההחלטה בין קנייה לליסינג היא אישית ותלויה במצב הכלכלי שלכם,
              בסוג הרכב, בתקופת השימוש המתוכננת, ובשאלה אם אתם עצמאים או
              שכירים. אין תשובה אחת נכונה — אבל יש חישוב שיכול לתת לכם תשובה
              מדויקת.
            </p>
          </>
        ) : (
          <>
            {/* --- Section 1 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              What Is the Difference Between Buying and Leasing?
            </h2>
            <p>
              When you buy a car, it becomes your property outright. You pay the
              full price — whether in cash, via bank transfer, or through an auto
              loan — and receive complete ownership. From the moment you drive it
              off the lot, the car begins to depreciate, but it stays with you
              until you decide to sell. You are responsible for insurance,
              maintenance, annual inspections, registration, and every other
              associated expense. The major upside: once the car is fully paid
              off, there are no more monthly payments, and the vehicle continues
              to serve you for as long as you keep it.
            </p>
            <p>
              With leasing, on the other hand, you never own the car. You make a
              fixed monthly payment to the leasing company and, in return, get to
              use a vehicle for a defined period — typically 3 to 4 years. At the
              end of the term, you return the car and can pick up a new one. In
              an operating lease, the monthly payment usually covers
              comprehensive and third-party insurance, routine maintenance, a
              replacement car in case of breakdowns, and annual inspections. From
              a cash-flow perspective, there is no need for a large down
              payment — just a predictable, fixed monthly cost.
            </p>

            {/* --- Section 2 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              When Does Buying Save You More?
            </h2>
            <p>
              Buying is usually the smarter choice when several conditions are
              met. First, when the car is relatively affordable — say, under
              150,000 ILS (roughly $40,000). The cheaper the car, the larger the
              gap between total buying cost and total leasing cost in favor of
              buying. Second, when you have enough cash on hand and do not need a
              loan — or at least only a small one. Interest on a car loan can add
              tens of thousands of shekels to the total cost over the life of the
              loan.
            </p>
            <p>
              Third, when you plan to keep the car long-term — 5 years or more.
              The steepest depreciation happens in the first two to three years.
              Once the car has already lost the bulk of its value, every
              additional year you drive it effectively lowers your average annual
              cost. Fourth, when the car holds a high residual value — brands
              like Toyota, Mazda, and Subaru are known for strong resale value
              retention.
            </p>
            <p>
              <strong>Example:</strong> A car worth 80,000 ILS purchased with
              cash will cost tens of thousands of shekels less than leasing the
              same vehicle. If you keep it for 6 years and sell it for 25,000
              ILS, the net total cost is roughly 55,000 ILS plus insurance and
              maintenance. Under a lease, even a modest car costs at least 2,000
              ILS per month — that is 144,000 ILS over 6 years.
            </p>

            {/* --- Section 3 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              When Does Leasing Save You More?
            </h2>
            <p>
              Leasing becomes the better deal in several specific situations.
              First, when the car is expensive — 300,000 ILS and above.
              Expensive cars shed enormous sums in depreciation, and with a
              lease, the risk of value loss shifts to the leasing company instead
              of you. Second, when you like switching cars every 3 years —
              leasing lets you move to a brand-new vehicle at the end of each
              term without the hassle of selling the old one.
            </p>
            <p>
              Third, and perhaps most significantly — for business owners and
              self-employed professionals. In Israel, up to 45% of leasing
              expenses can be deducted as a recognized business expense for tax
              purposes. For a self-employed individual in a high marginal tax
              bracket, the savings are enormous. A freelancer with a 47% marginal
              tax rate can save up to 45% of leasing costs as a deductible
              expense — which can amount to thousands of shekels per month in tax
              savings alone.
            </p>
            <p>
              Fourth, when you prefer a predictable, fixed monthly cost with no
              surprises. In an operating lease, almost everything is
              included: insurance, maintenance, a loaner car. If something
              breaks — it is the leasing company&apos;s problem, not yours. That
              peace of mind is worth real money, especially for those who do not
              want to deal with vehicle management.
            </p>

            {/* --- Section 4 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Hidden Costs You Should Know About
            </h2>
            <p>
              Whether you buy or lease, there are costs many people overlook that
              can tip the scales significantly. The biggest hidden cost of buying
              is <strong>depreciation</strong> — the car&apos;s loss of value over
              time. A new car loses an average of 20%-30% of its value in the
              first year alone, and up to 50%-60% within 4 years. A car you
              bought for 200,000 ILS could be worth only 80,000 ILS after 4
              years — a 120,000 ILS difference that has simply evaporated.
            </p>
            <p>
              Another cost is <strong>loan interest</strong>. If you finance the
              purchase through a loan, the interest can add 10%-20% to the total
              cost, depending on the terms. <strong>Insurance</strong> is a cost
              buyers often forget to factor in — comprehensive insurance for a
              new car can run 5,000-10,000 ILS per year, an amount that is
              already bundled into the monthly lease payment.{" "}
              <strong>Annual registration fees</strong>, safety inspections
              (mandatory from age 3), and{" "}
              <strong>routine maintenance</strong> that gets progressively more
              expensive as the car ages — tires, brakes, timing belts, and
              more — all add up.
            </p>
            <p>
              On the leasing side, hidden costs take a different form: early
              termination fees if you want to exit the contract before it ends,
              excess mileage charges beyond the allowance set in the agreement,
              and charges for abnormal wear and tear when you return the car.
            </p>

            {/* --- Section 5 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              A Practical Example
            </h2>
            <p>
              Let us look at a concrete example: a car with a list price of
              170,000 ILS. We will compare buying versus an operating lease over
              a 3-year period.
            </p>
            <p>
              <strong>Leasing:</strong> A monthly payment of 3,500 ILS for 36
              months, covering insurance, maintenance, a loaner car, and
              inspections. Total cost: 3,500 &times; 36 = 126,000 ILS, plus fuel
              (which is not included). At the end of the term, you return the car
              and walk away clean.
            </p>
            <p>
              <strong>Buying:</strong> Purchase price of 170,000 ILS.
              Comprehensive insurance over three years — roughly 18,000 ILS.
              Maintenance and upkeep — roughly 6,000 ILS. Fees and
              registration — roughly 3,000 ILS. Residual value after 3
              years — approximately 100,000 ILS. Net total cost: 170,000 +
              18,000 + 6,000 + 3,000 - 100,000 = 97,000 ILS, plus fuel. If you
              took out a loan, add 10,000-20,000 ILS in interest.
            </p>
            <p>
              In this case, buying is cheaper — but only if you have the cash up
              front and are willing to accept the risk that the residual value
              may be lower than expected. In the CarCalc calculator, you can
              enter your own numbers and get a precise result tailored to your
              personal situation.
            </p>

            {/* --- Section 6 --- */}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              An Important Tip
            </h2>
            <p>
              Do not just compare the monthly payment! This is a common mistake
              that leads people to make poor decisions. What truly matters is the{" "}
              <strong>total cost over the entire period</strong> — including
              every expense from start to finish.
            </p>
            <p>
              In addition, do not forget about{" "}
              <strong>opportunity cost</strong>. Money tied up in a car — whether
              you paid 170,000 ILS in cash or are repaying a loan — is money
              that could be working for you elsewhere. An investment of 170,000
              ILS at an average annual return of 7% would yield roughly 38,000
              ILS over 3 years. That is a sum you need to account for when
              comparing buying versus leasing.
            </p>
            <p>
              Ultimately, the decision between buying and leasing is personal. It
              depends on your financial situation, the type of car, your planned
              ownership period, and whether you are self-employed or salaried.
              There is no single right answer — but there is a calculation that
              can give you a precise one.
            </p>
          </>
        )}
      </div>

      {/* --- Callout Box --- */}
      <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-900 dark:bg-brand-950/30">
        <p className="font-semibold text-brand-800 dark:text-brand-300">
          {isHe
            ? "רוצים לבדוק מה משתלם יותר במקרה שלכם?"
            : "Want to check what saves more in your case?"}
        </p>
        <p className="mt-1 text-brand-700 dark:text-brand-400">
          <a href="/" className="underline hover:no-underline">
            {isHe
              ? "הזינו את הנתונים שלכם במחשבון CarCalc וגלו תוך דקות"
              : "Enter your details in CarCalc and find out in minutes"}
          </a>
        </p>
      </div>
    </main>
  );
}
