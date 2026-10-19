import { getTranslations, getDirection, type Locale } from "@/i18n/config";
import { formatNumber } from "@/lib/formatters";
import { SITE_URL } from "@/lib/site";
import type { CalculatorInput, CalculatorOutput, CostBreakdown } from "@/types/calculator";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function tpl(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
}

type Row = { label: string; key: keyof CostBreakdown; subtract?: boolean };

/**
 * Builds the "your results" email (subject, HTML and plain-text bodies) from a
 * server-side calculation. Inline styles + table layout for email clients.
 */
export function buildResultsEmail(input: CalculatorInput, results: CalculatorOutput, locale: Locale) {
  const t = getTranslations(locale);
  const e = t.email;
  const c = t.results.comparison;
  const r = t.results.recommendation;
  const dir = getDirection(locale);
  const align = dir === "rtl" ? "right" : "left";
  const n = (v: number) => formatNumber(v, locale);
  const { buy, lease, recommendation, periodYears } = results;

  const winnerName = recommendation.winner === "buy" ? r.buyName : r.leaseName;
  const explanation = locale === "he" ? recommendation.explanationHe : recommendation.explanation;
  const name = input.name?.trim();
  const greeting = name ? tpl(e.greetingNamed, { name: escapeHtml(name) }) : e.greeting;
  const headline = tpl(e.headline, { winner: winnerName, amount: n(recommendation.savingsAmount), years: periodYears });

  const rows: Row[] = [
    { label: c.carPayment, key: "carPayment" },
    { label: c.loanInterest, key: "loanInterest" },
    { label: c.registration, key: "registrationFees" },
    { label: c.mandatoryInsurance, key: "mandatoryInsurance" },
    { label: c.comprehensiveInsurance, key: "comprehensiveInsurance" },
    { label: c.testFees, key: "testFees" },
    { label: c.fuel, key: "fuel" },
    { label: c.maintenance, key: "maintenance" },
    { label: c.residualValue, key: "residualValue", subtract: true },
    { label: c.taxBenefits, key: "taxBenefits", subtract: true },
    { label: c.workplaceBenefit, key: "workplaceBenefit", subtract: true },
    { label: c.investmentResult, key: "investmentResult", subtract: true },
  ];
  const visibleRows = rows.filter((row) => buy.breakdown[row.key] || lease.breakdown[row.key]);
  const cell = (v: number, subtract?: boolean) => {
    if (!v) return "—";
    return subtract ? `-${n(v)} ₪` : `${n(v)} ₪`;
  };

  const td = `padding:8px 10px;border-bottom:1px solid #e4e4e7;font-size:14px;color:#3f3f46;text-align:${align};`;
  const tdNum = `padding:8px 10px;border-bottom:1px solid #e4e4e7;font-size:14px;color:#18181b;text-align:center;white-space:nowrap;`;
  const th = `padding:8px 10px;font-size:13px;color:#71717a;text-align:center;border-bottom:2px solid #d4d4d8;`;

  const breakdownHtml = visibleRows
    .map(
      (row) => `<tr>
        <td style="${td}">${row.label}</td>
        <td style="${tdNum}">${cell(buy.breakdown[row.key], row.subtract)}</td>
        <td style="${tdNum}">${cell(lease.breakdown[row.key], row.subtract)}</td>
      </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="${locale}" dir="${dir}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e.subject}</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" dir="${dir}" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#3f7f8c;padding:20px;text-align:center;">
          <img src="${SITE_URL}/images/logo_new.png" alt="CarCalc" width="160" style="display:inline-block;max-width:160px;height:auto;border:0;">
        </td></tr>
        <tr><td style="padding:24px 24px 8px;text-align:${align};">
          <p style="margin:0 0 12px;font-size:16px;color:#18181b;">${greeting}</p>
          <p style="margin:0;font-size:15px;color:#52525b;line-height:1.6;">${e.intro}</p>
        </td></tr>
        <tr><td style="padding:16px 24px;">
          <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:16px;text-align:center;">
            <div style="font-size:20px;font-weight:bold;color:#065f46;">🏆 ${headline}</div>
            <div style="margin-top:8px;font-size:14px;color:#047857;line-height:1.6;">${explanation}</div>
          </div>
        </td></tr>
        <tr><td style="padding:8px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <th style="${th}"></th>
              <th style="${th}">${c.buy}</th>
              <th style="${th}">${c.lease}</th>
            </tr>
            <tr>
              <td style="${td}font-weight:bold;">${c.total} (${periodYears} ${t.results.years})</td>
              <td style="${tdNum}font-weight:bold;">${n(buy.totalCost)} ₪</td>
              <td style="${tdNum}font-weight:bold;">${n(lease.totalCost)} ₪</td>
            </tr>
            <tr>
              <td style="${td}font-weight:bold;">${c.monthlyCost}</td>
              <td style="${tdNum}font-weight:bold;">${n(buy.monthlyCost)} ₪</td>
              <td style="${tdNum}font-weight:bold;">${n(lease.monthlyCost)} ₪</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:16px 24px 8px;text-align:${align};">
          <div style="font-size:15px;font-weight:bold;color:#18181b;margin-bottom:6px;">${e.breakdownTitle}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <th style="${th}"></th>
              <th style="${th}">${c.buy}</th>
              <th style="${th}">${c.lease}</th>
            </tr>
            ${breakdownHtml}
          </table>
        </td></tr>
        <tr><td style="padding:20px 24px;text-align:center;">
          <a href="${SITE_URL}" style="display:inline-block;background:#3f7f8c;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 22px;border-radius:8px;">${e.cta}</a>
        </td></tr>
        <tr><td style="padding:0 24px 24px;text-align:${align};">
          <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;line-height:1.6;">${e.disclaimer}</p>
          <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.6;">${e.footer}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    name ? tpl(e.greetingNamed, { name }) : e.greeting,
    "",
    e.intro,
    "",
    `🏆 ${headline}`,
    explanation,
    "",
    `${c.total} (${periodYears} ${t.results.years}): ${c.buy} ${n(buy.totalCost)} ₪ | ${c.lease} ${n(lease.totalCost)} ₪`,
    `${c.monthlyCost}: ${c.buy} ${n(buy.monthlyCost)} ₪ | ${c.lease} ${n(lease.monthlyCost)} ₪`,
    "",
    e.breakdownTitle,
    ...visibleRows.map(
      (row) => `${row.label}: ${c.buy} ${cell(buy.breakdown[row.key], row.subtract)} | ${c.lease} ${cell(lease.breakdown[row.key], row.subtract)}`,
    ),
    "",
    `${e.cta}: ${SITE_URL}`,
    "",
    e.disclaimer,
    e.footer,
  ].join("\n");

  return { subject: e.subject, html, text };
}
