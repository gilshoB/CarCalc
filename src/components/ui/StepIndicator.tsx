"use client";

import { TOTAL_STEPS } from "@/types/form";

interface StepIndicatorProps {
  currentStep: number;
  stepLabel: string;
  ofLabel: string;
}

export default function StepIndicator({ currentStep, stepLabel, ofLabel }: StepIndicatorProps) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <span className="text-sm font-semibold text-[#3d3d38]">
        {stepLabel} {currentStep} {ofLabel} {TOTAL_STEPS}
      </span>
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              step < currentStep
                ? "bg-ink"
                : step === currentStep
                  ? "bg-lime ring-[1.5px] ring-inset ring-ink"
                  : "bg-[#d6d6d0]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
