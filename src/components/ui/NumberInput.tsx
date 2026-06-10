"use client";

import { useState, useCallback } from "react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  error?: boolean;
  /** When true, tints the field green and shows the badge inside (auto-filled). */
  autoFilled?: boolean;
  /** Small label shown inside the field on the trailing edge (e.g. "auto-filled"). */
  badge?: string;
  /** When true, displays a 0 value as "0" instead of blank (for meaningful zeros like a new car's age). */
  showZero?: boolean;
}

export default function NumberInput({
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  min,
  max,
  step,
  error,
  autoFilled,
  badge,
  showZero,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const handleFocus = useCallback(() => {
    setFocused(true);
    setDisplayValue(value === 0 && !showZero ? "" : String(value));
  }, [value, showZero]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseFloat(displayValue);
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else if (displayValue === "") {
      onChange(0);
    }
  }, [displayValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  }, []);

  const formattedValue = value === 0 && !showZero ? "" : value.toLocaleString();

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-sm text-zinc-500 pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        type={focused ? "text" : "text"}
        inputMode="decimal"
        value={focused ? displayValue : formattedValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={`
          w-full rounded-lg border px-3 py-2 text-sm
          dark:text-zinc-100
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
          ${prefix ? "ps-8" : ""}
          ${badge ? "pe-28" : suffix ? "pe-12" : ""}
          ${autoFilled
            ? "bg-emerald-50 dark:bg-emerald-950/30"
            : "bg-white dark:bg-zinc-900"
          }
          ${error
            ? "border-red-500 dark:border-red-400"
            : autoFilled
              ? "border-emerald-300 dark:border-emerald-800"
              : "border-zinc-300 dark:border-zinc-700"
          }
        `}
      />
      {badge ? (
        <span className="absolute inset-y-0 end-0 flex items-center pe-2 pointer-events-none">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            {badge}
          </span>
        </span>
      ) : suffix ? (
        <span className="absolute inset-y-0 end-0 flex items-center pe-3 text-sm text-zinc-500 pointer-events-none">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
