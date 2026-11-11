import type { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { GuideShell, H2, Calc, CalcLink, CalcCta, Terms, Example, Bullets, Table, Note, Ref } from "@/components/guide";

export const metadata: Metadata = {
  title: "ביטוח רכב למתחילים: חובה, צד ג׳ ומקיף | CarCalc",
  description:
    "מה ההבדל בין ביטוח חובה, צד ג׳ ומקיף, מה זו השתתפות עצמית, כמה זה עולה בערך, מה קורה עם ביטוח בליסינג, ואיך משלמים פחות.",
  alternates: { canonical: "/guides/insurance" },
};

export default async function InsuranceGuidePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const isHe = locale === "he";

  return (
    <GuideShell
      locale={locale}
      path="/guides/insurance"
      illustration="insurance"
      title={isHe ? "ביטוח רכב למתחילים: חובה, צד ג׳ ומקיף" : "Car insurance for beginners: mandatory, third-party and comprehensive"}
      description={
        isHe
          ? "מה כל ביטוח מכסה, כמה הוא עולה בערך, מה קורה בליסינג, ואיך משלמים פחות."
          : "What each policy covers, roughly what it costs, how it works in a lease, and how to pay less."
      }
    >
      {isHe ? (
        <>
          <p>
            ביטוח הוא אחת ההוצאות הקבועות הגדולות על רכב, ורוב האנשים מחדשים אותו כל שנה בלי לבדוק. מי שמבין
            מה הוא קונה יכול לחסוך מאות ולפעמים אלפי שקלים בשנה, בלי לוותר על כיסוי.
          </p>
          <p>
            המדריך מסביר אילו ביטוחים יש, מה כל אחד מכסה, ומה משנה את המחיר. בסוף יש הסבר איך להכניס את
            הביטוח להשוואה בין קנייה לליסינג.
          </p>

          <CalcLink>קיבלתם הצעות לביטוח? הזינו אותן במחשבון</CalcLink>

          <Terms
            title="המושגים, בשפה פשוטה"
            items={[
              [
                "ביטוח חובה",
                "ביטוח שהחוק מחייב כל רכב. הוא מכסה נזקי גוף בלבד: פציעה או מוות של הנהג, של הנוסעים ושל הולכי רגל. הוא לא מכסה שום נזק לרכב, לא שלכם ולא של אחרים.",
              ],
              [
                "ביטוח צד ג׳",
                "מכסה נזק שגרמתם לרכוש של אחרים, למשל לרכב שפגעתם בו. הוא לא מכסה את הרכב שלכם.",
              ],
              [
                "ביטוח מקיף",
                "מכסה גם את הרכב שלכם (תאונה, גניבה, שריפה, נזקי טבע) וגם נזק לרכוש של אחרים. הוא כולל בתוכו את צד ג׳.",
              ],
              ["פרמיה", "המחיר שמשלמים על הביטוח, בדרך כלל לשנה."],
              [
                "השתתפות עצמית",
                "הסכום שאתם משלמים מהכיס בכל תביעה. אם הנזק 8,000 ₪ וההשתתפות העצמית 2,000 ₪, הביטוח משלם 6,000 ₪.",
              ],
              [
                "נהג צעיר ונהג חדש",
                "נהג מתחת לגיל מסוים (בדרך כלל 24) או עם ותק נהיגה קצר. הוספה שלו לפוליסה מייקרת אותה, ולפעמים גם מגדילה את ההשתתפות העצמית.",
              ],
              [
                "כל נהג או נהג נקוב",
                "פוליסה ל״כל נהג״ מכסה כל מי שנוהג ברכב ברשותכם. פוליסה ל״נהג נקוב״ מכסה רק את מי ששמו רשום בה, והיא זולה יותר.",
              ],
              ["היעדר תביעות", "אישור שלא תבעתם את הביטוח בשנים האחרונות. הוא מוריד את המחיר."],
              [
                "ירידת ערך",
                "הפגיעה בשווי הרכב אחרי תאונה, גם אם תוקן. לא כל פוליסה מכסה אותה, וכדאי לבדוק.",
              ],
              ["כתבי שירות", "תוספות לפוליסה: גרירה, רכב חלופי, שמשות. כל אחת מהן עולה כסף ואפשר לוותר עליה."],
            ]}
          />

          <H2>שלושת הביטוחים, אחד ליד השני</H2>
          <Table
            head={["", "ביטוח חובה", "צד ג׳", "מקיף"]}
            rows={[
              ["חובה לפי חוק?", "כן", "לא", "לא"],
              ["נזקי גוף", "מכסה", "לא", "לא"],
              ["נזק לרכב של אחרים", "לא", "מכסה", "מכסה"],
              ["נזק לרכב שלכם", "לא", "לא", "מכסה"],
              ["גניבה", "לא", "לא", "מכסה"],
              ["מחיר שנתי בערך", "1,000 עד 2,500 ₪", "1,000 עד 2,000 ₪", "2,500 עד 8,000 ₪"],
            ]}
          />
          <p>
            ביטוח חובה צריך תמיד. בנוסף אליו בוחרים בין צד ג׳ למקיף. נהיגה בלי ביטוח חובה היא עבירה פלילית,
            ובתאונה היא עלולה להשאיר אתכם לשלם לבד סכומי עתק.
          </p>
          <p>
            טווחי המחירים רחבים כי המחיר אישי מאוד. נהג בן 22 עם רכב חדש ישלם פי כמה מנהג בן 45 עם אותו רכב.
          </p>

          <H2>מה קובע את המחיר</H2>
          <Bullets>
            <li>
              <strong>מי נוהג.</strong> גיל, ותק נהיגה, ומספר הנהגים בפוליסה. נהג צעיר או חדש הוא הגורם שמייקר
              הכי הרבה.
            </li>
            <li>
              <strong>העבר שלכם.</strong> תביעות, תאונות ושלילות בשלוש השנים האחרונות.
            </li>
            <li>
              <strong>הרכב.</strong> שווי, דגם, נפח מנוע, וכמה הדגם נגנב. במקיף, רכב יקר יותר עולה יותר לבטח.
            </li>
            <li>
              <strong>מערכות בטיחות.</strong> בביטוח חובה יש הנחה לרכבים עם מערכות בטיחות מתקדמות.
            </li>
            <li>
              <strong>מיגון.</strong> חברות הביטוח דורשות מיגון מסוים לפי הדגם, ובלעדיו הכיסוי לגניבה לא תקף.
            </li>
            <li>
              <strong>ההשתתפות העצמית.</strong> ככל שהיא גבוהה יותר, הפרמיה נמוכה יותר.
            </li>
          </Bullets>

          <H2>השתתפות עצמית: המספר שלא מסתכלים עליו</H2>
          <p>
            שתי הצעות למקיף יכולות להיראות דומות במחיר ולהיות שונות מאוד ביום של תאונה. הצעה ב-4,000 ₪ עם
            השתתפות עצמית של 1,500 ₪ שונה מהצעה ב-3,600 ₪ עם השתתפות עצמית של 3,500 ₪. בתאונה אחת ההצעה
            ה״זולה״ עולה לכם 1,600 ₪ יותר.
          </p>
          <p>
            כשמשווים הצעות, בדקו גם את ההשתתפות העצמית לנהג צעיר ואת ההשתתפות במוסך שאינו מוסך הסדר. הן
            לפעמים כפולות.
          </p>

          <H2>מקיף או צד ג׳ בלבד?</H2>
          <p>
            השאלה היא כמה כסף תפסידו אם הרכב ייגנב או ייהרס מחר. ברכב ששווה 120,000 ₪ התשובה ברורה, ומקיף
            כמעט תמיד מוצדק. ברכב ששווה 15,000 ₪, מקיף ב-3,000 ₪ בשנה אומר שאתם משלמים חמישית משווי הרכב כל
            שנה כדי לבטח אותו.
          </p>
          <p>
            כלל אצבע: כשהפרמיה של המקיף מתקרבת ל-10% משווי הרכב, שווה לבדוק צד ג׳ בלבד. ואם לקחתם הלוואה
            והרכב משועבד, המלווה ידרוש בדרך כלל ביטוח מקיף עד סוף ההלוואה.
          </p>

          <H2>ביטוח בליסינג</H2>
          <p>
            בליסינג תפעולי הביטוח בדרך כלל כלול בתשלום החודשי. זה נוח, אבל יש שלושה דברים לבדוק בחוזה:
          </p>
          <Bullets>
            <li>
              <strong>מה בדיוק כלול.</strong> ברוב העסקאות גם חובה וגם מקיף, אבל לא בכולן.
            </li>
            <li>
              <strong>ההשתתפות העצמית.</strong> בליסינג היא נקבעת על ידי החברה, ואי אפשר לבחור. לפעמים היא
              גבוהה ממה שהייתם בוחרים לבד.
            </li>
            <li>
              <strong>נהגים צעירים.</strong> האם מותר להם לנהוג, ובכמה זה מייקר.
            </li>
          </Bullets>
          <p>
            כשמשווים ליסינג לקנייה, הביטוח הוא אחד ההבדלים הגדולים. בקנייה צריך להוסיף אותו לחשבון, ובליסינג
            הוא כבר בפנים. מי ששוכח את זה חושב שקנייה זולה ממה שהיא באמת. ההשוואה המלאה נמצאת ב
            <Ref to="buy-vs-lease">מדריך קנייה מול ליסינג</Ref>.
          </p>

          <H2>איך משלמים פחות</H2>
          <Bullets>
            <li>
              <strong>משווים כל שנה.</strong> ההבדלים בין חברות על אותו נהג ואותו רכב מגיעים למאות ואלפי
              שקלים. חידוש אוטומטי הוא כמעט תמיד היקר ביותר.
            </li>
            <li>
              <strong>בודקים חובה בנפרד.</strong> לרשות שוק ההון יש מחשבון ממשלתי שמשווה מחירי ביטוח חובה
              בין כל החברות. לא חייבים לקנות חובה ומקיף באותה חברה.
            </li>
            <li>
              <strong>מצמצמים נהגים.</strong> פוליסה לנהגים נקובים זולה מ״כל נהג״.
            </li>
            <li>
              <strong>מעלים את ההשתתפות העצמית,</strong> אם יש לכם כסף בצד למקרה של תאונה.
            </li>
            <li>
              <strong>מוותרים על תוספות מיותרות.</strong> שירותי גרירה או שמשות אולי כבר יש לכם ממקום אחר.
            </li>
            <li>
              <strong>מתמקחים.</strong> הצעה מחברה אחת היא סיבה טובה לחברה אחרת להוריד מחיר.
            </li>
          </Bullets>

          <H2>דוגמה: כמה הביטוח מוסיף לעלות הרכב</H2>
          <Example title="רכב בשווי 150,000 ₪, נהג ותיק">
            <p>
              ביטוח חובה 1,500 ₪ וביטוח מקיף 4,500 ₪ הם 6,000 ₪ בשנה, או <strong>18,000 ₪ בשלוש שנים</strong>.
              זה 500 ₪ בחודש שלא מופיעים במחיר הרכב ולא בהחזר ההלוואה.
            </p>
          </Example>

          <H2>הביטוח במחשבון</H2>
          <p>
            ב<Calc>מחשבון</Calc> מזינים את ההצעות שקיבלתם לביטוח חובה ולמקיף בשלב הקנייה. בשלב הליסינג מסמנים
            אילו ביטוחים כלולים בתשלום החודשי. אם אחד מהם לא כלול, המחשבון מוסיף אותו לעלות הליסינג, כך
            שההשוואה הוגנת.
          </p>

          <Note>
            המחירים במדריך הם טווחים כלליים להתמצאות. המחיר שלכם תלוי בנתונים האישיים, ורק הצעת מחיר אמיתית
            קובעת.
          </Note>

          <CalcCta
            title="כמה הביטוח משנה את התמונה?"
            text="הזינו את הצעות הביטוח שלכם, וראו את העלות המלאה של קנייה מול ליסינג, כולל הביטוח."
            button="למחשבון"
          />
        </>
      ) : (
        <>
          <p>
            Insurance is one of the biggest fixed costs of a car, and most people renew it every year without
            checking. If you understand what you are buying you can save hundreds and sometimes thousands of
            shekels a year without giving up cover.
          </p>
          <p>
            This guide explains which policies exist, what each one covers, and what moves the price. At the
            end it shows how to bring insurance into a buy-versus-lease comparison.
          </p>

          <CalcLink>Got insurance quotes? Enter them in the calculator</CalcLink>

          <Terms
            title="The terms, in plain language"
            items={[
              [
                "Mandatory insurance (ביטוח חובה)",
                "Required by law for every car. It covers bodily injury only: injury or death of the driver, passengers and pedestrians. It covers no damage to any car, yours or anyone else’s.",
              ],
              ["Third-party insurance (צד ג׳)", "Covers damage you cause to other people’s property, such as the car you hit. It does not cover your own car."],
              [
                "Comprehensive insurance (מקיף)",
                "Covers your own car (accident, theft, fire, natural damage) and damage to other people’s property. It includes third-party cover.",
              ],
              ["Premium", "The price you pay for the insurance, usually per year."],
              [
                "Deductible (השתתפות עצמית)",
                "The amount you pay out of pocket on each claim. If the damage is 8,000 ILS and the deductible 2,000, the insurer pays 6,000.",
              ],
              [
                "Young driver and new driver",
                "A driver under a certain age (usually 24) or with a short driving record. Adding one raises the price, and sometimes the deductible too.",
              ],
              [
                "Any driver or named driver",
                "An “any driver” policy covers anyone driving with your permission. A “named driver” policy covers only the people listed in it, and is cheaper.",
              ],
              ["No-claims record", "Confirmation that you made no claims in recent years. It lowers the price."],
              ["Loss of value", "The damage to the car’s value after an accident, even once repaired. Not every policy covers it, so check."],
              ["Service add-ons", "Extras on the policy: towing, replacement car, windscreen. Each costs money and can be dropped."],
            ]}
          />

          <H2>The three policies side by side</H2>
          <Table
            head={["", "Mandatory", "Third-party", "Comprehensive"]}
            rows={[
              ["Required by law?", "Yes", "No", "No"],
              ["Bodily injury", "Covered", "No", "No"],
              ["Damage to others’ cars", "No", "Covered", "Covered"],
              ["Damage to your car", "No", "No", "Covered"],
              ["Theft", "No", "No", "Covered"],
              ["Rough yearly price (ILS)", "1,000 to 2,500", "1,000 to 2,000", "2,500 to 8,000"],
            ]}
          />
          <p>
            You always need mandatory insurance. On top of it you choose between third-party and comprehensive.
            Driving without mandatory insurance is a criminal offence, and after an accident it can leave you
            paying enormous sums alone.
          </p>
          <p>
            The price ranges are wide because the price is very personal. A 22-year-old with a new car pays
            several times what a 45-year-old pays for the same car.
          </p>

          <H2>What sets the price</H2>
          <Bullets>
            <li>
              <strong>Who drives.</strong> Age, driving experience and the number of drivers on the policy. A
              young or new driver raises the price most.
            </li>
            <li>
              <strong>Your record.</strong> Claims, accidents and licence suspensions in the last three years.
            </li>
            <li>
              <strong>The car.</strong> Value, model, engine size and how often the model is stolen. For
              comprehensive cover, a more expensive car costs more to insure.
            </li>
            <li>
              <strong>Safety systems.</strong> Mandatory insurance is discounted for cars with advanced safety systems.
            </li>
            <li>
              <strong>Anti-theft protection.</strong> Insurers require certain protection by model, and without
              it theft cover is void.
            </li>
            <li>
              <strong>The deductible.</strong> The higher it is, the lower the premium.
            </li>
          </Bullets>

          <H2>The deductible: the number nobody looks at</H2>
          <p>
            Two comprehensive quotes can look similar in price and be very different on the day of an accident.
            A 4,000 ILS quote with a 1,500 deductible is not the same as a 3,600 quote with a 3,500 deductible.
            After one accident the “cheap” quote has cost you 1,600 ILS more.
          </p>
          <p>
            When comparing quotes, also check the deductible for a young driver and for a garage outside the
            insurer’s network. They are sometimes double.
          </p>

          <H2>Comprehensive or third-party only?</H2>
          <p>
            The question is how much you would lose if the car were stolen or written off tomorrow. For a car
            worth 120,000 ILS the answer is clear and comprehensive is almost always justified. For a car worth
            15,000, comprehensive at 3,000 a year means paying a fifth of the car’s value every year to insure it.
          </p>
          <p>
            A rule of thumb: when the comprehensive premium approaches 10% of the car’s value, look at
            third-party only. And if you took a loan and the car has a lien, the lender will usually require
            comprehensive cover until the loan ends.
          </p>

          <H2>Insurance in a lease</H2>
          <p>In an operating lease, insurance is usually included in the monthly payment. That is convenient, but check three things in the contract:</p>
          <Bullets>
            <li>
              <strong>Exactly what is included.</strong> Most deals include both mandatory and comprehensive, but not all.
            </li>
            <li>
              <strong>The deductible.</strong> In a lease the company sets it and you cannot choose. It is
              sometimes higher than you would pick yourself.
            </li>
            <li>
              <strong>Young drivers.</strong> Whether they may drive and what it adds.
            </li>
          </Bullets>
          <p>
            When comparing leasing with buying, insurance is one of the big differences. When buying you must
            add it to the sum; in a lease it is already inside. Forget that and buying looks cheaper than it
            is. The full comparison is in the <Ref to="buy-vs-lease">buying vs. leasing guide</Ref>.
          </p>

          <H2>How to pay less</H2>
          <Bullets>
            <li>
              <strong>Compare every year.</strong> Prices for the same driver and car differ between insurers
              by hundreds or thousands of shekels. Automatic renewal is almost always the most expensive.
            </li>
            <li>
              <strong>Check mandatory insurance separately.</strong> The Capital Market Authority runs a
              government calculator comparing mandatory insurance prices across all insurers. You do not have
              to buy mandatory and comprehensive from the same company.
            </li>
            <li>
              <strong>Limit the drivers.</strong> A named-driver policy is cheaper than “any driver”.
            </li>
            <li>
              <strong>Raise the deductible,</strong> if you have money set aside for an accident.
            </li>
            <li>
              <strong>Drop extras you do not need.</strong> You may already have towing or windscreen cover from elsewhere.
            </li>
            <li>
              <strong>Negotiate.</strong> One insurer’s quote is a good reason for another to lower its price.
            </li>
          </Bullets>

          <H2>Example: what insurance adds to the cost of the car</H2>
          <Example title="A car worth 150,000 ILS, experienced driver">
            <p>
              Mandatory insurance at 1,500 ILS and comprehensive at 4,500 make 6,000 a year, or{" "}
              <strong>18,000 ILS over three years</strong>. That is 500 ILS a month that appears neither in the
              price of the car nor in the loan repayment.
            </p>
          </Example>

          <H2>Insurance in the calculator</H2>
          <p>
            In <Calc>the calculator</Calc> you enter your mandatory and comprehensive quotes at the buying step.
            At the leasing step you tick which policies the monthly payment includes. If one is not included,
            the calculator adds it to the lease cost so the comparison is fair.
          </p>

          <Note>
            The prices here are broad ranges for orientation. Your price depends on your own details, and only
            a real quote counts.
          </Note>

          <CalcCta
            title="How much does insurance change the picture?"
            text="Enter your insurance quotes and see the full cost of buying against leasing, insurance included."
            button="Open the calculator"
          />
        </>
      )}
    </GuideShell>
  );
}
