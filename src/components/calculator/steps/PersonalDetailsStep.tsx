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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.name} error={errors["name"]}>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            className={`
              w-full rounded-lg border bg-white px-3 py-2 text-sm
              dark:bg-zinc-900 dark:text-zinc-100
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
              ${errors["name"] ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"}
            `}
          />
        </FormField>

        <FormField label={f.email} hint={f.emailHint} error={errors["email"]}>
          <input
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`
              w-full rounded-lg border bg-white px-3 py-2 text-sm
              dark:bg-zinc-900 dark:text-zinc-100
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
              ${errors["email"] ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"}
            `}
          />
        </FormField>
      </div>
    </div>
  );
}
