import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { GuideShell, H2, H3, Calc, CalcLink, CalcCta, Terms, Example, Bullets, Steps, Table, Note, Ref } from "@/components/guide";

export const metadata: Metadata = {
  title: "הלוואה לרכב: איפה כדאי לקחת וכמה זה עולה | CarCalc",
  description:
    "איפה כדאי לקחת הלוואה לרכב: בנק, קרן השתלמות, סוכנות או חברת מימון. כמה ריבית משלמים בפועל, מה זה בלון ושעבוד, ומה לשאול לפני שחותמים.",
  alternates: { canonical: "/guides/car-loans" },
};

export default async function CarLoansGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <GuideShell
      locale={locale}
      path="/guides/car-loans"
      illustration="car-loans"
      title={isHe ? "הלוואה לרכב: איפה כדאי לקחת, וכמה זה באמת עולה" : "Car loans: where to borrow, and what it really costs"}
      description={
        isHe
          ? "איפה כדאי לקחת הלוואה לרכב, כמה ריבית משלמים בפועל, ומה לשאול לפני שחותמים."
          : "Where to get a car loan in Israel, how much interest you actually pay, and what to ask before signing."
      }
    >
      {isHe ? (
        <>
          <p>
            הלוואה לרכב היא מוצר שקל מאוד לקבל וקל מאוד לשלם עליו יותר מדי. בסוכנות יציעו לכם מימון תוך כמה
            דקות, והשאלה היחידה שישאלו היא ״כמה נוח לכם לשלם בחודש״. זו בדיוק השאלה שמייקרת הלוואות.
          </p>
          <p>
            המדריך הזה מסביר מאיפה אפשר לקחת הלוואה, איך יודעים כמה היא עולה, ואילו שאלות חוסכות אלפי שקלים.
          </p>

          <CalcLink>רוצים לראות כמה ההלוואה מוסיפה לעלות הרכב? למחשבון</CalcLink>

          <Terms
            title="המושגים, בשפה פשוטה"
            items={[
              ["מימון", "מילה אחרת להלוואה לקניית רכב. כשבסוכנות אומרים ״מימון״, מתכוונים להלוואה."],
              ["קרן", "הסכום שלוויתם. אם לקחתם 90,000 ₪, זו הקרן."],
              ["ריבית", "המחיר של ההלוואה. משלמים אותה בנוסף לקרן, והיא נקובה באחוזים לשנה."],
              [
                "ריבית הפריים",
                "ריבית הבסיס של הבנקים: ריבית בנק ישראל ועוד 1.5%. הלוואות רבות מתומחרות כ״פריים ועוד משהו״, למשל פריים + 2%.",
              ],
              [
                "ריבית קבועה וריבית משתנה",
                "ריבית קבועה לא משתנה לאורך ההלוואה. ריבית משתנה צמודה לפריים: אם בנק ישראל מעלה את הריבית, ההחזר החודשי שלכם עולה.",
              ],
              [
                "לוח שפיצר",
                "שיטת ההחזר הנפוצה: משלמים אותו סכום בכל חודש. בהתחלה רוב התשלום הוא ריבית, ובהמשך רובו קרן.",
              ],
              [
                "הלוואת בלון",
                "הלוואה שבה חלק גדול מהקרן לא מוחזר בתשלומים החודשיים, אלא בתשלום אחד גדול בסוף. ההחזר החודשי נמוך, אבל משלמים יותר ריבית.",
              ],
              [
                "שעבוד",
                "רישום שאומר שהרכב משמש בטוחה להלוואה. אי אפשר למכור רכב משועבד בלי לסלק את ההלוואה, ואם לא משלמים, המלווה יכול לקחת את הרכב.",
              ],
              ["עמלת פתיחת תיק", "תשלום חד-פעמי על העמדת ההלוואה. היא חלק מהעלות, גם אם היא לא נקראת ריבית."],
              ["פירעון מוקדם", "סגירת ההלוואה לפני הזמן. בחלק מההלוואות זה כרוך בעמלה."],
              ["טרייד-אין", "מסירת הרכב הישן לסוכנות כחלק מהתשלום על הרכב החדש."],
            ]}
          />

          <H2>כמה הלוואה צריך בכלל</H2>
          <p>החשבון פשוט: מחיר הרכב, פחות הכסף שיש לכם, פחות מה שתקבלו על הרכב הישן.</p>
          <Example title="דוגמה">
            <p>
              הרכב עולה 150,000 ₪. יש לכם 40,000 ₪ בחיסכון, ואת הרכב הישן תמכרו ב-20,000 ₪. ההלוואה שאתם
              צריכים היא <strong>90,000 ₪</strong>.
            </p>
          </Example>
          <p>
            כל שקל שאתם מביאים מהבית הוא שקל שלא משלמים עליו ריבית. מצד שני, לא כדאי לרוקן את כל החיסכון
            ולהישאר בלי כרית ביטחון.
          </p>

          <H2>איפה כדאי לקחת הלוואה לרכב</H2>
          <p>
            אין מקום אחד שהוא תמיד הזול ביותר. הריבית תלויה בכם: בהכנסה, בהיסטוריית האשראי, ובשאלה אם יש
            בטוחה. לכן כדאי לבקש הצעות מכמה מקורות. אלה האפשרויות:
          </p>

          <H3>1. הלוואה כנגד קרן השתלמות או קופת גמל</H3>
          <p>
            אם יש לכם קרן השתלמות, זו בדרך כלל האפשרות הזולה ביותר. הגוף שמנהל את הקרן מלווה לכם כסף, והקרן
            משמשת בטוחה. הכסף בקרן נשאר מושקע וממשיך להרוויח. הריבית לרוב נמוכה משמעותית מהלוואה רגילה בבנק.
            החיסרון: אפשר ללוות רק חלק מהסכום שצברתם.
          </p>

          <H3>2. הבנק שלכם</H3>
          <p>
            הבנק מכיר אתכם, והתהליך מהיר. הריבית תלויה בדירוג שלכם אצלו, והיא כמעט תמיד פתוחה למשא ומתן. אל
            תקבלו את ההצעה הראשונה באפליקציה. דברו עם בנקאי, ותגידו שאתם בודקים גם במקומות אחרים.
          </p>

          <H3>3. בנק אחר</H3>
          <p>
            מותר לקחת הלוואה גם מבנק שאין לכם בו חשבון. בנקים רוצים לקוחות חדשים, ולפעמים ההצעה שלהם טובה
            יותר משל הבנק שלכם. גם אם לא תיקחו אותה, היא קלף מיקוח.
          </p>

          <H3>4. מימון דרך הסוכנות או היבואן</H3>
          <p>
            הכי נוח: הכול נסגר במקום אחד. אבל הסוכנות מרוויחה על ההלוואה, והריבית שם לא תמיד תחרותית. כשמציעים
            לכם מימון בסוכנות, בקשו את הריבית השנתית ואת העלות הכוללת, והשוו להצעה מהבנק. ההלוואה הזו כמעט
            תמיד כוללת שעבוד של הרכב.
          </p>

          <H3>5. חברות כרטיסי האשראי</H3>
          <p>
            הלוואה מהירה, בלי קשר לבנק. הריבית בדרך כלל גבוהה יותר מאשר בבנק, אבל לפעמים יש מבצעים. מתאים
            כשצריך להשלים סכום קטן.
          </p>

          <H3>6. חברות מימון חוץ-בנקאיות</H3>
          <p>
            הן מאשרות גם מי שהבנק סירב לו, ולכן הריבית שלהן היא בדרך כלל הגבוהה ביותר. אם זו האפשרות היחידה
            שלכם, שווה לעצור ולשאול אם הרכב הזה לא יקר מדי בשבילכם כרגע.
          </p>

          <H2>כמה ההלוואה עולה: אותה הלוואה, ארבע תוצאות</H2>
          <p>הנה הלוואה של 90,000 ₪ בתנאים שונים:</p>
          <Table
            head={["ריבית ותקופה", "החזר חודשי", "סך הריבית"]}
            rows={[
              ["7% לשלוש שנים", "2,779 ₪", "כ-10,000 ₪"],
              ["7% לחמש שנים", "1,782 ₪", "כ-16,900 ₪"],
              ["6% לחמש שנים", "1,740 ₪", "כ-14,400 ₪"],
              ["9% לחמש שנים", "1,868 ₪", "כ-22,100 ₪"],
            ]}
          />
          <p>שלושה דברים שכדאי לראות בטבלה:</p>
          <Bullets>
            <li>
              <strong>תקופה ארוכה נראית זולה ועולה יותר.</strong> ההחזר לחמש שנים נמוך ב-1,000 ₪ בחודש, אבל
              הריבית הכוללת גבוהה ב-6,900 ₪.
            </li>
            <li>
              <strong>אחוז אחד שווה אלפי שקלים.</strong> ההבדל בין 6% ל-7% הוא רק 42 ₪ בחודש, אבל 2,500 ₪ על
              כל התקופה.
            </li>
            <li>
              <strong>ההחזר החודשי מטעה.</strong> בין ההלוואה הזולה ליקרה יש הפרש של 128 ₪ בחודש, ושל 7,700 ₪
              בסך הכול.
            </li>
          </Bullets>
          <p>הריביות בטבלה הן להמחשה. הריבית שתקבלו תלויה בריבית הפריים באותו זמן ובנתונים שלכם.</p>

          <H2>הלוואת בלון: החזר נמוך, חשבון גדול בסוף</H2>
          <p>
            בהלוואת בלון דוחים חלק מהקרן לסוף התקופה. ההחזר החודשי קטן, וזה מה שהופך אותה לקלה למכירה.
          </p>
          <Example title="אותן 90,000 ₪, עם בלון של 40,000 ₪">
            <p>
              ב-7% לחמש שנים ההחזר החודשי יורד מ-1,782 ₪ ל-1,223 ₪. אבל בסוף חמש השנים אתם עדיין חייבים
              40,000 ₪ בתשלום אחד, והריבית הכוללת עולה מ-16,900 ₪ ל-23,400 ₪.
            </p>
          </Example>
          <p>
            בלון מתאים רק אם ברור לכם מאיפה יגיע הכסף בסוף. מי שמתכנן לשלם את הבלון ממכירת הרכב צריך לזכור
            שהרכב יהיה שווה אז הרבה פחות. כמה פחות? זה מוסבר ב<Ref to="depreciation">מדריך הפחת</Ref>.
          </p>

          <H2>מימון ב-0% ריבית: איפה המלכוד</H2>
          <p>אף אחד לא מלווה כסף בחינם. כשמציעים 0% ריבית, המחיר מסתתר במקום אחר:</p>
          <Bullets>
            <li>מחיר הרכב מלא, בלי ההנחה שהייתם מקבלים במזומן.</li>
            <li>ה-0% חל רק על חלק מהסכום או על תקופה קצרה.</li>
            <li>יש עמלת פתיחת תיק או דמי טיפול גבוהים.</li>
          </Bullets>
          <p>
            הבדיקה פשוטה: שאלו כמה עולה הרכב במזומן, וכמה תשלמו בסך הכול במסלול ה-0%. ההפרש הוא הריבית
            האמיתית.
          </p>

          <H2>שש שאלות לפני שחותמים</H2>
          <Steps>
            <li>מה הריבית השנתית, והאם היא קבועה או צמודה לפריים?</li>
            <li>כמה אשלם בסך הכול עד סוף ההלוואה, כולל כל העמלות?</li>
            <li>יש עמלת פתיחת תיק? כמה?</li>
            <li>יש תשלום גדול בסוף (בלון)?</li>
            <li>הרכב משועבד? ומה נדרש ממני בביטוח?</li>
            <li>כמה יעלה לי לסגור את ההלוואה מוקדם?</li>
          </Steps>
          <p>
            שאלה מספר 2 היא החשובה ביותר. מלווה חייב להציג לכם את העלות הכוללת של ההלוואה, ואיתה אפשר להשוות
            בין הצעות שנראות שונות לגמרי.
          </p>

          <H2>הלוואה או מזומן?</H2>
          <p>
            אם יש לכם את הכסף, השאלה היא מה הוא עושה כשהוא לא ברכב. אם הוא יושב בעובר ושב, עדיף לשלם במזומן
            ולחסוך את הריבית. אם הוא מושקע ומרוויח יותר מריבית ההלוואה, אולי עדיף להשאיר אותו שם. רק זכרו
            שריבית על הלוואה היא ודאית, ורווח מהשקעה הוא לא.
          </p>

          <H2>ההלוואה במחשבון</H2>
          <p>
            ב<Calc>מחשבון</Calc> מזינים כמה כסף יש לכם וכמה שווה הרכב הישן, והוא מחשב לבד כמה הלוואה צריך.
            אחר כך מזינים ריבית ותקופה, ורואים את ההחזר החודשי, את סך הריבית, ואיך ההלוואה משנה את ההשוואה מול
            ליסינג.
          </p>

          <Note>
            המדריך נותן מידע כללי ואינו ייעוץ פיננסי. תנאי הלוואות משתנים בין מלווים ולאורך זמן, וכדאי לבדוק
            הצעות עדכניות.
          </Note>

          <CalcCta
            title="כמה ההלוואה תוסיף למחיר הרכב?"
            text="הזינו ריבית ותקופה, וראו את ההחזר החודשי, את סך הריבית, ואם ליסינג יוצא זול יותר."
            button="למחשבון"
          />
        </>
      ) : (
        <>
          <p>
            A car loan is very easy to get and very easy to overpay for. A dealership will offer you financing
            in minutes, and the only question it asks is “how much is comfortable per month”. That is exactly
            the question that makes loans expensive.
          </p>
          <p>This guide explains where you can borrow, how to tell what a loan costs, and which questions save thousands of shekels.</p>

          <CalcLink>Want to see what a loan adds to the cost of the car? Open the calculator</CalcLink>

          <Terms
            title="The terms, in plain language"
            items={[
              ["Financing (מימון)", "Another word for a loan to buy a car. When a dealership says “financing”, it means a loan."],
              ["Principal", "The amount you borrowed. If you took 90,000 ILS, that is the principal."],
              ["Interest", "The price of the loan. You pay it on top of the principal, and it is quoted as a yearly percentage."],
              [
                "Prime rate",
                "The banks’ base rate: the Bank of Israel rate plus 1.5%. Many loans are priced as “prime plus something”, for example prime + 2%.",
              ],
              [
                "Fixed and variable interest",
                "A fixed rate does not change during the loan. A variable rate follows prime: if the Bank of Israel raises rates, your monthly repayment goes up.",
              ],
              [
                "Spitzer schedule",
                "The usual repayment method: the same amount every month. Early on most of the payment is interest, later most of it is principal.",
              ],
              [
                "Balloon loan",
                "A loan where a large part of the principal is not repaid monthly but in one big payment at the end. The monthly repayment is low, but you pay more interest.",
              ],
              [
                "Lien (שעבוד)",
                "A registration saying the car is collateral for the loan. You cannot sell a car with a lien without clearing the loan, and if you stop paying, the lender can take the car.",
              ],
              ["Origination fee", "A one-off charge for setting up the loan. It is part of the cost even though it is not called interest."],
              ["Early repayment", "Closing the loan ahead of time. Some loans charge a fee for it."],
              ["Trade-in", "Handing your old car to the dealership as part of the payment for the new one."],
            ]}
          />

          <H2>How much do you need to borrow</H2>
          <p>The sum is simple: the price of the car, minus the money you have, minus what you get for your old car.</p>
          <Example title="Example">
            <p>
              The car costs 150,000 ILS. You have 40,000 in savings and will sell your old car for 20,000. The
              loan you need is <strong>90,000 ILS</strong>.
            </p>
          </Example>
          <p>
            Every shekel you bring yourself is a shekel you pay no interest on. On the other hand, do not empty
            all your savings and leave yourself without a cushion.
          </p>

          <H2>Where to get a car loan</H2>
          <p>
            No single place is always cheapest. The rate depends on you: your income, your credit history and
            whether there is collateral. So ask several sources. These are the options:
          </p>

          <H3>1. A loan against your study fund (קרן השתלמות) or provident fund</H3>
          <p>
            If you have a study fund, this is usually the cheapest option. The body that manages the fund lends
            you money with the fund as collateral. The money stays invested and keeps earning. The rate is
            usually well below an ordinary bank loan. The drawback: you can borrow only part of what you have
            accumulated.
          </p>

          <H3>2. Your own bank</H3>
          <p>
            The bank knows you and the process is quick. The rate depends on your rating there and is almost
            always negotiable. Do not accept the first offer in the app. Talk to a banker and say you are
            checking elsewhere too.
          </p>

          <H3>3. Another bank</H3>
          <p>
            You can borrow from a bank where you have no account. Banks want new customers, and their offer is
            sometimes better than your own bank’s. Even if you do not take it, it is a bargaining chip.
          </p>

          <H3>4. Financing through the dealership or importer</H3>
          <p>
            The most convenient: everything is settled in one place. But the dealership earns on the loan, and
            its rate is not always competitive. When offered dealership financing, ask for the annual rate and
            the total cost, and compare with a bank offer. This kind of loan almost always puts a lien on the car.
          </p>

          <H3>5. Credit card companies</H3>
          <p>
            A fast loan that does not involve your bank. The rate is usually higher than a bank’s, though there
            are occasional promotions. Suitable for topping up a small amount.
          </p>

          <H3>6. Non-bank finance companies</H3>
          <p>
            They approve people the bank turned down, so their rate is usually the highest. If this is your
            only option, it is worth pausing to ask whether this car is too expensive for you right now.
          </p>

          <H2>What the loan costs: one loan, four outcomes</H2>
          <p>Here is a 90,000 ILS loan on different terms:</p>
          <Table
            head={["Rate and term", "Monthly repayment", "Total interest"]}
            rows={[
              ["7% over three years", "2,779", "about 10,000"],
              ["7% over five years", "1,782", "about 16,900"],
              ["6% over five years", "1,740", "about 14,400"],
              ["9% over five years", "1,868", "about 22,100"],
            ]}
          />
          <p>Three things worth noticing:</p>
          <Bullets>
            <li>
              <strong>A long term looks cheap and costs more.</strong> The five-year repayment is 1,000 ILS a
              month lower, but total interest is 6,900 ILS higher.
            </li>
            <li>
              <strong>One percentage point is worth thousands.</strong> The gap between 6% and 7% is only 42
              ILS a month, but 2,500 ILS over the whole term.
            </li>
            <li>
              <strong>The monthly repayment misleads.</strong> The cheap and expensive loans differ by 128 ILS
              a month, and by 7,700 ILS in total.
            </li>
          </Bullets>
          <p>The rates in the table are illustrations. The rate you get depends on prime at the time and on your own profile.</p>

          <H2>Balloon loans: low repayments, a big bill at the end</H2>
          <p>A balloon loan pushes part of the principal to the end of the term. The monthly repayment is small, which is what makes it easy to sell.</p>
          <Example title="The same 90,000 ILS, with a 40,000 balloon">
            <p>
              At 7% over five years the monthly repayment drops from 1,782 to 1,223 ILS. But after five years
              you still owe 40,000 ILS in one payment, and total interest rises from 16,900 to 23,400 ILS.
            </p>
          </Example>
          <p>
            A balloon suits you only if you know where the final money will come from. If you plan to pay it by
            selling the car, remember the car will be worth far less by then. How much less is covered in the{" "}
            <Ref to="depreciation">depreciation guide</Ref>.
          </p>

          <H2>0% financing: where is the catch</H2>
          <p>Nobody lends money for free. When you are offered 0% interest, the price is hiding somewhere else:</p>
          <Bullets>
            <li>The car is at full price, without the discount you would get for cash.</li>
            <li>The 0% applies to only part of the amount or to a short period.</li>
            <li>There is a high origination or handling fee.</li>
          </Bullets>
          <p>
            The test is simple: ask what the car costs in cash and what you will pay in total on the 0% plan.
            The difference is the real interest.
          </p>

          <H2>Six questions before you sign</H2>
          <Steps>
            <li>What is the annual rate, and is it fixed or linked to prime?</li>
            <li>How much will I pay in total by the end of the loan, including all fees?</li>
            <li>Is there an origination fee? How much?</li>
            <li>Is there a large final payment (a balloon)?</li>
            <li>Is there a lien on the car? What insurance must I hold?</li>
            <li>What will it cost to close the loan early?</li>
          </Steps>
          <p>
            Question 2 matters most. A lender must show you the total cost of the loan, and with it you can
            compare offers that look completely different.
          </p>

          <H2>Loan or cash?</H2>
          <p>
            If you have the money, the question is what it does when it is not in the car. If it sits in a
            current account, pay cash and save the interest. If it is invested and earning more than the loan
            rate, it may be better left there. Just remember that loan interest is certain and investment
            returns are not.
          </p>

          <H2>The loan in the calculator</H2>
          <p>
            In <Calc>the calculator</Calc> you enter how much money you have and what your old car is worth, and
            it works out the loan you need. Then you enter a rate and a term and see the monthly repayment, the
            total interest, and how the loan changes the comparison with leasing.
          </p>

          <Note>
            This guide is general information, not financial advice. Loan terms vary between lenders and over
            time, so check current offers.
          </Note>

          <CalcCta
            title="How much will the loan add to the price of the car?"
            text="Enter a rate and a term and see the monthly repayment, the total interest, and whether leasing comes out cheaper."
            button="Open the calculator"
          />
        </>
      )}
    </GuideShell>
  );
}
