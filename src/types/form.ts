export type FormErrors = Record<string, string>;

export interface DepreciationOverrideValues {
  yr1: number;
  yr2: number;
  yr3Plus: number;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export const TOTAL_STEPS = 5;
