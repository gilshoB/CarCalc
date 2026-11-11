"use client";

import { useState } from "react";
import type { getTranslations } from "@/i18n/config";

type Kind = "question" | "feedback" | "suggestion";
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({ t }: { t: ReturnType<typeof getTranslations> }) {
  const c = t.contact;
  const [kind, setKind] = useState<Kind>("question");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<"message" | "email" | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 5) return setFieldError("message");
    if (email.trim() && !EMAIL_RE.test(email.trim())) return setFieldError("email");
    setFieldError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, name, email: email.trim(), message, website }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-[24px] bg-lime p-8 text-ink">
        <p className="text-2xl font-extrabold">{c.sentTitle}</p>
        <p className="mt-2 text-base">{c.sentText}</p>
      </div>
    );
  }

  const input = "w-full rounded-[14px] border-2 border-line bg-white px-4 text-[17px] text-ink focus:border-ink focus:outline-none";

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-[24px] bg-white p-6 sm:p-8">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[15px] font-bold">{c.kindLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {(["question", "feedback", "suggestion"] as const).map((k) => (
            <label
              key={k}
              className={`cursor-pointer rounded-full border-2 px-5 py-2 text-[15px] font-semibold transition-colors ${kind === k ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"}`}
            >
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              {c.kinds[k]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[15px] font-bold">{c.name}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" className={`${input} h-14`} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[15px] font-bold">{c.email}</span>
          <input
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={`${input} h-14 ${fieldError === "email" ? "border-red-500" : ""}`}
          />
          <span className={`text-[13px] ${fieldError === "email" ? "font-medium text-red-700" : "text-muted"}`}>
            {fieldError === "email" ? t.form.validation.invalidEmail : c.emailHint}
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[15px] font-bold">
          {c.message}
          <span className="text-red-500 ms-1">*</span>
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          maxLength={5000}
          className={`${input} py-3 leading-relaxed ${fieldError === "message" ? "border-red-500" : ""}`}
        />
        {fieldError === "message" && <span className="text-[13px] font-medium text-red-700">{c.messageRequired}</span>}
      </label>

      {/* Honeypot — hidden from people, filled by bots */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {status === "error" && <p className="text-sm font-medium text-red-700">{c.error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="h-14 self-start rounded-[14px] bg-ink px-9 text-base font-bold text-white transition-colors hover:bg-black disabled:opacity-60"
      >
        {status === "sending" ? c.sending : c.send}
      </button>
    </form>
  );
}
