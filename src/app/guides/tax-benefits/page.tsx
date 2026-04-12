import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import GuideHero from "@/components/GuideHero";

export default async function TaxBenefitsGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {isHe
          ? "הטבות מס לעצמאים ברכב"
          : "Tax Benefits for Self-Employed — Car Expenses in Israel"}
      </h1>

      <GuideHero illustration="tax-benefits" />

      <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
        {isHe ? (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              מי זכאי להטבות מס על רכב?
            </h2>
            <p>
              בעלי עסקים עצמאיים בישראל הרשומים כעוסק מורשה זכאים להכיר בחלק
              מהוצאות הרכב שלהם כהוצאה עסקית מוכרת לצורכי מס. בהתאם לתקנות מס
              הכנסה, ניתן לנכות 45% מהוצאות הרכב מההכנסה החייבת במס. הטבה זו
              חלה הן על רכב שנרכש והן על רכב בליסינג, ומהווה חיסכון משמעותי
              שיכול להגיע לעשרות אלפי שקלים לאורך חיי הרכב. חשוב לדעת שההטבה
              חלה על כל סוגי הרכבים — פרטיים ומסחריים — כל עוד הרכב משמש לצורכי
              העסק, גם אם רק באופן חלקי. עוסק פטור, לעומת זאת, אינו זכאי
              להטבה זו באותו אופן, ולכן חשוב לוודא את הסטטוס העסקי שלכם לפני
              שמתחילים לתכנן.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              מה ניתן להכיר כהוצאה?
            </h2>
            <p>
              רשימת ההוצאות שניתן להכיר בהן כהוצאה עסקית על הרכב כוללת מגוון
              רחב של עלויות שוטפות. ראשית, תשלומי ליסינג חודשיים — עבור מי
              שבוחר בליסינג תפעולי, כל התשלום החודשי נכלל בבסיס החישוב. כמו כן,
              הוצאות דלק מוכרות כהוצאה, וכך גם הוצאות תחזוקה ושירות — טיפולים
              תקופתיים, תיקונים, החלפת צמיגים וכדומה. ביטוח חובה וביטוח מקיף
              נכללים אף הם ברשימת ההוצאות המוכרות, לצד אגרת רישוי שנתית
              ותשלומי חניה. עבור מי שרכש רכב באמצעות הלוואה, גם הריבית על
              ההלוואה מוכרת כהוצאה. שיעור ההכרה של 45% חל על כל ההוצאות הללו
              באופן אחיד. כלומר, אם סך ההוצאות השנתיות שלכם על הרכב הוא 60,000
              שקלים, תוכלו להכיר ב-27,000 שקלים כהוצאה עסקית מוכרת.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              איך מחשבים את ההטבה?
            </h2>
            <p>
              חישוב הטבת המס מבוסס על נוסחה פשוטה: סך ההוצאות המוכרות כפול שיעור
              ההכרה (45%) כפול שיעור המס השולי שלכם. התוצאה היא החיסכון בפועל
              במס שתשלמו. לדוגמה, נניח שהוצאות הרכב השנתיות שלכם מסתכמות
              ב-60,000 שקלים, ושיעור המס השולי שלכם עומד על 47%. החישוב ייראה
              כך: 60,000 &times; 0.45 &times; 0.47 = 12,690 שקלים חיסכון במס
              בשנה! על פני תקופה של 3 שנים, מדובר בחיסכון מצטבר של 38,070
              שקלים. זהו סכום משמעותי שיכול להטות את הכף בהחלטה בין קנייה לליסינג,
              ולכן חשוב מאוד להכניס אותו לחישוב הכולל. ככל ששיעור המס השולי
              שלכם גבוה יותר, כך הטבת המס גדולה יותר, מה שהופך את התכנון המיסויי
              לחלק בלתי נפרד מההחלטה הפיננסית.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              מדרגות מס שולי בישראל
            </h2>
            <p>
              שיטת המס בישראל בנויה על מדרגות מס פרוגרסיביות, כלומר ככל שההכנסה
              שלכם גבוהה יותר, כך שיעור המס על החלק העליון של ההכנסה גבוה יותר.
              מדרגות המס נעות בטווח של כ-10% עד 50% בקירוב. שיעור המס השולי הוא
              אחוז המס שחל על השקל האחרון שהרווחתם — כלומר, המדרגה הגבוהה ביותר
              שאליה הגעתם. לדוגמה, עצמאי עם הכנסה שנתית חייבת של 400,000 שקלים
              ייכנס למדרגת מס של 47%, בעוד שעצמאי עם הכנסה של 200,000 שקלים
              ייכנס למדרגה נמוכה יותר. המשמעות היא שבעלי הכנסות גבוהות נהנים
              מהטבת מס גדולה יותר על הוצאות הרכב, מכיוון שכל שקל של הוצאה מוכרת
              חוסך להם יותר מס. לכן, ככל שההכנסה שלכם גבוהה יותר, כך הטבת המס
              על רכב משמעותית יותר.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              ליסינג vs קנייה — מה יותר משתלם לעצמאי?
            </h2>
            <p>
              עבור בעלי עסקים, ליסינג תפעולי מציע לעיתים קרובות יתרון מיסויי
              משמעותי לעומת קנייה. הסיבה המרכזית היא שבליסינג, כל התשלום החודשי
              נחשב כהוצאה שוטפת המוכרת לצורכי מס. לעומת זאת, כשרוכשים רכב, רק
              ההוצאות השוטפות (דלק, ביטוח, תחזוקה, ריבית על הלוואה) מוכרות
              כהוצאה — עלות הרכב עצמו אינה ניתנת לניכוי כהוצאה שוטפת. בליסינג,
              התשלום החודשי כבר כולל את &quot;עלות הרכב&quot; בתוכו, ולכן בסיס
              ההוצאה המוכרת גדול יותר. עבור עצמאים במדרגות מס גבוהות, ההפרש יכול
              להיות דרמטי — אלפי שקלים בשנה. זו הסיבה שליסינג הפך לאופציה
              הפופולרית בקרב עצמאים ובעלי חברות בישראל. עם זאת, חשוב לזכור
              שהשיקול המיסויי הוא רק חלק מהתמונה — יש להביא בחשבון גם את עלות
              הליסינג הכוללת, תנאי ההחזרה, הגבלת קילומטראז&apos; ועוד.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              במחשבון CarCalc
            </h2>
            <p>
              סמנו &quot;עוסק מורשה&quot; בשלב הפרטים האישיים והזינו את שיעור
              המס השולי שלכם. המחשבון יחשב אוטומטית את הטבת המס עבור שתי
              האפשרויות — קנייה וליסינג — ותראו כמה אתם חוסכים. החישוב לוקח
              בחשבון את כל ההוצאות הרלוונטיות, מחיל את שיעור ההכרה של 45%, ומציג
              לכם את החיסכון האמיתי במס לצד העלות הכוללת של כל אפשרות. כך תוכלו
              לקבל החלטה מושכלת שמתחשבת בכל המרכיבים הפיננסיים — כולל הטבות
              המס.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              חשוב לדעת
            </h2>
            <p>
              חוקי המס בישראל משתנים מעת לעת, ולכן מומלץ בחום להתייעץ עם רואה
              חשבון או יועץ מס מוסמך לפני קבלת החלטות פיננסיות משמעותיות. שיעור
              ההכרה של 45% הוא שיעור ההכרה הסטנדרטי הנוכחי לרכבים המשמשים באופן
              מעורב (עסקי ופרטי). כללים שונים עשויים לחול על סוגי רכב מסוימים,
              כגון רכבים מסחריים שמשמשים אך ורק לצורכי העסק (שם שיעור ההכרה
              עשוי להיות גבוה יותר), או על מבני עסקים ספציפיים כמו חברות בע&quot;מ
              שבהן ההתייחסות המיסויית שונה. המידע במדריך זה הוא כללי ואינו מהווה
              ייעוץ מס. תמיד בדקו עם איש מקצוע את המצב הספציפי שלכם.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Who Is Eligible for Car Tax Benefits?
            </h2>
            <p>
              Self-employed business owners in Israel who are registered as a
              licensed business (Osek Murshe) are entitled to deduct a portion of
              their car-related expenses as a recognized business expense for tax
              purposes. According to Israeli income tax regulations, 45% of car
              expenses can be deducted from taxable income. This benefit applies
              to both purchased and leased vehicles, and it represents a
              significant saving that can amount to tens of thousands of shekels
              over the life of the vehicle. It is important to note that the
              benefit applies to all types of vehicles — private and commercial —
              as long as the vehicle is used for business purposes, even if only
              partially. A small-scale business (Osek Patur), on the other hand,
              is not eligible for this benefit in the same way, so it is
              essential to verify your business status before planning.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              What Expenses Can Be Deducted?
            </h2>
            <p>
              The list of expenses that can be recognized as deductible business
              car expenses covers a wide range of ongoing costs. First, monthly
              lease payments — for those who choose an operating lease, the
              entire monthly payment is included in the calculation base.
              Additionally, fuel expenses are recognized as deductible, as are
              maintenance and service costs — periodic treatments, repairs, tire
              replacements, and similar expenses. Mandatory insurance (third-party
              liability) and comprehensive insurance are also included in the
              list of recognized expenses, alongside annual registration fees and
              parking payments. For those who purchased a vehicle with a loan,
              the loan interest is also a deductible expense. The 45% recognition
              rate applies uniformly to all of these expenses. This means that if
              your total annual car expenses amount to 60,000 ILS, you can
              recognize 27,000 ILS as a deductible business expense.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              How Is the Tax Benefit Calculated?
            </h2>
            <p>
              The tax benefit calculation is based on a straightforward formula:
              Total deductible expenses &times; 45% recognition rate &times; your
              marginal tax rate = tax savings. The result is the actual reduction
              in tax you will pay. For example, suppose your annual car expenses
              total 60,000 ILS and your marginal tax rate is 47%. The
              calculation would be: 60,000 &times; 0.45 &times; 0.47 = 12,690
              ILS in tax savings per year! Over a period of 3 years, that is a
              cumulative saving of 38,070 ILS. This is a substantial amount that
              can tip the scales in the decision between buying and leasing, which
              is why it is so important to factor it into the overall
              calculation. The higher your marginal tax rate, the greater your
              tax benefit, making tax planning an integral part of the financial
              decision.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Marginal Tax Brackets in Israel
            </h2>
            <p>
              The Israeli tax system is built on progressive tax brackets,
              meaning the higher your income, the higher the tax rate on the
              upper portion of your earnings. Tax brackets range from
              approximately 10% to 50%. The marginal tax rate is the percentage
              of tax applied to your last shekel earned — that is, the highest
              bracket you have reached. For example, a self-employed individual
              with annual taxable income of 400,000 ILS would fall into the 47%
              tax bracket, while someone with an income of 200,000 ILS would be
              in a lower bracket. This means that high-income earners enjoy a
              larger tax benefit on car expenses, since every shekel of
              recognized expense saves them more in tax. Therefore, the higher
              your income, the more significant the car tax benefit becomes for
              you.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Leasing vs. Buying — Which Is Better for the Self-Employed?
            </h2>
            <p>
              For business owners, an operating lease often offers a significant
              tax advantage over purchasing. The main reason is that with
              leasing, the entire monthly payment is considered an ongoing
              expense that is recognized for tax purposes. In contrast, when you
              buy a car, only the ongoing costs (fuel, insurance, maintenance,
              loan interest) are deductible — the cost of the car itself cannot
              be deducted as an ongoing expense. With a lease, the monthly
              payment already includes the &quot;cost of the vehicle&quot; within
              it, so the base of recognized expenses is larger. For
              self-employed individuals in high tax brackets, the difference can
              be dramatic — thousands of shekels per year. This is why leasing
              has become the popular option among freelancers and company owners
              in Israel. However, it is important to remember that the tax
              consideration is only part of the picture — you should also
              account for the total cost of the lease, return conditions,
              mileage limits, and more.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              In the CarCalc Calculator
            </h2>
            <p>
              Mark &quot;Licensed Business&quot; in the personal details step and
              enter your marginal tax rate. The calculator will automatically
              compute the tax benefit for both options — buying and leasing — so
              you can see exactly how much you save. The calculation takes into
              account all relevant expenses, applies the 45% recognition rate,
              and presents you with the real tax savings alongside the total cost
              of each option. This way you can make an informed decision that
              considers all financial components — including tax benefits.
            </p>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-6">
              Important to Know
            </h2>
            <p>
              Tax laws in Israel change from time to time, so it is strongly
              recommended to consult with a certified accountant or tax advisor
              before making significant financial decisions. The 45% recognition
              rate is the current standard rate for vehicles used for mixed
              purposes (both business and personal). Different rules may apply
              to certain vehicle types, such as commercial vehicles used
              exclusively for business purposes (where the recognition rate may
              be higher), or to specific business structures such as limited
              companies (Ltd.) where the tax treatment differs. The information
              in this guide is general and does not constitute tax advice. Always
              check with a professional about your specific situation.
            </p>
          </>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="font-semibold text-blue-800 dark:text-blue-300">
          {isHe
            ? "רוצים לדעת כמה תחסכו במס?"
            : "Want to know how much you'll save in taxes?"}
        </p>
        <p className="mt-1 text-blue-700 dark:text-blue-400">
          <a href="/" className="underline hover:no-underline">
            {isHe
              ? "סמנו 'עוסק מורשה' במחשבון וקבלו חישוב מדויק של הטבת המס"
              : "Mark 'Licensed Business' in the calculator for an exact tax benefit calculation"}
          </a>
        </p>
      </div>
    </main>
  );
}
