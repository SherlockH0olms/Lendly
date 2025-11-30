// Client-side re-export of shared loan matching functions
export {
  getEligibleLoans,
  getLoanById,
  getLoansByIds,
  sortLoansByInterestRate,
} from "@shared/loanMatching";

import { LoanOffer, CompanyData } from "@shared/api";

// Additional client-specific utility function
export function getLoanRecommendationScore(
  loan: LoanOffer,
  companyData: CompanyData,
  creditScore: number,
): number {
  let score = 0;

  // Higher score for lower interest rate
  score += Math.max(0, 20 - loan.annualInterestRate);

  // Score based on loan amount fit
  const requestedAmount = companyData.annualRevenue * 0.3;
  if (
    requestedAmount >= loan.loanAmountMin &&
    requestedAmount <= loan.loanAmountMax
  ) {
    score += 20;
  } else if (loan.loanAmountMax >= requestedAmount) {
    score += 15;
  }

  // Score based on credit score margin
  const scoreMargin = creditScore - loan.minCreditScore;
  score += Math.min(20, scoreMargin / 5);

  // Shorter repayment periods
  if (loan.repaymentPeriodMonths <= 24) {
    score += 5;
  } else if (loan.repaymentPeriodMonths <= 36) {
    score += 3;
  }

  // Processing speed bonus
  if (
    loan.processingTime.includes("Same day") ||
    loan.processingTime.includes("1 ")
  ) {
    score += 10;
  }

  return Math.round(score);
}
