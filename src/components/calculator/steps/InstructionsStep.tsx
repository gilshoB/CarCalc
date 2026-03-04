"use client";

import type { getTranslations } from "@/i18n/config";

interface InstructionsStepProps {
  t: ReturnType<typeof getTranslations>;
  onStart: () => void;
}

export default function InstructionsStep({ t, onStart }: InstructionsStepProps) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        {t.wizard.instructions.title}
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400">
        {t.wizard.instructions.subtitle}
      </p>
      <ul className="mx-auto max-w-md space-y-3 text-start">
        {t.wizard.instructions.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {i + 1}
            </span>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{item}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onStart}
        className="mx-auto mt-4 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {t.wizard.instructions.ready}
      </button>
    </div>
  );
}
