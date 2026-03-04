"use client";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: boolean;
}

export default function Select({ value, onChange, options, error }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full rounded-lg border bg-white px-3 py-2 text-sm
        dark:bg-zinc-900 dark:text-zinc-100
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${error
          ? "border-red-500 dark:border-red-400"
          : "border-zinc-300 dark:border-zinc-700"
        }
      `}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
