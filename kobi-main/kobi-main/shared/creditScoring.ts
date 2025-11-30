import { CompanyData, CreditScoreBreakdown, CreditScoreResult } from "./api";

const CRITERIA_WEIGHTS = {
  companyAge: 15,
  revenue: 20,
  taxDebt: 15,
  employees: 10,
  paymentHistory: 15,
  industryRisk: 10,
  debtRatio: 10,
  growthTrend: 5,
} as const;

export function calculateCreditScore(
  companyData: CompanyData,
): CreditScoreResult {
  const breakdown = calculateBreakdown(companyData);

  const totalPoints = Object.values(breakdown).reduce(
    (sum, criterion) => sum + criterion.points,
    0,
  );
  const score = Math.min(Math.round(totalPoints), 100);

  const grade = getGrade(score);

  return {
    score,
    grade,
    breakdown,
    loanEligibility: {
      canApply: score >= 40,
      minScore: 40,
      message: getEligibilityMessage(score),
    },
  };
}

function calculateBreakdown(companyData: CompanyData): CreditScoreBreakdown {
  const currentYear = new Date().getFullYear();
  const foundingYear = parseInt(companyData.foundingDate.split("-")[0]);
  const companyAge = currentYear - foundingYear;

  return {
    companyAge: {
      points: calculateCompanyAgePoints(companyAge),
      maxPoints: CRITERIA_WEIGHTS.companyAge,
      label: `Company Age: ${companyAge} years`,
    },
    revenue: {
      points: calculateRevenuePoints(companyData.annualRevenue),
      maxPoints: CRITERIA_WEIGHTS.revenue,
      label: `Annual Revenue: ${formatCurrency(companyData.annualRevenue)}`,
    },
    taxDebt: {
      points: calculateTaxDebtPoints(companyData.taxDebt),
      maxPoints: CRITERIA_WEIGHTS.taxDebt,
      label: `Tax Debt: ${formatCurrency(companyData.taxDebt)}`,
    },
    employees: {
      points: calculateEmployeesPoints(companyData.employees),
      maxPoints: CRITERIA_WEIGHTS.employees,
      label: `Employees: ${companyData.employees}`,
    },
    paymentHistory: {
      points: calculatePaymentHistoryPoints(companyData.paymentHistory),
      maxPoints: CRITERIA_WEIGHTS.paymentHistory,
      label: `Payment History: ${companyData.paymentHistory}% on-time`,
    },
    industryRisk: {
      points: calculateIndustryRiskPoints(companyData.industry),
      maxPoints: CRITERIA_WEIGHTS.industryRisk,
      label: `Industry Risk: ${companyData.industry}`,
    },
    debtRatio: {
      points: calculateDebtRatioPoints(
        companyData.totalDebt,
        companyData.annualRevenue,
      ),
      maxPoints: CRITERIA_WEIGHTS.debtRatio,
      label: `Debt Ratio: ${formatDebtRatio(companyData.totalDebt, companyData.annualRevenue)}`,
    },
    growthTrend: {
      points: calculateGrowthTrendPoints(companyData.growthRate),
      maxPoints: CRITERIA_WEIGHTS.growthTrend,
      label: `Growth Trend: ${companyData.growthRate > 0 ? "+" : ""}${companyData.growthRate}% YoY`,
    },
  };
}

function calculateCompanyAgePoints(ageYears: number): number {
  if (ageYears < 1) return 0;
  if (ageYears <= 2) return 3;
  if (ageYears <= 5) return 8;
  if (ageYears <= 10) return 12;
  return 15;
}

function calculateRevenuePoints(annualRevenue: number): number {
  if (annualRevenue <= 0) return 0;
  if (annualRevenue <= 50000) return 2;
  if (annualRevenue <= 200000) return 6;
  if (annualRevenue <= 500000) return 12;
  if (annualRevenue <= 1000000) return 16;
  return 20;
}

function calculateTaxDebtPoints(taxDebt: number): number {
  if (taxDebt <= 0) return 15;
  if (taxDebt <= 5000) return 10;
  if (taxDebt <= 20000) return 5;
  if (taxDebt <= 50000) return 2;
  return 0;
}

function calculateEmployeesPoints(employees: number): number {
  if (employees <= 0) return 0;
  if (employees <= 5) return 3;
  if (employees <= 15) return 6;
  if (employees <= 50) return 8;
  return 10;
}

function calculatePaymentHistoryPoints(paymentHistory: number): number {
  if (paymentHistory < 50) return 0;
  if (paymentHistory < 70) return 5;
  if (paymentHistory < 85) return 10;
  if (paymentHistory < 95) return 12;
  return 15;
}

function calculateIndustryRiskPoints(industry: string): number {
  const lowRiskIndustries = [
    "Technology",
    "Services",
    "Trade",
    "Software",
    "Consulting",
    "Education",
  ];
  const mediumRiskIndustries = [
    "Manufacturing",
    "Agriculture",
    "Logistics",
    "Retail",
  ];
  const highRiskIndustries = ["Real Estate", "Finance", "Investment"];

  const industryLower = industry.toLowerCase();

  if (
    lowRiskIndustries.some((ind) => industryLower.includes(ind.toLowerCase()))
  )
    return 10;
  if (
    mediumRiskIndustries.some((ind) =>
      industryLower.includes(ind.toLowerCase()),
    )
  )
    return 7;
  if (
    highRiskIndustries.some((ind) => industryLower.includes(ind.toLowerCase()))
  )
    return 4;
  return 5;
}

function calculateDebtRatioPoints(
  totalDebt: number,
  annualRevenue: number,
): number {
  if (annualRevenue <= 0) return 0;

  const debtRatio = totalDebt / annualRevenue;
  if (debtRatio <= 0.5) return 10;
  if (debtRatio <= 1.0) return 7;
  if (debtRatio <= 1.5) return 4;
  return 0;
}

function calculateGrowthTrendPoints(growthRate: number): number {
  if (growthRate <= 0) return 0;
  if (growthRate <= 5) return 1;
  if (growthRate <= 15) return 3;
  return 5;
}

function getGrade(score: number): "A" | "B" | "C" | "D" {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

function getEligibilityMessage(score: number): string {
  if (score >= 85)
    return "Excellent credit profile. You qualify for premium loans with competitive rates.";
  if (score >= 70)
    return "Good credit profile. You qualify for standard loans from most lenders.";
  if (score >= 55)
    return "Fair credit profile. Limited loan options available. Consider improving payment history.";
  if (score >= 40)
    return "Low credit profile. Limited options available. Focus on improving financial metrics.";
  return "Below minimum threshold. Cannot apply for loans at this time.";
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDebtRatio(debt: number, revenue: number): string {
  if (revenue <= 0) return "N/A";
  const ratio = ((debt / revenue) * 100).toFixed(1);
  return `${ratio}%`;
}
