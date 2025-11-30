import { LoanOffer, CompanyData } from "./api";

// Mock BOKT (lender) data
const MOCK_LOAN_OFFERS: LoanOffer[] = [
  {
    id: "loan-001",
    boktName: "AzərCredit",
    loanAmountMin: 10000,
    loanAmountMax: 500000,
    annualInterestRate: 14.5,
    repaymentPeriodMonths: 36,
    minCreditScore: 60,
    features: ["Fast processing", "No collateral required"],
    processingTime: "2-3 business days",
  },
  {
    id: "loan-002",
    boktName: "Bank Alatəmir",
    loanAmountMin: 5000,
    loanAmountMax: 300000,
    annualInterestRate: 16.0,
    repaymentPeriodMonths: 24,
    minCreditScore: 50,
    features: ["Flexible repayment", "Online application"],
    processingTime: "3-5 business days",
  },
  {
    id: "loan-003",
    boktName: "Capital Finance",
    loanAmountMin: 20000,
    loanAmountMax: 1000000,
    annualInterestRate: 12.0,
    repaymentPeriodMonths: 48,
    minCreditScore: 70,
    features: [
      "Best rates",
      "Dedicated account manager",
      "Early repayment allowed",
    ],
    processingTime: "1-2 business days",
  },
  {
    id: "loan-004",
    boktName: "Mikro Kredit Plus",
    loanAmountMin: 1000,
    loanAmountMax: 50000,
    annualInterestRate: 18.5,
    repaymentPeriodMonths: 12,
    minCreditScore: 40,
    features: ["Instant approval", "Micro business focused"],
    processingTime: "Same day",
  },
  {
    id: "loan-005",
    boktName: "Businesss Growth Bank",
    loanAmountMin: 50000,
    loanAmountMax: 2000000,
    annualInterestRate: 11.5,
    repaymentPeriodMonths: 60,
    minCreditScore: 75,
    features: [
      "Lowest rates",
      "Large loan amounts",
      "Expert business consultation",
    ],
    processingTime: "2-3 business days",
  },
  {
    id: "loan-006",
    boktName: "Trade Credit Solutions",
    loanAmountMin: 15000,
    loanAmountMax: 750000,
    annualInterestRate: 13.5,
    repaymentPeriodMonths: 36,
    minCreditScore: 55,
    features: ["Trade financing", "Supplier partnerships"],
    processingTime: "2-4 business days",
  },
  {
    id: "loan-007",
    boktName: "Tech Entrepreneur Fund",
    loanAmountMin: 25000,
    loanAmountMax: 500000,
    annualInterestRate: 10.0,
    repaymentPeriodMonths: 48,
    minCreditScore: 65,
    features: [
      "Tech company focused",
      "Mentorship included",
      "Lowest tech rates",
    ],
    processingTime: "3-5 business days",
  },
  {
    id: "loan-008",
    boktName: "Agricultural Development Fund",
    loanAmountMin: 30000,
    loanAmountMax: 1500000,
    annualInterestRate: 9.5,
    repaymentPeriodMonths: 60,
    minCreditScore: 50,
    features: ["Agriculture focused", "Seasonal repayment options"],
    processingTime: "5-7 business days",
  },
  {
    id: "loan-009",
    boktName: "Express Business Loans",
    loanAmountMin: 5000,
    loanAmountMax: 200000,
    annualInterestRate: 17.0,
    repaymentPeriodMonths: 24,
    minCreditScore: 45,
    features: ["Quick approval", "Minimal documentation"],
    processingTime: "1 business day",
  },
  {
    id: "loan-010",
    boktName: "Premium Corporate Credit",
    loanAmountMin: 100000,
    loanAmountMax: 5000000,
    annualInterestRate: 10.5,
    repaymentPeriodMonths: 72,
    minCreditScore: 80,
    features: ["Corporate accounts", "Volume discounts", "Flexible terms"],
    processingTime: "3-5 business days",
  },
  {
    id: "loan-011",
    boktName: "Smart Finance",
    loanAmountMin: 10000,
    loanAmountMax: 400000,
    annualInterestRate: 15.0,
    repaymentPeriodMonths: 36,
    minCreditScore: 55,
    features: ["Mobile app", "Transparent fees", "AI-powered decisions"],
    processingTime: "24 hours",
  },
  {
    id: "loan-012",
    boktName: "Growth Capital Partners",
    loanAmountMin: 40000,
    loanAmountMax: 1200000,
    annualInterestRate: 12.5,
    repaymentPeriodMonths: 48,
    minCreditScore: 68,
    features: ["Growth focused", "Strategic advice", "Network access"],
    processingTime: "2-3 business days",
  },
];

export function getEligibleLoans(
  creditScore: number,
  limit?: number,
): LoanOffer[] {
  const eligible = MOCK_LOAN_OFFERS.filter(
    (loan) => creditScore >= loan.minCreditScore,
  );
  eligible.sort((a, b) => a.annualInterestRate - b.annualInterestRate);

  if (limit && limit > 0) {
    return eligible.slice(0, limit);
  }

  return eligible;
}

export function getLoanById(id: string): LoanOffer | undefined {
  return MOCK_LOAN_OFFERS.find((loan) => loan.id === id);
}

export function getLoansByIds(ids: string[]): LoanOffer[] {
  return ids
    .map((id) => getLoanById(id))
    .filter((loan): loan is LoanOffer => loan !== undefined);
}

export function sortLoansByInterestRate(loans: LoanOffer[]): LoanOffer[] {
  return [...loans].sort((a, b) => a.annualInterestRate - b.annualInterestRate);
}
