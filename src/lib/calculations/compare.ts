import type { OptionResult } from "@/types/calculator";

export interface ComparisonResult {
  winner: "buy" | "lease";
  savingsAmount: number;
  savingsPercent: number;
  explanation: string;
  explanationHe: string;
}

export function compareScenarios(
  buyResult: OptionResult,
  leaseResult: OptionResult,
  periodYears: number,
): ComparisonResult {
  const buyCost = buyResult.totalCost;
  const leaseCost = leaseResult.totalCost;

  const winner = buyCost <= leaseCost ? "buy" : "lease";
  const savingsAmount = Math.abs(buyCost - leaseCost);
  const loserCost = Math.max(buyCost, leaseCost);
  const savingsPercent = loserCost > 0 ? Math.round((savingsAmount / loserCost) * 100) : 0;

  const monthlySavings = Math.round(savingsAmount / (periodYears * 12));

  let explanation: string;
  let explanationHe: string;

  if (winner === "buy") {
    explanation = `Buying saves you ${savingsAmount.toLocaleString()} ILS over ${periodYears} years (${monthlySavings.toLocaleString()} ILS/month), which is ${savingsPercent}% less than leasing.`;
    explanationHe = `קניית הרכב חוסכת לך ${savingsAmount.toLocaleString()} ₪ על פני ${periodYears} שנים (${monthlySavings.toLocaleString()} ₪ לחודש), חיסכון של ${savingsPercent}% לעומת ליסינג.`;
  } else {
    explanation = `Leasing saves you ${savingsAmount.toLocaleString()} ILS over ${periodYears} years (${monthlySavings.toLocaleString()} ILS/month), which is ${savingsPercent}% less than buying.`;
    explanationHe = `ליסינג תפעולי חוסך לך ${savingsAmount.toLocaleString()} ₪ על פני ${periodYears} שנים (${monthlySavings.toLocaleString()} ₪ לחודש), חיסכון של ${savingsPercent}% לעומת קנייה.`;
  }

  return {
    winner,
    savingsAmount,
    savingsPercent,
    explanation,
    explanationHe,
  };
}
