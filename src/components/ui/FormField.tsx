"use client";

const errorMessages: Record<string, string> = {
  required: "שדה חובה",
  positiveNumber: "יש להזין מספר חיובי",
};

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({ label, hint, error, required, children }: FormFieldProps) {
  const errorText = error ? (errorMessages[error] || error) : undefined;
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </label>
      {children}
      {hint && !errorText && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      )}
      {errorText && (
        <p className="text-xs text-red-600 dark:text-red-400">{errorText}</p>
      )}
    </div>
  );
}
