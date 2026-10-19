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
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-5 ring-1 ring-zinc-200/70 dark:bg-zinc-900 dark:ring-zinc-700/50">
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{s.title}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{s.subtitle}</p>

      {status === "sent" ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
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
            className={`min-w-0 flex-1 rounded-lg border bg-white px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-zinc-800 dark:text-zinc-100 ${
              status === "invalid" ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
            }`}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          >
            {status === "sending" ? s.sending : s.button}
          </button>
        </form>
      )}

      {status === "invalid" && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{s.invalid}</p>}
      {status === "error" && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{s.error}</p>}
    </div>
  );
}
