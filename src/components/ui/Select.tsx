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
  /** When true, tints the field green and shows the badge inside (auto-filled). */
  autoFilled?: boolean;
  /** Small label shown inside the field (e.g. "auto-filled"). */
  badge?: string;
  /** Shows a spinner and disables the control while its options load. */
  loading?: boolean;
}

export default function Select({ value, onChange, options, error, autoFilled, badge, loading }: SelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className={`
          w-full rounded-lg border px-3 py-2 text-sm
          dark:text-zinc-100
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
          ${badge ? "pe-28" : ""}
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
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {badge && !loading && (
        <span className="absolute inset-y-0 end-7 flex items-center pointer-events-none">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            {badge}
          </span>
        </span>
      )}
      {loading && (
        <span className="absolute inset-y-0 end-7 flex items-center pointer-events-none">
          <svg className="h-4 w-4 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </span>
      )}
    </div>
  );
}
