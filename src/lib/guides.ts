// One list of all guides, used by the menu, the /guides index page and the sitemap,
// so a new guide only has to be added here (plus its page).

export type GuideInfo = {
  slug: string;
  he: { nav: string; summary: string };
  en: { nav: string; summary: string };
};

export const GUIDES: GuideInfo[] = [
  {
    slug: "buy-vs-lease",
    he: { nav: "קנייה מול ליסינג", summary: "מה באמת זול יותר לאורך זמן, ואיך משווים נכון בין קנייה לליסינג." },
    en: { nav: "Buying vs Leasing", summary: "Which really costs less over time, and how to compare the two fairly." },
  },
  {
    slug: "monthly-car-cost",
    he: { nav: "כמה עולה להחזיק רכב", summary: "כל ההוצאות של רכב בחודש, עם דוגמה מלאה לרכב משפחתי." },
    en: { nav: "Monthly Cost of a Car", summary: "Every cost of owning a car each month, with a full family-car example." },
  },
  {
    slug: "private-vs-operational-leasing",
    he: { nav: "ליסינג פרטי או תפעולי", summary: "מה ההבדל, מה כלול בכל אחד, ומה לבדוק לפני שחותמים." },
    en: { nav: "Private vs Operational Leasing", summary: "The difference, what each includes, and what to check before signing." },
  },
  {
    slug: "depreciation",
    he: { nav: "פחת רכב", summary: "כמה ערך הרכב יורד בכל שנה, ואיך לבחור רכב ששומר על ערכו." },
    en: { nav: "Car Depreciation", summary: "How much value a car loses each year, and how to pick one that holds it." },
  },
  {
    slug: "car-loans",
    he: { nav: "הלוואת רכב", summary: "איפה כדאי לקחת הלוואה, מה הריביות היום, ומחשבון החזר קטן." },
    en: { nav: "Car Loans", summary: "Where to borrow, today's rates, and a small repayment calculator." },
  },
  {
    slug: "insurance",
    he: { nav: "ביטוח רכב", summary: "חובה, צד ג׳ ומקיף: מה כל ביטוח מכסה ואיך חוסכים." },
    en: { nav: "Car Insurance", summary: "Mandatory, third-party and comprehensive: what each covers and how to save." },
  },
  {
    slug: "electric-vs-gasoline",
    he: { nav: "חשמלי מול בנזין", summary: "כמה עולה אנרגיה לשנה, ומתי רכב חשמלי באמת משתלם." },
    en: { nav: "Electric vs Gasoline", summary: "Yearly energy costs, and when an EV really pays off." },
  },
  {
    slug: "tax-benefits",
    he: { nav: "הטבות מס לעצמאים", summary: "הוצאה מוכרת, מע״מ ושווי שימוש ברכב צמוד." },
    en: { nav: "Tax Benefits for Businesses", summary: "Deductible expenses, VAT and the usage value of a company car." },
  },
];
