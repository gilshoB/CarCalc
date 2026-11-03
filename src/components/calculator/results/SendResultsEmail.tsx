"use client";

import { useEffect, useState } from "react";
import type { getTranslations, Locale } from "@/i18n/config";
import type { CalculatorInput } from "@/types/calculator";
import type { MaintenanceOverrideValues } from "@/types/form";

interface SendResultsEmailProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  input: CalculatorInput;
  maintenanceOverride: MaintenanceOverrideValues | null;
}

type Status = "idle" | "sending" | "sent" | "invalid" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SendResultsEmail({ t, locale, input, maintenanceOverride }: SendResultsEmailProps) {
  const s = t.results.sendEmail;
  // Hidden until the server confirms email sending is configured.
  const [enabled, setEnabled] = useState(false);
  const [email, setEmail] = useState(input.email ?? "");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    fetch("/api/send-results")
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  if (!enabled) return null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    if (!EMAIL_RE.test(address)) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: address,
          locale,
          input: { ...input, ...(maintenanceOverride ? { maintenanceOverride } : {}) },
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[720px] rounded-[24px] bg-white p-6">
      <h3 className="text-lg font-bold">{s.title}</h3>
      <p className="mt-1 text-sm text-muted">{s.subtitle}</p>

      {status === "sent" ? (
        <p className="mt-4 rounded-[14px] bg-brand-100 px-4 py-3 text-sm font-medium text-ink">
          {s.sent}
        </p>
      ) : (
        <form onSubmit={send} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle" && status !== "sending") setStatus("idle");
            }}
            placeholder={s.placeholder}
            aria-label={s.placeholder}
            aria-invalid={status === "invalid"}
            className={`min-w-0 flex-1 h-[52px] rounded-xl border-2 bg-white px-4 text-[15px] text-ink focus:outline-none focus:border-ink ${
              status === "invalid" ? "border-red-500" : "border-line"
            }`}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="shrink-0 h-[52px] rounded-xl bg-ink px-6 text-[15px] font-bold text-white transition-colors hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {status === "sending" ? s.sending : s.button}
          </button>
        </form>
      )}

      {status === "invalid" && <p className="mt-2 text-sm text-red-700">{s.invalid}</p>}
      {status === "error" && <p className="mt-2 text-sm text-red-700">{s.error}</p>}
    </div>
  );
}
