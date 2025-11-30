import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CreditScoreCard } from "@/components/CreditScoreCard";
import { CriteriaBreakdown } from "@/components/CriteriaBreakdown";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { CompanyData, CreditScoreResult } from "@shared/api";
import { calculateCreditScore } from "@shared/creditScoring";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function CreditScorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [creditScore, setCreditScore] = useState<CreditScoreResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = location.state as { companyData?: CompanyData };
    if (state?.companyData) {
      setCompanyData(state.companyData);
      // Calculate score
      const score = calculateCreditScore(state.companyData);
      setCreditScore(score);
      setIsLoading(false);
    } else {
      // Redirect if no company data
      navigate("/");
    }
  }, [location, navigate]);

  const handleContinueToLoans = () => {
    if (creditScore) {
      navigate("/loans", {
        state: { companyData, creditScore },
      });
    }
  };

  const handleBackToCompanyData = () => {
    navigate("/company-data", { state: { companyData } });
  };

  if (isLoading || !creditScore) {
    return (
      <Layout companyData={companyData} onLogout={() => navigate("/")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-muted-foreground">
            Calculating your credit score...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout companyData={companyData} onLogout={() => navigate("/")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <button
            onClick={handleBackToCompanyData}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Company Data
          </button>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
            Your Credit Score
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Your personalized credit assessment based on 8 key financial
            criteria. This score helps lenders understand your creditworthiness
            fairly and transparently.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left - Score Card */}
          <div>
            <CreditScoreCard score={creditScore} />
          </div>

          {/* Right - Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-heading font-bold text-lg text-foreground mb-4">
                What This Means
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Your Score: {creditScore.score}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your credit score ranges from 0-100 and is calculated using
                    advanced AI algorithms that analyze 8 different financial
                    criteria relevant to business lending.
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    Your Grade: {creditScore.grade}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your grade provides a quick assessment of your overall
                    creditworthiness.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-semibold text-success">A:</span>
                      <span>
                        85+ - Excellent profile, best loan rates available
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">B:</span>
                      <span>
                        70-84 - Good profile, standard rates from most lenders
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-warning">C:</span>
                      <span>
                        55-69 - Fair profile, limited options available
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-destructive">D:</span>
                      <span>
                        &lt;55 - Limited profile, fewer lenders available
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
              <h3 className="font-heading font-bold text-foreground mb-3">
                Can I apply for loans?
              </h3>
              {creditScore.loanEligibility.canApply ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-success">
                    ✓ Yes, you're eligible to apply!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We found{" "}
                    {creditScore.loanEligibility.canApply
                      ? "12+ lenders"
                      : "no lenders"}{" "}
                    willing to work with your credit profile.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    Your score is below the minimum required to apply.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Consider improving your financial metrics and try again
                    later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Criteria Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
          <CriteriaBreakdown breakdown={creditScore.breakdown} />
        </div>

        {/* Information */}
        <div className="bg-muted/30 rounded-lg p-6 border border-border/50 mb-8">
          <h3 className="font-heading font-bold text-foreground mb-3">
            How to Improve Your Score
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Increase annual revenue through business growth</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Reduce outstanding tax debt and obligations</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Improve payment history by paying bills on time</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Manage debt-to-revenue ratio responsibly</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            variant="outline"
            onClick={handleBackToCompanyData}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Edit Company Data
          </Button>
          <Button
            onClick={handleContinueToLoans}
            disabled={!creditScore.loanEligibility.canApply}
            className="flex-1"
          >
            View Eligible Loans
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {!creditScore.loanEligibility.canApply && (
          <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              Your credit score is below the minimum required to apply for
              loans. Please improve your financial metrics and try again later.
            </p>
          </div>
        )}
      </div>

      {/* Floating Chatbot Widget */}
      {creditScore && <ChatbotWidget creditScore={creditScore} />}
    </Layout>
  );
}
