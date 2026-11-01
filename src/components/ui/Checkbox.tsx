"use client";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-medium cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 ${
        checked ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {checked && <span aria-hidden="true">✓</span>}
      <span>{label}</span>
    </label>
  );
}
