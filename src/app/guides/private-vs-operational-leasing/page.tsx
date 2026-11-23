import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { GuideShell, H2, H3, Calc, CalcLink, CalcCta, Terms, Example, Bullets, Steps, Table, Note, Ref } from "@/components/guide";

export const metadata: Metadata = {
  title: "ליסינג פרטי או ליסינג תפעולי: מה ההבדל ומה משתלם? | CarCalc",
  description:
    "מה ההבדל בין ליסינג פרטי (מימוני) לליסינג תפעולי, מה כלול בתשלום החודשי, מה זו יתרת סיום, ומה חשוב לבדוק בחוזה לפני שחותמים.",
  alternates: { canonical: "/guides/private-vs-operational-leasing" },
};

export default async function LeasingTypesGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <GuideShell
      locale={locale}
      path="/guides/private-vs-operational-leasing"
      title={isHe ? "ליסינג פרטי או ליסינג תפעולי: מה ההבדל?" : "Private or operational leasing: what's the difference?"}
      description={
        isHe
          ? "מה כלול בכל סוג ליסינג, מה זו יתרת סיום, ולמי כל אחד מתאים."
          : "What each type of lease includes, what a balloon payment is, and who each one suits."
      }
    >
      {isHe ? (
        <>
          <p>
            ״ליסינג״ נשמע כמו דבר אחד, אבל בישראל מדובר בשתי עסקאות שונות מאוד. בליסינג תפעולי אתם בעצם{" "}
            <strong>שוכרים</strong> רכב לכמה שנים, והחברה דואגת כמעט לכל השאר. ליסינג פרטי (נקרא גם ליסינג
            מימוני) הוא בעצם <strong>קנייה בתשלומים</strong>: הרכב יכול להיות שלכם בסוף, וההוצאות עליו עליכם.
          </p>
          <p>
            שתי העסקאות נראות דומות בפרסומת: ״רכב חדש ב-1,990 ₪ לחודש״. מה שמסתתר מאחורי המספר הזה שונה
            לגמרי, ובמדריך הזה נסביר איך לזהות את ההבדל.
          </p>

          <CalcLink>קיבלתם הצעת ליסינג? בדקו במחשבון אם היא משתלמת מול קנייה</CalcLink>

          <Terms
            title="המושגים, בשפה פשוטה"
            items={[
              ["ליסינג תפעולי", "שכירות ארוכה של רכב, בדרך כלל לשלוש שנים. התשלום החודשי כולל ביטוח, טיפולים ואגרה. בסוף מחזירים את הרכב."],
              ["ליסינג פרטי (מימוני)", "עסקת מימון לקניית רכב. משלמים מקדמה ותשלומים חודשיים, ובסוף משלמים סכום גדול ומקבלים את הרכב, או מחזירים אותו."],
              ["מקדמה", "סכום שמשלמים בתחילת העסקה. ככל שהמקדמה גבוהה יותר, התשלום החודשי נמוך יותר."],
              ["יתרת סיום (בלון)", "סכום גדול שנשאר לתשלום בסוף העסקה. הוא מה שמאפשר תשלום חודשי נמוך."],
              ["מכסת קילומטרים", "כמה קילומטרים מותר לנסוע בשנה בלי תשלום נוסף. בליסינג תפעולי כל קילומטר מעבר למכסה עולה כסף."],
              ["הצמדה למדד", "התשלום החודשי עולה כשהמדד עולה. בעסקה ארוכה זה יכול להצטבר לסכום משמעותי."],
            ]}
          />

          <H2>ההבדל, בטבלה אחת</H2>
          <Table
            head={["", "ליסינג תפעולי", "ליסינג פרטי (מימוני)"]}
            rows={[
              ["מה זה בעצם", "שכירות ארוכה", "קנייה במימון"],
              ["של מי הרכב", "של חברת הליסינג", "של חברת הליסינג עד התשלום האחרון, ואז יכול לעבור אליכם"],
              ["ביטוח", "בדרך כלל כלול", "עליכם, ולרוב חייבים ביטוח מקיף"],
              ["טיפולים ותיקונים", "כלולים", "עליכם"],
              ["אגרת רישוי", "כלולה", "עליכם"],
              ["רכב חלופי ושירותי דרך", "לרוב כלולים", "לרוב לא"],
              ["דלק או חשמל", "עליכם", "עליכם"],
              ["ירידת ערך", "הסיכון על החברה", "הסיכון עליכם"],
              ["מקדמה", "נמוכה או בלי מקדמה", "לרוב 15% עד 30% ממחיר הרכב"],
              ["בסוף התקופה", "מחזירים את הרכב", "משלמים את יתרת הסיום ולוקחים את הרכב, ממחזרים אותה, או מחזירים את הרכב"],
              ["מכסת קילומטרים", "יש, וחריגה עולה כסף", "לרוב אין"],
            ]}
          />
          <Note>
            התנאים משתנים מחברה לחברה ומעסקה לעסקה. יש גם עסקאות ״ליסינג פרטי״ שכוללות חבילת שירות. תמיד קראו
            מה בדיוק כתוב בחוזה.
          </Note>

          <H2>ליסינג תפעולי: לשלם על השימוש, לא על הרכב</H2>
          <p>
            בליסינג תפעולי חברת הליסינג קונה את הרכב, ואתם משלמים לה כל חודש על השימוש בו. בתשלום כלולים לרוב
            הביטוח, הטיפולים, אגרת הרישוי, שירותי דרך ולפעמים גם רכב חלופי. אחרי שלוש שנים בערך מחזירים את
            הרכב ויכולים לקחת רכב חדש.
          </p>
          <p>
            <strong>היתרון הגדול:</strong> אין הפתעות. אתם יודעים בדיוק כמה הרכב יעלה לכם כל חודש, ולא צריכים
            לדאוג למכירה שלו בסוף. גם הסיכון שהרכב יאבד מערכו יותר מהצפוי נשאר אצל החברה.
          </p>
          <p>
            <strong>החיסרון:</strong> משלמים על הנוחות. החברה מגלמת במחיר את הרווח שלה ואת הסיכון שהיא לוקחת.
            בנוסף, בסוף התקופה לא נשאר לכם כלום ביד.
          </p>
          <H3>מה עלול לעלות לכם עוד כסף</H3>
          <Bullets>
            <li>
              <strong>חריגה ממכסת הקילומטרים.</strong> נוסעים יותר מהמכסה? כל קילומטר נוסף מחויב. בדקו את המחיר
              לקילומטר לפני החתימה.
            </li>
            <li>
              <strong>נזקים בהחזרה.</strong> בסוף התקופה בודקים את הרכב, ושריטות, מכות וכתמים שנחשבים מעבר
              לבלאי רגיל מחויבים בנפרד.
            </li>
            <li>
              <strong>יציאה מוקדמת.</strong> מי שרוצה להחזיר את הרכב לפני הזמן משלם קנס, ולפעמים הוא גבוה.
            </li>
            <li>
              <strong>השתתפות עצמית.</strong> גם כשהביטוח כלול, בתאונה משלמים השתתפות עצמית.
            </li>
          </Bullets>

          <H2>ליסינג פרטי (מימוני): קנייה בתשלומים, עם בלון בסוף</H2>
          <p>
            בליסינג פרטי משלמים מקדמה, אחר כך תשלום חודשי לכמה שנים, ובסוף נשארת <strong>יתרת סיום</strong>:
            סכום גדול, לפעמים עשרות אחוזים ממחיר הרכב. אז אפשר לשלם אותה ולקבל את הרכב, לקחת עליה הלוואה חדשה,
            או להחזיר את הרכב ולסגור את החשבון.
          </p>
          <p>
            התשלום החודשי נמוך דווקא בגלל היתרה הזו. חלק גדול מהמחיר פשוט נדחה לסוף, ועל הסכום הזה משלמים ריבית
            לאורך כל התקופה. זה אותו עיקרון כמו <Ref to="car-loans">הלוואת בלון</Ref>.
          </p>
          <Example title="דוגמה: מה מסתתר מאחורי ״1,990 ₪ לחודש״">
            <p>
              רכב ב-150,000 ₪. מקדמה של 30,000 ₪, יתרת סיום של 70,000 ₪ אחרי 3 שנים, וריבית של 7.5%. התשלום
              החודשי יוצא בדיוק כ-1,990 ₪.
            </p>
            <p>
              על פני שלוש שנים שילמתם כ-101,700 ₪ (מקדמה ותשלומים), ועדיין חסרים לכם 70,000 ₪ כדי שהרכב יהיה
              שלכם. ובזמן הזה שילמתם בנפרד ביטוח, טיפולים ואגרה, כ-900 ₪ בחודש.
            </p>
            <p>
              <strong>השורה התחתונה:</strong> העלות האמיתית לחודש קרובה ל-2,900 ₪, לא ל-1,990 ₪, וזה לפני דלק.
            </p>
          </Example>
          <Note>
            הדוגמה מחושבת בנוסחת החזר רגילה עם בלון, לפי ההנחות שכתובות בה. בעסקה אמיתית יש לפעמים גם עמלות
            והצמדה למדד.
          </Note>

          <H2>אז מה מתאים לכם?</H2>
          <H3>ליסינג תפעולי מתאים אם:</H3>
          <Bullets>
            <li>אתם רוצים תשלום קבוע וידוע, בלי לדאוג לטיפולים, לביטוח ולמכירה בסוף.</li>
            <li>אתם אוהבים להחליף לרכב חדש כל שלוש שנים בערך.</li>
            <li>אתם נוסעים כמות קילומטרים צפויה, שנכנסת במכסה.</li>
            <li>אתם עצמאים, וחלק מהתשלום מוכר לכם כהוצאה. ראו את <Ref to="tax-benefits">מדריך המס</Ref>.</li>
          </Bullets>
          <H3>ליסינג פרטי מתאים אם:</H3>
          <Bullets>
            <li>אתם רוצים שהרכב יהיה שלכם בסוף, ואין לכם את כל הסכום עכשיו.</li>
            <li>יש לכם תוכנית ברורה לתשלום יתרת הסיום, ולא רק תקווה שהיא ״תסתדר״.</li>
            <li>בדקתם שהריבית לא גבוהה מהלוואה רגילה בבנק או מקרן ההשתלמות.</li>
          </Bullets>
          <H3>ואולי בכלל לא ליסינג?</H3>
          <p>
            הרבה פעמים, קנייה רגילה עם הלוואה זולה, או רכב יד שנייה, יוצאים זולים יותר משני סוגי הליסינג. הדרך
            היחידה לדעת היא להשוות את העלות הכוללת. <Calc>המחשבון שלנו</Calc> משווה בדיוק בין קנייה חדשה, קנייה
            יד שנייה וליסינג, לפי ההצעות שקיבלתם.
          </p>

          <H2>מה לבדוק בחוזה לפני שחותמים</H2>
          <Steps>
            <li><strong>מה בדיוק כלול בתשלום החודשי?</strong> ביטוח מקיף, חובה, טיפולים, צמיגים, אגרה, רכב חלופי.</li>
            <li><strong>כמה המקדמה, וכמה יתרת הסיום?</strong> חברו את כל הסכומים, לא רק את התשלום החודשי.</li>
            <li><strong>מה הריבית, והאם התשלום צמוד למדד?</strong></li>
            <li><strong>מה מכסת הקילומטרים, וכמה עולה כל קילומטר נוסף?</strong></li>
            <li><strong>כמה עולה לצאת מהעסקה לפני הזמן?</strong></li>
            <li><strong>איך בודקים את הרכב בהחזרה, ומה נחשב ״בלאי סביר״?</strong></li>
            <li><strong>כמה ההשתתפות העצמית בביטוח?</strong></li>
          </Steps>

          <H2>שאלות נפוצות</H2>
          <H3>אפשר לקחת ליסינג תפעולי כאדם פרטי?</H3>
          <p>
            כן. ליסינג תפעולי נפוץ בעיקר בחברות, אבל חברות הליסינג מציעות אותו גם ללקוחות פרטיים. התנאים
            והמחירים יכולים להיות שונים מאלה שחברות מקבלות.
          </p>
          <H3>מה קורה אם לא אוכל לשלם את יתרת הסיום?</H3>
          <p>
            אפשר בדרך כלל להחזיר את הרכב, או לקחת הלוואה חדשה על היתרה. הלוואה כזו מאריכה את התשלומים ומוסיפה
            ריבית. אם ערך הרכב בסוף נמוך מהיתרה, ייתכן שתצטרכו להשלים את ההפרש.
          </p>
          <H3>מה זול יותר בסוף: ליסינג או קנייה?</H3>
          <p>
            אין תשובה אחת. זה תלוי במחיר הרכב, בריבית, בכמה זמן מחזיקים אותו ובכמה הוא שומר על ערכו. על זה
            בדיוק כתבנו את המדריך <Ref to="buy-vs-lease">קנייה מול ליסינג</Ref>, ואת המחשבון.
          </p>

          <CalcCta
            title="קיבלתם הצעת ליסינג?"
            text="הזינו את התשלום החודשי ומה כלול בו, והמחשבון יראה לכם אם היא זולה יותר מקנייה, ובכמה."
            button="למחשבון"
          />
        </>
      ) : (
        <>
          <p>
            “Leasing” sounds like one thing, but in Israel it's two very different deals. Operational leasing is
            really <strong>renting</strong> a car for a few years while the company handles almost everything
            else. Private leasing (also called financial leasing) is really <strong>buying in instalments</strong>:
            the car can be yours at the end, and its costs are on you.
          </p>
          <p>Both look the same in an ad: “a new car for 1,990 ILS a month”. What sits behind that number is completely different. This guide shows how to tell.</p>

          <CalcLink>Got a lease offer? Check in the calculator whether it beats buying</CalcLink>

          <Terms
            title="The terms, in plain language"
            items={[
              ["Operational leasing", "A long-term rental, usually three years. The monthly payment includes insurance, servicing and licensing. You return the car at the end."],
              ["Private (financial) leasing", "Financing to buy a car. You pay a down payment and monthly instalments, then a large final sum to keep the car, or you hand it back."],
              ["Down payment", "Paid at the start. The higher it is, the lower the monthly payment."],
              ["Balloon (final payment)", "A large sum left to pay at the end. It is what keeps the monthly payment low."],
              ["Mileage allowance", "How many km a year you may drive at no extra charge. In operational leasing every km over it costs money."],
              ["Index linkage", "The payment rises with the consumer price index. Over a long deal that can add up."],
            ]}
          />

          <H2>The difference, in one table</H2>
          <Table
            head={["", "Operational leasing", "Private (financial) leasing"]}
            rows={[
              ["What it really is", "A long rental", "A financed purchase"],
              ["Who owns the car", "The leasing company", "The leasing company until the last payment, then possibly you"],
              ["Insurance", "Usually included", "On you, and comprehensive is usually required"],
              ["Servicing and repairs", "Included", "On you"],
              ["Licensing fee", "Included", "On you"],
              ["Replacement car, roadside help", "Usually included", "Usually not"],
              ["Fuel or electricity", "On you", "On you"],
              ["Depreciation risk", "On the company", "On you"],
              ["Down payment", "Low or none", "Usually 15% to 30% of the price"],
              ["At the end", "Return the car", "Pay the balloon and keep it, refinance it, or return the car"],
              ["Mileage allowance", "Yes, extra km cost money", "Usually none"],
            ]}
          />
          <Note>Terms vary by company and deal, and some “private leasing” deals include a service package. Always read what the contract actually says.</Note>

          <H2>Operational leasing: paying for use, not for the car</H2>
          <p>
            The leasing company buys the car and you pay monthly to use it. The payment usually covers insurance,
            servicing, licensing, roadside help and sometimes a replacement car. After about three years you hand it
            back and can take a new one.
          </p>
          <p><strong>The big plus:</strong> no surprises. You know exactly what the car costs each month and never have to sell it. The risk of it losing more value than expected stays with the company.</p>
          <p><strong>The minus:</strong> you pay for that convenience. The price includes the company's profit and the risk it takes on, and at the end you're left with nothing.</p>
          <H3>What can cost you extra</H3>
          <Bullets>
            <li><strong>Going over the mileage allowance.</strong> Every extra km is charged. Check the per-km price before signing.</li>
            <li><strong>Damage at return.</strong> The car is inspected, and scratches or dents beyond normal wear are charged separately.</li>
            <li><strong>Leaving early.</strong> Returning the car before the end means a penalty, sometimes a big one.</li>
            <li><strong>Insurance excess.</strong> Even with insurance included, you pay the excess after an accident.</li>
          </Bullets>

          <H2>Private (financial) leasing: instalments with a balloon at the end</H2>
          <p>
            You pay a down payment, then monthly instalments for a few years, and at the end there's a{" "}
            <strong>balloon</strong>: a large sum, sometimes tens of percent of the price. You can pay it and keep the
            car, take a new loan for it, or hand the car back.
          </p>
          <p>
            The monthly payment is low precisely because of that balloon. Much of the price is pushed to the end, and
            you pay interest on it the whole time. It's the same idea as a <Ref to="car-loans">balloon loan</Ref>.
          </p>
          <Example title="Example: what's behind “1,990 ILS a month”">
            <p>A 150,000 ILS car. 30,000 down, a 70,000 balloon after 3 years, 7.5% interest. The monthly payment comes to about 1,990 ILS.</p>
            <p>Over three years you've paid about 101,700 ILS (down payment plus instalments) and still owe 70,000 to own the car. Meanwhile you paid insurance, servicing and licensing separately, about 900 ILS a month.</p>
            <p><strong>Bottom line:</strong> the real monthly cost is close to 2,900 ILS, not 1,990, before fuel.</p>
          </Example>
          <Note>Worked out with a standard balloon repayment formula using the assumptions stated. Real deals may also have fees and index linkage.</Note>

          <H2>So which suits you?</H2>
          <H3>Operational leasing suits you if:</H3>
          <Bullets>
            <li>You want a fixed, known payment with no servicing, insurance or resale to worry about.</li>
            <li>You like switching to a new car every three years or so.</li>
            <li>Your mileage is predictable and fits the allowance.</li>
            <li>You're self-employed and part of the payment is deductible. See the <Ref to="tax-benefits">tax guide</Ref>.</li>
          </Bullets>
          <H3>Private leasing suits you if:</H3>
          <Bullets>
            <li>You want to own the car at the end but don't have the full amount now.</li>
            <li>You have a clear plan for paying the balloon, not just a hope it will “work out”.</li>
            <li>You've checked the rate isn't higher than a regular bank loan or a study-fund loan.</li>
          </Bullets>
          <H3>Or maybe no lease at all?</H3>
          <p>
            Often a regular purchase with a cheap loan, or a used car, costs less than either kind of lease. The only
            way to know is to compare the total cost. <Calc>Our calculator</Calc> compares buying new, buying used and
            leasing, using the offers you received.
          </p>

          <H2>What to check in the contract before signing</H2>
          <Steps>
            <li><strong>What exactly does the monthly payment include?</strong> Comprehensive and mandatory insurance, servicing, tyres, licensing, replacement car.</li>
            <li><strong>How big are the down payment and the balloon?</strong> Add up every sum, not just the monthly one.</li>
            <li><strong>What's the interest rate, and is the payment index-linked?</strong></li>
            <li><strong>What's the mileage allowance, and what does each extra km cost?</strong></li>
            <li><strong>What does leaving early cost?</strong></li>
            <li><strong>How is the car inspected at return, and what counts as normal wear?</strong></li>
            <li><strong>What's the insurance excess?</strong></li>
          </Steps>

          <H2>Common questions</H2>
          <H3>Can a private person take operational leasing?</H3>
          <p>Yes. It's most common with companies, but leasing firms offer it to private customers too, sometimes on different terms and prices.</p>
          <H3>What if I can't pay the balloon?</H3>
          <p>You can usually return the car or take a new loan for the balance. That stretches the payments and adds interest. If the car is worth less than the balloon at the end, you may have to cover the gap.</p>
          <H3>Which is cheaper in the end, leasing or buying?</H3>
          <p>There's no single answer. It depends on the price, the rate, how long you keep the car and how well it holds value. That's what the <Ref to="buy-vs-lease">buying vs leasing guide</Ref> and the calculator are for.</p>

          <CalcCta
            title="Got a lease offer?"
            text="Enter the monthly payment and what it includes, and the calculator shows whether it beats buying, and by how much."
            button="Open the calculator"
          />
        </>
      )}
    </GuideShell>
  );
}
