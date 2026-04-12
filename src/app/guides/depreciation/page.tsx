import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import GuideHero from "@/components/GuideHero";

export default async function DepreciationGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {isHe
          ? "איך מחשבים פחת רכב בישראל"
          : "How Car Depreciation Works in Israel"}
      </h1>

      <GuideHero illustration="depreciation" />

      <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
        {isHe ? (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              מה זה פחת רכב?
            </h2>
            <p>
              פחת רכב מתאר את הירידה בשווי הרכב לאורך זמן. ברגע שאתם נוסעים
              ברכב חדש מהסוכנות, ערכו יורד באופן מיידי — ולעיתים קרובות מדובר
              בירידה של אלפי שקלים כבר ביום הראשון. פחת הוא העלות הגדולה ביותר
              בבעלות על רכב, ובמקרים רבים הוא עולה על עלויות הדלק והביטוח
              ביחד. רוב הנהגים לא מודעים לכך, כי מדובר בעלות &quot;שקטה&quot;
              — אתם לא משלמים אותה מדי חודש, אבל היא מצטברת לסכומים
              משמעותיים כשאתם מוכרים את הרכב.
            </p>
            <p>
              הבנת הפחת חשובה במיוחד כשאתם משווים בין קנייה ללקיחת ליסינג,
              או כשאתם מתלבטים בין רכב חדש לרכב יד שנייה. ככל שתבינו טוב יותר
              כמה הרכב שלכם צפוי לאבד מערכו, כך תוכלו לקבל החלטות
              כלכליות חכמות יותר.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              שיעורי פחת לפי סוג דלק
            </h2>
            <p>
              בישראל נהוגים שיעורי פחת סטנדרטיים שמשתנים בהתאם לסוג המנוע
              ולגיל הרכב. ההבדל בין סוגי הדלק משמעותי ויכול להגיע לעשרות
              אלפי שקלים לאורך כמה שנים:
            </p>
            <p>
              <strong>רכב בנזין, דיזל או היברידי:</strong>
            </p>
            <ul>
              <li>שנה ראשונה: 15% פחת</li>
              <li>שנה שנייה: 12% פחת</li>
              <li>שנה שלישית ואילך: 10% פחת בכל שנה</li>
            </ul>
            <p>
              <strong>רכב חשמלי:</strong>
            </p>
            <ul>
              <li>שנה ראשונה: 25% פחת</li>
              <li>שנה שנייה: 20% פחת</li>
              <li>שנה שלישית ואילך: 15% פחת בכל שנה</li>
            </ul>
            <p>
              למה רכבים חשמליים מאבדים ערך מהר יותר? הסיבות העיקריות הן
              חוסר ודאות לגבי אורך חיי הסוללה, טכנולוגיה שמתפתחת במהירות
              (דגמים חדשים עם טווח נסיעה ארוך יותר יוצאים כל שנה), וירידה
              בערך הסוללה עם הזמן. קונים פוטנציאליים של רכב חשמלי יד שנייה
              חוששים מעלויות החלפת סוללה, שעלולות להגיע לעשרות אלפי שקלים,
              ולכן הם מוכנים לשלם פחות.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              דוגמה מספרית
            </h2>
            <p>
              נניח שקניתם רכב חדש במחיר 200,000 ש&quot;ח. הנה איך הפחת
              עובד בפועל:
            </p>
            <p>
              <strong>רכב בנזין (200,000 ש&quot;ח):</strong>
            </p>
            <ul>
              <li>אחרי שנה 1: 200,000 × (1 − 0.15) = 170,000 ש&quot;ח</li>
              <li>אחרי שנה 2: 170,000 × (1 − 0.12) = 149,600 ש&quot;ח</li>
              <li>אחרי שנה 3: 149,600 × (1 − 0.10) = 134,640 ש&quot;ח</li>
            </ul>
            <p>
              סה&quot;כ ירידת ערך: 65,360 ש&quot;ח — כלומר 33% מהמחיר
              המקורי נעלמו תוך שלוש שנים בלבד!
            </p>
            <p>
              <strong>רכב חשמלי (200,000 ש&quot;ח):</strong>
            </p>
            <ul>
              <li>אחרי שנה 1: 200,000 × (1 − 0.25) = 150,000 ש&quot;ח</li>
              <li>אחרי שנה 2: 150,000 × (1 − 0.20) = 120,000 ש&quot;ח</li>
              <li>אחרי שנה 3: 120,000 × (1 − 0.15) = 102,000 ש&quot;ח</li>
            </ul>
            <p>
              סה&quot;כ ירידת ערך: 98,000 ש&quot;ח — כמעט 49% מהמחיר
              המקורי! ההפרש בין רכב בנזין לחשמלי עומד על כ-32,640
              ש&quot;ח לאורך שלוש שנים, מה שיכול להטות את הכדאיות הכלכלית
              בצורה משמעותית.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              פחת ברכב יד שנייה
            </h2>
            <p>
              אחד היתרונות הגדולים של קניית רכב יד שנייה הוא ששיעור הפחת
              איטי יותר. הירידה הכי חדה בערך קורה בשנים הראשונות — אחרי שהיא
              כבר קרתה, הרכב ממשיך לרדת בערכו בקצב מתון יותר. למשל, רכב
              בנזין בן 3 שנים יפחת בשיעור של כ-10% בשנה (השיעור של שנה
              שלישית ואילך), לעומת 15% בשנה הראשונה של רכב חדש.
            </p>
            <p>
              מבחינה כלכלית, קניית רכב בן 2-3 שנים עם קילומטראז&#39; סביר היא
              לרוב ההחלטה החכמה ביותר: אתם נהנים מרכב שעדיין צעיר ובמצב
              טוב, אבל מישהו אחר כבר &quot;שילם&quot; את הפחת הכבד של השנים
              הראשונות. בנוסף, רכב יד שנייה בן מספר שנים כבר הוכיח את
              עצמו מבחינת אמינות, כך שאתם יודעים טוב יותר למה לצפות.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              איך להשתמש בפחת במחשבון CarCalc
            </h2>
            <p>
              במחשבון CarCalc, שיעורי הפחת מוגדרים כברירת מחדל לפי סוג
              הדלק, אבל אתם יכולים לשנות אותם בהתאם לרכב הספציפי שלכם.
              אם אתם יודעים שדגם מסוים שומר על ערכו טוב יותר מהממוצע (למשל
              טויוטה קורולה או מאזדה 3), הורידו את אחוזי הפחת. אם מדובר
              בדגם שידוע כמאבד ערך מהר (למשל דגמים יוקרתיים מסוימים),
              העלו את האחוזים בהתאם.
            </p>
            <p>
              במחשבון CarCalc ניתן לשנות את שיעורי הפחת בעמוד התוצאות —
              לחצו על &quot;התאמת פחת&quot; ושנו את האחוזים לפי הניסיון
              שלכם. התאמה זו מאפשרת לכם לקבל תמונה מדויקת יותר של העלות
              האמיתית של הרכב לאורך זמן, ולהשוות בצורה הוגנת יותר בין
              אפשרויות שונות.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              טיפים לשמירה על ערך הרכב
            </h2>
            <p>
              אמנם לא ניתן למנוע פחת לחלוטין, אבל יש כמה דברים שתוכלו
              לעשות כדי למזער אותו ולשמור על ערך הרכב גבוה ככל האפשר:
            </p>
            <ul>
              <li>
                <strong>תחזוקה שוטפת:</strong> הקפידו על טיפולים במועד לפי
                הוראות היצרן. רכב מטופל שווה יותר.
              </li>
              <li>
                <strong>קילומטראז&#39; נמוך:</strong> ככל שנוסעים פחות, הרכב
                שומר על ערכו טוב יותר. הממוצע בישראל הוא כ-15,000 ק&quot;מ
                בשנה — אם אתם מתחת לזה, יש לכם יתרון.
              </li>
              <li>
                <strong>שמרו על פנקס טיפולים:</strong> תיעוד מלא של כל
                הטיפולים מעלה את הביטחון של הקונה ואת שווי הרכב.
              </li>
              <li>
                <strong>הימנעו מתאונות:</strong> רכב שעבר תאונה, גם אם
                תוקן, מאבד ערך משמעותי. נהיגה זהירה משתלמת גם כלכלית.
              </li>
              <li>
                <strong>בחרו צבע פופולרי:</strong> צבעים כמו לבן, שחור
                ואפור נמכרים מהר יותר ושומרים על ערכם טוב יותר מצבעים
                חריגים.
              </li>
            </ul>

            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
              <p className="font-semibold text-blue-800 dark:text-blue-300">
                רוצים לדעת כמה הרכב שלכם יאבד מערכו?
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-400">
                <a href="/" className="underline hover:no-underline">
                  נסו את המחשבון — ניתן גם לשנות את שיעורי הפחת בהתאמה
                  אישית
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              What Is Car Depreciation?
            </h2>
            <p>
              Car depreciation describes how much a vehicle loses in value over
              time. The moment you drive a new car off the dealership lot, its
              value drops immediately — often by thousands of shekels on the
              very first day. Depreciation is the single biggest cost of car
              ownership, and in many cases it exceeds the combined costs of fuel
              and insurance. Most drivers are not aware of this because it is a
              &quot;silent&quot; cost — you do not pay it every month, but it
              accumulates to significant amounts when you eventually sell the
              car.
            </p>
            <p>
              Understanding depreciation is especially important when you are
              comparing buying versus leasing, or deciding between a new car
              and a used one. The better you understand how much your car is
              expected to lose in value, the smarter your financial decisions
              will be.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Depreciation Rates by Fuel Type
            </h2>
            <p>
              In Israel, standard depreciation rates vary based on the engine
              type and the age of the vehicle. The difference between fuel types
              is substantial and can amount to tens of thousands of shekels
              over just a few years:
            </p>
            <p>
              <strong>Gasoline, Diesel, or Hybrid vehicles:</strong>
            </p>
            <ul>
              <li>Year 1: 15% depreciation</li>
              <li>Year 2: 12% depreciation</li>
              <li>Year 3 and beyond: 10% depreciation per year</li>
            </ul>
            <p>
              <strong>Electric vehicles:</strong>
            </p>
            <ul>
              <li>Year 1: 25% depreciation</li>
              <li>Year 2: 20% depreciation</li>
              <li>Year 3 and beyond: 15% depreciation per year</li>
            </ul>
            <p>
              Why do electric cars depreciate faster? The main reasons are
              uncertainty about battery lifespan, rapidly evolving technology
              (newer models with longer range come out every year), and
              declining battery capacity over time. Potential buyers of a used
              electric car worry about battery replacement costs, which can
              reach tens of thousands of shekels, so they are willing to pay
              less.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              A Numerical Example
            </h2>
            <p>
              Let&apos;s say you bought a new car for 200,000 ILS. Here is how
              depreciation plays out in practice:
            </p>
            <p>
              <strong>Gasoline car (200,000 ILS):</strong>
            </p>
            <ul>
              <li>
                After year 1: 200,000 &times; (1 &minus; 0.15) = 170,000 ILS
              </li>
              <li>
                After year 2: 170,000 &times; (1 &minus; 0.12) = 149,600 ILS
              </li>
              <li>
                After year 3: 149,600 &times; (1 &minus; 0.10) = 134,640 ILS
              </li>
            </ul>
            <p>
              Total depreciation: 65,360 ILS — that is 33% of the original
              price gone in just three years!
            </p>
            <p>
              <strong>Electric car (200,000 ILS):</strong>
            </p>
            <ul>
              <li>
                After year 1: 200,000 &times; (1 &minus; 0.25) = 150,000 ILS
              </li>
              <li>
                After year 2: 150,000 &times; (1 &minus; 0.20) = 120,000 ILS
              </li>
              <li>
                After year 3: 120,000 &times; (1 &minus; 0.15) = 102,000 ILS
              </li>
            </ul>
            <p>
              Total depreciation: 98,000 ILS — nearly 49% of the original
              price! The gap between a gasoline and electric car comes to about
              32,640 ILS over three years, which can significantly tip the
              financial equation.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Depreciation on Used Cars
            </h2>
            <p>
              One of the biggest advantages of buying a used car is that the
              depreciation rate is slower. The sharpest drop in value happens
              in the first few years — once that has already occurred, the car
              continues to lose value at a more moderate pace. For example, a
              3-year-old gasoline car depreciates at about 10% per year (the
              year-3-and-beyond rate), compared to 15% in the first year of a
              new car.
            </p>
            <p>
              From a financial perspective, buying a car that is 2 to 3 years
              old with reasonable mileage is often the smartest decision: you
              enjoy a car that is still young and in good condition, but
              someone else has already &quot;paid&quot; the heavy depreciation
              of the early years. Additionally, a used car that is a few years
              old has already proven itself in terms of reliability, so you
              have a better idea of what to expect.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              How to Use Depreciation in the CarCalc Calculator
            </h2>
            <p>
              In the CarCalc calculator, depreciation rates are set by default
              based on fuel type, but you can adjust them to match your
              specific car. If you know that a particular model holds its value
              better than average (for example, Toyota Corolla or Mazda 3),
              lower the depreciation percentages. If the model is known to lose
              value quickly (for instance, certain luxury brands), increase
              the percentages accordingly.
            </p>
            <p>
              In CarCalc you can change the depreciation rates on the results
              page — click on &quot;Adjust Depreciation&quot; and modify the
              percentages based on your experience. This customization lets you
              get a more accurate picture of the true cost of the car over
              time, and compare different options more fairly.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Tips for Preserving Your Car&apos;s Value
            </h2>
            <p>
              While you cannot prevent depreciation entirely, there are several
              things you can do to minimize it and keep your car&apos;s value
              as high as possible:
            </p>
            <ul>
              <li>
                <strong>Regular maintenance:</strong> Follow the
                manufacturer&apos;s service schedule. A well-maintained car is
                worth more.
              </li>
              <li>
                <strong>Low mileage:</strong> The less you drive, the better
                the car retains its value. The average in Israel is about
                15,000 km per year — if you are below that, you have an
                advantage.
              </li>
              <li>
                <strong>Keep service records:</strong> Complete documentation
                of all maintenance boosts buyer confidence and increases the
                car&apos;s worth.
              </li>
              <li>
                <strong>Avoid accidents:</strong> A car that has been in an
                accident, even if repaired, loses significant value. Careful
                driving pays off financially too.
              </li>
              <li>
                <strong>Choose a popular color:</strong> Colors like white,
                black, and gray sell faster and hold their value better than
                unusual colors.
              </li>
            </ul>

            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
              <p className="font-semibold text-blue-800 dark:text-blue-300">
                Want to know how much your car will lose in value?
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-400">
                <a href="/" className="underline hover:no-underline">
                  Try the calculator — you can also customize depreciation
                  rates
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
