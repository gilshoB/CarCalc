"use client";

import { useState } from "react";
import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { BuyCarDetails, VehicleIdentity } from "@/types/calculator";
import type { FormErrors } from "@/types/form";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import VehiclePicker from "./VehiclePicker";

const CONSUMPTION_DEFAULTS: Record<string, number> = {
  gasoline: 14,
  diesel: 16,
  hybrid: 18,
  electric: 6,
};

interface BuyingStepProps {
  t: ReturnType<typeof getTranslations>;
  locale: Locale;
  buy: BuyCarDetails;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function BuyingStep({
  t,
  locale,
  buy,
  errors,
  onChange,
}: BuyingStepProps) {
  const f = t.form.buying;
  const fuelOptions = [
    { value: "gasoline", label: t.form.fuelTypes.gasoline },
    { value: "diesel", label: t.form.fuelTypes.diesel },
    { value: "electric", label: t.form.fuelTypes.electric },
    { value: "hybrid", label: t.form.fuelTypes.hybrid },
  ];

  const consumptionLabel = buy.fuelType === "electric"
    ? t.form.consumptionUnit.kmPerKwh
    : t.form.consumptionUnit.kmPerLiter;

  const handleFuelTypeChange = (fuelType: string) => {
    onChange("buy.fuelType", fuelType);
    onChange("buy.consumptionKmPerUnit", CONSUMPTION_DEFAULTS[fuelType] ?? 14);
  };

  const [manualMode, setManualMode] = useState(false);

  // Picker always wins: unconditionally overwrite the auto-fillable fields.
  const handleResolve = (v: VehicleIdentity) => {
    onChange("buy.vehicle", v);
    if (v.fuelType) onChange("buy.fuelType", v.fuelType);
    if (v.kmPerLiter) onChange("buy.consumptionKmPerUnit", v.kmPerLiter);
    if (v.catalogPrice) onChange("buy.catalogPrice", v.catalogPrice);
    // Auto-derive the car's age from the picked model year (#5). If it's at
    // least a year old, mark it used so the depreciation inputs appear.
    if (v.modelYear) {
      const age = Math.max(0, new Date().getFullYear() - v.modelYear);
      onChange("buy.usedCarAge", age);
      if (age >= 1) onChange("buy.isUsed", true);
    }
  };

  const handleManualEntry = () => {
    setManualMode(true);
    onChange("buy.vehicle", undefined);
    onChange("buy.catalogPrice", undefined);
  };

  const catalogAutoFilled = !manualMode && buy.vehicle?.catalogPrice != null;
  // When a car is picked, fuel type + consumption are filled by the picker —
  // show them read-only instead of redundant editable inputs.
  const vehicleAutoFilled = !manualMode && buy.vehicle != null;
  // Show the detail fields only once a car is picked or the user chose manual entry.
  const showFields = manualMode || buy.vehicle != null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h2>

      {!manualMode && (
        <VehiclePicker
          t={t}
          vehicle={buy.vehicle}
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
        <FormField label={f.carPrice} error={errors["buy.carPrice"]} required>
          <NumberInput
            value={buy.carPrice}
            onChange={(v) => onChange("buy.carPrice", v)}
            prefix="₪"
            error={!!errors["buy.carPrice"]}
          />
        </FormField>

        <FormField label={f.catalogPrice} hint={f.catalogPriceHint}>
          <NumberInput
            value={buy.catalogPrice ?? 0}
            onChange={(v) => onChange("buy.catalogPrice", v || undefined)}
            prefix="₪"
            autoFilled={catalogAutoFilled}
            badge={catalogAutoFilled ? t.form.vehiclePicker.autofilledBadge : undefined}
          />
        </FormField>
      </div>

      {/* Fuel type + consumption — auto-filled by the picker but always editable
          so the user can override (e.g. petrol vs. diesel within the same trim). */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.fuelType}>
          <Select
            value={buy.fuelType}
            onChange={handleFuelTypeChange}
            options={fuelOptions}
            autoFilled={vehicleAutoFilled}
            badge={vehicleAutoFilled ? t.form.vehiclePicker.autofilledBadge : undefined}
          />
        </FormField>

        <FormField
          label={`${f.consumption} (${consumptionLabel})`}
          error={errors["buy.consumptionKmPerUnit"]}
          required
        >
          <NumberInput
            value={buy.consumptionKmPerUnit}
            onChange={(v) => onChange("buy.consumptionKmPerUnit", v)}
            step={0.1}
            error={!!errors["buy.consumptionKmPerUnit"]}
            autoFilled={vehicleAutoFilled}
            badge={vehicleAutoFilled ? t.form.vehiclePicker.autofilledBadge : undefined}
          />
        </FormField>
      </div>

      <div className="pt-2">
        <Toggle
          checked={buy.isUsed}
          onChange={(v) => onChange("buy.isUsed", v)}
          label={f.isUsed}
        />
      </div>

      {buy.isUsed && (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-700 dark:bg-zinc-800/40">
          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{t.form.usedCar.sectionTitle}</h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{t.form.usedCar.sectionHint}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={f.usedCarAge} hint={f.usedCarAgeHint} error={errors["buy.usedCarAge"]} required>
              <NumberInput
                value={buy.usedCarAge ?? 0}
                onChange={(v) => onChange("buy.usedCarAge", v)}
                min={1}
                max={20}
                error={!!errors["buy.usedCarAge"]}
                autoFilled={vehicleAutoFilled}
                badge={vehicleAutoFilled ? t.form.vehiclePicker.autofilledBadge : undefined}
              />
            </FormField>

            <FormField label={t.form.usedCar.odometer} hint={t.form.usedCar.odometerHint}>
              <NumberInput
                value={buy.odometerKm ?? 0}
                onChange={(v) => onChange("buy.odometerKm", v || undefined)}
                suffix="km"
              />
            </FormField>

            <FormField label={t.form.usedCar.hands} hint={t.form.usedCar.handsHint}>
              <NumberInput
                value={buy.previousHands ?? 1}
                onChange={(v) => onChange("buy.previousHands", v || undefined)}
                min={1}
                max={10}
              />
            </FormField>
          </div>

          <div>
            <Toggle
              checked={buy.wasLeased ?? false}
              onChange={(v) => onChange("buy.wasLeased", v)}
              label={t.form.usedCar.wasLeased}
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t.form.usedCar.wasLeasedHint}</p>
          </div>
        </div>
      )}

      {/* Insurance for purchased car */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">{f.insuranceSection}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={f.mandatoryInsuranceQuote} error={errors["buy.mandatoryInsuranceQuote"]} required>
            <NumberInput
              value={buy.mandatoryInsuranceQuote ?? 0}
              onChange={(v) => onChange("buy.mandatoryInsuranceQuote", v)}
              prefix="₪"
              error={!!errors["buy.mandatoryInsuranceQuote"]}
            />
          </FormField>
          <FormField label={f.comprehensiveInsuranceQuote} error={errors["buy.comprehensiveInsuranceQuote"]} required>
            <NumberInput
              value={buy.comprehensiveInsuranceQuote ?? 0}
              onChange={(v) => onChange("buy.comprehensiveInsuranceQuote", v)}
              prefix="₪"
              error={!!errors["buy.comprehensiveInsuranceQuote"]}
            />
          </FormField>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
