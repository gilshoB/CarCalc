"use client";

import type { getTranslations } from "@/i18n/config";
import type { FormErrors } from "@/types/form";
import FormField from "@/components/ui/FormField";
import NumberInput from "@/components/ui/NumberInput";
import Toggle from "@/components/ui/Toggle";

interface BusinessStepProps {
  t: ReturnType<typeof getTranslations>;
  isBusinessUse: boolean;
  marginalTaxRate?: number;
  buyWorkplaceBenefit?: number;
  leaseWorkplaceBenefit?: number;
  errors: FormErrors;
  onChange: (path: string, value: unknown) => void;
}

export default function BusinessStep({
  t,
  isBusinessUse,
  marginalTaxRate,
  buyWorkplaceBenefit,
  leaseWorkplaceBenefit,
  errors,
  onChange,
}: BusinessStepProps) {
  const f = t.form.finance;
  const pd = t.form.personalDetails;

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[34px] sm:text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em]">{f.businessTitle}</h2>
        <p className="mt-2 text-base leading-relaxed text-muted">{f.businessSubtitle}</p>
      </div>

      {/* 1. Osek Murshe */}
      <div>
        <h3 className="text-lg font-bold mb-3">{f.businessSection}</h3>
        <Toggle
          checked={isBusinessUse}
          onChange={(v) => onChange("isBusinessUse", v)}
          label={pd.isOsekMurshe}
        />
        {isBusinessUse && (
          <>
            <p className="mt-3 rounded-[14px] bg-soft px-4 py-3 text-sm leading-relaxed text-[#3d3d38]">{pd.isOsekMursheHint}</p>
            <div className="mt-4">
              <FormField label={pd.marginalTaxRate} hint={pd.marginalTaxRateHint} error={errors["marginalTaxRate"]} required>
                <NumberInput
                  value={marginalTaxRate ?? 0}
                  onChange={(v) => onChange("marginalTaxRate", v)}
                  suffix="%"
                  min={0}
                  max={100}
                  error={!!errors["marginalTaxRate"]}
                />
              </FormField>
            </div>
          </>
        )}
      </div>

      {/* 2. Workplace reimbursement — buy scenario */}
      <div className="pt-2">
        <h3 className="text-lg font-bold mb-3">{f.workplaceSectionBuy}</h3>
        <FormField label={f.workplaceBenefitLabel} hint={f.workplaceBenefitHint}>
          <NumberInput
            value={buyWorkplaceBenefit ?? 0}
            onChange={(v) => onChange("buy.workplaceBenefitMonthly", v || undefined)}
            prefix="₪"
          />
        </FormField>
      </div>

      {/* 3. Workplace reimbursement — lease scenario */}
      <div className="pt-2">
        <h3 className="text-lg font-bold mb-3">{f.workplaceSectionLease}</h3>
        <FormField label={f.workplaceBenefitLabel} hint={f.workplaceBenefitHint}>
          <NumberInput
            value={leaseWorkplaceBenefit ?? 0}
            onChange={(v) => onChange("lease.workplaceBenefitMonthly", v || undefined)}
            prefix="₪"
          />
        </FormField>
      </div>
    </div>
  );
}
