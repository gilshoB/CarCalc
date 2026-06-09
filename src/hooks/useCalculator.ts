"use client";

import { useState, useCallback, useRef } from "react";
import type { CalculatorInput, CalculatorOutput } from "@/types/calculator";
import type { FormErrors, DepreciationOverrideValues, MaintenanceOverrideValues } from "@/types/form";
import { DEFAULT_INPUT } from "@/lib/defaults";

export interface UseCalculatorReturn {
  input: CalculatorInput;
  updateField: (path: string, value: unknown) => void;

  currentStep: number;
  nextStep: () => boolean;
  prevStep: () => void;

  errors: FormErrors;

  calculate: () => Promise<void>;
  isCalculating: boolean;
  apiError: string | null;

  results: CalculatorOutput | null;
  showResults: boolean;
  changePeriod: (years: number) => Promise<void>;

  depreciationOverride: DepreciationOverrideValues | null;
  setDepreciationOverride: (v: DepreciationOverrideValues | null) => void;
  maintenanceOverride: MaintenanceOverrideValues | null;
  setMaintenanceOverride: (v: MaintenanceOverrideValues | null) => void;
  recalculate: () => Promise<void>;

  backToForm: () => void;
  resetAll: () => void;
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const result = structuredClone(obj);
  const keys = path.split(".");
  let current: Record<string, unknown> = result;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

function validateStep(step: number, input: CalculatorInput): FormErrors {
  const errors: FormErrors = {};

  switch (step) {
    case 2: // Personal Details (name + email only)
      if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
        errors["email"] = "Invalid email address";
      }
      break;

    case 3: // Annual km
      if (!input.annualKm || input.annualKm <= 0) {
        errors["annualKm"] = "required";
      }
      break;

    case 4: // Buying
      if (!input.buy.carPrice || input.buy.carPrice <= 0) {
        errors["buy.carPrice"] = "required";
      }
      if (!input.buy.consumptionKmPerUnit || input.buy.consumptionKmPerUnit <= 0) {
        errors["buy.consumptionKmPerUnit"] = "required";
      }
      if (input.buy.isUsed && (!input.buy.usedCarAge || input.buy.usedCarAge <= 0)) {
        errors["buy.usedCarAge"] = "required";
      }
      if (!input.buy.mandatoryInsuranceQuote || input.buy.mandatoryInsuranceQuote <= 0) {
        errors["buy.mandatoryInsuranceQuote"] = "required";
      }
      if (!input.buy.comprehensiveInsuranceQuote || input.buy.comprehensiveInsuranceQuote <= 0) {
        errors["buy.comprehensiveInsuranceQuote"] = "required";
      }
      break;

    case 5: // Leasing
      if (!input.lease.monthlyPayment || input.lease.monthlyPayment <= 0) {
        errors["lease.monthlyPayment"] = "required";
      }
      if (!input.lease.consumptionKmPerUnit || input.lease.consumptionKmPerUnit <= 0) {
        errors["lease.consumptionKmPerUnit"] = "required";
      }
      break;

    case 6: // Finances (capital + business/tax)
      if (input.cashOnHand < 0) errors["cashOnHand"] = "positiveNumber";
      if (input.isBusinessUse && (!input.marginalTaxRate || input.marginalTaxRate <= 0)) {
        errors["marginalTaxRate"] = "required";
      }
      break;
  }

  return errors;
}

export function useCalculator(): UseCalculatorReturn {
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [results, setResults] = useState<CalculatorOutput | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [depreciationOverride, setDepreciationOverride] = useState<DepreciationOverrideValues | null>(null);
  const [maintenanceOverride, setMaintenanceOverride] = useState<MaintenanceOverrideValues | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const updateField = useCallback((path: string, value: unknown) => {
    setInput((prev) => setNestedValue(prev as unknown as Record<string, unknown>, path, value) as unknown as CalculatorInput);
    // Clear error for this field
    setErrors((prev) => {
      if (prev[path]) {
        const next = { ...prev };
        delete next[path];
        return next;
      }
      return prev;
    });
  }, []);

  const nextStep = useCallback((): boolean => {
    const stepErrors = validateStep(currentStep, input);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }
    setErrors({});
    setCurrentStep((s) => Math.min(s + 1, 6));
    return true;
  }, [currentStep, input]);

  const prevStep = useCallback(() => {
    setErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const doCalculate = useCallback(async (
    inputData: CalculatorInput,
    depOverride?: DepreciationOverrideValues | null,
    maintOverride?: MaintenanceOverrideValues | null,
  ) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsCalculating(true);
    setApiError(null);

    try {
      const payload: CalculatorInput & {
        depreciationOverride?: DepreciationOverrideValues;
        maintenanceOverride?: MaintenanceOverrideValues;
      } = { ...inputData };
      if (depOverride) payload.depreciationOverride = depOverride;
      if (maintOverride) payload.maintenanceOverride = maintOverride;
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.details) {
          console.error("Validation errors:", data.details);
          const fieldErrors = data.details
            .map((d: { path: (string | number)[]; message: string }) => `${d.path.join(".")}: ${d.message}`)
            .join(", ");
          throw new Error(`${data.error}: ${fieldErrors}`);
        }
        throw new Error(data.error || "Calculation failed");
      }

      const output: CalculatorOutput = await response.json();
      setResults(output);
      setShowResults(true);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setApiError(err.message);
      }
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const calculate = useCallback(async () => {
    // Validate the final step first
    const stepErrors = validateStep(5, input);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    await doCalculate(input, depreciationOverride, maintenanceOverride);
  }, [input, depreciationOverride, maintenanceOverride, doCalculate]);

  const changePeriod = useCallback(async (years: number) => {
    const updatedInput = { ...input, comparisonPeriodYears: years };
    setInput(updatedInput);
    await doCalculate(updatedInput, depreciationOverride, maintenanceOverride);
  }, [input, depreciationOverride, maintenanceOverride, doCalculate]);

  const recalculate = useCallback(async () => {
    await doCalculate(input, depreciationOverride, maintenanceOverride);
  }, [input, depreciationOverride, maintenanceOverride, doCalculate]);

  const backToForm = useCallback(() => {
    setShowResults(false);
  }, []);

  const resetAll = useCallback(() => {
    setInput(DEFAULT_INPUT);
    setCurrentStep(1);
    setErrors({});
    setResults(null);
    setShowResults(false);
    setApiError(null);
    setDepreciationOverride(null);
    setMaintenanceOverride(null);
  }, []);

  return {
    input,
    updateField,
    currentStep,
    nextStep,
    prevStep,
    errors,
    calculate,
    isCalculating,
    apiError,
    results,
    showResults,
    changePeriod,
    depreciationOverride,
    setDepreciationOverride,
    maintenanceOverride,
    setMaintenanceOverride,
    recalculate,
    backToForm,
    resetAll,
  };
}
