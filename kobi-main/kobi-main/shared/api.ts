// Company data from ASAN İmza
export interface CompanyData {
  id: string;
  name: string;
  registrationNumber: string;
  foundingDate: string; // YYYY-MM-DD
  industry: string;
  employees: number;
  annualRevenue: number; // in AZN
  taxDebt: number; // in AZN
  totalDebt: number; // in AZN
  paymentHistory: number; // 0-100 (percentage of on-time payments)
  growthRate: number; // -100 to 100 (percentage YoY growth)
}

// Credit score calculation
export interface CreditScoreBreakdown {
  companyAge: { points: number; maxPoints: number; label: string };
  revenue: { points: number; maxPoints: number; label: string };
  taxDebt: { points: number; maxPoints: number; label: string };
  employees: { points: number; maxPoints: number; label: string };
  paymentHistory: { points: number; maxPoints: number; label: string };
  industryRisk: { points: number; maxPoints: number; label: string };
  debtRatio: { points: number; maxPoints: number; label: string };
  growthTrend: { points: number; maxPoints: number; label: string };
}

export interface CreditScoreResult {
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D"; // A: 85+, B: 70-84, C: 55-69, D: <55
  breakdown: CreditScoreBreakdown;
  loanEligibility: {
    canApply: boolean;
    minScore: number;
    message: string;
  };
}

// Loan offer from BOKT (lender)
export interface LoanOffer {
  id: string;
  boktName: string;
  boktLogo?: string; // URL to logo
  loanAmountMin: number; // in AZN
  loanAmountMax: number;
  annualInterestRate: number; // percentage (e.g., 12.5)
  repaymentPeriodMonths: number;
  minCreditScore: number;
  features: string[];
  processingTime: string; // e.g., "2-3 business days"
}

// User loan application
export interface LoanApplication {
  id: string;
  companyId: string;
  companyName: string;
  loanOfferIds: string[]; // Multiple loan applications at once
  status: "pending" | "submitted" | "approved" | "rejected";
  appliedAt: string; // ISO timestamp
  responses?: {
    offerId: string;
    status: "pending" | "approved" | "rejected";
    responseDate?: string;
  }[];
}

// API request/response types
export interface ASANAuthRequest {
  email: string;
  pin: string;
}

export interface ASANAuthResponse {
  success: boolean;
  companyData?: CompanyData;
  error?: string;
}

export interface CalculateCreditScoreRequest {
  companyData: CompanyData;
}

export interface GetLoansRequest {
  creditScore: number;
  limit?: number;
}

export interface GetLoansResponse {
  loans: LoanOffer[];
  total: number;
}

export interface SubmitApplicationRequest {
  companyData: CompanyData;
  loanOfferIds: string[];
}

export interface SubmitApplicationResponse {
  applicationId: string;
  status: string;
  message: string;
}

// Chatbot types
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  reasoning?: string;
}

export interface DemoResponse {
  message: string;
  timestamp: number;
}
