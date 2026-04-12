import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import GuideHero from "@/components/GuideHero";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {isHe ? "אודות CarCalc" : "About CarCalc"}
      </h1>

      <GuideHero illustration="about" />

      <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
        {isHe ? (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">מה זה CarCalc?</h2>
            <p>
              CarCalc הוא כלי מקוון חינמי שנועד לעזור לישראלים להשוות את העלות האמיתית של רכישת רכב
              מול ליסינג תפעולי. המחשבון לוקח בחשבון את כל הגורמים המשפיעים על העלות הכוללת — פחת,
              ביטוח, תחזוקה, דלק, הלוואות, הטבות מס ועוד — כדי לתת לכם תמונה מלאה ומדויקת של
              העלויות לאורך תקופת השימוש ברכב. בשונה ממחשבונים אחרים שמתמקדים רק בתשלום החודשי,
              CarCalc מציג את כל העלויות הנסתרות ומאפשר לכם לקבל החלטה מושכלת בהתבסס על הנתונים
              האישיים שלכם.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">למה יצרנו את CarCalc?</h2>
            <p>
              שוק הרכב בישראל מורכב במיוחד. רוב האנשים כשהם מחליטים בין קנייה לליסינג משווים רק
              את התשלום החודשי — אבל העלות האמיתית כוללת הרבה גורמים נסתרים שלא נלקחים בחשבון.
              כמה באמת שווה הפחת על הרכב שלכם? מה עלות הריבית המצטברת על ההלוואה? כמה תשלמו
              על ביטוח וטסט לאורך השנים? ומה לגבי עלות ההזדמנות של ההון העצמי שהשקעתם?
            </p>
            <p>
              יצרנו את CarCalc כדי לתת תמונה שלמה ושקופה של כל העלויות, כך שתוכלו לקבל החלטה
              פיננסית מושכלת. אנחנו מאמינים שכל אדם זכאי לגישה חופשית לכלים פיננסיים איכותיים,
              ולכן CarCalc הוא לגמרי חינמי ופתוח לשימוש ללא הגבלה.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">איך המחשבון עובד?</h2>
            <p>
              המחשבון עובד בחמישה שלבים פשוטים שמובילים אתכם מהזנת הנתונים ועד לקבלת תוצאות
              מפורטות:
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li><strong>פרטים אישיים</strong> — סוג המשתמש (פרטי או עסקי), קילומטראז&#39; שנתי משוער ותקופת החזקה רצויה.</li>
              <li><strong>מימון</strong> — פרטי ההלוואה כולל סכום, ריבית, תקופה ועמלת פתיחת תיק.</li>
              <li><strong>הצעת ליסינג</strong> — התשלום החודשי, מקדמה, מגבלת קילומטרים ותנאי ההחזרה.</li>
              <li><strong>פרטי רכישה</strong> — מחיר הרכב, סוג דלק, שנת ייצור ועלויות נלוות.</li>
              <li><strong>תוצאות</strong> — השוואה מלאה בין שתי האפשרויות עם פירוט כל רכיבי העלות.</li>
            </ol>
            <p>
              המחשבון מחשב פחת לפי סוג דלק (בנזין, דיזל, היברידי, חשמלי), לוח סילוקין מלא
              של ההלוואה, עלויות ביטוח (חובה ומקיף), תחזוקה שוטפת, רישוי וטסט, עלויות דלק
              לפי הקילומטראז&#39; ואפילו עלות הזדמנות אלטרנטיבית על ההון העצמי.
              הזינו את הנתונים שלכם במחשבון ותקבלו פירוט מלא של כל העלויות.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">מה אנחנו מחשבים?</h2>
            <p>
              המחשבון שלנו כולל חישוב מקיף של כל רכיבי העלות הבאים:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>פחת</strong> — חישוב ירידת ערך הרכב לפי סוג הדלק (בנזין, דיזל, היברידי, חשמלי) וגיל הרכב, על בסיס נתוני שוק עדכניים.</li>
              <li><strong>ריבית ועמלות הלוואה</strong> — חישוב הריבית המצטברת לאורך תקופת ההלוואה ועמלת פתיחת תיק.</li>
              <li><strong>ביטוח חובה ומקיף</strong> — הערכת עלויות ביטוח שנתיות על בסיס שווי הרכב וגיל הנהג.</li>
              <li><strong>אגרת רישוי וטסט</strong> — עלויות שנתיות קבועות של רישום הרכב ובדיקת טסט תקופתית.</li>
              <li><strong>עלויות דלק</strong> — חישוב הוצאות הדלק השנתיות על בסיס הקילומטראז&#39; המשוער וצריכת הדלק של הרכב.</li>
              <li><strong>תחזוקה שוטפת</strong> — טיפולים תקופתיים, החלפת צמיגים ותיקונים שוטפים.</li>
              <li><strong>הטבות מס לעסקים</strong> — הכרה של 45% בהוצאות רכב לעצמאים ובעלי עסקים, כולל חישוב החיסכון הנובע מכך.</li>
              <li><strong>תשואה על הון פנוי</strong> — חישוב עלות ההזדמנות של ההון העצמי שמושקע ברכב במקום בהשקעות חלופיות.</li>
            </ul>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">חשוב לדעת</h2>
            <p>
              החישובים המוצגים ב-CarCalc הם הערכות המבוססות על ממוצעים בשוק הישראלי ואינם מהווים
              ייעוץ פיננסי או המלצה לפעולה. התוצאות תלויות בנתונים שהזנתם ובהנחות שהמחשבון
              משתמש בהן, ועשויות להשתנות בהתאם לתנאי השוק בפועל. אנו ממליצים בחום להתייעץ
              עם יועץ פיננסי מוסמך לפני קבלת החלטות כספיות משמעותיות.
            </p>
            <p>
              כל הנתונים שתזינו במחשבון מעובדים בצד השרת ואינם נשמרים במאגרי מידע. אנו מכבדים
              את פרטיותכם ולא אוספים מידע אישי מזהה.
            </p>

            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
              <p className="font-semibold text-blue-800 dark:text-blue-300">
                רוצים לבדוק מה משתלם יותר?
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-400">
                <a href="/" className="underline hover:no-underline">
                  נסו את המחשבון שלנו — זה חינם ומהיר
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">What is CarCalc?</h2>
            <p>
              CarCalc is a free online tool designed to help Israelis compare the true cost of buying a car
              versus operational leasing. The calculator takes into account all the factors that affect the
              total cost — depreciation, insurance, maintenance, fuel, loans, tax benefits, and more — to
              give you a complete and accurate picture of the expenses over the entire period of car
              ownership. Unlike other calculators that focus only on the monthly payment, CarCalc reveals
              all the hidden costs and allows you to make an informed decision based on your personal
              financial data.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">Why did we create CarCalc?</h2>
            <p>
              The car market in Israel is particularly complex. Most people, when deciding between buying
              and leasing, compare only the monthly payment — but the real cost includes many hidden
              factors that are not taken into account. How much is the depreciation on your car really
              worth? What is the cumulative interest cost on your loan? How much will you pay for
              insurance and registration over the years? And what about the opportunity cost of the
              equity you invested?
            </p>
            <p>
              We created CarCalc to provide a complete and transparent picture of all costs, so you can
              make a well-informed financial decision. We believe that everyone deserves free access to
              quality financial tools, which is why CarCalc is completely free and open for unlimited use.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">How does the calculator work?</h2>
            <p>
              The calculator works in five simple steps that guide you from entering your data to
              receiving detailed results:
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li><strong>Personal details</strong> — user type (private or business), estimated annual mileage, and desired ownership period.</li>
              <li><strong>Financing</strong> — loan details including amount, interest rate, term, and origination fee.</li>
              <li><strong>Leasing quote</strong> — monthly payment, down payment, mileage limit, and return conditions.</li>
              <li><strong>Purchase details</strong> — car price, fuel type, model year, and associated costs.</li>
              <li><strong>Results</strong> — a full comparison between the two options with a detailed breakdown of every cost component.</li>
            </ol>
            <p>
              The calculator computes depreciation by fuel type (gasoline, diesel, hybrid, electric),
              full loan amortization schedules, insurance costs (mandatory and comprehensive),
              routine maintenance, registration and test fees, fuel costs based on your estimated
              mileage, and even the alternative opportunity cost on your invested equity.
              Enter your data into the calculator and receive a full breakdown of all costs.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">What do we calculate?</h2>
            <p>
              Our calculator includes a comprehensive computation of all the following cost components:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Depreciation</strong> — calculation of the car&apos;s value decline based on fuel type (gasoline, diesel, hybrid, electric) and car age, using up-to-date market data.</li>
              <li><strong>Loan interest and origination fees</strong> — total accumulated interest over the loan period and the origination fee charged by the lender.</li>
              <li><strong>Mandatory and comprehensive insurance</strong> — estimated annual insurance costs based on car value and driver age.</li>
              <li><strong>Registration and test fees</strong> — fixed annual costs for vehicle registration and periodic roadworthiness testing.</li>
              <li><strong>Fuel costs</strong> — annual fuel expenses calculated from your estimated mileage and the car&apos;s fuel consumption.</li>
              <li><strong>Maintenance</strong> — periodic services, tire replacements, and routine repairs.</li>
              <li><strong>Tax benefits for businesses</strong> — 45% recognition of vehicle expenses for self-employed and business owners, including calculation of the resulting tax savings.</li>
              <li><strong>Investment returns on free capital</strong> — opportunity cost calculation of the equity invested in the car versus alternative investments.</li>
            </ul>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">Important to know</h2>
            <p>
              The calculations presented by CarCalc are estimates based on Israeli market averages and
              do not constitute financial advice or a recommendation to act. The results depend on the
              data you entered and the assumptions the calculator uses, and may vary according to actual
              market conditions. We strongly recommend consulting with a qualified financial advisor
              before making significant financial decisions.
            </p>
            <p>
              All data you enter in the calculator is processed server-side and is not stored in any
              database. We respect your privacy and do not collect personally identifiable information.
            </p>

            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
              <p className="font-semibold text-blue-800 dark:text-blue-300">
                Want to find out what saves you more?
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-400">
                <a href="/" className="underline hover:no-underline">
                  Try our calculator — it&apos;s free and fast
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
