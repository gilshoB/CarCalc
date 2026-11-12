import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { GuideShell, H2, Calc, CalcLink, CalcCta, Terms, Example, Bullets, Steps, Table, Note } from "@/components/guide";

export const metadata: Metadata = {
  title: "קנייה או ליסינג: מה משתלם יותר? מדריך למתחילים | CarCalc",
  description:
    "מה ההבדל בין ליסינג תפעולי, ליסינג מימוני ומימון, מה באמת עולה כסף ברכב, ודוגמה מלאה במספרים. מדריך בשפה פשוטה.",
  alternates: { canonical: "/guides/buy-vs-lease" },
};

export default async function BuyVsLeasePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <GuideShell
      locale={locale}
      path="/guides/buy-vs-lease"
      illustration="buy-vs-lease"
      title={isHe ? "קנייה או ליסינג: מה ההבדל, ומה משתלם יותר?" : "Buying or leasing: what’s the difference, and which costs less?"}
      description={
        isHe
          ? "ההבדל בין ליסינג תפעולי, ליסינג מימוני ומימון, מה באמת עולה כסף ברכב, ודוגמה מלאה במספרים."
          : "Operating lease, finance lease and car loans explained, what a car really costs, and a full worked example."
      }
    >
      {isHe ? (
        <>
          <p>
            רוב האנשים משווים בין קנייה לליסינג לפי התשלום החודשי. זו ההשוואה הלא נכונה. תשלום חודשי נמוך
            יכול להסתיר עסקה יקרה, ותשלום גבוה יכול לכלול דברים שבקנייה הייתם משלמים עליהם בנפרד.
          </p>
          <p>
            מה שצריך להשוות הוא כמה כסף יצא לכם מהכיס בסוף התקופה, אחרי שמחשבים את הכול: מה שילמתם, ומה נשאר
            לכם ביד. המדריך הזה מסביר את המושגים, מראה מה נכנס לחשבון, ועובר על דוגמה אחת מההתחלה ועד הסוף.
          </p>

          <CalcLink>כבר יש לכם הצעות מחיר? דלגו ישר למחשבון</CalcLink>

          <Terms
            title="המושגים, בשפה פשוטה"
            items={[
              ["קנייה במזומן", "משלמים את כל מחיר הרכב מהכסף שלכם. הרכב שלכם, ואין תשלומים חודשיים."],
              [
                "מימון (הלוואה לרכב)",
                "קונים את הרכב, אבל חלק מהמחיר מגיע מהלוואה: מהבנק, מחברת מימון או דרך הסוכנות. הרכב שלכם, ואתם מחזירים את ההלוואה בתשלומים חודשיים עם ריבית. לרוב הרכב משועבד למלווה עד שמסיימים לשלם.",
              ],
              [
                "ליסינג תפעולי",
                "שכירות של רכב לתקופה ארוכה, בדרך כלל שנתיים עד ארבע שנים. הרכב רשום על שם חברת הליסינג. משלמים סכום חודשי קבוע, שכולל בדרך כלל טיפולים, ביטוחים ואגרת רישוי. בסוף התקופה מחזירים את הרכב, ולא נשאר לכם ממנו כלום.",
              ],
              ["ליסינג פרטי", "ליסינג תפעולי שאדם פרטי לוקח בעצמו, ולא דרך מקום העבודה. אותו רעיון בדיוק."],
              [
                "ליסינג מימוני",
                "למרות השם, זו בעצם דרך לממן קנייה. חברת הליסינג קונה את הרכב, ואתם משלמים לה תשלומים חודשיים. בסוף התקופה הרכב עובר לבעלותכם, לפעמים אחרי תשלום אחרון גדול. הטיפולים, הביטוח וירידת הערך עליכם, כמו בקנייה רגילה.",
              ],
              [
                "רכב צמוד מהעבודה",
                "רכב שהמעסיק מעמיד לרשותכם, בדרך כלל בליסינג תפעולי שהוא משלם. אתם משלמים על זה מס דרך התלוש, מה שנקרא שווי שימוש.",
              ],
              [
                "פחת",
                "הסכום שהרכב מאבד מערכו עם הזמן. קניתם ב-150,000 ₪ ומכרתם אחרי שלוש שנים ב-100,000 ₪? הפחת עלה לכם 50,000 ₪.",
              ],
              ["ערך שארית", "כמה הרכב שווה בסוף התקופה. זה הכסף שחוזר אליכם כשמוכרים."],
              ["מקדמה", "תשלום חד-פעמי בתחילת עסקת ליסינג. היא חלק מהמחיר, ולא מקבלים אותה בחזרה."],
              [
                "מגבלת קילומטרים",
                "כמה מותר לנסוע בשנה לפי חוזה הליסינג, למשל 15,000 או 20,000 ק״מ. על כל קילומטר מעבר לזה משלמים תוספת.",
              ],
              ["השתתפות עצמית", "הסכום שאתם משלמים מהכיס בכל תביעת ביטוח, גם כשיש ביטוח מקיף."],
              [
                "עלות ההזדמנות",
                "מה שהכסף שלכם היה מרוויח אילו לא היה תקוע ברכב. מי ששם 150,000 ₪ על רכב מוותר על הרווח שהיה מקבל מהשקעה של אותו סכום.",
              ],
            ]}
          />

          <H2>ליסינג תפעולי, ליסינג מימוני ומימון: מי הבעלים ומי משלם על מה</H2>
          <p>
            שלוש האפשרויות נשמעות דומות, אבל הן שונות בשאלה אחת: של מי הרכב בסוף. מזה נגזר כל השאר.
          </p>
          <Table
            head={["", "קנייה (במזומן או בהלוואה)", "ליסינג מימוני", "ליסינג תפעולי"]}
            rows={[
              ["של מי הרכב", "שלכם", "של חברת הליסינג עד סוף התשלומים, ואז שלכם", "של חברת הליסינג"],
              ["מה משלמים", "את מחיר הרכב, או החזר הלוואה", "תשלום חודשי, ולפעמים תשלום גדול בסוף", "תשלום חודשי קבוע"],
              ["טיפולים וביטוח", "עליכם", "עליכם", "בדרך כלל כלולים"],
              ["מי סופג את ירידת הערך", "אתם", "אתם", "חברת הליסינג"],
              ["מה קורה בסוף", "הרכב נשאר אצלכם, או שמוכרים אותו", "הרכב נשאר אצלכם", "מחזירים את הרכב"],
            ]}
          />
          <p>
            מבחינת הכסף, ליסינג מימוני דומה מאוד לקנייה בהלוואה. לכן ההתלבטות האמיתית היא בין שתי אפשרויות:
            רכב שהוא שלכם (במזומן, בהלוואה או בליסינג מימוני), מול רכב ששוכרים (ליסינג תפעולי).
          </p>

          <H2>מה באמת עולה כסף ברכב</H2>
          <p>כשקונים רכב, מחיר הרכב הוא לא העלות. העלות היא סכום של כמה דברים:</p>
          <Bullets>
            <li>
              <strong>פחת.</strong> ההפרש בין המחיר שקניתם לבין המחיר שתמכרו. ברוב המקרים זו ההוצאה הכי גדולה,
              והיא לא מופיעה באף חשבונית.
            </li>
            <li>
              <strong>ריבית.</strong> אם לקחתם הלוואה, הריבית והעמלות הן תוספת למחיר הרכב.
            </li>
            <li>
              <strong>ביטוח.</strong> ביטוח חובה וביטוח מקיף, כל שנה מחדש.
            </li>
            <li>
              <strong>אגרת רישוי וטסט.</strong> האגרה השנתית נקבעת לפי מחיר המחירון של הרכב ושנת הייצור שלו.
            </li>
            <li>
              <strong>טיפולים ותיקונים.</strong> טיפול תקופתי, צמיגים, בלמים, ומה שמתקלקל.
            </li>
            <li>
              <strong>דלק או חשמל.</strong> משלמים אותם גם בקנייה וגם בליסינג.
            </li>
            <li>
              <strong>הכסף שתקוע ברכב.</strong> סכום ששמתם על הרכב לא מושקע במקום אחר. זו עלות ההזדמנות.
            </li>
          </Bullets>
          <p>
            בליסינג תפעולי רוב הסעיפים האלה כבר בתוך התשלום החודשי. לכן אי אפשר להשוות את התשלום החודשי של
            ליסינג להחזר החודשי של הלוואה. הם לא כוללים את אותם דברים.
          </p>

          <H2>דוגמה: רכב של 150,000 ₪ לשלוש שנים</H2>
          <p>
            ניקח רכב בנזין חדש שעולה 150,000 ₪, 15,000 ק״מ בשנה, ושלוש שנים. את הדלק לא נחשב, כי הוא זהה בשתי
            האפשרויות.
          </p>
          <Example title="אפשרות א׳: קנייה במזומן">
            <Table
              head={["סעיף", "עלות לשלוש שנים"]}
              rows={[
                ["פחת (הרכב שווה כ-109,300 ₪ בסוף)", "40,700 ₪"],
                ["ביטוח חובה ומקיף (6,000 ₪ בשנה)", "18,000 ₪"],
                ["אגרת רישוי", "5,800 ₪"],
                ["טיפולים", "6,750 ₪"],
                [<strong key="t">סך הכול</strong>, <strong key="v">כ-71,300 ₪, שהם כ-2,000 ₪ לחודש</strong>],
              ]}
            />
          </Example>
          <Example title="אפשרות ב׳: ליסינג תפעולי">
            <p>
              הצעה של 2,900 ₪ לחודש, שכוללת ביטוחים, טיפולים ואגרת רישוי. 2,900 כפול 36 חודשים הם{" "}
              <strong>104,400 ₪</strong>.
            </p>
          </Example>
          <p>
            לפי החשבון הזה הקנייה זולה בכ-33,000 ₪. אבל חסר בו דבר אחד: מי שקנה שם 150,000 ₪ על הרכב. מי שלקח
            ליסינג השאיר את הכסף אצלו. אם הכסף הזה מושקע ומרוויח 6% בשנה, אחרי שלוש שנים ומס על הרווח נוספו לו
            כ-21,500 ₪. עכשיו הפער הוא כ-11,500 ₪.
          </p>
          <p>
            ומה אם הרכב יימכר ב-100,000 ₪ במקום 109,000 ₪, וחלק מהקנייה ממומן בהלוואה בריבית של 7%? הפער
            נמחק, והליסינג יכול לצאת זול יותר. זו הנקודה: התשובה תלויה במספרים שלכם, ושינוי קטן באחד מהם הופך את התוצאה. בשביל זה
            בנינו את <Calc>המחשבון</Calc>.
          </p>

          <H2>מתי קנייה בדרך כלל זולה יותר</H2>
          <Bullets>
            <li>כשמחזיקים את הרכב הרבה שנים. רוב ירידת הערך קורית בשנים הראשונות, וכל שנה נוספת זולה יותר.</li>
            <li>כשקונים רכב בן שנתיים או שלוש. מישהו אחר כבר שילם על הפחת הכבד של ההתחלה.</li>
            <li>כשיש לכם את הכסף, או שאתם מקבלים הלוואה בריבית נמוכה.</li>
            <li>כשהדגם שומר על ערכו ונמכר בקלות.</li>
            <li>כשאתם נוסעים הרבה, ומגבלת הקילומטרים בליסינג הייתה עולה לכם ביוקר.</li>
          </Bullets>

          <H2>מתי ליסינג שווה את הכסף</H2>
          <Bullets>
            <li>כשאתם מחליפים רכב כל שלוש שנים בכל מקרה. אז אתם משלמים את הפחת הכבד שוב ושוב גם בקנייה.</li>
            <li>כשאין לכם הון עצמי, והחלופה היא הלוואה יקרה.</li>
            <li>כשהכסף שלכם מושקע ומרוויח יותר ממה שהליסינג עולה לכם.</li>
            <li>כשאתם לא רוצים סיכון: לא הפתעות במוסך, ולא שאלה בכמה הרכב יימכר.</li>
            <li>
              כשאתם עוסק מורשה. לעצמאים יש שיקולי מס שמשנים את החשבון, ועליהם יש{" "}
              <a href="/guides/tax-benefits" className="font-bold text-ink underline underline-offset-4">מדריך נפרד</a>.
            </li>
          </Bullets>

          <H2>מה לבדוק בחוזה ליסינג לפני שחותמים</H2>
          <Bullets>
            <li>
              <strong>מה כלול בתשלום.</strong> ביטוח חובה? ביטוח מקיף? טיפולים? צמיגים? רכב חלופי? מה שלא כלול,
              תשלמו בנפרד.
            </li>
            <li>
              <strong>מגבלת הקילומטרים.</strong> כמה מותר לנסוע בשנה, וכמה עולה כל קילומטר נוסף.
            </li>
            <li>
              <strong>ההשתתפות העצמית.</strong> כמה תשלמו על כל תאונה או נזק. בליסינג היא לפעמים גבוהה.
            </li>
            <li>
              <strong>יציאה מוקדמת.</strong> מה הקנס אם תרצו להחזיר את הרכב לפני סוף החוזה.
            </li>
            <li>
              <strong>נהג צעיר או חדש.</strong> האם מותר לו לנהוג, וכמה זה מוסיף.
            </li>
            <li>
              <strong>החזרת הרכב.</strong> על אילו שריטות ונזקים תחויבו בסוף.
            </li>
            <li>
              <strong>הצמדה למדד.</strong> האם התשלום החודשי קבוע, או שהוא עולה עם המדד.
            </li>
          </Bullets>

          <H2>איך משווים נכון, בארבעה צעדים</H2>
          <Steps>
            <li>בקשו הצעת מחיר לליסינג והצעת מחיר לקנייה, עדיף לאותו רכב בדיוק.</li>
            <li>בדקו מה הליסינג כולל, ובקשו הצעות לביטוח חובה ומקיף למקרה של קנייה.</li>
            <li>השוו לאותה תקופה: אורך חוזה הליסינג.</li>
            <li>
              הזינו את הכול ב<Calc>מחשבון</Calc>. הוא מחשב את הפחת, האגרות, הריבית ועלות ההזדמנות, ומראה כמה כל
              אפשרות עולה בסך הכול ולחודש.
            </li>
          </Steps>

          <Note>
            המספרים בדוגמה הם הערכות לצורך המחשה. מחירי ביטוח, ליסינג וריבית משתנים מאדם לאדם ומחודש לחודש.
          </Note>

          <CalcCta
            title="מה משתלם יותר במקרה שלכם?"
            text="הזינו את הצעות המחיר שקיבלתם, והמחשבון יראה כמה תעלה כל אפשרות בסך הכול ולחודש."
            button="למחשבון"
          />
        </>
      ) : (
        <>
          <p>
            Most people compare buying and leasing by the monthly payment. That is the wrong comparison. A low
            monthly payment can hide an expensive deal, and a high one can include things you would pay for
            separately if you bought.
          </p>
          <p>
            What you should compare is how much money has left your pocket by the end of the period, counting
            what you paid and what you still hold. This guide explains the terms, shows what goes into the
            sum, and walks through one example from start to finish.
          </p>

          <CalcLink>Already have quotes? Go straight to the calculator</CalcLink>

          <Terms
            title="The terms, in plain language"
            items={[
              ["Buying with cash", "You pay the full price from your own money. The car is yours and there are no monthly payments."],
              [
                "Financing (a car loan)",
                "You buy the car, but part of the price comes from a loan: a bank, a finance company or the dealership. The car is yours and you repay the loan monthly, with interest. The lender usually holds a lien on the car until you finish paying.",
              ],
              [
                "Operating lease (ליסינג תפעולי)",
                "A long-term rental, usually two to four years. The car is registered to the leasing company. You pay a fixed monthly amount that normally covers servicing, insurance and the registration fee. At the end you hand the car back and keep nothing.",
              ],
              ["Private lease", "An operating lease taken by an individual rather than through an employer. Same idea."],
              [
                "Finance lease (ליסינג מימוני)",
                "Despite the name, this is a way to finance a purchase. The leasing company buys the car and you pay it monthly. At the end the car becomes yours, sometimes after a large final payment. Servicing, insurance and the loss in value are yours, as with any purchase.",
              ],
              [
                "Company car",
                "A car your employer provides, usually on an operating lease it pays for. You pay tax on it through your payslip, known as the usage value (שווי שימוש).",
              ],
              [
                "Depreciation",
                "The value the car loses over time. Bought for 150,000 ILS and sold three years later for 100,000 ILS? Depreciation cost you 50,000 ILS.",
              ],
              ["Residual value", "What the car is worth at the end of the period. This is the money you get back when you sell."],
              ["Down payment", "A one-off payment at the start of a lease. It is part of the price and you do not get it back."],
              [
                "Mileage limit",
                "How far the lease lets you drive each year, for example 15,000 or 20,000 km. Every kilometre beyond that costs extra.",
              ],
              ["Deductible", "The amount you pay out of pocket on each insurance claim, even with comprehensive cover."],
              [
                "Opportunity cost",
                "What your money would have earned had it not been tied up in the car. Put 150,000 ILS into a car and you give up the return on investing that sum.",
              ],
            ]}
          />

          <H2>Operating lease, finance lease and a loan: who owns the car and who pays for what</H2>
          <p>The three sound alike, but they differ on one question: whose car is it at the end. Everything else follows.</p>
          <Table
            head={["", "Buying (cash or loan)", "Finance lease", "Operating lease"]}
            rows={[
              ["Who owns the car", "You", "The leasing company until you finish paying, then you", "The leasing company"],
              ["What you pay", "The price, or loan repayments", "A monthly payment, sometimes a large final one", "A fixed monthly payment"],
              ["Servicing and insurance", "Yours", "Yours", "Usually included"],
              ["Who absorbs the loss in value", "You", "You", "The leasing company"],
              ["What happens at the end", "You keep the car or sell it", "You keep the car", "You return the car"],
            ]}
          />
          <p>
            Financially, a finance lease is very close to buying with a loan. So the real choice is between two
            options: a car that is yours (cash, loan or finance lease) and a car you rent (operating lease).
          </p>

          <H2>What a car really costs</H2>
          <p>When you buy, the price of the car is not the cost. The cost is the sum of several things:</p>
          <Bullets>
            <li>
              <strong>Depreciation.</strong> The gap between what you paid and what you sell for. Usually the
              biggest expense, and it appears on no invoice.
            </li>
            <li>
              <strong>Interest.</strong> If you took a loan, the interest and fees come on top of the price.
            </li>
            <li>
              <strong>Insurance.</strong> Mandatory and comprehensive, renewed every year.
            </li>
            <li>
              <strong>Registration fee and annual test.</strong> The yearly fee depends on the car’s list price
              and year of manufacture.
            </li>
            <li>
              <strong>Servicing and repairs.</strong> Routine services, tyres, brakes and whatever breaks.
            </li>
            <li>
              <strong>Fuel or electricity.</strong> You pay these whether you buy or lease.
            </li>
            <li>
              <strong>The money tied up in the car.</strong> Money spent on the car is not invested elsewhere.
              That is the opportunity cost.
            </li>
          </Bullets>
          <p>
            In an operating lease most of these are already inside the monthly payment. That is why you cannot
            compare a lease payment with a loan repayment. They do not cover the same things.
          </p>

          <H2>Example: a 150,000 ILS car over three years</H2>
          <p>
            Take a new petrol car at 150,000 ILS, 15,000 km a year, three years. Fuel is left out because it is
            the same either way.
          </p>
          <Example title="Option A: buying with cash">
            <Table
              head={["Item", "Cost over three years"]}
              rows={[
                ["Depreciation (car worth about 109,300 ILS at the end)", "40,700 ILS"],
                ["Mandatory and comprehensive insurance (6,000 a year)", "18,000 ILS"],
                ["Registration fee", "5,800 ILS"],
                ["Servicing", "6,750 ILS"],
                [<strong key="t">Total</strong>, <strong key="v">about 71,300 ILS, roughly 2,000 a month</strong>],
              ]}
            />
          </Example>
          <Example title="Option B: operating lease">
            <p>
              A quote of 2,900 ILS a month, including insurance, servicing and registration. 2,900 times 36
              months is <strong>104,400 ILS</strong>.
            </p>
          </Example>
          <p>
            On these numbers buying is about 33,000 ILS cheaper. But one thing is missing: the buyer put 150,000
            ILS into the car. The lessee kept that money. Invested at 6% a year, after three years and tax on
            the gain it has grown by about 21,500 ILS. Now the gap is about 11,500 ILS.
          </p>
          <p>
            What if the car sells for 100,000 ILS instead of 109,000, and part of the purchase is financed at 7%
            interest? The gap disappears and leasing can come out cheaper. That is the point: the answer depends on your numbers, and a small
            change in one of them flips the result. That is what <Calc>the calculator</Calc> is for.
          </p>

          <H2>When buying is usually cheaper</H2>
          <Bullets>
            <li>When you keep the car for many years. Most of the value is lost early, so each extra year is cheaper.</li>
            <li>When you buy a two- or three-year-old car. Someone else already paid for the steep early depreciation.</li>
            <li>When you have the cash, or can borrow at a low rate.</li>
            <li>When the model holds its value and sells easily.</li>
            <li>When you drive a lot and a lease mileage limit would cost you dearly.</li>
          </Bullets>

          <H2>When leasing is worth the money</H2>
          <Bullets>
            <li>When you change cars every three years anyway. Then you pay the steep early depreciation again and again even when buying.</li>
            <li>When you have no savings and the alternative is an expensive loan.</li>
            <li>When your money is invested and earns more than the lease costs you.</li>
            <li>When you want no risk: no garage surprises and no question about the resale price.</li>
            <li>
              When you are a registered business. The self-employed have tax considerations that change the sum;
              see the{" "}
              <a href="/guides/tax-benefits" className="font-bold text-ink underline underline-offset-4">separate guide</a>.
            </li>
          </Bullets>

          <H2>What to check in a lease contract before signing</H2>
          <Bullets>
            <li>
              <strong>What the payment includes.</strong> Mandatory insurance? Comprehensive? Servicing? Tyres?
              A replacement car? Whatever is not included, you pay separately.
            </li>
            <li>
              <strong>The mileage limit.</strong> How far you may drive each year, and the price of each extra kilometre.
            </li>
            <li>
              <strong>The deductible.</strong> What you pay on each accident or damage claim. In leases it can be high.
            </li>
            <li>
              <strong>Early exit.</strong> The penalty for returning the car before the contract ends.
            </li>
            <li>
              <strong>Young or new drivers.</strong> Whether they may drive, and what it adds.
            </li>
            <li>
              <strong>Returning the car.</strong> Which scratches and damage you will be charged for.
            </li>
            <li>
              <strong>Index linkage.</strong> Whether the payment is fixed or rises with the consumer price index.
            </li>
          </Bullets>

          <H2>How to compare properly, in four steps</H2>
          <Steps>
            <li>Get a lease quote and a purchase quote, ideally for exactly the same car.</li>
            <li>Check what the lease includes, and get mandatory and comprehensive insurance quotes for the purchase.</li>
            <li>Compare over the same period: the length of the lease contract.</li>
            <li>
              Enter everything in <Calc>the calculator</Calc>. It works out depreciation, fees, interest and
              opportunity cost, and shows what each option costs in total and per month.
            </li>
          </Steps>

          <Note>
            The numbers in the example are estimates for illustration. Insurance, lease and interest prices vary
            from person to person and month to month.
          </Note>

          <CalcCta
            title="Which is cheaper in your case?"
            text="Enter the quotes you received and the calculator shows what each option costs in total and per month."
            button="Open the calculator"
          />
        </>
      )}
    </GuideShell>
  );
}
