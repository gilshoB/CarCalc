"use client";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  /** Translated validation messages keyed by error code (e.g. { required: "Required", positiveNumber: "..." }) */
  validationMessages?: Record<string, string>;
}

export default function FormField({ label, hint, error, required, children, validationMessages }: FormFieldProps) {
  const errorText = error ? (validationMessages?.[error] || error) : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label className="block text-[15px] font-bold">
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </label>
      {children}
      {hint && !errorText && (
        <p className="text-[13px] leading-relaxed text-muted">{hint}</p>
      )}
      {errorText && (
        <p data-field-error="" className="text-[13px] font-medium text-red-700">{errorText}</p>
      )}
    </div>
  );
}
