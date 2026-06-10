"use client";

import { useState } from "react";
import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { LeaseCarDetails, VehicleIdentity } from "@/types/calculator";
import type { FormErrors } from "@/types/form";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import VehiclePicker from "./VehiclePicker";

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
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function LeasingStep({
  t,
  locale,
  lease,
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

  const [manualMode, setManualMode] = useState(false);

  // Picker always wins: unconditionally overwrite the auto-fillable fields.
  const handleResolve = (v: VehicleIdentity) => {
    onChange("lease.vehicle", v);
    if (v.fuelType) onChange("lease.fuelType", v.fuelType);
    if (v.kmPerLiter) onChange("lease.consumptionKmPerUnit", v.kmPerLiter);
    // Auto-derive the lease car's age from the picked model year.
    if (v.modelYear) {
      onChange("lease.leaseCarAge", Math.max(0, new Date().getFullYear() - v.modelYear));
    }
  };

  const handleManualEntry = () => {
    setManualMode(true);
    onChange("lease.vehicle", undefined);
  };

  // When a car is picked, fuel type + consumption are filled by the picker —
  // show them read-only instead of redundant editable inputs.
  const vehicleAutoFilled = !manualMode && lease.vehicle != null;

  // Determine which insurances need separate quotes (not included in lease)
  const needsMandatoryInsurance = !lease.leaseIncludes.mandatoryInsurance;
  const needsComprehensiveInsurance = !lease.leaseIncludes.comprehensiveInsurance;
  // Show the detail fields only once a car is picked or manual entry is chosen.
  const showFields = manualMode || lease.vehicle != null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h2>

      {!manualMode && (
        <VehiclePicker
          t={t}
          vehicle={lease.vehicle}
          onResolve={handleResolve}
          onManualEntry={handleManualEntry}
        />
      )}

      {manualMode && (
        <button
          type="button"
          onClick={() => setManualMode(false)}
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          {t.form.vehiclePicker.title}
        </button>
      )}

      {!showFields && (
        <p className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-500 dark:bg-zinc-800/40 dark:text-zinc-400">
          {t.form.vehiclePicker.pickPrompt}
        </p>
      )}

      {showFields && (
      <>
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
            showZero
            autoFilled={vehicleAutoFilled}
            badge={vehicleAutoFilled ? t.form.vehiclePicker.autofilledBadge : undefined}
          />
        </FormField>
      </div>

      {/* Fuel type + consumption — auto-filled by the picker but always editable. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.fuelType}>
          <Select
            value={lease.fuelType}
            onChange={handleFuelTypeChange}
            options={fuelOptions}
            autoFilled={vehicleAutoFilled}
            badge={vehicleAutoFilled ? t.form.vehiclePicker.autofilledBadge : undefined}
          />
        </FormField>

        <FormField
          label={`${f.consumption} (${consumptionLabel})`}
          error={errors["lease.consumptionKmPerUnit"]}
          required
        >
          <NumberInput
            value={lease.consumptionKmPerUnit}
            onChange={(v) => onChange("lease.consumptionKmPerUnit", v)}
            step={0.1}
            error={!!errors["lease.consumptionKmPerUnit"]}
            autoFilled={vehicleAutoFilled}
            badge={vehicleAutoFilled ? t.form.vehiclePicker.autofilledBadge : undefined}
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
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">{f.insuranceSection}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {needsMandatoryInsurance && (
              <FormField label={f.mandatoryInsuranceQuote}>
                <NumberInput
                  value={lease.mandatoryInsuranceQuote ?? 0}
                  onChange={(v) => onChange("lease.mandatoryInsuranceQuote", v)}
                  prefix="₪"
                />
              </FormField>
            )}
            {needsComprehensiveInsurance && (
              <FormField label={f.comprehensiveInsuranceQuote}>
                <NumberInput
                  value={lease.comprehensiveInsuranceQuote ?? 0}
                  onChange={(v) => onChange("lease.comprehensiveInsuranceQuote", v)}
                  prefix="₪"
                />
              </FormField>
            )}
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
