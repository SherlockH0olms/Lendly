import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ApplicationModal } from "@/components/ApplicationModal";
import { Button } from "@/components/ui/button";
import { CompanyData, CreditScoreResult } from "@shared/api";
import { ArrowLeft } from "lucide-react";

export default function ApplicationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [creditScore, setCreditScore] = useState<CreditScoreResult | null>(
    null,
  );
  const [selectedLoanIds, setSelectedLoanIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as {
      companyData?: CompanyData;
      creditScore?: CreditScoreResult;
      selectedLoanIds?: string[];
    };

    if (state?.companyData && state?.creditScore && state?.selectedLoanIds) {
      setCompanyData(state.companyData);
      setCreditScore(state.creditScore);
      setSelectedLoanIds(state.selectedLoanIds);
    } else {
      // Redirect if no data
      navigate("/");
    }
  }, [location, navigate]);

  const handleSubmitApplication = async (loanIds: string[]) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate application ID
      const appId = `APP-${Date.now()}`;
      setApplicationId(appId);

      // Could make actual API call here
      // const response = await fetch('/api/applications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     companyData,
      //     loanOfferIds: loanIds,
      //   }),
      // });
      // const data = await response.json();
      // setApplicationId(data.applicationId);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!companyData || !creditScore) {
    return (
      <Layout onLogout={() => navigate("/")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout companyData={companyData} onLogout={() => navigate("/")}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <button
            onClick={() =>
              navigate("/loans", {
                state: { companyData, creditScore },
              })
            }
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Loan Options
          </button>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
            Submit Your Application
          </h1>
          <p className="text-muted-foreground">
            Apply to multiple lenders at once and get offers within 1-2 business
            days
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <ApplicationModal
            companyData={companyData}
            selectedLoanIds={selectedLoanIds}
            onSubmit={handleSubmitApplication}
            isLoading={isSubmitting}
          />
        </div>

        {/* Additional info */}
        {applicationId && (
          <div className="mt-8 space-y-4">
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
              <h3 className="font-heading font-bold text-foreground mb-3">
                Next Steps
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>
                  Lenders will review your application within 1-2 business days
                </li>
                <li>You'll receive emails with loan offers and terms</li>
                <li>Compare the offers and select the best option</li>
                <li>Finalize your application with the chosen lender</li>
              </ol>
            </div>

            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
