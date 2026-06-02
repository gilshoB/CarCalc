"use client";

import { useState } from "react";
import type { getTranslations } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { BuyCarDetails, VehicleIdentity } from "@/types/calculator";
import type { FormErrors } from "@/types/form";
import { formatNumber } from "@/lib/formatters";
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
  cashOnHand: number;
  oldCarValue: number;
  mandatoryInsuranceQuote: number;
  comprehensiveInsuranceQuote: number;
  useLoan: boolean;
  interestRate: number;
  loanTermYears: number;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function BuyingStep({
  t,
  locale,
  buy,
  cashOnHand,
  oldCarValue,
  mandatoryInsuranceQuote,
  comprehensiveInsuranceQuote,
  useLoan,
  interestRate,
  loanTermYears,
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
  };

  const handleManualEntry = () => {
    setManualMode(true);
    onChange("buy.vehicle", undefined);
    onChange("buy.catalogPrice", undefined);
  };

  const catalogAutoFilled = !manualMode && buy.vehicle?.catalogPrice != null;

  // Calculate if loan is needed
  const availableCapital = cashOnHand + oldCarValue;
  const loanNeeded = buy.carPrice > 0 && buy.carPrice > availableCapital;
  const loanAmount = loanNeeded ? buy.carPrice - availableCapital : 0;

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

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.carPrice} error={errors["buy.carPrice"]} required>
          <NumberInput
            value={buy.carPrice}
            onChange={(v) => onChange("buy.carPrice", v)}
            prefix="₪"
            error={!!errors["buy.carPrice"]}
          />
        </FormField>

        {catalogAutoFilled ? (
          <FormField label={f.catalogPrice}>
            <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
              <span className="text-zinc-700 dark:text-zinc-200">
                ₪ {formatNumber(buy.vehicle!.catalogPrice!, locale)}
              </span>
              <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                {t.form.vehiclePicker.autofilledBadge}
              </span>
            </div>
          </FormField>
        ) : (
          <FormField label={f.catalogPrice} hint={f.catalogPriceHint}>
            <NumberInput
              value={buy.catalogPrice ?? 0}
              onChange={(v) => onChange("buy.catalogPrice", v || undefined)}
              prefix="₪"
            />
          </FormField>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={f.fuelType}>
          <Select
            value={buy.fuelType}
            onChange={handleFuelTypeChange}
            options={fuelOptions}
          />
        </FormField>

        <FormField label={`${f.consumption} (${consumptionLabel})`} error={errors["buy.consumptionKmPerUnit"]} required>
          <NumberInput
            value={buy.consumptionKmPerUnit}
            onChange={(v) => onChange("buy.consumptionKmPerUnit", v)}
            step={0.1}
            error={!!errors["buy.consumptionKmPerUnit"]}
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
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={f.usedCarAge} error={errors["buy.usedCarAge"]} required>
              <NumberInput
                value={buy.usedCarAge ?? 0}
                onChange={(v) => onChange("buy.usedCarAge", v)}
                min={1}
                max={20}
                error={!!errors["buy.usedCarAge"]}
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

          <Toggle
            checked={buy.wasLeased ?? false}
            onChange={(v) => onChange("buy.wasLeased", v)}
            label={t.form.usedCar.wasLeased}
          />
        </div>
      )}

      {/* Insurance for purchased car */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">{f.insuranceSection}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={f.mandatoryInsuranceQuote} error={errors["mandatoryInsuranceQuote"]} required>
            <NumberInput
              value={mandatoryInsuranceQuote}
              onChange={(v) => onChange("mandatoryInsuranceQuote", v)}
              prefix="₪"
              error={!!errors["mandatoryInsuranceQuote"]}
            />
          </FormField>
          <FormField label={f.comprehensiveInsuranceQuote} error={errors["comprehensiveInsuranceQuote"]} required>
            <NumberInput
              value={comprehensiveInsuranceQuote}
              onChange={(v) => onChange("comprehensiveInsuranceQuote", v)}
              prefix="₪"
              error={!!errors["comprehensiveInsuranceQuote"]}
            />
          </FormField>
        </div>
      </div>

      {/* Loan section — user toggles on/off */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <Toggle
          checked={useLoan}
          onChange={(v) => onChange("useLoan", v)}
          label={f.useLoan}
        />

        {/* Hint when loan seems needed based on numbers */}
        {!useLoan && loanNeeded && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            {f.loanNeeded} — {f.loanAmount}: {formatNumber(loanAmount, locale)} ₪
          </p>
        )}

        {useLoan && (
          <div className="mt-4 space-y-3">
            {loanNeeded && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {f.loanExplain}
              </p>
            )}
            <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
              {f.loanAmount}: {formatNumber(loanAmount, locale)} ₪
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={f.interestRate} error={errors["financing.interestRate"]}>
                <NumberInput
                  value={interestRate}
                  onChange={(v) => onChange("financing.interestRate", v)}
                  suffix="%"
                  step={0.1}
                  error={!!errors["financing.interestRate"]}
                />
              </FormField>
              <FormField label={f.loanTerm} error={errors["financing.loanTermYears"]}>
                <NumberInput
                  value={loanTermYears}
                  onChange={(v) => onChange("financing.loanTermYears", v)}
                  min={1}
                  max={10}
                  error={!!errors["financing.loanTermYears"]}
                />
              </FormField>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
