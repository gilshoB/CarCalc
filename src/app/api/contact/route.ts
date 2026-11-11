import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Contact form → email to the site owner via Resend.
// Needs RESEND_API_KEY, EMAIL_FROM and CONTACT_EMAIL (where messages go).

const RequestSchema = z.object({
  kind: z.enum(["question", "feedback", "suggestion"]),
  name: z.string().trim().max(100).optional().default(""),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).optional().default(""),
  message: z.string().trim().min(5).max(5000),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().optional().default(""),
});

const KIND_LABEL = { question: "שאלה", feedback: "תגובה", suggestion: "הצעה" } as const;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(request: NextRequest) {
  const { RESEND_API_KEY, EMAIL_FROM, CONTACT_EMAIL } = process.env;
  if (!RESEND_API_KEY || !EMAIL_FROM || !CONTACT_EMAIL) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let data: z.infer<typeof RequestSchema>;
  try {
    data = RequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  // Pretend success to bots so they don't retry.
  if (data.website) return NextResponse.json({ ok: true });

  const kind = KIND_LABEL[data.kind];
  const from = data.name || data.email || "אנונימי";
  const subject = `CarCalc — ${kind} מ${from}`;
  const text = `${kind}\nשם: ${data.name || "-"}\nמייל: ${data.email || "-"}\n\n${data.message}`;
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#0e0e0e">
<p><b>${kind}</b></p>
<p>שם: ${escapeHtml(data.name || "-")}<br>מייל: ${escapeHtml(data.email || "-")}</p>
<p style="white-space:pre-wrap">${escapeHtml(data.message)}</p></div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [CONTACT_EMAIL],
        ...(data.email ? { reply_to: data.email } : {}),
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
    console.error("contact error:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
