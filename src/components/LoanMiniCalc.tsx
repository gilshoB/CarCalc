"use client";

import { useState } from "react";
import NumberInput from "@/components/ui/NumberInput";

type LoanType = "regular" | "balloon";

/** Monthly payment for an amortising (Spitzer) loan that leaves `balloon` unpaid at the end. */
export function loanMonthlyPayment(principal: number, annualRatePct: number, months: number, balloon = 0): number {
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return (principal - balloon) / months;
  const growth = Math.pow(1 + r, months);
  return ((principal - balloon / growth) * r) / (1 - 1 / growth);
}

const TEXT = {
  he: {
    regular: "הלוואה רגילה",
    balloon: "הלוואת בלון",
    amount: "סכום ההלוואה",
    rate: "ריבית שנתית",
    years: "תקופה",
    yearsUnit: "שנים",
    balloonAmount: "הבלון (משולם בסוף)",
    monthly: "החזר חודשי",
    interest: "סך הריבית",
    total: "סך הכול תחזירו",
    atEnd: "תשלום בסוף התקופה",
    withoutBalloon: "בלי בלון: החזר של {m} בחודש, וסך ריבית של {i}. הבלון מוריד את ההחזר ב-{dm} בחודש, אבל עולה לכם עוד {di} בריבית.",
    balloonTooBig: "הבלון צריך להיות קטן מסכום ההלוואה.",
    fill: "מלאו סכום, ריבית ותקופה כדי לראות את התוצאה.",
    currency: "₪",
  },
  en: {
    regular: "Regular loan",
    balloon: "Balloon loan",
    amount: "Loan amount",
    rate: "Annual rate",
    years: "Term",
    yearsUnit: "years",
    balloonAmount: "Balloon (paid at the end)",
    monthly: "Monthly repayment",
    interest: "Total interest",
    total: "Total you repay",
    atEnd: "Payment at the end",
    withoutBalloon: "Without a balloon: {m} a month and {i} in total interest. The balloon cuts the repayment by {dm} a month but costs {di} more in interest.",
    balloonTooBig: "The balloon must be smaller than the loan amount.",
    fill: "Enter an amount, rate and term to see the result.",
    currency: "ILS",
  },
};

export default function LoanMiniCalc({ locale }: { locale: string }) {
  const t = locale === "en" ? TEXT.en : TEXT.he;
  const [type, setType] = useState<LoanType>("regular");
  const [amount, setAmount] = useState(90000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [balloon, setBalloon] = useState(40000);

  const fmt = (n: number) =>
    locale === "en"
      ? `${Math.round(n).toLocaleString("en-US")} ${t.currency}`
      : `${Math.round(n).toLocaleString("he-IL")} ${t.currency}`;

  const months = Math.round(years * 12);
  const b = type === "balloon" ? balloon : 0;
  const ready = amount > 0 && months > 0 && rate >= 0;
  const balloonInvalid = type === "balloon" && b >= amount;

  const monthly = ready && !balloonInvalid ? loanMonthlyPayment(amount, rate, months, b) : 0;
  const totalPaid = monthly * months + b;
  const interest = totalPaid - amount;

  const plainMonthly = ready ? loanMonthlyPayment(amount, rate, months) : 0;
  const plainInterest = plainMonthly * months - amount;

  const tab = (value: LoanType, label: string) => (
    <button
      type="button"
      onClick={() => setType(value)}
      aria-pressed={type === value}
      className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
        type === value ? "bg-ink text-white" : "text-ink hover:bg-soft"
      }`}
    >
      {label}
    </button>
  );

  const field = (label: string, input: React.ReactNode) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {input}
    </label>
  );

  return (
    <div className="!mt-5 rounded-[24px] bg-white p-5 sm:p-6 text-[15px] leading-snug">
      <div className="mb-5 flex gap-1 rounded-full bg-canvas p-1" role="group">
        {tab("regular", t.regular)}
        {tab("balloon", t.balloon)}
      </div>

      <div className={`grid gap-4 ${type === "balloon" ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {field(t.amount, <NumberInput value={amount} onChange={setAmount} prefix="₪" />)}
        {field(t.rate, <NumberInput value={rate} onChange={setRate} suffix="%" step={0.1} showZero />)}
        {field(t.years, <NumberInput value={years} onChange={setYears} suffix={t.yearsUnit} min={1} max={10} />)}
        {type === "balloon" &&
          field(t.balloonAmount, <NumberInput value={balloon} onChange={setBalloon} prefix="₪" error={balloonInvalid} />)}
      </div>

      <div className="mt-5 rounded-[18px] bg-ink p-5 text-white" aria-live="polite">
        {!ready ? (
          <p className="text-[#c8c8c1]">{t.fill}</p>
        ) : balloonInvalid ? (
          <p className="text-red-300">{t.balloonTooBig}</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-[13px] text-[#c8c8c1]">{t.monthly}</div>
                <div className="text-[26px] font-extrabold tracking-[-0.02em] text-lime">{fmt(monthly)}</div>
              </div>
              <div>
                <div className="text-[13px] text-[#c8c8c1]">{t.interest}</div>
                <div className="text-[22px] font-extrabold tracking-[-0.02em]">{fmt(interest)}</div>
              </div>
              <div>
                <div className="text-[13px] text-[#c8c8c1]">{type === "balloon" ? t.atEnd : t.total}</div>
                <div className="text-[22px] font-extrabold tracking-[-0.02em]">{fmt(type === "balloon" ? b : totalPaid)}</div>
              </div>
            </div>
            {type === "balloon" && b > 0 && (
              <p className="mt-4 border-t border-white/15 pt-3 text-[14px] leading-relaxed text-[#c8c8c1]">
                {t.withoutBalloon
                  .replace("{m}", fmt(plainMonthly))
                  .replace("{i}", fmt(plainInterest))
                  .replace("{dm}", fmt(plainMonthly - monthly))
                  .replace("{di}", fmt(interest - plainInterest))}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
