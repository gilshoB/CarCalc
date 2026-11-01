"use client";

import type { getTranslations } from "@/i18n/config";

interface InstructionsStepProps {
  t: ReturnType<typeof getTranslations>;
  onStart: () => void;
}

export default function InstructionsStep({ t, onStart }: InstructionsStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[34px] sm:text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em]">
        {t.wizard.instructions.title}
      </h2>
      <p className="text-base text-[#c8c8c1]">
        {t.wizard.instructions.subtitle}
      </p>
      <ul className="flex flex-col gap-2">
        {t.wizard.instructions.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3.5 rounded-[14px] bg-[#1c1c1a] px-4 py-3.5 text-base">
            <span className="shrink-0 font-bold text-lime tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onStart}
        className="h-[60px] rounded-[14px] bg-lime px-8 text-[17px] font-bold text-ink hover:brightness-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {t.wizard.instructions.ready} ←
      </button>
    </div>
  );
}
