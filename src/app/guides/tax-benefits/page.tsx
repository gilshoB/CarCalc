import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { GuideShell, H2, Calc, CalcLink, CalcCta, Terms, Example, Bullets, Table, Note, Ref } from "@/components/guide";

export const metadata: Metadata = {
  title: "רכב לעצמאים ולשכירים: הוצאה מוכרת, מע״מ ושווי שימוש | CarCalc",
  description:
    "כמה מהוצאות הרכב מוכרות לעוסק מורשה ולעוסק פטור, מה מקזזים במע״מ, מה ההבדל בין קנייה לליסינג לעצמאי, ואיך מחשבים שווי שימוש ברכב צמוד.",
  alternates: { canonical: "/guides/tax-benefits" },
};

export default async function TaxBenefitsGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <GuideShell
      locale={locale}
      path="/guides/tax-benefits"
      illustration="tax-benefits"
      title={isHe ? "רכב ומס: מה מוכר לעצמאי, ומה זה שווי שימוש" : "Cars and tax: what the self-employed can deduct, and what usage value means"}
      description={
        isHe
          ? "הוצאות רכב מוכרות, קיזוז מע״מ, קנייה מול ליסינג לעצמאי, ושווי שימוש ברכב צמוד."
          : "Deductible car expenses, VAT, buying vs. leasing for the self-employed, and the usage value of a company car."
      }
    >
      {isHe ? (
        <>
          <p>
            לעצמאי, רכב עולה פחות ממה שכתוב בחשבונית, כי חלק מההוצאה חוזר דרך המס. לשכיר עם רכב צמוד, הרכב
            ״בחינם״ עולה יותר ממה שנדמה, כי משלמים עליו מס בתלוש. בשני המקרים, מי שלא מכניס את המס לחשבון
            משווה מספרים לא נכונים.
          </p>
          <p>
            המדריך מסביר את הכללים העיקריים בשפה פשוטה. הוא לא מחליף רואה חשבון, אבל אחריו תדעו מה לשאול.
          </p>

          <CalcLink>עוסק מורשה? המחשבון מחשב את הטבת המס בשבילכם</CalcLink>

          <Terms
            title="המושגים, בשפה פשוטה"
            items={[
              [
                "עוסק מורשה",
                "עצמאי שגובה מע״מ מהלקוחות ומעביר אותו למדינה. הוא יכול לקזז חלק מהמע״מ ששילם על הוצאות העסק.",
              ],
              [
                "עוסק פטור",
                "עצמאי עם מחזור קטן שלא גובה מע״מ. הוא לא מקזז מע״מ, אבל כן יכול להכיר בהוצאות לצורך מס הכנסה.",
              ],
              [
                "הוצאה מוכרת",
                "הוצאה שמותר להפחית מההכנסה לפני שמחשבים עליה מס. הוצאה מוכרת של 1,000 ₪ לא מחזירה 1,000 ₪. היא חוסכת את המס על 1,000 ₪.",
              ],
              [
                "מס שולי",
                "אחוז המס על השקל האחרון שהרווחתם. מדרגות מס ההכנסה בישראל הן 10%, 14%, 20%, 31%, 35% ו-47%, ומעל הכנסה גבוהה מאוד נוסף מס יסף.",
              ],
              ["מע״מ תשומות", "המע״מ שעוסק מורשה שילם על קניות והוצאות של העסק, ואותו הוא מקזז מהמע״מ שגבה."],
              [
                "רכב צמוד",
                "רכב שהמעסיק נותן לעובד לשימוש מלא, גם פרטי. המעסיק משלם על הרכב, והעובד משלם מס על ההטבה.",
              ],
              [
                "שווי שימוש",
                "הסכום שמתווסף לשכר ברוטו של עובד עם רכב צמוד, לצורך חישוב המס. זה לא סכום שמשלמים. משלמים את המס עליו.",
              ],
              [
                "פחת לצורכי מס",
                "כשעסק קונה רכב, הוא לא מכיר בכל המחיר בשנה אחת. הוא מכיר בחלק קבוע ממנו בכל שנה, בדרך כלל 15%.",
              ],
            ]}
          />

          <H2>עצמאים: כמה מהוצאות הרכב מוכרות</H2>
          <p>
            רכב פרטי של עצמאי משמש גם לעבודה וגם לחיים הפרטיים. במקום לבדוק כל נסיעה, התקנות קובעות כלל קבוע.
            ההוצאה המוכרת היא הגבוה מבין השניים:
          </p>
          <Bullets>
            <li>45% מכל הוצאות הרכב.</li>
            <li>כל הוצאות הרכב, פחות שווי השימוש של אותו רכב.</li>
          </Bullets>
          <p>ברוב הרכבים הפרטיים יוצא שהאפשרות הראשונה גבוהה יותר, ולכן מדברים בדרך כלל על ״45%״.</p>
          <p>
            <strong>אילו הוצאות נכנסות?</strong> דלק או חשמל, ביטוחים, אגרת רישוי, טיפולים ותיקונים, ריבית על
            הלוואה לרכב, דמי ליסינג, והפחת השנתי על רכב שקניתם.
          </p>
          <Example title="דוגמה: כמה זה שווה בכסף">
            <p>
              הוצאות הרכב שלכם הן 60,000 ₪ בשנה, והמס השולי שלכם 35%. ההוצאה המוכרת היא 45% מ-60,000 ₪, כלומר
              27,000 ₪. החיסכון במס הוא 35% מ-27,000 ₪, כלומר <strong>9,450 ₪ בשנה</strong>.
            </p>
            <p>במס שולי של 47% אותו רכב חוסך 12,690 ₪ בשנה. ככל שהמס השולי גבוה יותר, ההטבה גדולה יותר.</p>
          </Example>
          <p>
            הוצאה מוכרת מקטינה גם את דמי הביטוח הלאומי, כך שהחיסכון האמיתי קצת גבוה יותר. המחשבון שלנו מחשב
            את מס ההכנסה והמע״מ בלבד.
          </p>

          <H2>מע״מ: מה מקזזים ומה לא</H2>
          <p>הכללים לרכב פרטי של עוסק מורשה:</p>
          <Table
            head={["ההוצאה", "קיזוז מע״מ"]}
            rows={[
              ["דלק, טיפולים ותיקונים", "שני שלישים מהמע״מ אם עיקר השימוש לעסק, רבע אם עיקרו פרטי"],
              ["קניית הרכב", "אין קיזוז"],
              ["דמי ליסינג או שכירות של רכב פרטי", "אין קיזוז"],
              ["ביטוח ואגרת רישוי", "אין בהם מע״מ"],
            ]}
          />
          <Example title="דוגמה">
            <p>
              הוצאתם 12,000 ₪ בשנה על דלק וטיפולים, כולל מע״מ. המע״מ שבתוך הסכום הוא כ-1,830 ₪. שני שלישים
              ממנו הם <strong>כ-1,220 ₪</strong> שחוזרים אליכם.
            </p>
          </Example>
          <p>עוסק פטור לא מקזז מע״מ בכלל, אבל מכיר בהוצאה המלאה, כולל המע״מ, לצורך מס הכנסה.</p>
          <p>הכללים שונים לרכב מסחרי, למונית ולרכב עבודה, ושם ההכרה בדרך כלל רחבה יותר.</p>

          <H2>קנייה או ליסינג לעצמאי</H2>
          <p>
            נהוג לומר שלעצמאי תמיד עדיף ליסינג ״כי הכול מוכר״. זה נכון רק בחלקו. גם בקנייה מחיר הרכב מוכר,
            רק לא בבת אחת.
          </p>
          <Bullets>
            <li>
              <strong>בליסינג</strong> התשלום החודשי הוא הוצאה שוטפת, והוא נכנס כולו לחישוב ה-45%.
            </li>
            <li>
              <strong>בקנייה</strong> מכירים בפחת השנתי על הרכב (בדרך כלל 15% ממחירו בכל שנה), ובנוסף בריבית,
              בביטוחים, בטיפולים ובדלק. גם הם נכנסים לחישוב ה-45%.
            </li>
          </Bullets>
          <p>
            לכן הפער במס בין שתי האפשרויות קטן ממה שמקובל לחשוב, והוא לא מחליף את ההשוואה הרגילה: כמה כל
            אפשרות עולה בסך הכול. מה שמשתנה לעצמאי הוא שכל העלויות ״מוזלות״ בשיעור דומה. את ההשוואה עצמה
            הסברנו ב<Ref to="buy-vs-lease">מדריך קנייה מול ליסינג</Ref>.
          </p>
          <p>
            הכללים האלה חלים על עצמאי. בחברה בע״מ החשבון שונה: החברה מכירה בהוצאות הרכב, ולעובד או לבעל
            השליטה נזקף שווי שימוש.
          </p>

          <H2>שכירים: רכב צמוד ושווי שימוש</H2>
          <p>
            רכב צמוד נראה כמו הטבה בחינם: המעסיק משלם על הרכב, על הביטוח ולרוב גם על הדלק. אבל המדינה רואה בו
            חלק מהשכר, ומחייבת אותו במס.
          </p>
          <p>
            <strong>איך מחשבים?</strong> שווי השימוש החודשי הוא בערך 2.5% ממחיר המחירון של הרכב כשהיה חדש.
            הסכום הזה מתווסף לברוטו, ועליו משלמים מס הכנסה, ביטוח לאומי ומס בריאות. לרכב היברידי, פלאג-אין
            וחשמלי יש הפחתה קבועה משווי השימוש.
          </p>
          <Example title="דוגמה: רכב צמוד עם מחיר מחירון של 150,000 ₪">
            <p>
              שווי השימוש הוא כ-3,700 ₪ בחודש. במס שולי של 35%, המס עליו הוא{" "}
              <strong>כ-1,300 ₪ בחודש</strong> מהנטו, ועוד ביטוח לאומי.
            </p>
          </Example>
          <p>שלושה דברים שכדאי לדעת:</p>
          <Bullets>
            <li>שווי השימוש נקבע לפי מחיר המחירון, לא לפי מה שהרכב שווה היום. רכב בן חמש עולה לכם כמו חדש.</li>
            <li>הוא לא תלוי בכמה אתם נוסעים. מי שנוסע מעט משלם אותו דבר.</li>
            <li>
              כשמציעים לכם לבחור בין רכב צמוד לתוספת שכר, השוו את המס על שווי השימוש למה שיעלה לכם להחזיק רכב
              בעצמכם. את העלות הזו אפשר לחשב במחשבון.
            </li>
          </Bullets>

          <H2>המס במחשבון</H2>
          <p>
            ב<Calc>מחשבון</Calc>, בשלב האחרון, מסמנים שאתם עוסק מורשה ומזינים את המס השולי. המחשבון מכיר ב-45%
            מהוצאות הרכב בכל אחת מהאפשרויות, מוסיף את קיזוז המע״מ על דלק וטיפולים, ומראה את העלות אחרי מס
            לקנייה ולליסינג. כך רואים אם ההטבה משנה את התשובה.
          </p>

          <Note>
            המדריך נותן מידע כללי ואינו ייעוץ מס. כללי המס והסכומים מתעדכנים מדי שנה ותלויים בסוג העסק ובסוג
            הרכב. לפני החלטה, בדקו את המצב שלכם עם רואה חשבון או יועץ מס.
          </Note>

          <CalcCta
            title="כמה הרכב עולה לכם אחרי מס?"
            text="סמנו ״עוסק מורשה״, הזינו את המס השולי, וראו את העלות האמיתית של קנייה מול ליסינג."
            button="למחשבון"
          />
        </>
      ) : (
        <>
          <p>
            For the self-employed, a car costs less than the invoice says, because part of the expense comes
            back through tax. For an employee with a company car, the “free” car costs more than it seems,
            because tax is paid on it through the payslip. In both cases, leaving tax out means comparing the
            wrong numbers.
          </p>
          <p>
            This guide explains the main rules in plain language. It does not replace an accountant, but
            afterwards you will know what to ask.
          </p>

          <CalcLink>Registered business? The calculator works out the tax saving for you</CalcLink>

          <Terms
            title="The terms, in plain language"
            items={[
              [
                "Osek murshe (עוסק מורשה)",
                "A self-employed person who charges customers VAT and passes it to the state. They can reclaim part of the VAT paid on business expenses.",
              ],
              [
                "Osek patur (עוסק פטור)",
                "A self-employed person with a small turnover who does not charge VAT. They reclaim no VAT, but can still deduct expenses for income tax.",
              ],
              [
                "Deductible expense",
                "An expense you may subtract from income before tax is calculated. A 1,000 ILS deductible expense does not return 1,000 ILS. It saves the tax on 1,000 ILS.",
              ],
              [
                "Marginal tax rate",
                "The tax rate on the last shekel you earned. Israel’s income tax brackets are 10%, 14%, 20%, 31%, 35% and 47%, with a surtax on very high incomes.",
              ],
              ["Input VAT", "The VAT a registered business paid on its purchases and expenses, which it sets off against the VAT it collected."],
              [
                "Company car (רכב צמוד)",
                "A car an employer gives an employee for full use, private use included. The employer pays for the car and the employee pays tax on the benefit.",
              ],
              [
                "Usage value (שווי שימוש)",
                "The amount added to the gross salary of an employee with a company car, for tax purposes. You do not pay this amount. You pay the tax on it.",
              ],
              [
                "Tax depreciation",
                "When a business buys a car it does not deduct the whole price in one year. It deducts a fixed share each year, usually 15%.",
              ],
            ]}
          />

          <H2>Self-employed: how much of the car expense is deductible</H2>
          <p>
            A self-employed person’s private car is used for both work and private life. Instead of checking
            every trip, the regulations set a fixed rule. The deductible amount is the higher of:
          </p>
          <Bullets>
            <li>45% of all car expenses.</li>
            <li>All car expenses, minus the usage value of that car.</li>
          </Bullets>
          <p>For most private cars the first option is higher, which is why people usually just say “45%”.</p>
          <p>
            <strong>Which expenses count?</strong> Fuel or electricity, insurance, the registration fee,
            servicing and repairs, interest on a car loan, lease payments, and yearly depreciation on a car you
            bought.
          </p>
          <Example title="Example: what it is worth in money">
            <p>
              Your car expenses are 60,000 ILS a year and your marginal tax rate is 35%. The deductible amount
              is 45% of 60,000, that is 27,000. The tax saving is 35% of 27,000, that is{" "}
              <strong>9,450 ILS a year</strong>.
            </p>
            <p>At a 47% marginal rate the same car saves 12,690 ILS a year. The higher the marginal rate, the bigger the benefit.</p>
          </Example>
          <p>
            A deductible expense also reduces National Insurance contributions, so the real saving is slightly
            higher. Our calculator covers income tax and VAT only.
          </p>

          <H2>VAT: what you reclaim and what you do not</H2>
          <p>The rules for a registered business’s private car:</p>
          <Table
            head={["Expense", "VAT reclaim"]}
            rows={[
              ["Fuel, servicing and repairs", "Two thirds of the VAT if the car is mainly for business, a quarter if mainly private"],
              ["Buying the car", "None"],
              ["Lease or rental payments on a private car", "None"],
              ["Insurance and registration fee", "No VAT on these"],
            ]}
          />
          <Example title="Example">
            <p>
              You spent 12,000 ILS in a year on fuel and servicing, VAT included. The VAT inside that is about
              1,830 ILS. Two thirds of it, <strong>about 1,220 ILS</strong>, comes back to you.
            </p>
          </Example>
          <p>An osek patur reclaims no VAT at all, but deducts the full expense, VAT included, for income tax.</p>
          <p>The rules differ for commercial vehicles, taxis and work vehicles, where recognition is usually broader.</p>

          <H2>Buying or leasing when self-employed</H2>
          <p>
            People say leasing is always better for the self-employed “because everything is deductible”. That
            is only partly true. When you buy, the price of the car is deductible too, just not all at once.
          </p>
          <Bullets>
            <li>
              <strong>Leasing:</strong> the monthly payment is a running expense and all of it goes into the 45% calculation.
            </li>
            <li>
              <strong>Buying:</strong> you deduct the yearly depreciation on the car (usually 15% of its price
              each year), plus interest, insurance, servicing and fuel. These go into the 45% calculation too.
            </li>
          </Bullets>
          <p>
            So the tax gap between the two is smaller than commonly thought, and it does not replace the
            ordinary comparison: what each option costs in total. What changes for the self-employed is that
            all the costs are “discounted” at a similar rate. The comparison itself is explained in the{" "}
            <Ref to="buy-vs-lease">buying vs. leasing guide</Ref>.
          </p>
          <p>
            These rules apply to the self-employed. In a limited company the sum is different: the company
            deducts the car expenses and a usage value is attributed to the employee or controlling shareholder.
          </p>

          <H2>Employees: company cars and usage value</H2>
          <p>
            A company car looks like a free benefit: the employer pays for the car, the insurance and usually
            the fuel. But the state treats it as part of your salary and taxes it.
          </p>
          <p>
            <strong>How is it calculated?</strong> The monthly usage value is roughly 2.5% of the car’s list
            price when new. That amount is added to your gross salary, and you pay income tax, National
            Insurance and health tax on it. Hybrid, plug-in and electric cars get a fixed reduction.
          </p>
          <Example title="Example: a company car with a 150,000 ILS list price">
            <p>
              The usage value is about 3,700 ILS a month. At a 35% marginal rate, the tax on it is{" "}
              <strong>about 1,300 ILS a month</strong> off your net pay, plus National Insurance.
            </p>
          </Example>
          <p>Three things worth knowing:</p>
          <Bullets>
            <li>Usage value is based on the list price, not on what the car is worth today. A five-year-old car costs you the same as a new one.</li>
            <li>It does not depend on how much you drive. Low-mileage drivers pay the same.</li>
            <li>
              When offered a choice between a company car and extra salary, compare the tax on the usage value
              with what running your own car would cost. You can work out that cost in the calculator.
            </li>
          </Bullets>

          <H2>Tax in the calculator</H2>
          <p>
            In <Calc>the calculator</Calc>, at the last step, you mark that you are a registered business and
            enter your marginal tax rate. The calculator recognises 45% of the car expenses in each option,
            adds the VAT reclaim on fuel and servicing, and shows the after-tax cost of buying and of leasing.
            That way you can see whether the benefit changes the answer.
          </p>

          <Note>
            This guide is general information, not tax advice. Tax rules and amounts are updated every year and
            depend on the type of business and vehicle. Before deciding, check your situation with an
            accountant or tax adviser.
          </Note>

          <CalcCta
            title="What does the car cost you after tax?"
            text="Mark “registered business”, enter your marginal tax rate, and see the real cost of buying against leasing."
            button="Open the calculator"
          />
        </>
      )}
    </GuideShell>
  );
}
