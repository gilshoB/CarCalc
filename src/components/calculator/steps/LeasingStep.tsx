"use client";

import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { LeaseCarDetails } from "@/types/calculator";
import type { FormErrors } from "@/types/form";
import { formatNumber } from "@/lib/formatters";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Toggle from "@/components/ui/Toggle";

const CONSUMPTION_DEFAULTS: Record<string, number> = {
  gasoline: 14,
  diesel: 16,
  hybrid: 18,
  electric: 6,
};

interface LeasingStepProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  lease: LeaseCarDetails;
  annualKm: number;
  mandatoryInsuranceQuote: number;
  comprehensiveInsuranceQuote: number;
  includeInvestment: boolean;
  investmentReturnRate?: number;
  defaultInvestmentReturn: number;
  cashOnHand: number;
  oldCarValue: number;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function LeasingStep({
  t,
  locale,
  lease,
  annualKm,
  mandatoryInsuranceQuote,
  comprehensiveInsuranceQuote,
  includeInvestment,
  investmentReturnRate,
  defaultInvestmentReturn,
  cashOnHand,
  oldCarValue,
  errors,
  onChange,
}: LeasingStepProps) {
  const f = t.form.leasing;
  const fuelOptions = [
    { value: "gasoline", label: t.form.fuelTypes.gasoline },
    { value: "diesel", label: t.form.fuelTypes.diesel },
    { value: "electric", label: t.form.fuelTypes.electric },
    { value: "hybrid", label: t.form.fuelTypes.hybrid },
  ];

  const consumptionLabel = lease.fuelType === "electric"
    ? t.form.consumptionUnit.kmPerKwh
    : t.form.consumptionUnit.kmPerLiter;

  const handleFuelTypeChange = (fuelType: string) => {
    onChange("lease.fuelType", fuelType);
    onChange("lease.consumptionKmPerUnit", CONSUMPTION_DEFAULTS[fuelType] ?? 14);
  };

  // Calculate investable amount
  const investableAmount = Math.max(0, cashOnHand + oldCarValue - lease.leaseDownPayment);

  // Determine which insurances need separate quotes (not included in lease)
  const needsMandatoryInsurance = !lease.leaseIncludes.mandatoryInsurance;
  const needsComprehensiveInsurance = !lease.leaseIncludes.comprehensiveInsurance;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h2>

      {/* Annual KM */}
      <FormField label={f.annualKm} hint={f.annualKmHint} error={errors["annualKm"]} required>
        <NumberInput
          value={annualKm}
          onChange={(v) => onChange("annualKm", v)}
          placeholder="15,000"
          suffix="km"
          error={!!errors["annualKm"]}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.monthlyPayment} error={errors["lease.monthlyPayment"]} required>
          <NumberInput
            value={lease.monthlyPayment}
            onChange={(v) => onChange("lease.monthlyPayment", v)}
            prefix="₪"
            error={!!errors["lease.monthlyPayment"]}
          />
        </FormField>

        <FormField label={f.downPayment}>
          <NumberInput
            value={lease.leaseDownPayment}
            onChange={(v) => onChange("lease.leaseDownPayment", v)}
            prefix="₪"
          />
        </FormField>

        <FormField label={f.carAge} hint={f.carAgeHint}>
          <NumberInput
            value={lease.leaseCarAge ?? 0}
            onChange={(v) => onChange("lease.leaseCarAge", v)}
            min={0}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.fuelType}>
          <Select
            value={lease.fuelType}
            onChange={handleFuelTypeChange}
            options={fuelOptions}
          />
        </FormField>

        <FormField label={`${f.consumption} (${consumptionLabel})`} error={errors["lease.consumptionKmPerUnit"]} required>
          <NumberInput
            value={lease.consumptionKmPerUnit}
            onChange={(v) => onChange("lease.consumptionKmPerUnit", v)}
            step={0.1}
            error={!!errors["lease.consumptionKmPerUnit"]}
          />
        </FormField>
      </div>

      {/* What's included */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">{f.includes}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox
            checked={lease.leaseIncludes.maintenance}
            onChange={(v) => onChange("lease.leaseIncludes.maintenance", v)}
            label={f.maintenance}
          />
          <Checkbox
            checked={lease.leaseIncludes.mandatoryInsurance}
            onChange={(v) => onChange("lease.leaseIncludes.mandatoryInsurance", v)}
            label={f.mandatoryInsurance}
          />
          <Checkbox
            checked={lease.leaseIncludes.comprehensiveInsurance}
            onChange={(v) => onChange("lease.leaseIncludes.comprehensiveInsurance", v)}
            label={f.comprehensiveInsurance}
          />
          <Checkbox
            checked={lease.leaseIncludes.registration}
            onChange={(v) => onChange("lease.leaseIncludes.registration", v)}
            label={f.registration}
          />
        </div>
      </div>

      {/* Insurance for lease car — only fields not included in lease */}
      {(needsMandatoryInsurance || needsComprehensiveInsurance) && (
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{f.insuranceSection}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{f.insuranceSectionHint}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {needsMandatoryInsurance && (
              <FormField label={f.mandatoryInsuranceQuote}>
                <NumberInput
                  value={mandatoryInsuranceQuote}
                  onChange={(v) => onChange("mandatoryInsuranceQuote", v)}
                  prefix="₪"
                />
              </FormField>
            )}
            {needsComprehensiveInsurance && (
              <FormField label={f.comprehensiveInsuranceQuote}>
                <NumberInput
                  value={comprehensiveInsuranceQuote}
                  onChange={(v) => onChange("comprehensiveInsuranceQuote", v)}
                  prefix="₪"
                />
              </FormField>
            )}
          </div>
        </div>
      )}

      {/* Investment section */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{f.investmentSection}</h3>
        <Toggle
          checked={includeInvestment}
          onChange={(v) => onChange("includeInvestment", v)}
          label={f.investmentQuestion}
        />
        {includeInvestment && (
          <div className="mt-3 space-y-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{f.investmentExplain}</p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {f.investmentAmount}: {formatNumber(investableAmount, locale)} ₪
            </p>
            <FormField label={f.investmentReturn} hint={f.investmentHint}>
              <NumberInput
                value={investmentReturnRate ?? defaultInvestmentReturn}
                onChange={(v) => onChange("investmentReturnRate", v)}
                suffix="%"
                step={0.1}
                placeholder={String(defaultInvestmentReturn)}
              />
            </FormField>
          </div>
        )}
      </div>
    </div>
  );
}
