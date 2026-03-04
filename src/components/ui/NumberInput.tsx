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
}: NumberInputProps) {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const handleFocus = useCallback(() => {
    setFocused(true);
    setDisplayValue(value === 0 ? "" : String(value));
  }, [value]);

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

  const formattedValue = value === 0 ? "" : value.toLocaleString();

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
          w-full rounded-lg border bg-white px-3 py-2 text-sm
          dark:bg-zinc-900 dark:text-zinc-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${prefix ? "ps-8" : ""}
          ${suffix ? "pe-12" : ""}
          ${error
            ? "border-red-500 dark:border-red-400"
            : "border-zinc-300 dark:border-zinc-700"
          }
        `}
      />
      {suffix && (
        <span className="absolute inset-y-0 end-0 flex items-center pe-3 text-sm text-zinc-500 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}
