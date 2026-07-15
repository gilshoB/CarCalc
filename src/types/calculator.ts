// ---- Fuel Types ----

export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid";

// ---- Vehicle Identity (auto-filled from gov.il picker) ----

/**
 * VehicleIdentity is populated by the cascading make/model/year/trim picker
 * which queries Israeli gov.il open data. When present, fields like fuelType,
 * consumptionKmPerUnit, and catalogPrice get auto-filled from this object.
 *
 * Data sources:
 *  - Active vehicles registry (053cea08-09bc-40ec-8f7a-156f0677aff3): browsing
 *  - WLTP model spec dataset (142afde2-6228-49f9-8a29-9b6c3a0cbe40):
 *    fuelType, feeGroup (kvuzat_agra_cd), pollutionGroup (kvutzat_zihum),
 *    CO2_WLTP for fuel-economy derivation
 *  - Importer price list (39f455bf-6db0-4926-859d-017f34eacbcb): catalogPrice (mehir)
 */
export interface VehicleIdentity {
  manufacturer: string; // tozeret_nm
  manufacturerCode?: number; // tozeret_cd
  model: string; // kinuy_mishari
  modelCode?: string; // degem_nm
  modelYear: number; // shnat_yitzur
  trim?: string; // ramat_gimur — undefined or literal "__common__" sentinel
  drivetrain?: string; // hanaa_nm — "4X2" / "4X4" (optional; narrows price/specs)
  // Auto-resolved specs:
  fuelType?: FuelType; // mapped from delek_nm (Hebrew "בנזין"/"דיזל"/"חשמל"/"היברידי")
  fuelTypeRaw?: string; // raw delek_nm for diagnostics
  pollutionGroup?: number; // kvutzat_zihum (1-15)
  feeGroup?: number; // kvuzat_agra_cd — the registration fee group (preferred lookup)
  co2WltpGramsPerKm?: number; // CO2_WLTP — used to derive km/L when not provided
  kmPerLiter?: number; // derived from CO2 (combustion only) or null
  catalogPrice?: number; // mehir — MSRP from importer price list
  ambiguous?: boolean; // true if "Common" trim used or specs varied >30% across trims
  source: "gov.il" | "manual";
}

// ---- User Inputs ----

export interface BuyCarDetails {
  carPrice: number;
  catalogPrice?: number; // מחיר מחירון — defaults to carPrice if omitted. Auto-filled from picker when vehicle is set.
  isUsed: boolean;
  usedCarAge?: number; // age of used car at purchase (e.g. 2 = 2 years old)
  fuelType: FuelType;
  consumptionKmPerUnit: number; // km/L for combustion, km/kWh for electric
  vehicle?: VehicleIdentity; // optional — populated by the picker
  // Used-car adjustments (only meaningful when isUsed=true):
  odometerKm?: number; // current mileage
  previousHands?: number; // number of previous owners (1 = first hand)
  wasLeased?: boolean; // car was previously leased/rented
  // Per-scenario insurance (split from top-level for accuracy):
  mandatoryInsuranceQuote?: number; // override of CalculatorInput.mandatoryInsuranceQuote
  comprehensiveInsuranceQuote?: number; // override of CalculatorInput.comprehensiveInsuranceQuote
  workplaceBenefitMonthly?: number; // net monthly reimbursement from workplace if owning this car
}

export interface LeaseCarDetails {
  monthlyPayment: number;
  leaseTerm: number; // years
  leaseDownPayment: number;
  leaseCarAge?: number; // age of car at lease start (usually 0)
  fuelType: FuelType;
  consumptionKmPerUnit: number; // km/L or km/kWh
  leaseIncludes: {
    maintenance: boolean;
    mandatoryInsurance: boolean;
    comprehensiveInsurance: boolean;
    registration: boolean;
  };
  vehicle?: VehicleIdentity; // optional — populated by the picker
  // Per-scenario insurance overrides (only used if leaseIncludes.*=false):
  mandatoryInsuranceQuote?: number;
  comprehensiveInsuranceQuote?: number;
  workplaceBenefitMonthly?: number; // net monthly reimbursement from workplace if using this lease car
}

export interface CalculatorInput {
  // Personal details
  name: string;
  email: string;

  // Scenario details
  buy: BuyCarDetails;
  lease: LeaseCarDetails;

  // Financial situation
  cashOnHand: number; // available cash (excluding old car)
  oldCarValue: number; // שווי רכב ישן — added to available capital

  // Insurance quotes (user inputs)
  mandatoryInsuranceQuote: number; // per year
  comprehensiveInsuranceQuote: number; // per year

  // Driving
  annualKm: number;

  // Business
  isBusinessUse: boolean;
  marginalTaxRate?: number; // for business users, percentage (e.g. 47)

  // Financing (for buy scenario)
  useLoan: boolean; // user toggle — whether to include a loan
  financing: {
    interestRate: number; // annual percentage
    loanTermYears: number;
    originationFee: number; // עמלה — one-time fee in ILS
  };

  // Comparison settings
  comparisonPeriodYears: number; // e.g. 3, 5, 7
  includeInvestment: boolean;
  investmentReturnRate?: number; // annual %, fetched default or user override

  // Depreciation override (from results page)
  depreciationOverride?: { yr1: number; yr2: number; yr3Plus: number };
  // Direct override of the car's end-of-period sale value (₪) — from the
  // inline editor on the residual row. Takes precedence over the % curves.
  residualOverride?: number;

  // Maintenance override (from results page) — service-interval model
  maintenanceOverride?: {
    serviceIntervalKm: number; // routine service every N km
    costPerService: number; // average all-in cost per service (incl. wear)
  };
}

// ---- Market Data (live/dynamic) ----

export interface FuelPrices {
  benzine95: number; // ILS per liter
  benzine98: number;
  diesel: number;
  lpg: number;
  electricityPerKwh: number;
}

export interface RegistrationTier {
  maxPrice: number; // upper bound of catalog price range
  fee: number; // annual fee in ILS
}

/**
 * Official Israeli MoT annual licensing-fee table (אגרת רישוי).
 * The fee is a fixed government table indexed by the car's ORIGINAL new-car
 * catalog price (price group 1–7) AND its manufacture-year cohort.
 * `fees` is ordered by year cohort: [2024–2026, 2021–2023, 2017–2020, ≤2016].
 */
export interface RegistrationFeeBand {
  maxPrice: number; // upper bound of original new-car catalog price for this group
  fees: [number, number, number, number]; // annual fee in ILS, by year cohort
}

export interface MarketData {
  fuelPrices: FuelPrices;
  registrationFeeBands: RegistrationFeeBand[]; // official price-group × year table
  radioFee: number; // annual, ILS
  testFees: {
    combustion: number; // ILS/year
    electric: number; // ILS/year
    retest: number; // ILS
  };
  testStartAge: number; // car must be this old for test (3)
  defaultInvestmentReturn: number; // 5-year S&P 500 avg, percentage
  year: number;
  lastUpdated: string; // ISO date
}

// ---- Calculation Output ----

export interface CostBreakdown {
  carPayment: number; // purchase price or total lease payments
  loanInterest: number;
  loanOriginationFee: number;
  registrationFees: number; // includes radio fee
  mandatoryInsurance: number;
  comprehensiveInsurance: number;
  testFees: number; // טסט
  fuel: number;
  maintenance: number;
  depreciation: number; // only for buy (net loss in value)
  residualValue: number; // value of car at end (subtracted from cost)
  taxBenefits: number; // negative = reduces cost (business only)
  investmentResult: number; // positive = gain (reduces effective cost), negative = opportunity cost
  workplaceBenefit: number; // total net workplace reimbursement over the period (reduces cost)
}

export interface YearlyBreakdown {
  year: number;
  registration: number;
  insurance: number;
  test: number;
  fuel: number;
  maintenance: number;
  loanPayment: number;
  leasePayment: number;
  cumulativeCost: number;
}

export interface OptionResult {
  totalCost: number;
  monthlyCost: number;
  breakdown: CostBreakdown;
  yearlyBreakdown: YearlyBreakdown[];
}

export interface CalculatorOutput {
  periodYears: number;
  buy: OptionResult;
  lease: OptionResult;
  recommendation: {
    winner: "buy" | "lease";
    savingsAmount: number;
    savingsPercent: number;
    explanation: string;
    explanationHe: string;
  };
  marketDataUsed: {
    year: number;
    lastUpdated: string;
  };
}

// ---- Depreciation Output ----

export interface DepreciationResult {
  totalDepreciation: number;
  residualValue: number;
  yearlyValues: number[]; // car value at end of each year
  adjustments?: {
    handsAdj: number; // multiplier from previousHands (1.0 = no adj)
    leaseAdj: number; // multiplier from wasLeased (1.0 = no adj)
    kmAdj: number; // multiplier from km vs expected (1.0 = on average)
    composite: number; // product of the three
  };
}

// ---- Loan Output ----

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  totalWithFee: number;
}

// ---- Investment Output ----

export interface InvestmentResult {
  gain: number;
  finalValue: number;
}
