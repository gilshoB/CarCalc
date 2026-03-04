"use client";

import { TOTAL_STEPS } from "@/types/form";

interface StepIndicatorProps {
  currentStep: number;
  stepLabel: string;
  ofLabel: string;
}

export default function StepIndicator({ currentStep, stepLabel, ofLabel }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {stepLabel} {currentStep} {ofLabel} {TOTAL_STEPS}
        </span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`
              h-2 flex-1 rounded-full transition-colors duration-300
              ${step <= currentStep
                ? "bg-blue-600"
                : "bg-zinc-200 dark:bg-zinc-700"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
