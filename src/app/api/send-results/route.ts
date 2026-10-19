import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CalculatorInputSchema, runCalculation } from "@/lib/calculations/calculate";
import { buildResultsEmail } from "@/lib/email/resultsEmail";
import type { CalculatorInput } from "@/types/calculator";

// Emails a results summary via Resend (https://resend.com).
// Needs RESEND_API_KEY and EMAIL_FROM (an address on a domain verified in
// Resend, e.g. "CarCalc <results@your-domain.com>"). Until both are set the
// feature reports itself disabled and the UI hides the button.

const RequestSchema = z.object({
  email: z.string().trim().email().max(254),
  locale: z.enum(["he", "en"]),
  input: CalculatorInputSchema,
});

function isConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function GET() {
  return NextResponse.json({ enabled: isConfigured() });
}

export async function POST(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let parsed: z.infer<typeof RequestSchema>;
  try {
    parsed = RequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  try {
    // Recompute server-side rather than trusting client-sent numbers, so the
    // endpoint can only ever send our own calculation.
    const input = parsed.input as CalculatorInput;
    const results = await runCalculation(input);
    const { subject, html, text } = buildResultsEmail(input, results, parsed.locale);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [parsed.email],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("send-results error:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
