// ---- Fuel Types ----

export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid";

// ---- User Inputs ----

export interface BuyCarDetails {
  carPrice: number;
  catalogPrice?: number; // מחיר מחירון — defaults to carPrice if omitted
  isUsed: boolean;
  usedCarAge?: number; // age of used car at purchase (e.g. 2 = 2 years old)
  fuelType: FuelType;
  consumptionKmPerUnit: number; // km/L for combustion, km/kWh for electric
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

export interface MarketData {
  fuelPrices: FuelPrices;
  registrationFeeTiers: RegistrationTier[];
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
