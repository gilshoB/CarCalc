import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { GuideShell, H2, Calc, CalcLink, CalcCta, Terms, Example, Bullets, Table, Note, Ref } from "@/components/guide";

export const metadata: Metadata = {
  title: "פחת וירידת ערך רכב: טבלה לפי שנים וסוג הנעה | CarCalc",
  description:
    "כמה רכב מאבד מערכו כל שנה? טבלת ירידת ערך לבנזין, היברידי וחשמלי, דוגמה בשקלים, ומה ההבדל בין פחת לירידת ערך אחרי תאונה.",
  alternates: { canonical: "/guides/depreciation" },
};

export default async function DepreciationGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <GuideShell
      locale={locale}
      path="/guides/depreciation"
      illustration="depreciation"
      title={isHe ? "פחת רכב: כמה הרכב מאבד מערכו כל שנה" : "Car depreciation: how much value a car loses each year"}
      description={
        isHe
          ? "טבלת ירידת ערך לפי שנים וסוג הנעה, דוגמה בשקלים, ומה משפיע על שווי הרכב."
          : "A year-by-year depreciation table by powertrain, a worked example, and what affects a car’s value."
      }
    >
      {isHe ? (
        <>
          <p>
            פחת הוא ההוצאה הכי גדולה ברכב, והיחידה שלא רואים. על דלק משלמים בתחנה, על ביטוח פעם בשנה. על הפחת
            משלמים רק ביום שמוכרים את הרכב ומגלים כמה הוא שווה.
          </p>
          <p>
            המדריך הזה מסביר מה זה פחת, כמה רכב מאבד מערכו בכל שנה, ומה גורם לרכב אחד לשמור על ערכו ולאחר
            לאבד אותו מהר.
          </p>

          <CalcLink>רוצים לדעת כמה הרכב שלכם יהיה שווה בעוד כמה שנים? למחשבון</CalcLink>

          <Terms
            title="המושגים, בשפה פשוטה"
            items={[
              [
                "פחת",
                "הירידה בשווי הרכב עם הזמן והשימוש. מחשבים אותו כך: המחיר שקניתם, פחות המחיר שתמכרו.",
              ],
              [
                "ירידת ערך",
                "בשפה היומיומית זה אותו דבר כמו פחת. בעולם הביטוח זה מונח אחר: הפגיעה בשווי של רכב אחרי תאונה, גם אם תוקן. שמאי קובע אותה באחוזים, והיא נרשמת בהיסטוריה של הרכב.",
              ],
              [
                "מחיר מחירון",
                "המחיר הרשמי של רכב חדש אצל היבואן. לפיו נקבעות אגרת הרישוי ושווי השימוש, גם שנים אחרי שהרכב נמכר.",
              ],
              [
                "מחירון רכב משומש",
                "הערכה מקובלת של שווי רכב משומש לפי דגם, שנה, קילומטראז׳ והיסטוריה. המוכר ביותר בישראל הוא מחירון לוי יצחק. זו נקודת פתיחה למשא ומתן, לא מחיר מחייב.",
              ],
              ["יד", "מספר הבעלים שהיו לרכב. יד ראשונה היא הבעלים הראשון. ככל שהיד גבוהה יותר, השווי יורד."],
              ["ערך שארית", "כמה הרכב שווה בסוף התקופה שאתם בודקים. מחיר הקנייה פחות ערך השארית הוא הפחת."],
              [
                "פחת לצורכי מס",
                "מונח חשבונאי של עסקים: החלק ממחיר הרכב שמותר להכיר בו כהוצאה בכל שנה. זה לא קשור לשווי האמיתי של הרכב בשוק.",
              ],
            ]}
          />

          <H2>טבלת ירידת ערך לפי שנים</H2>
          <p>
            הטבלה מראה כמה אחוזים ממחיר הקנייה הרכב עדיין שווה בסוף כל שנה. אלה ממוצעים שהמחשבון שלנו משתמש
            בהם. רכב מסוים יכול להיות מעל או מתחת, לפי הדגם והמצב שלו.
          </p>
          <Table
            head={["סוג הנעה", "אחרי שנה", "אחרי שנתיים", "אחרי 3 שנים", "אחרי 4 שנים", "אחרי 5 שנים"]}
            rows={[
              ["בנזין או דיזל", "85%", "75%", "67%", "61%", "55%"],
              ["היברידי", "87%", "77%", "70%", "64%", "58%"],
              ["פלאג-אין", "82%", "71%", "62%", "55%", "48%"],
              ["חשמלי", "78%", "64%", "56%", "48%", "42%"],
            ]}
          />
          <p>
            שני דברים בולטים בטבלה. הראשון: השנה הראשונה היא היקרה ביותר, ואחריה הקצב נרגע. השני: רכב חשמלי
            מאבד ערך מהר יותר מרכב בנזין, ורכב היברידי רגיל שומר על ערכו הכי טוב.
          </p>

          <H2>דוגמה בשקלים: רכב של 150,000 ₪</H2>
          <Table
            head={["", "ביום הקנייה", "אחרי שנה", "אחרי 3 שנים", "אחרי 5 שנים"]}
            rows={[
              ["בנזין", "150,000 ₪", "127,500 ₪", "101,000 ₪", "81,800 ₪"],
              ["היברידי", "150,000 ₪", "130,500 ₪", "105,700 ₪", "87,500 ₪"],
              ["חשמלי", "150,000 ₪", "117,000 ₪", "83,500 ₪", "63,200 ₪"],
            ]}
          />
          <p>
            רכב הבנזין איבד 49,000 ₪ בשלוש שנים. זה כ-1,360 ₪ בכל חודש, יותר ממה שרוב האנשים מוציאים על דלק.
            הרכב החשמלי איבד 66,500 ₪ באותו זמן, שהם כ-1,850 ₪ לחודש.
          </p>

          <H2>למה רכב חשמלי מאבד ערך מהר יותר</H2>
          <Bullets>
            <li>הטכנולוגיה מתקדמת מהר. דגם בן שלוש שנים מתחרה בדגמים חדשים עם טווח ארוך יותר וטעינה מהירה יותר.</li>
            <li>מחירי הרכבים החדשים יורדים, וזה מושך למטה גם את מחירי המשומשים.</li>
            <li>קונים של יד שנייה חוששים ממצב הסוללה, כי החלפה שלה יקרה.</li>
            <li>הטבות המס על רכב חשמלי משתנות משנה לשנה, וכל שינוי מזיז את המחירים בשוק.</li>
          </Bullets>
          <p>
            מצד שני, רכב חשמלי חוסך הרבה על אנרגיה. את החשבון המלא עשינו ב
            <Ref to="electric-vs-gasoline">מדריך חשמלי מול בנזין</Ref>.
          </p>

          <H2>מה מוריד את שווי הרכב, מעבר לגיל</H2>
          <Bullets>
            <li>
              <strong>קילומטראז׳.</strong> הממוצע בישראל הוא בערך 15,000 ק״מ בשנה. רכב שנסע הרבה יותר שווה
              פחות, ורכב שנסע פחות שווה יותר.
            </li>
            <li>
              <strong>מספר הידיים.</strong> כל בעלים נוסף מוריד את המחיר.
            </li>
            <li>
              <strong>עבר בליסינג או בהשכרה.</strong> רכב שהיה בבעלות חברת ליסינג או השכרה נמכר בפחות מרכב
              זהה בבעלות פרטית.
            </li>
            <li>
              <strong>תאונות.</strong> רכב שעבר תאונה שווה פחות גם אחרי תיקון מושלם. פגיעה בשלדה מורידה הרבה
              יותר מפגיעה בפח.
            </li>
            <li>
              <strong>הדגם.</strong> דגמים מבוקשים ואמינים נמכרים מהר ובמחיר טוב. דגמים נדירים, יוקרתיים או
              כאלה שהיבואן שלהם עזב את הארץ מאבדים יותר.
            </li>
            <li>
              <strong>טיפולים.</strong> היסטוריית טיפולים מלאה ומתועדת שווה כסף ביום המכירה.
            </li>
          </Bullets>

          <H2>חדש או יד שנייה: איפה הפחת פחות כואב</H2>
          <p>
            מי שקונה רכב חדש משלם את השנים היקרות ביותר. מי שקונה רכב בן שלוש נכנס אחרי שהירידה החדה כבר
            קרתה.
          </p>
          <Example title="אותו רכב, שני קונים">
            <p>
              <strong>קונה א׳</strong> קונה רכב בנזין חדש ב-150,000 ₪ ומוכר אחרי שלוש שנים ב-101,000 ₪. הפחת
              עלה לו 49,000 ₪.
            </p>
            <p>
              <strong>קונה ב׳</strong> קונה ממנו את הרכב ב-101,000 ₪ ומחזיק בו שלוש שנים נוספות. בסופן הרכב
              שווה כ-73,600 ₪. הפחת עלה לו 27,400 ₪, קצת יותר מחצי.
            </p>
          </Example>
          <p>
            המחיר של יד שנייה הוא יותר טיפולים ותיקונים, פחות אחריות יצרן, וצורך לבדוק את הרכב היטב לפני
            הקנייה. אבל בחשבון של פחת בלבד, יד שנייה מנצחת כמעט תמיד.
          </p>

          <H2>ומה עם פחת בליסינג?</H2>
          <p>
            בליסינג תפעולי הרכב לא שלכם, ולכן הפחת הוא לא הבעיה שלכם. חברת הליסינג סופגת אותו, אבל היא גם
            מתמחרת אותו מראש בתוך התשלום החודשי. במילים אחרות, אתם משלמים על הפחת בכל מקרה. ההבדל הוא שבליסינג
            הסכום ידוע מראש, ובקנייה הוא מתברר רק כשמוכרים. על ההבדלים בין האפשרויות אפשר לקרוא ב
            <Ref to="buy-vs-lease">מדריך קנייה מול ליסינג</Ref>.
          </p>

          <H2>איך לשמור על ערך הרכב</H2>
          <Bullets>
            <li>עשו טיפולים בזמן, ושמרו את החשבוניות.</li>
            <li>תקנו שריטות ומכות קטנות לפני המכירה. הן מורידות מהמחיר יותר ממה שעולה לתקן אותן.</li>
            <li>בחרו דגם וצבע מבוקשים. לבן, אפור ושחור נמכרים הכי מהר.</li>
            <li>שמרו על פנים הרכב נקי ולא מעושן.</li>
          </Bullets>

          <H2>איך המחשבון מחשב פחת</H2>
          <p>
            <Calc>המחשבון</Calc> בוחר את קצב הפחת לפי סוג ההנעה, כמו בטבלה למעלה. ברכב יד שנייה הוא מתחשב גם
            בגיל הרכב, בקילומטראז׳, במספר הידיים ובשאלה אם הרכב היה בליסינג. אם אתם מכירים את השוק של הדגם
            שלכם, אפשר לשנות את האחוזים בעצמכם בעמוד התוצאות, תחת ״התאמת פחת״.
          </p>

          <Note>
            האחוזים במדריך הם ממוצעים כלליים ולא תחזית לרכב מסוים. לפני קנייה או מכירה כדאי לבדוק מחירון
            עדכני ומודעות של רכבים דומים.
          </Note>

          <CalcCta
            title="כמה הפחת יעלה לכם?"
            text="בחרו רכב במחשבון, וראו כמה הוא צפוי להיות שווה בסוף התקופה ומה העלות הכוללת מול ליסינג."
            button="למחשבון"
          />
        </>
      ) : (
        <>
          <p>
            Depreciation is the biggest cost of a car, and the only one you do not see. You pay for fuel at the
            pump and for insurance once a year. You pay for depreciation only on the day you sell and find out
            what the car is worth.
          </p>
          <p>
            This guide explains what depreciation is, how much value a car loses each year, and why one car
            holds its value while another loses it fast.
          </p>

          <CalcLink>Want to know what your car will be worth in a few years? Open the calculator</CalcLink>

          <Terms
            title="The terms, in plain language"
            items={[
              ["Depreciation (פחת)", "The fall in a car’s value with time and use. It is the price you paid minus the price you sell for."],
              [
                "Loss of value after an accident (ירידת ערך)",
                "In everyday Hebrew this means the same as depreciation. In insurance it is a separate term: the damage to a car’s value after an accident, even once repaired. An assessor sets it as a percentage and it stays in the car’s history.",
              ],
              [
                "List price",
                "The importer’s official price for the car when new. The registration fee and the company-car usage value are based on it, even years later.",
              ],
              [
                "Used-car price guide",
                "A standard estimate of a used car’s value by model, year, mileage and history. The best known in Israel is the Levi Yitzhak guide. It is a starting point for negotiation, not a binding price.",
              ],
              ["Hand (יד)", "The number of owners the car has had. First hand is the first owner. The more owners, the lower the value."],
              ["Residual value", "What the car is worth at the end of the period you are looking at. Purchase price minus residual value is the depreciation."],
              [
                "Tax depreciation",
                "A business accounting term: the share of the car’s price a business may claim as an expense each year. It has nothing to do with the car’s real market value.",
              ],
            ]}
          />

          <H2>Depreciation table by year</H2>
          <p>
            The table shows what percentage of the purchase price a car is still worth at the end of each year.
            These are the averages our calculator uses. A particular car can be above or below them depending
            on model and condition.
          </p>
          <Table
            head={["Powertrain", "After 1 year", "After 2", "After 3", "After 4", "After 5"]}
            rows={[
              ["Petrol or diesel", "85%", "75%", "67%", "61%", "55%"],
              ["Hybrid", "87%", "77%", "70%", "64%", "58%"],
              ["Plug-in hybrid", "82%", "71%", "62%", "55%", "48%"],
              ["Electric", "78%", "64%", "56%", "48%", "42%"],
            ]}
          />
          <p>
            Two things stand out. First, year one is the most expensive and the pace eases after that. Second,
            an electric car loses value faster than a petrol car, and a regular hybrid holds its value best.
          </p>

          <H2>In shekels: a 150,000 ILS car</H2>
          <Table
            head={["", "Day of purchase", "After 1 year", "After 3 years", "After 5 years"]}
            rows={[
              ["Petrol", "150,000", "127,500", "101,000", "81,800"],
              ["Hybrid", "150,000", "130,500", "105,700", "87,500"],
              ["Electric", "150,000", "117,000", "83,500", "63,200"],
            ]}
          />
          <p>
            The petrol car lost 49,000 ILS in three years. That is about 1,360 ILS every month, more than most
            people spend on fuel. The electric car lost 66,500 ILS in the same time, about 1,850 a month.
          </p>

          <H2>Why electric cars lose value faster</H2>
          <Bullets>
            <li>The technology moves quickly. A three-year-old model competes with new ones that go further and charge faster.</li>
            <li>New-car prices are falling, which pulls used prices down too.</li>
            <li>Second-hand buyers worry about battery condition, because replacing it is expensive.</li>
            <li>Tax breaks on electric cars change from year to year, and each change moves market prices.</li>
          </Bullets>
          <p>
            On the other hand an electric car saves a lot on energy. The full sum is in the{" "}
            <Ref to="electric-vs-gasoline">electric vs. petrol guide</Ref>.
          </p>

          <H2>What lowers a car’s value, besides age</H2>
          <Bullets>
            <li>
              <strong>Mileage.</strong> The Israeli average is roughly 15,000 km a year. A car that has done far
              more is worth less, and one that has done less is worth more.
            </li>
            <li>
              <strong>Number of owners.</strong> Each extra owner lowers the price.
            </li>
            <li>
              <strong>Lease or rental history.</strong> A car that belonged to a leasing or rental company sells
              for less than an identical privately owned one.
            </li>
            <li>
              <strong>Accidents.</strong> A car that has been in an accident is worth less even after a perfect
              repair. Chassis damage costs far more than bodywork damage.
            </li>
            <li>
              <strong>The model.</strong> Popular, reliable models sell fast and well. Rare or luxury models, or
              ones whose importer has left the country, lose more.
            </li>
            <li>
              <strong>Servicing.</strong> A full, documented service history is worth money on the day you sell.
            </li>
          </Bullets>

          <H2>New or used: where depreciation hurts less</H2>
          <p>
            Whoever buys new pays for the most expensive years. Whoever buys a three-year-old car comes in after
            the steep drop has already happened.
          </p>
          <Example title="Same car, two buyers">
            <p>
              <strong>Buyer A</strong> buys a new petrol car for 150,000 ILS and sells it three years later for
              101,000. Depreciation cost them 49,000 ILS.
            </p>
            <p>
              <strong>Buyer B</strong> buys that car for 101,000 ILS and keeps it another three years, after
              which it is worth about 73,600. Depreciation cost them 27,400 ILS, a little over half.
            </p>
          </Example>
          <p>
            The price of buying used is more servicing and repairs, less manufacturer warranty, and the need to
            inspect the car carefully first. But on depreciation alone, used almost always wins.
          </p>

          <H2>What about depreciation when leasing?</H2>
          <p>
            In an operating lease the car is not yours, so depreciation is not your problem. The leasing company
            absorbs it, but it also prices it into the monthly payment in advance. In other words you pay for
            depreciation either way. The difference is that in a lease the amount is known up front, and when
            buying you find out only when you sell. More on the options in the{" "}
            <Ref to="buy-vs-lease">buying vs. leasing guide</Ref>.
          </p>

          <H2>How to protect your car’s value</H2>
          <Bullets>
            <li>Service it on time and keep the invoices.</li>
            <li>Fix small scratches and dents before selling. They take more off the price than they cost to repair.</li>
            <li>Choose a popular model and colour. White, grey and black sell fastest.</li>
            <li>Keep the interior clean and smoke-free.</li>
          </Bullets>

          <H2>How the calculator handles depreciation</H2>
          <p>
            <Calc>The calculator</Calc> picks the depreciation pace by powertrain, as in the table above. For a
            used car it also accounts for age, mileage, number of owners and whether the car was leased. If you
            know the market for your model, you can change the percentages yourself on the results page, under
            “Depreciation Adjustment”.
          </p>

          <Note>
            The percentages here are general averages, not a forecast for a specific car. Before buying or
            selling, check a current price guide and listings for similar cars.
          </Note>

          <CalcCta
            title="What will depreciation cost you?"
            text="Pick a car in the calculator and see what it should be worth at the end of the period, and the total cost against leasing."
            button="Open the calculator"
          />
        </>
      )}
    </GuideShell>
  );
}
