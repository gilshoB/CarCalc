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
    const parsed = parseFloat(displayValue.replace(/,/g, ""));
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else if (displayValue === "") {
      onChange(0);
    }
  }, [displayValue, onChange]);

  // Commit on every keystroke so "Next" always validates what's on screen.
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    const parsed = parseFloat(raw.replace(/,/g, ""));
    onChange(isNaN(parsed) ? 0 : parsed);
  }, [onChange]);

  const formattedValue = value === 0 && !showZero ? "" : value.toLocaleString();

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute inset-y-0 start-0 flex items-center ps-4 text-[15px] font-medium text-muted pointer-events-none">
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
          w-full h-14 rounded-[14px] border-2 px-4 text-[17px] text-ink
          dark:text-zinc-100
          focus:outline-none focus:border-ink
          ${prefix ? "ps-10" : ""}
          ${badge ? "pe-36" : suffix ? "pe-12" : ""}
          ${autoFilled
            ? "bg-white"
            : "bg-white dark:bg-zinc-900"
          }
          ${error
            ? "border-red-500 dark:border-red-400"
            : autoFilled
              ? "border-ink"
              : "border-line"
          }
        `}
      />
      {badge ? (
        <span className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
          <span className="rounded-lg bg-lime px-2 py-0.5 text-xs font-bold text-ink">
            {badge}
          </span>
        </span>
      ) : suffix ? (
        <span className="absolute inset-y-0 end-0 flex items-center pe-4 text-[15px] text-muted pointer-events-none">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
