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

  const FONT = "'Rubik',Arial,Helvetica,sans-serif";
  const td = `padding:10px 12px;border-bottom:1px solid #eeeeea;font-size:14px;color:#0e0e0e;text-align:${align};`;
  const tdNum = `padding:10px 12px;border-bottom:1px solid #eeeeea;font-size:14px;font-weight:bold;color:#0e0e0e;text-align:center;white-space:nowrap;`;
  const th = `padding:10px 12px;font-size:12px;font-weight:bold;color:#55554f;background:#f2f2ee;text-align:center;`;
  const winnerTh = `${th}color:#0e0e0e;`;
  const buyWins = recommendation.winner === "buy";
  const pill = (label: string) =>
    `<span style="display:inline-block;background:#d4f53c;color:#0e0e0e;border-radius:99px;padding:3px 10px;">✓ ${label}</span>`;
  const buyHead = buyWins ? pill(c.buy) : c.buy;
  const leaseHead = buyWins ? c.lease : pill(c.lease);

  const breakdownHtml = visibleRows
    .map(
      (row) => `<tr>
        <td style="${td}">${row.label}</td>
        <td style="${tdNum}">${cell(buy.breakdown[row.key], row.subtract)}</td>
        <td style="${tdNum}">${cell(lease.breakdown[row.key], row.subtract)}</td>
      </tr>`,
    )
    .join("");

  const totalCell = (v: number, win: boolean) =>
    `<td style="padding:14px 12px 4px;font-size:18px;font-weight:bold;text-align:center;white-space:nowrap;color:${win ? "#d4f53c" : "#ffffff"};">${n(v)} ₪</td>`;
  const monthlyCell = (v: number) =>
    `<td style="padding:0 12px 14px;font-size:14px;text-align:center;white-space:nowrap;color:#c8c8c1;">${n(v)} ₪</td>`;

  const html = `<!doctype html>
<html lang="${locale}" dir="${dir}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e.subject}</title></head>
<body style="margin:0;padding:0;background:#ededE8;font-family:${FONT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ededE8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" dir="${dir}" style="max-width:600px;">
        <tr><td style="background:#ffffff;border-radius:24px;padding:16px;text-align:center;">
          <img src="${SITE_URL}/images/email-logo@2x.png" alt="CarCalc" width="220" height="50" style="display:inline-block;width:220px;max-width:100%;height:auto;border:0;">
        </td></tr>
        <tr><td style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>
        <tr><td style="background:#ffffff;border-radius:24px;padding:24px;text-align:${align};">
          <p style="margin:0 0 10px;font-size:16px;font-weight:bold;color:#0e0e0e;">${greeting}</p>
          <p style="margin:0;font-size:15px;color:#55554f;line-height:1.6;">${e.intro}</p>
        </td></tr>
        <tr><td style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>
        <tr><td style="background:#0e0e0e;border-radius:24px;padding:24px;text-align:center;">
          <div style="display:inline-block;background:#d4f53c;color:#0e0e0e;border-radius:99px;padding:4px 14px;font-size:13px;font-weight:bold;">${r.bestDeal}</div>
          <div style="margin-top:12px;font-size:22px;font-weight:bold;line-height:1.35;color:#ffffff;">${headline}</div>
          <div style="margin-top:10px;font-size:14px;color:#c8c8c1;line-height:1.6;">${explanation}</div>
        </td></tr>
        <tr><td style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>
        <tr><td style="background:#ffffff;border-radius:24px;padding:8px 0 0;overflow:hidden;">
          <div style="padding:12px 20px 12px;font-size:16px;font-weight:bold;color:#0e0e0e;text-align:${align};">${e.breakdownTitle} · ${periodYears} ${t.results.years}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <th style="${th}"></th>
              <th style="${buyWins ? winnerTh : th}">${buyHead}</th>
              <th style="${buyWins ? th : winnerTh}">${leaseHead}</th>
            </tr>
            ${breakdownHtml}
            <tr style="background:#0e0e0e;">
              <td style="padding:14px 12px 4px;font-size:15px;font-weight:bold;color:#ffffff;text-align:${align};">${c.total}</td>
              ${totalCell(buy.totalCost, buyWins)}
              ${totalCell(lease.totalCost, !buyWins)}
            </tr>
            <tr style="background:#0e0e0e;">
              <td style="padding:0 12px 14px;font-size:13px;color:#c8c8c1;text-align:${align};">${c.monthlyCost}</td>
              ${monthlyCell(buy.monthlyCost)}
              ${monthlyCell(lease.monthlyCost)}
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 0 8px;text-align:center;">
          <a href="${SITE_URL}" style="display:inline-block;background:#d4f53c;color:#0e0e0e;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 26px;border-radius:14px;border:2px solid #0e0e0e;">${e.cta} ${dir === "rtl" ? "←" : "→"}</a>
        </td></tr>
        <tr><td style="padding:12px 8px 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:#6b6b65;line-height:1.6;">${e.disclaimer}</p>
          <p style="margin:0;font-size:12px;color:#6b6b65;line-height:1.6;">${e.footer}</p>
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
    headline,
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
