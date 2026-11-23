import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { GuideShell, H2, H3, Calc, CalcLink, CalcCta, Terms, Example, Bullets, Table, Note, Ref } from "@/components/guide";

export const metadata: Metadata = {
  title: "כמה עולה להחזיק רכב בחודש? כל ההוצאות, עם דוגמה | CarCalc",
  description:
    "דלק, ביטוח, טיפולים, אגרת רישוי, ירידת ערך וריבית: כמה עולה להחזיק רכב משפחתי בחודש בישראל, עם חישוב מלא לבנזין, היברידי וחשמלי.",
  alternates: { canonical: "/guides/monthly-car-cost" },
};

// Example figures follow the calculator's own assumptions (Nov 2026):
// new family car 150,000 ILS, 15,000 km a year, kept 3 years.
// Petrol 7.85/l at 15 km/l; hybrid 20 km/l; EV 6.5 km/kWh at 0.64/kWh.
// Depreciation over 3 years: petrol 27%, hybrid 26%, EV 38%.
// Licensing fee 1,941/yr (price group up to 167,000, cars from 2024–2026).
// Insurance: comprehensive 5,000/yr, mandatory 1,500/yr.
// Servicing: every 10,000 km at 1,500 (petrol), 1,800 (hybrid), 1,200 (EV).

export default async function MonthlyCarCostGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <GuideShell
      locale={locale}
      path="/guides/monthly-car-cost"
      title={isHe ? "כמה עולה להחזיק רכב בחודש?" : "How much does it cost to own a car each month?"}
      description={
        isHe
          ? "כל ההוצאות של רכב, מדלק ועד ירידת ערך, עם חישוב מלא לרכב משפחתי."
          : "Every cost of owning a car, from fuel to depreciation, with a full family-car example."
      }
    >
      {isHe ? (
        <>
          <p>
            כששואלים אנשים כמה הרכב עולה להם, רובם עונים ״דלק וביטוח, בערך 1,200 ₪ בחודש״. בפועל, רכב משפחתי
            חדש עולה בערך <strong>פי שניים</strong>. ההוצאה הכי גדולה לא מופיעה באף חשבונית: הרכב מאבד מערכו
            בכל חודש, גם כשהוא עומד בחניה.
          </p>
          <p>
            במדריך הזה נעבור על כל ההוצאות, אחת אחת, ונחשב יחד כמה עולה רכב משפחתי ממוצע בחודש. בסוף תוכלו
            להכניס את הנתונים שלכם למחשבון ולקבל את המספר המדויק.
          </p>

          <CalcLink>רוצים את המספר שלכם? המחשבון מחשב את כל ההוצאות</CalcLink>

          <Terms
            title="המושגים, בשפה פשוטה"
            items={[
              [
                "ירידת ערך (פחת)",
                "ההפרש בין המחיר ששילמתם על הרכב לבין מה שתקבלו כשתמכרו אותו. זה כסף שהולך לאיבוד גם אם לא נסעתם בכלל.",
              ],
              ["אגרת רישוי", "תשלום שנתי למשרד התחבורה כדי שהרכב יהיה רשום ומותר לנסוע בו. הסכום תלוי במחיר הרכב ובשנת הייצור."],
              ["ביטוח חובה", "ביטוח שהחוק מחייב. הוא מכסה פגיעה בגוף של אנשים, לא נזק לרכבים."],
              ["ביטוח מקיף", "ביטוח שמכסה נזק לרכב שלכם ולרכבים אחרים, וגם גניבה. הוא לא חובה, אבל כמעט כל מי שיש לו רכב חדש עושה אותו."],
              ["עלות קבועה", "הוצאה שמשלמים גם אם לא נוסעים: ביטוח, אגרת רישוי, ורוב ירידת הערך."],
              ["עלות משתנה", "הוצאה שגדלה ככל שנוסעים יותר: דלק או חשמל, טיפולים, צמיגים."],
            ]}
          />

          <H2>כל ההוצאות של רכב, ברשימה אחת</H2>
          <Table
            head={["ההוצאה", "מה משפיע עליה", "כמה בערך (רכב משפחתי)"]}
            rows={[
              ["ירידת ערך", "מחיר הרכב, הדגם, סוג המנוע, כמה שנים מחזיקים", "800 עד 1,600 ₪ בחודש"],
              ["דלק או חשמל", "כמה קילומטרים נוסעים, כמה הרכב צורך, איפה מטעינים", "120 עד 700 ₪ בחודש"],
              ["ביטוח מקיף", "גיל וותק של הנהגים, סוג הרכב, עבר תביעות", "250 עד 600 ₪ בחודש"],
              ["ביטוח חובה", "גיל הנהג הצעיר, נפח מנוע", "100 עד 200 ₪ בחודש"],
              ["טיפולים, צמיגים ובלמים", "קילומטרים, גיל הרכב, מוסך יבואן או פרטי", "150 עד 250 ₪ בחודש"],
              ["אגרת רישוי", "מחיר הרכב כשהיה חדש ושנת הייצור", "70 עד 450 ₪ בחודש"],
              ["טסט", "רק מהשנה הרביעית של הרכב", "כ-10 ₪ בחודש"],
              ["ריבית על הלוואה", "גובה ההלוואה, הריבית והתקופה", "0 עד 500 ₪ בחודש"],
              ["חניה, כבישי אגרה, שטיפה", "איפה גרים ועובדים", "משתנה מאוד"],
            ]}
          />
          <Note>
            הטווחים מבוססים על אותן הנחות שהמחשבון שלנו משתמש בהן, נכון לנובמבר 2026. ההוצאה שלכם יכולה להיות
            מחוץ לטווח, למשל עם נהג צעיר בפוליסה או רכב יוקרה.
          </Note>

          <H2>דוגמה מלאה: רכב משפחתי חדש בבנזין</H2>
          <p>
            נניח שקניתם רכב משפחתי חדש ב-150,000 ₪, אתם נוסעים 15,000 ק״מ בשנה, ומתכננים להחזיק אותו שלוש
            שנים. ככה נראה החודש שלכם:
          </p>
          <Table
            head={["ההוצאה", "החישוב", "בחודש"]}
            rows={[
              ["ירידת ערך", "הרכב מאבד כ-27% בשלוש שנים, כלומר כ-40,700 ₪, חלקי 36 חודשים", "1,130 ₪"],
              ["דלק", "15,000 ק״מ חלקי 15 ק״מ לליטר = 1,000 ליטר בשנה, כפול 7.85 ₪", "654 ₪"],
              ["ביטוח מקיף", "כ-5,000 ₪ בשנה", "417 ₪"],
              ["טיפולים ובלאי", "טיפול כל 10,000 ק״מ, כ-1,500 ₪ לטיפול כולל צמיגים ובלמים", "188 ₪"],
              ["אגרת רישוי", "1,941 ₪ בשנה לרכב בקבוצת המחיר הזו", "162 ₪"],
              ["ביטוח חובה", "כ-1,500 ₪ בשנה", "125 ₪"],
              [<strong key="t">סך הכול</strong>, "", <strong key="v">כ-2,680 ₪</strong>],
            ]}
          />
          <p>
            שימו לב: <strong>ירידת הערך לבדה גדולה יותר מהדלק והביטוח המקיף ביחד.</strong> בגלל זה ההערכה
            ״1,200 ₪ בחודש״ רחוקה כל כך מהמציאות.
          </p>

          <Example title="ואם לקחתם הלוואה?">
            <p>
              ההחזר החודשי של ההלוואה הוא לא כולו הוצאה. רובו מחזיר את הקרן, כלומר את הכסף ששילמתם על הרכב, ואת
              זה כבר ספרנו בירידת הערך. ההוצאה האמיתית היא רק <strong>הריבית</strong>.
            </p>
            <p>
              על הלוואה של 90,000 ₪ ל-5 שנים בריבית של 7%, הריבית מגיעה לכ-16,900 ₪, כלומר בממוצע{" "}
              <strong>כ-280 ₪ בחודש</strong>. עם הריבית, הרכב עולה כ-2,960 ₪ בחודש.
            </p>
            <p>
              שילמתם במזומן? גם לזה יש מחיר: הכסף יכול היה להרוויח ריבית או תשואה במקום אחר. המחשבון שלנו יודע
              לחשב גם את זה. על ריביות ומבצעי מימון יש <Ref to="car-loans">מדריך נפרד</Ref>.
            </p>
          </Example>

          <H2>בנזין, היברידי או חשמלי: כמה כל אחד עולה בחודש</H2>
          <p>אותו רכב משפחתי, אותם 15,000 ק״מ בשנה, שלוש שנים. רק סוג המנוע משתנה:</p>
          <Table
            head={["", "בנזין", "היברידי", "חשמלי"]}
            rows={[
              ["ירידת ערך", "1,130 ₪", "1,100 ₪", "1,580 ₪"],
              ["דלק או חשמל (טעינה בבית)", "654 ₪", "491 ₪", "123 ₪"],
              ["טיפולים ובלאי", "188 ₪", "225 ₪", "150 ₪"],
              ["ביטוחים ואגרה", "704 ₪", "704 ₪", "704 ₪"],
              [<strong key="t">סך הכול בחודש</strong>, <strong key="a">כ-2,680 ₪</strong>, <strong key="b">כ-2,520 ₪</strong>, <strong key="c">כ-2,560 ₪</strong>],
            ]}
          />
          <p>
            התוצאה מפתיעה רבים: <strong>הסכום הכולל כמעט זהה.</strong> הרכב החשמלי חוסך כ-500 ₪ בחודש בחשמל,
            אבל מאבד יותר מערכו. מי שנוסע הרבה יותר מ-15,000 ק״מ בשנה, או מחזיק את הרכב הרבה שנים, ירוויח
            יותר מרכב חשמלי. כל הפרטים נמצאים במדריך <Ref to="electric-vs-gasoline">חשמלי מול בנזין</Ref>.
          </p>
          <Note>
            בטבלה הנחנו אותו ביטוח לכל הרכבים. בפועל ביטוח לרכב חשמלי יוצא לרוב קצת יותר יקר, וכדאי לבדוק הצעה.
          </Note>

          <H2>איך להוריד את העלות החודשית</H2>
          <H3>1. לבחור רכב ששומר על ערכו</H3>
          <p>
            ירידת הערך היא ההוצאה הגדולה ביותר, ולכן גם המקום שבו אפשר לחסוך הכי הרבה. דגמים פופולריים
            בישראל, כמו טויוטה, יונדאי וקיה, נמכרים בקלות ושומרים על ערכם טוב יותר. רכב בן שנתיים-שלוש כבר
            ספג את הירידה החדה של השנה הראשונה. ראו את <Ref to="depreciation">מדריך הפחת</Ref>.
          </p>
          <H3>2. להשוות ביטוח כל שנה</H3>
          <p>
            ההבדל בין חברות הביטוח על אותו רכב ואותו נהג יכול להגיע לאלפי שקלים בשנה. כדאי לבקש כמה הצעות לפני
            כל חידוש. ב<Ref to="insurance">מדריך הביטוח</Ref> מוסבר מה בודקים.
          </p>
          <H3>3. להחזיק את הרכב יותר זמן</H3>
          <p>
            הרכב מאבד הכי הרבה מערכו בשנים הראשונות. מי שמחליף רכב כל שלוש שנים משלם את החלק היקר שוב ושוב. על
            פני חמש שנים, ירידת הערך של רכב בנזין בדוגמה שלנו יורדת מכ-1,130 ₪ לכ-990 ₪ בחודש.
          </p>
          <H3>4. לא להתבלבל בין החזר חודשי לעלות</H3>
          <p>
            ליסינג או הלוואה עם ״החזר נמוך״ לא בהכרח זולים יותר. לפעמים ההחזר נמוך כי חלק גדול מהתשלום נדחה
            לסוף. כדי להשוות נכון צריך לחשב את כל העלות לאורך כל התקופה, ובדיוק את זה <Calc>המחשבון</Calc> עושה.
          </p>

          <H2>שאלות נפוצות</H2>
          <H3>כמה עולה להחזיק רכב משומש?</H3>
          <p>
            בדרך כלל פחות. ירידת הערך בשקלים קטנה יותר, כי הרכב כבר זול יותר, וגם אגרת הרישוי יורדת עם השנים.
            מצד שני, הטיפולים והתיקונים עולים, ומהשנה הרביעית יש טסט שנתי. ברכב משפחתי בן חמש שנים, ההוצאה
            החודשית יכולה לרדת לכ-2,000 ₪.
          </p>
          <H3>האם הליסינג כולל את כל ההוצאות האלה?</H3>
          <p>
            תלוי בסוג הליסינג. בליסינג תפעולי רוב ההוצאות כלולות בתשלום החודשי, חוץ מדלק. בליסינג פרטי (מימוני)
            רובן עליכם. ההבדל מוסבר במדריך <Ref to="private-vs-operational-leasing">ליסינג פרטי או תפעולי</Ref>.
          </p>
          <H3>למה המחשבון שלכם נותן מספר אחר?</H3>
          <p>
            הדוגמה כאן משתמשת בהנחות ממוצעות. המחשבון מחשב לפי המחיר, הצריכה, הקילומטרים והצעות הביטוח שלכם,
            ולכן המספר שלו מדויק יותר עבורכם.
          </p>

          <CalcCta
            title="כמה הרכב שלכם עולה בחודש?"
            text="הזינו מחיר, צריכת דלק וקילומטרים, וקבלו את העלות החודשית האמיתית, כולל ירידת ערך, וגם השוואה לליסינג."
            button="למחשבון"
          />
        </>
      ) : (
        <>
          <p>
            Ask people what their car costs them and most say “fuel and insurance, about 1,200 ILS a month”. In
            reality a new family car costs roughly <strong>twice that</strong>. The biggest cost never shows up on
            a bill: the car loses value every month, even while it sits in the parking lot.
          </p>
          <p>
            This guide walks through every cost, one by one, and works out what an average family car costs each
            month. At the end you can put your own numbers into the calculator.
          </p>

          <CalcLink>Want your own number? The calculator adds up every cost</CalcLink>

          <Terms
            title="The terms, in plain language"
            items={[
              ["Depreciation", "The gap between what you paid for the car and what you get when you sell it. That money is gone even if you never drove."],
              ["Licensing fee", "A yearly fee to the Ministry of Transport to keep the car registered. It depends on the car's price and model year."],
              ["Mandatory insurance", "Insurance required by law. It covers injury to people, not damage to cars."],
              ["Comprehensive insurance", "Covers damage to your car and other cars, plus theft. Not required, but almost everyone with a new car has it."],
              ["Fixed cost", "Paid even if you don't drive: insurance, licensing, most depreciation."],
              ["Variable cost", "Grows the more you drive: fuel or electricity, servicing, tyres."],
            ]}
          />

          <H2>Every cost of a car, in one list</H2>
          <Table
            head={["Cost", "What drives it", "Roughly (family car)"]}
            rows={[
              ["Depreciation", "Price, model, engine type, how long you keep it", "800 to 1,600 ILS a month"],
              ["Fuel or electricity", "Distance, consumption, where you charge", "120 to 700 ILS a month"],
              ["Comprehensive insurance", "Drivers' age and experience, car type, claims history", "250 to 600 ILS a month"],
              ["Mandatory insurance", "Youngest driver's age, engine size", "100 to 200 ILS a month"],
              ["Servicing, tyres, brakes", "Distance, car age, dealer or independent garage", "150 to 250 ILS a month"],
              ["Licensing fee", "Original price and model year", "70 to 450 ILS a month"],
              ["Annual test", "Only from the car's fourth year", "About 10 ILS a month"],
              ["Loan interest", "Loan size, rate and term", "0 to 500 ILS a month"],
              ["Parking, toll roads, washing", "Where you live and work", "Varies a lot"],
            ]}
          />
          <Note>Ranges use the same assumptions as our calculator, as of November 2026. Yours may fall outside them, for example with a young driver on the policy.</Note>

          <H2>A full example: a new petrol family car</H2>
          <p>You bought a new family car for 150,000 ILS, drive 15,000 km a year and plan to keep it three years:</p>
          <Table
            head={["Cost", "Calculation", "Per month"]}
            rows={[
              ["Depreciation", "About 27% over three years, roughly 40,700 ILS, over 36 months", "1,130 ILS"],
              ["Fuel", "15,000 km at 15 km/l = 1,000 litres a year, at 7.85 ILS", "654 ILS"],
              ["Comprehensive insurance", "About 5,000 ILS a year", "417 ILS"],
              ["Servicing and wear", "A service every 10,000 km at about 1,500 ILS, tyres and brakes included", "188 ILS"],
              ["Licensing fee", "1,941 ILS a year for this price group", "162 ILS"],
              ["Mandatory insurance", "About 1,500 ILS a year", "125 ILS"],
              [<strong key="t">Total</strong>, "", <strong key="v">About 2,680 ILS</strong>],
            ]}
          />
          <p><strong>Depreciation alone is bigger than fuel and comprehensive insurance combined.</strong> That's why the “1,200 a month” guess is so far off.</p>

          <Example title="And if you took a loan?">
            <p>
              Most of a loan repayment isn't a cost. It pays back the principal, the money for the car, which we
              already counted as depreciation. The real cost is only the <strong>interest</strong>.
            </p>
            <p>
              On a 90,000 ILS loan over 5 years at 7%, interest comes to about 16,900 ILS, or{" "}
              <strong>about 280 ILS a month</strong> on average. With interest, the car costs about 2,960 ILS a month.
            </p>
            <p>
              Paid cash? That has a cost too: the money could have earned interest elsewhere. Our calculator
              counts that as well. Rates and dealer financing are covered in a <Ref to="car-loans">separate guide</Ref>.
            </p>
          </Example>

          <H2>Petrol, hybrid or electric: the monthly cost of each</H2>
          <p>Same family car, same 15,000 km a year, three years. Only the engine changes:</p>
          <Table
            head={["", "Petrol", "Hybrid", "Electric"]}
            rows={[
              ["Depreciation", "1,130", "1,100", "1,580"],
              ["Fuel or electricity (home charging)", "654", "491", "123"],
              ["Servicing and wear", "188", "225", "150"],
              ["Insurance and licensing", "704", "704", "704"],
              [<strong key="t">Total per month (ILS)</strong>, <strong key="a">About 2,680</strong>, <strong key="b">About 2,520</strong>, <strong key="c">About 2,560</strong>],
            ]}
          />
          <p>
            Many people are surprised: <strong>the totals are almost the same.</strong> The EV saves about 500 ILS a
            month on energy but loses more value. Drive much more than 15,000 km a year, or keep the car for many
            years, and the EV comes out ahead. See <Ref to="electric-vs-gasoline">electric vs gasoline</Ref>.
          </p>
          <Note>We assumed the same insurance for all three. In practice EV insurance is often a little higher, so get a quote.</Note>

          <H2>How to bring the monthly cost down</H2>
          <H3>1. Pick a car that holds its value</H3>
          <p>
            Depreciation is the biggest cost, so it's where you can save the most. Popular models sell easily and
            hold value better. A two- or three-year-old car has already taken the steep first-year drop. See the{" "}
            <Ref to="depreciation">depreciation guide</Ref>.
          </p>
          <H3>2. Compare insurance every year</H3>
          <p>
            Insurers can differ by thousands of shekels a year for the same car and driver. Get several quotes
            before each renewal. The <Ref to="insurance">insurance guide</Ref> explains what to check.
          </p>
          <H3>3. Keep the car longer</H3>
          <p>
            A car loses most of its value early. Swapping every three years means paying the expensive part again
            and again. Over five years, depreciation in our petrol example drops from about 1,130 to about 990 ILS a month.
          </p>
          <H3>4. Don't confuse a monthly payment with the cost</H3>
          <p>
            A lease or loan with a “low payment” isn't necessarily cheaper. Sometimes the payment is low because
            much of it is pushed to the end. A fair comparison counts the full cost over the whole period, which is
            exactly what the <Calc>calculator</Calc> does.
          </p>

          <H2>Common questions</H2>
          <H3>How much does a used car cost to own?</H3>
          <p>
            Usually less. Depreciation in shekels is smaller because the car is already cheaper, and the licensing
            fee falls with age. On the other hand repairs cost more, and from the fourth year there's an annual
            test. A five-year-old family car can come down to about 2,000 ILS a month.
          </p>
          <H3>Does leasing include all these costs?</H3>
          <p>
            Depends on the type. Operational leasing includes most of them except fuel. With private (financial)
            leasing most are on you. See <Ref to="private-vs-operational-leasing">private vs operational leasing</Ref>.
          </p>
          <H3>Why does your calculator give a different number?</H3>
          <p>This example uses average assumptions. The calculator uses your price, consumption, distance and insurance quotes, so its figure fits you better.</p>

          <CalcCta
            title="What does your car cost each month?"
            text="Enter the price, fuel consumption and distance, and get the real monthly cost, depreciation included, plus a comparison with leasing."
            button="Open the calculator"
          />
        </>
      )}
    </GuideShell>
  );
}
