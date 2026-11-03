"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex w-full items-center justify-between gap-4 rounded-[18px] bg-soft px-5 py-4 cursor-pointer">
      <span className="text-base font-bold text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-[34px] w-[60px] shrink-0 items-center rounded-full p-1
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2
          ${checked ? "bg-ink justify-end" : "bg-[#d6d6d0] justify-start"}
        `}
      >
        <span
          className={`pointer-events-none inline-block h-[26px] w-[26px] rounded-full ${checked ? "bg-lime" : "bg-white"}`}
        />
      </button>
    </label>
  );
}
