"use client";

import type { getTranslations } from "@/i18n/config";
import type { FormErrors } from "@/types/form";
import FormField from "@/components/ui/FormField";

interface PersonalDetailsStepProps {
  t: ReturnType<typeof getTranslations>;
  name: string;
  email: string;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function PersonalDetailsStep({
  t,
  name,
  email,
  errors,
  onChange,
}: PersonalDetailsStepProps) {
  const f = t.form.personalDetails;

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[34px] sm:text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em]">{f.title}</h2>
        <p className="mt-2 text-base leading-relaxed text-muted">{f.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.name} error={errors["name"]} validationMessages={t.form.validation}>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            className={`
              w-full h-14 rounded-[14px] border-2 bg-white px-4 text-[17px] text-ink
              dark:bg-zinc-900 dark:text-zinc-100
              focus:outline-none focus:border-ink
              ${errors["name"] ? "border-red-500" : "border-line"}
            `}
          />
        </FormField>

        <FormField label={f.email} hint={f.emailHint} error={errors["email"]} validationMessages={t.form.validation}>
          <input
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`
              w-full h-14 rounded-[14px] border-2 bg-white px-4 text-[17px] text-ink
              dark:bg-zinc-900 dark:text-zinc-100
              focus:outline-none focus:border-ink
              ${errors["email"] ? "border-red-500" : "border-line"}
            `}
          />
        </FormField>
      </div>
    </div>
  );
}
