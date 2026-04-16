import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import GuideHero from "@/components/GuideHero";

export default async function CarLoansGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {isHe ? "מדריך הלוואת רכב בישראל" : "Car Loan Guide for Israel"}
      </h1>

      <GuideHero illustration="car-loans" />

      <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
        {isHe ? (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              מתי צריכים הלוואה לרכב?
            </h2>
            <p>
              רכישת רכב היא אחת ההוצאות הגדולות ביותר שמשפחה ישראלית מתמודדת
              איתה. לא תמיד יש מספיק הון עצמי לכסות את מלוא מחיר הרכב, ובמקרים
              כאלה הלוואה היא הפתרון הנפוץ. ההלוואה נדרשת כאשר מחיר הרכב עולה על
              ההון הזמין שלכם — כלומר, הסכום שיש לכם במזומן בתוספת שווי הרכב הישן
              שלכם (אם אתם מוכרים או מחליפים אותו).
            </p>
            <p>
              לדוגמה: נניח שמחיר הרכב החדש שאתם רוצים הוא 200,000 ש&quot;ח. יש
              לכם 50,000 ש&quot;ח במזומן, ואת הרכב הישן שלכם אתם יכולים למכור
              ב-60,000 ש&quot;ח. סה&quot;כ יש לכם 110,000 ש&quot;ח. המשמעות היא
              שתצטרכו הלוואה בגובה 90,000 ש&quot;ח כדי להשלים את הפער. גובה
              ההלוואה הזה הוא הבסיס לכל חישובי הריבית והתשלומים שנסקור בהמשך
              המדריך.
            </p>
            <p>
              חשוב להבין: ככל שההלוואה גדולה יותר, כך סך הריבית שתשלמו תהיה
              גבוהה יותר. לכן, מומלץ לבחון כמה הון עצמי אתם יכולים לגייס לפני
              שניגשים ללקיחת הלוואה.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              סוגי הלוואות לרכב
            </h2>
            <p>
              בישראל קיימים מספר מקורות מימון לרכישת רכב, ולכל אחד מהם יתרונות
              וחסרונות. חשוב להכיר את האפשרויות כדי לבחור את ההלוואה המשתלמת
              ביותר עבורכם.
            </p>
            <p>
              <strong>הלוואה בנקאית:</strong> ההלוואה הנפוצה ביותר. הבנקים
              בישראל מציעים הלוואות לרכב בריבית שנעה בדרך כלל בין 4% ל-6%. הריבית
              המדויקת תלויה בפרופיל הלקוח, היסטוריית האשראי, ומשך ההלוואה.
              היתרון הוא שקיפות יחסית ואפשרות להשוואה בין בנקים. החיסרון הוא
              שלעיתים הריבית גבוהה מהחלופות.
            </p>
            <p>
              <strong>מימון יצרן:</strong> חלק מיבואני הרכב בישראל מציעים מימון
              ישירות דרך חברת הליסינג או המימון שלהם. לעיתים ניתן למצוא מבצעי
              מימון ב-0% ריבית, במיוחד בדגמים שהיצרן רוצה לקדם. שימו לב שלפעמים
              ריבית 0% מגיעה עם מחיר רכב גבוה יותר, כך שכדאי לבדוק את העלות
              הכוללת.
            </p>
            <p>
              <strong>מימון פרטי:</strong> הלוואות מגופים חוץ-בנקאיים כמו חברות
              אשראי או גופים פיננסיים פרטיים. הריבית עשויה להיות גבוהה יותר, אך
              לפעמים תנאי ההלוואה גמישים יותר. בישראל, תקופת ההלוואה הנפוצה לרכב
              נעה בין 3 ל-7 שנים, כאשר 5 שנים הוא המשך הנפוץ ביותר.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              איך מחשבים ריבית על הלוואה
            </h2>
            <p>
              חישוב ההחזר החודשי מתבצע לפי נוסחת לוח סילוקין סטנדרטית (שיטת
              שפיצר). הנוסחה היא:
            </p>
            <p className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg text-center" dir="ltr">
              תשלום חודשי = P × r(1+r)<sup>n</sup> / ((1+r)<sup>n</sup> - 1)
            </p>
            <p>
              כאשר P הוא סכום ההלוואה, r היא הריבית החודשית (ריבית שנתית חלקי
              12), ו-n הוא מספר התשלומים.
            </p>
            <p>
              דוגמה מפורטת: הלוואה של 90,000 ש&quot;ח בריבית שנתית של 4.5%
              לתקופה של 5 שנים (60 תשלומים). הריבית החודשית היא 4.5% / 12 =
              0.375%. לפי הנוסחה, התשלום החודשי יוצא כ-1,679 ש&quot;ח. על פני 60
              חודשים תשלמו סה&quot;כ כ-100,740 ש&quot;ח, כלומר סך הריבית שתשלמו
              היא כ-10,740 ש&quot;ח. העלות הכוללת של הרכב תהיה 200,000 + 10,740 =
              210,740 ש&quot;ח.
            </p>
            <p>
              שימו לב שגם שינוי קטן בריבית יכול להשפיע משמעותית על סך העלות.
              לדוגמה, הפרש של 1% בריבית על הלוואה של 90,000 ש&quot;ח לחמש שנים
              יכול לחסוך או לעלות לכם כמה אלפי שקלים.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              עמלת פתיחת תיק
            </h2>
            <p>
              בנוסף לריבית, רוב הגופים המלווים גובים עמלת פתיחת תיק — תשלום
              חד-פעמי שנגבה בתחילת ההלוואה. עמלה זו נעה בדרך כלל בין 0.5% ל-1%
              מסכום ההלוואה. בדוגמה שלנו, על הלוואה של 90,000 ש&quot;ח, עמלת
              פתיחת תיק תעלה בין 450 ל-900 ש&quot;ח.
            </p>
            <p>
              עמלה זו מתווספת לעלות הכוללת של ההלוואה ולכן חשוב להביא אותה בחשבון
              בהשוואה בין הצעות. לפעמים ניתן לנהל משא ומתן על גובה העמלה, במיוחד
              אם יש לכם הצעה מתחרה מגוף אחר. חלק מהבנקים מוותרים על העמלה
              ללקוחות קיימים או במסגרת מבצעים.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              טיפים לחיסכון בהלוואה
            </h2>
            <p>
              כדי לחסוך כסף על הלוואת הרכב שלכם, הנה מספר טיפים מעשיים שכדאי
              ליישם:
            </p>
            <ul>
              <li>
                <strong>השוו בין בנקים וגופי מימון:</strong> אל תסתפקו בהצעה
                הראשונה. קבלו הצעות מלפחות 2-3 גופים שונים והשוו את הריבית,
                העמלות, והתנאים.
              </li>
              <li>
                <strong>נהלו משא ומתן על הריבית:</strong> ברגע שיש לכם הצעה
                מתחרה, אתם יכולים להשתמש בה כקלף מיקוח. בנקים רבים מוכנים להוריד
                את הריבית כדי לזכות בעסקה.
              </li>
              <li>
                <strong>תקופה קצרה יותר = פחות ריבית:</strong> ככל שתקופת ההלוואה
                קצרה יותר, כך סך הריבית שתשלמו נמוך יותר. עם זאת, התשלום החודשי
                יהיה גבוה יותר — ודאו שהתקציב שלכם מאפשר זאת.
              </li>
              <li>
                <strong>הגדילו את ההון העצמי:</strong> ככל שתשלמו יותר מכסכם מראש,
                כך ההלוואה תהיה קטנה יותר והריבית הכוללת תקטן בהתאם. שקלו לחסוך
                קצת יותר לפני הרכישה.
              </li>
              <li>
                <strong>היזהרו מעמלות פירעון מוקדם:</strong> חלק מההלוואות כוללות
                קנס על פירעון מוקדם. בדקו את התנאים מראש, כי אם תרצו לסגור את
                ההלוואה לפני הזמן, העמלה עלולה לבטל חלק מהחיסכון.
              </li>
              <li>
                <strong>בדקו אם הריבית שווה את זה:</strong> לפעמים כדאי לשקול האם
                עדיף לקחת הלוואה בריבית נמוכה ולהשקיע את המזומן בהשקעה שמניבה
                תשואה גבוהה יותר, או להיפך — לשלם מזומן ולחסוך את הריבית. זה
                תלוי בשיעור התשואה שאתם מצפים להשיג.
              </li>
            </ul>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              במחשבון CarCalc
            </h2>
            <p>
              כשתזינו את פרטי הרכב והמצב הפיננסי שלכם, המחשבון יחשב אוטומטית את
              גובה ההלוואה הנדרשת, התשלום החודשי, וסך הריבית שתשלמו. תוכלו לשחק
              עם הפרמטרים ולראות איך שינוי בריבית או בתקופה משפיע על העלות
              הכוללת.
            </p>

            <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-900 dark:bg-brand-950/30">
              <p className="font-semibold text-brand-800 dark:text-brand-300">
                רוצים לדעת כמה תשלמו על הלוואת רכב?
              </p>
              <p className="mt-1 text-brand-700 dark:text-brand-400">
                <a href="/" className="underline hover:no-underline">
                  הזינו את פרטי ההלוואה במחשבון וקבלו חישוב מדויק
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              When Do You Need a Car Loan?
            </h2>
            <p>
              Purchasing a car is one of the largest expenses an Israeli household
              faces. It is not always possible to cover the full price of the car
              with available capital, and in such cases, a loan is the most common
              solution. A car loan becomes necessary when the price of the vehicle
              exceeds your available funds — that is, the amount of cash you have
              on hand plus the trade-in value of your existing car (if you are
              selling or trading it in).
            </p>
            <p>
              For example: suppose the new car you want costs 200,000 ILS. You
              have 50,000 ILS in cash, and you can sell your old car for 60,000
              ILS. That gives you a total of 110,000 ILS in available capital. This
              means you will need a loan of 90,000 ILS to bridge the gap. This
              loan amount is the basis for all the interest and payment
              calculations we will cover in the rest of this guide.
            </p>
            <p>
              It is important to understand: the larger the loan, the more
              interest you will pay overall. For this reason, it is advisable to
              evaluate how much equity you can put together before applying for a
              loan.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Types of Car Loans
            </h2>
            <p>
              In Israel, there are several sources of financing for purchasing a
              car, each with its own advantages and disadvantages. It is important
              to understand the options so you can choose the most cost-effective
              loan for your situation.
            </p>
            <p>
              <strong>Bank loans:</strong> The most common type of car loan.
              Israeli banks typically offer car loans at interest rates ranging
              from 4% to 6%. The exact rate depends on the borrower&apos;s
              profile, credit history, and loan duration. The advantage is
              relative transparency and the ability to compare offers across
              banks. The downside is that the interest rate can sometimes be
              higher than alternative financing options.
            </p>
            <p>
              <strong>Manufacturer financing:</strong> Some car importers in
              Israel offer financing directly through their leasing or finance
              subsidiaries. You can sometimes find 0% interest promotions,
              especially on models the manufacturer wants to push. Keep in mind
              that 0% interest sometimes comes with a higher vehicle price, so it
              is worth checking the total cost of ownership.
            </p>
            <p>
              <strong>Private financing:</strong> Loans from non-bank entities
              such as credit companies or private financial institutions. The
              interest rate may be higher, but the loan terms are sometimes more
              flexible. In Israel, the common loan term for a car ranges from 3 to
              7 years, with 5 years being the most popular duration.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              How to Calculate Loan Interest
            </h2>
            <p>
              The monthly repayment is calculated using a standard amortization
              formula (known in Israel as the &quot;Spitzer&quot; method). The
              formula is:
            </p>
            <p className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg text-center">
              Monthly Payment = P &times; r(1+r)<sup>n</sup> / ((1+r)<sup>n</sup>{" "}
              - 1)
            </p>
            <p>
              Where P is the loan principal, r is the monthly interest rate
              (annual rate divided by 12), and n is the total number of payments.
            </p>
            <p>
              Detailed example: a loan of 90,000 ILS at an annual interest rate of
              4.5% over a period of 5 years (60 payments). The monthly interest
              rate is 4.5% / 12 = 0.375%. Using the formula, the monthly payment
              comes out to approximately 1,679 ILS. Over the 60-month term, you
              will pay a total of approximately 100,740 ILS, meaning the total
              interest paid is about 10,740 ILS. The total cost of the car becomes
              200,000 + 10,740 = 210,740 ILS.
            </p>
            <p>
              Note that even a small change in the interest rate can significantly
              affect the total cost. For instance, a 1% difference in interest on
              a 90,000 ILS loan over five years can save or cost you several
              thousand shekels.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Origination Fee
            </h2>
            <p>
              In addition to interest, most lenders charge an origination fee — a
              one-time payment collected at the beginning of the loan. This fee
              typically ranges from 0.5% to 1% of the loan amount. In our example,
              on a 90,000 ILS loan, the origination fee would be between 450 and
              900 ILS.
            </p>
            <p>
              This fee adds to the total cost of the loan and should be factored
              into any comparison between offers. It is sometimes possible to
              negotiate the fee down, especially if you have a competing offer from
              another lender. Some banks waive the fee for existing customers or as
              part of promotional campaigns.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Tips for Saving on Your Car Loan
            </h2>
            <p>
              To save money on your car loan, here are some practical tips to
              follow:
            </p>
            <ul>
              <li>
                <strong>Compare across banks and lenders:</strong> Do not settle
                for the first offer you receive. Get quotes from at least 2-3
                different institutions and compare interest rates, fees, and
                terms.
              </li>
              <li>
                <strong>Negotiate the interest rate:</strong> Once you have a
                competing offer, you can use it as leverage. Many banks are
                willing to lower their rate to win the deal.
              </li>
              <li>
                <strong>Shorter term = less interest:</strong> The shorter the
                loan period, the less total interest you will pay. However, the
                monthly payment will be higher — make sure your budget can handle
                it.
              </li>
              <li>
                <strong>Make a larger down payment:</strong> The more you pay
                upfront, the smaller the loan and the less interest you pay
                overall. Consider saving a bit more before making the purchase.
              </li>
              <li>
                <strong>Watch out for early repayment fees:</strong> Some loans
                include a penalty for early repayment. Check the terms in advance,
                because if you want to close the loan early, the fee could offset
                part of your savings.
              </li>
              <li>
                <strong>Evaluate whether the interest is worth it:</strong>{" "}
                Sometimes it makes sense to consider whether you are better off
                taking a low-interest loan and investing your cash in something
                that yields a higher return, or conversely, paying in cash and
                saving on the interest entirely. This depends on the rate of
                return you expect to achieve.
              </li>
            </ul>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              In the CarCalc Calculator
            </h2>
            <p>
              When you enter your vehicle details and financial situation, the
              calculator will automatically compute the required loan amount, the
              monthly payment, and the total interest you will pay. You can
              experiment with the parameters and see how changing the interest
              rate or the loan term affects the overall cost.
            </p>

            <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-900 dark:bg-brand-950/30">
              <p className="font-semibold text-brand-800 dark:text-brand-300">
                Want to know how much you&apos;ll pay on a car loan?
              </p>
              <p className="mt-1 text-brand-700 dark:text-brand-400">
                <a href="/" className="underline hover:no-underline">
                  Enter your loan details in the calculator for an exact
                  calculation
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
