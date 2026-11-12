import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { GuideShell, H2, Calc, CalcLink, CalcCta, Terms, Example, Bullets, Table, Note, Ref } from "@/components/guide";

export const metadata: Metadata = {
  title: "רכב חשמלי או בנזין: מה משתלם יותר, גם בליסינג | CarCalc",
  description:
    "השוואת עלויות בין רכב חשמלי לבנזין: כמה עולה קילומטר, טעינה בבית מול טעינה ציבורית, טיפולים, ירידת ערך, ומה משתלם יותר בקנייה ובליסינג.",
  alternates: { canonical: "/guides/electric-vs-gasoline" },
};

export default async function ElectricVsGasolinePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <GuideShell
      locale={locale}
      path="/guides/electric-vs-gasoline"
      illustration="electric-vs-gasoline"
      title={isHe ? "רכב חשמלי או בנזין: מה באמת משתלם יותר?" : "Electric or petrol: which really costs less?"}
      description={
        isHe
          ? "כמה עולה קילומטר בחשמלי ובבנזין, טעינה, טיפולים וירידת ערך, בקנייה ובליסינג."
          : "Cost per kilometre, charging, servicing and depreciation for electric and petrol cars, when buying and when leasing."
      }
    >
      {isHe ? (
        <>
          <p>
            רכב חשמלי זול מאוד לנסיעה ויקר יותר בירידת הערך. השאלה מה משתלם תלויה בעיקר בשני דברים: כמה אתם
            נוסעים, והאם יש לכם איפה לטעון בבית.
          </p>
          <p>
            המדריך עובר על כל סעיף בנפרד, עם מספרים, ובסוף מחבר אותם לחשבון אחד. יש גם פרק נפרד על ליסינג,
            כי שם החשבון שונה.
          </p>

          <CalcLink>רוצים להשוות על הרכב שלכם? למחשבון</CalcLink>

          <Terms
            title="המושגים, בשפה פשוטה"
            items={[
              [
                "קוט״ש (קילוואט-שעה)",
                "יחידת המידה של חשמל, כמו ליטר בדלק. גודל הסוללה נמדד בקוט״ש, וגם חשבון החשמל.",
              ],
              [
                "צריכה",
                "כמה הרכב נוסע על יחידת אנרגיה. בבנזין: קילומטרים לליטר. בחשמלי: קילומטרים לקוט״ש. רכב חשמלי ממוצע נוסע בערך 6 ק״מ על כל קוט״ש.",
              ],
              ["טווח", "כמה קילומטרים הרכב נוסע בטעינה מלאה. בחורף, במהירות גבוהה ועם מזגן הטווח קצר יותר."],
              [
                "טעינה ביתית",
                "עמדת טעינה בחניה פרטית או בבניין. משלמים תעריף חשמל ביתי, וזו הטעינה הזולה ביותר.",
              ],
              [
                "טעינה ציבורית וטעינה מהירה",
                "עמדות בקניונים, בתחנות דלק ובצידי הדרך. טעינה מהירה ממלאת את רוב הסוללה בפחות משעה, אבל המחיר לקוט״ש גבוה בהרבה מבבית.",
              ],
              [
                "היברידי",
                "רכב עם מנוע בנזין ומנוע חשמלי קטן שנטען לבד תוך כדי נסיעה. לא מחברים אותו לחשמל. הוא חוסך דלק, בעיקר בעיר.",
              ],
              [
                "פלאג-אין",
                "היברידי עם סוללה גדולה יותר שכן מחברים לחשמל. הוא נוסע כמה עשרות קילומטרים על חשמל בלבד, ואחר כך עובר לבנזין.",
              ],
              [
                "בלימה רגנרטיבית",
                "כשמרימים את הרגל מהגז, המנוע החשמלי מאט את הרכב ומחזיר חשמל לסוללה. בגלל זה הבלמים נשחקים לאט.",
              ],
              ["אחריות סוללה", "אחריות נפרדת של היצרן על הסוללה, בדרך כלל לכמה שנים טובות או למספר קילומטרים."],
              [
                "מס קנייה",
                "מס שהמדינה גובה על כל רכב חדש, והוא חלק ממחיר המחירון. לרכב חשמלי יש שיעור מופחת, שעולה בהדרגה משנה לשנה.",
              ],
            ]}
          />

          <H2>כמה עולה קילומטר</H2>
          <p>זה היתרון הגדול של הרכב החשמלי, וכדאי לראות אותו במספרים:</p>
          <Table
            head={["", "מחיר האנרגיה", "עלות לק״מ", "עלות ל-15,000 ק״מ בשנה"]}
            rows={[
              ["בנזין (14 ק״מ לליטר)", "כ-7.85 ₪ לליטר", "56 אגורות", "כ-8,400 ₪"],
              ["חשמלי, טעינה בבית", "כ-64 אגורות לקוט״ש", "11 אגורות", "כ-1,600 ₪"],
              ["חשמלי, טעינה מהירה ציבורית", "כ-1.8 ₪ לקוט״ש", "30 אגורות", "כ-4,500 ₪"],
            ]}
          />
          <p>
            מי שטוען בבית חוסך כ-6,800 ₪ בשנה לעומת בנזין. מי שטוען רק בעמדות מהירות חוסך כ-3,900 ₪. ההבדל
            הזה הוא הסיבה שהשאלה הראשונה לפני רכב חשמלי היא לא איזה דגם, אלא איפה תטענו אותו.
          </p>
          <p>
            מחירי הדלק מתעדכנים כל חודש, ומחירי הטעינה הציבורית משתנים בין הרשתות. המחשבון מושך את מחיר הדלק
            העדכני בעצמו.
          </p>

          <H2>טיפולים ותחזוקה</H2>
          <p>
            במנוע חשמלי יש הרבה פחות חלקים נעים. אין שמן מנוע, אין מצמד, אין רצועת תזמון ואין מערכת פליטה.
            הבלמים מחזיקים יותר זמן בגלל הבלימה הרגנרטיבית. לכן הטיפול התקופתי זול יותר.
          </p>
          <p>
            מצד שני, רכב חשמלי כבד יותר, והצמיגים שלו נשחקים מהר יותר. בסך הכול החיסכון בתחזוקה אמיתי אבל
            קטן: מאות שקלים בשנה, לא אלפים.
          </p>

          <H2>ירידת ערך: החיסרון הגדול</H2>
          <p>
            רכב חשמלי מאבד ערך מהר יותר. לפי הממוצעים שהמחשבון משתמש בהם, רכב בנזין שווה אחרי שלוש שנים בערך
            73% ממחירו, ורכב חשמלי בערך 62%.
          </p>
          <Example title="רכב של 200,000 ₪ אחרי שלוש שנים">
            <p>
              רכב הבנזין שווה כ-145,800 ₪, כלומר איבד 54,200 ₪. הרכב החשמלי שווה כ-124,200 ₪, כלומר איבד 75,800
              ₪. ההפרש: <strong>21,600 ₪ לרעת החשמלי</strong>.
            </p>
          </Example>
          <p>
            הסיבות מוסברות ב<Ref to="depreciation">מדריך הפחת</Ref>: טכנולוגיה שמתקדמת מהר, מחירים שיורדים,
            וחשש של קונים ממצב הסוללה.
          </p>

          <H2>החשבון המלא: שלוש שנים, רכב של 200,000 ₪</H2>
          <p>נחבר את שלושת הסעיפים, בהנחה שטוענים בבית:</p>
          <Table
            head={["", "15,000 ק״מ בשנה", "25,000 ק״מ בשנה"]}
            rows={[
              ["חיסכון באנרגיה", "20,400 ₪", "34,100 ₪"],
              ["חיסכון בטיפולים", "1,350 ₪", "2,250 ₪"],
              ["ירידת ערך נוספת", "מינוס 21,600 ₪", "מינוס 21,600 ₪"],
              [<strong key="a">השורה התחתונה</strong>, <strong key="b">כמעט שוויון</strong>, <strong key="c">החשמלי זול בכ-14,700 ₪</strong>],
            ]}
          />
          <p>
            המסקנה: בנסועה ממוצעת שני הרכבים קרובים מאוד, והפחת מוחק את רוב החיסכון בדלק. ככל שנוסעים יותר,
            החשמלי מנצח בפער גדל. וככל שמחזיקים את הרכב יותר שנים, הפחת השנתי קטן והחיסכון בדלק ממשיך להצטבר.
          </p>

          <H2>ליסינג חשמלי מול ליסינג בנזין: מה משתלם יותר?</H2>
          <p>
            בליסינג תפעולי החשבון פשוט יותר, כי ירידת הערך היא לא שלכם. חברת הליסינג סופגת אותה, והיא כבר
            מתומחרת בתשלום החודשי. גם הטיפולים כלולים. נשארים שני מספרים בלבד:
          </p>
          <Bullets>
            <li>ההפרש בתשלום החודשי בין הדגם החשמלי לדגם הבנזין.</li>
            <li>החיסכון החודשי באנרגיה.</li>
          </Bullets>
          <Example title="דוגמה">
            <p>
              ליסינג לרכב חשמלי עולה 300 ₪ יותר בחודש מליסינג לרכב בנזין דומה. ב-15,000 ק״מ בשנה ועם טעינה
              בבית, החיסכון באנרגיה הוא כ-570 ₪ בחודש. החשמלי משתלם ב-270 ₪ בחודש. בלי טעינה בבית החיסכון
              יורד לכ-325 ₪ בחודש, והיתרון כמעט נעלם.
            </p>
          </Example>
          <p>
            בגלל זה ליסינג הוא דרך נוחה לנסות רכב חשמלי: נהנים מהחיסכון בנסיעה, והסיכון של ירידת הערך נשאר
            אצל חברת הליסינג. שימו לב רק למגבלת הקילומטרים בחוזה. מי שנוסע הרבה הוא בדיוק מי שמרוויח הכי
            הרבה מחשמלי, וגם מי שעלול לחרוג ממנה.
          </p>

          <H2>ומה עם היברידי ופלאג-אין?</H2>
          <p>
            <strong>היברידי רגיל</strong> מתאים למי שאין לו איפה לטעון. הוא חוסך דלק בלי לשנות הרגלים, ושומר
            על ערכו טוב יותר מכל סוג אחר.
          </p>
          <p>
            <strong>פלאג-אין</strong> משתלם רק למי שטוען אותו באמת, כל יום. מי שלא טוען נוסע ברכב בנזין כבד
            ויקר. במחשבון אפשר להגדיר איזה חלק מהנסיעות שלכם נעשה על חשמל.
          </p>

          <H2>למי חשמלי מתאים, ולמי פחות</H2>
          <Bullets>
            <li>
              <strong>מתאים:</strong> יש חניה עם אפשרות טעינה, נוסעים הרבה, ומתכננים להחזיק את הרכב כמה שנים
              או לקחת אותו בליסינג.
            </li>
            <li>
              <strong>פחות מתאים:</strong> אין טעינה בבית או בעבודה, נוסעים מעט, ומחליפים רכב כל שנתיים-שלוש
              בקנייה.
            </li>
          </Bullets>
          <p>
            עוד דבר שכדאי לדעת: המיסוי על רכב חשמלי משתנה. מס הקנייה עולה בהדרגה, ומדי פעם עולות הצעות למס על
            נסועה. שינוי כזה משפיע גם על מחיר הרכב החדש וגם על שווי הרכב המשומש, אז כדאי לבדוק מה המצב העדכני
            לפני שקונים.
          </p>

          <H2>ההשוואה במחשבון</H2>
          <p>
            ב<Calc>מחשבון</Calc> בוחרים רכב מהרשימה, וסוג ההנעה והצריכה שלו נשלפים לבד מנתוני משרד התחבורה.
            המחשבון מחשב את עלות האנרגיה לפי הנסועה שלכם, את הטיפולים ואת הפחת לפי סוג ההנעה. כדי להשוות
            חשמלי לבנזין, הריצו אותו פעם אחת לכל רכב והשוו את העלות הכוללת.
          </p>

          <Note>
            המספרים במדריך הם ממוצעים והערכות לצורך המחשה. צריכה, מחירי טעינה וירידת ערך משתנים בין דגמים
            ולאורך זמן.
          </Note>

          <CalcCta
            title="חשמלי או בנזין, עם המספרים שלכם"
            text="בחרו את שני הרכבים שאתם שוקלים, וראו כמה כל אחד יעלה לכם בסך הכול, בקנייה ובליסינג."
            button="למחשבון"
          />
        </>
      ) : (
        <>
          <p>
            An electric car is very cheap to drive and more expensive in lost value. Which comes out ahead
            depends mainly on two things: how much you drive, and whether you can charge at home.
          </p>
          <p>
            This guide takes each item separately, with numbers, and then combines them into one sum. Leasing
            has its own section because the sum is different there.
          </p>

          <CalcLink>Want to compare for your own car? Open the calculator</CalcLink>

          <Terms
            title="The terms, in plain language"
            items={[
              ["kWh (kilowatt-hour)", "The unit of electricity, like a litre of fuel. Battery size is measured in kWh, and so is your electricity bill."],
              [
                "Consumption",
                "How far the car goes on a unit of energy. Petrol: kilometres per litre. Electric: kilometres per kWh. An average electric car does roughly 6 km per kWh.",
              ],
              ["Range", "How far the car goes on a full charge. In winter, at high speed and with the air conditioning on, range is shorter."],
              ["Home charging", "A charger in a private or building car park. You pay the household electricity rate, and it is the cheapest way to charge."],
              [
                "Public and fast charging",
                "Chargers at malls, petrol stations and roadsides. Fast charging fills most of the battery in under an hour, but the price per kWh is far higher than at home.",
              ],
              [
                "Hybrid",
                "A car with a petrol engine and a small electric motor that charges itself while driving. You never plug it in. It saves fuel, mainly in town.",
              ],
              [
                "Plug-in hybrid",
                "A hybrid with a larger battery that you do plug in. It drives a few dozen kilometres on electricity alone, then switches to petrol.",
              ],
              [
                "Regenerative braking",
                "When you lift off the accelerator, the electric motor slows the car and feeds electricity back to the battery. That is why the brakes wear slowly.",
              ],
              ["Battery warranty", "A separate manufacturer warranty on the battery, usually for a good number of years or kilometres."],
              [
                "Purchase tax",
                "A tax the state charges on every new car, built into the list price. Electric cars get a reduced rate that rises gradually each year.",
              ],
            ]}
          />

          <H2>What a kilometre costs</H2>
          <p>This is the electric car’s big advantage, and it is worth seeing in numbers:</p>
          <Table
            head={["", "Energy price", "Cost per km", "Cost for 15,000 km a year"]}
            rows={[
              ["Petrol (14 km per litre)", "about 7.85 ILS a litre", "0.56 ILS", "about 8,400 ILS"],
              ["Electric, home charging", "about 0.64 ILS per kWh", "0.11 ILS", "about 1,600 ILS"],
              ["Electric, public fast charging", "about 1.8 ILS per kWh", "0.30 ILS", "about 4,500 ILS"],
            ]}
          />
          <p>
            Charging at home saves about 6,800 ILS a year against petrol. Charging only at fast chargers saves
            about 3,900. That gap is why the first question before an electric car is not which model, but
            where you will charge it.
          </p>
          <p>
            Fuel prices are updated monthly and public charging prices vary between networks. The calculator
            fetches the current fuel price itself.
          </p>

          <H2>Servicing and maintenance</H2>
          <p>
            An electric motor has far fewer moving parts. No engine oil, no clutch, no timing belt and no
            exhaust system. The brakes last longer thanks to regenerative braking. So routine servicing is cheaper.
          </p>
          <p>
            On the other hand an electric car is heavier and wears its tyres faster. Overall the maintenance
            saving is real but small: hundreds of shekels a year, not thousands.
          </p>

          <H2>Depreciation: the big drawback</H2>
          <p>
            An electric car loses value faster. On the averages the calculator uses, a petrol car is worth
            about 73% of its price after three years, and an electric car about 62%.
          </p>
          <Example title="A 200,000 ILS car after three years">
            <p>
              The petrol car is worth about 145,800 ILS, so it lost 54,200. The electric car is worth about
              124,200, so it lost 75,800. The difference: <strong>21,600 ILS against the electric car</strong>.
            </p>
          </Example>
          <p>
            The reasons are in the <Ref to="depreciation">depreciation guide</Ref>: fast-moving technology,
            falling prices, and buyers’ worries about battery condition.
          </p>

          <H2>The full sum: three years, a 200,000 ILS car</H2>
          <p>Putting the three items together, assuming home charging:</p>
          <Table
            head={["", "15,000 km a year", "25,000 km a year"]}
            rows={[
              ["Energy saving", "20,400 ILS", "34,100 ILS"],
              ["Servicing saving", "1,350 ILS", "2,250 ILS"],
              ["Extra depreciation", "−21,600 ILS", "−21,600 ILS"],
              [<strong key="a">Bottom line</strong>, <strong key="b">Almost even</strong>, <strong key="c">Electric cheaper by about 14,700</strong>],
            ]}
          />
          <p>
            The conclusion: at average mileage the two are very close, and depreciation wipes out most of the
            fuel saving. The more you drive, the further ahead the electric car gets. And the longer you keep
            the car, the smaller the yearly depreciation while the fuel saving keeps adding up.
          </p>

          <H2>Leasing electric vs. leasing petrol: which costs less?</H2>
          <p>
            In an operating lease the sum is simpler, because the loss in value is not yours. The leasing
            company absorbs it and has already priced it into the monthly payment. Servicing is included too.
            Only two numbers remain:
          </p>
          <Bullets>
            <li>The difference in monthly payment between the electric model and the petrol one.</li>
            <li>The monthly energy saving.</li>
          </Bullets>
          <Example title="Example">
            <p>
              Leasing an electric car costs 300 ILS a month more than a similar petrol car. At 15,000 km a year
              with home charging, the energy saving is about 570 ILS a month. Electric wins by 270 a month.
              Without home charging the saving drops to about 325 a month, and the advantage almost disappears.
            </p>
          </Example>
          <p>
            This is why leasing is a convenient way to try an electric car: you get the driving savings and the
            depreciation risk stays with the leasing company. Just watch the mileage limit in the contract.
            People who drive a lot gain most from electric, and are also the ones likely to exceed it.
          </p>

          <H2>What about hybrids and plug-ins?</H2>
          <p>
            <strong>A regular hybrid</strong> suits people with nowhere to charge. It saves fuel without
            changing habits, and holds its value better than any other type.
          </p>
          <p>
            <strong>A plug-in</strong> pays off only if you really charge it, every day. If you do not, you are
            driving a heavy, expensive petrol car. In the calculator you can set what share of your driving is
            done on electricity.
          </p>

          <H2>Who electric suits, and who it suits less</H2>
          <Bullets>
            <li>
              <strong>Suits:</strong> you have parking where you can charge, you drive a lot, and you plan to
              keep the car for several years or to lease it.
            </li>
            <li>
              <strong>Suits less:</strong> no charging at home or work, low mileage, and you change cars every
              two or three years when buying.
            </li>
          </Bullets>
          <p>
            One more thing: taxation of electric cars keeps changing. Purchase tax is rising gradually, and
            proposals for a per-kilometre tax come up from time to time. Such changes affect both new-car
            prices and used values, so check the current situation before buying.
          </p>

          <H2>The comparison in the calculator</H2>
          <p>
            In <Calc>the calculator</Calc> you pick a car from the list, and its powertrain and consumption are
            pulled from Ministry of Transport data. The calculator works out the energy cost for your mileage,
            servicing, and depreciation by powertrain. To compare electric with petrol, run it once for each
            car and compare the total cost.
          </p>

          <Note>
            The numbers here are averages and estimates for illustration. Consumption, charging prices and
            depreciation vary between models and over time.
          </Note>

          <CalcCta
            title="Electric or petrol, with your numbers"
            text="Pick the two cars you are considering and see what each will cost you in total, buying and leasing."
            button="Open the calculator"
          />
        </>
      )}
    </GuideShell>
  );
}
