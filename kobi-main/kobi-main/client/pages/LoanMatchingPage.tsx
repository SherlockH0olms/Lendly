import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { LoanCard } from "@/components/LoanCard";
import { CompanyData, CreditScoreResult, LoanOffer } from "@shared/api";
import {
  getEligibleLoans,
  sortLoansByInterestRate,
} from "@shared/loanMatching";
import { ArrowRight, ArrowLeft, Filter } from "lucide-react";

type SortBy = "rate" | "amount" | "period";

export default function LoanMatchingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [creditScore, setCreditScore] = useState<CreditScoreResult | null>(
    null,
  );
  const [loans, setLoans] = useState<LoanOffer[]>([]);
  const [selectedLoanIds, setSelectedLoanIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("rate");
  const [maxRate, setMaxRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = location.state as {
      companyData?: CompanyData;
      creditScore?: CreditScoreResult;
    };

    if (state?.companyData && state?.creditScore) {
      setCompanyData(state.companyData);
      setCreditScore(state.creditScore);

      // Get eligible loans
      const eligible = getEligibleLoans(state.creditScore.score);
      setLoans(eligible);
      setIsLoading(false);
    } else {
      // Redirect if no data
      navigate("/");
    }
  }, [location, navigate]);

  if (isLoading || !creditScore) {
    return (
      <Layout companyData={companyData} onLogout={() => navigate("/")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-muted-foreground">Loading loan options...</p>
        </div>
      </Layout>
    );
  }

  // Filter and sort loans
  let filteredLoans = loans;
  if (maxRate) {
    filteredLoans = filteredLoans.filter(
      (loan) => loan.annualInterestRate <= maxRate,
    );
  }

  // Sort
  if (sortBy === "rate") {
    filteredLoans = sortLoansByInterestRate(filteredLoans);
  } else if (sortBy === "amount") {
    filteredLoans = [...filteredLoans].sort(
      (a, b) => b.loanAmountMax - a.loanAmountMax,
    );
  } else if (sortBy === "period") {
    filteredLoans = [...filteredLoans].sort(
      (a, b) => a.repaymentPeriodMonths - b.repaymentPeriodMonths,
    );
  }

  const handleSelectLoan = (loanId: string) => {
    setSelectedLoanIds((prev) => {
      if (prev.includes(loanId)) {
        return prev.filter((id) => id !== loanId);
      } else {
        return [...prev, loanId];
      }
    });
  };

  const handleApply = () => {
    if (selectedLoanIds.length > 0 && companyData) {
      navigate("/apply", {
        state: { companyData, creditScore, selectedLoanIds },
      });
    }
  };

  return (
    <Layout companyData={companyData} onLogout={() => navigate("/")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <button
            onClick={() =>
              navigate("/credit-score", {
                state: { companyData },
              })
            }
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Credit Score
          </button>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
            Eligible Loans for You
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            We found {loans.length} lenders ready to work with your credit
            profile. Compare rates, terms, and features below.
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">Filters & Sort</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-4 py-2 border border-border rounded-lg text-sm bg-white text-foreground"
              >
                <option value="rate">
                  Sort by: Interest Rate (Low to High)
                </option>
                <option value="amount">
                  Sort by: Loan Amount (High to Low)
                </option>
                <option value="period">
                  Sort by: Repayment Period (Short to Long)
                </option>
              </select>

              {/* Max Rate filter */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="8"
                  max="20"
                  step="0.5"
                  value={maxRate || 20}
                  onChange={(e) => setMaxRate(parseFloat(e.target.value))}
                  className="w-full sm:w-32"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {maxRate ? `≤ ${maxRate}%` : "≤ 20%"}
                </span>
              </div>

              {maxRate && (
                <button
                  onClick={() => setMaxRate(null)}
                  className="text-sm text-primary hover:text-primary/80 px-3 py-2"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loans Grid */}
        {filteredLoans.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredLoans.map((loan) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  isSelected={selectedLoanIds.includes(loan.id)}
                  onApply={() => handleSelectLoan(loan.id)}
                />
              ))}
            </div>

            {/* Selection Summary */}
            {selectedLoanIds.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg sm:relative sm:shadow-none sm:border sm:rounded-lg sm:p-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm sm:text-base font-medium text-foreground">
                    {selectedLoanIds.length} loan
                    {selectedLoanIds.length !== 1 ? "s" : ""} selected
                  </p>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedLoanIds([])}
                      className="flex-1 sm:flex-none"
                    >
                      Clear Selection
                    </Button>
                    <Button
                      onClick={handleApply}
                      className="flex-1 sm:flex-none"
                    >
                      Continue to Application
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-8 text-center border border-border/50">
            <p className="text-muted-foreground mb-4">
              No loans match your current filters. Try adjusting your
              preferences.
            </p>
            <Button variant="outline" onClick={() => setMaxRate(null)}>
              Clear All Filters
            </Button>
          </div>
        )}

        {/* If no selection made yet */}
        {selectedLoanIds.length === 0 && filteredLoans.length > 0 && (
          <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Select one or more loans to apply to multiple lenders at once.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
