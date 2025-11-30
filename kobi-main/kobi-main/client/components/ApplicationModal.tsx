import { useState } from "react";
import { LoanOffer, CompanyData } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getLoansByIds } from "@shared/loanMatching";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ApplicationModalProps {
  companyData: CompanyData;
  selectedLoanIds: string[];
  onSubmit: (loanIds: string[]) => Promise<void>;
  isLoading?: boolean;
}

export function ApplicationModal({
  companyData,
  selectedLoanIds,
  onSubmit,
  isLoading = false,
}: ApplicationModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedLoans = getLoansByIds(selectedLoanIds);

  const handleSubmit = async () => {
    if (!confirmed) return;

    setError(null);
    try {
      await onSubmit(selectedLoanIds);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit application",
      );
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Applications Submitted!
            </h2>
            <p className="text-muted-foreground max-w-md">
              Your application has been sent to {selectedLoanIds.length} lender
              {selectedLoanIds.length !== 1 ? "s" : ""}. They will contact you
              shortly.
            </p>
          </div>
        </div>

        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">
                What happens next?
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Lenders will review your application within 1-2 business days
                </li>
                <li>You'll receive updates via email and SMS</li>
                <li>
                  Compare offers and choose the best option for your business
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Application ID:</p>
          <div className="bg-muted p-3 rounded-lg font-mono text-sm text-muted-foreground break-all">
            APP-{Date.now()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Review Your Application
        </h2>
        <p className="text-muted-foreground">
          You're about to apply to {selectedLoanIds.length} lender
          {selectedLoanIds.length !== 1 ? "s" : ""}. They'll review your
          information and contact you with their decisions.
        </p>
      </div>

      {/* Company info summary */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
        <p className="text-xs text-muted-foreground mb-3 font-medium">
          APPLYING AS
        </p>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{companyData.name}</p>
          <p className="text-sm text-muted-foreground">
            Registration: {companyData.registrationNumber}
          </p>
          <p className="text-sm text-muted-foreground">
            Industry: {companyData.industry}
          </p>
        </div>
      </div>

      {/* Selected loans */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">
          SELECTED LENDERS
        </p>
        <div className="space-y-2">
          {selectedLoans.map((loan) => (
            <div
              key={loan.id}
              className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground">{loan.boktName}</p>
                <p className="text-sm text-muted-foreground">
                  {loan.annualInterestRate}% APR • {loan.repaymentPeriodMonths}{" "}
                  months
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Terms confirmation */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-muted/50 rounded-lg transition-colors">
          <Checkbox
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked === true)}
            className="mt-1"
          />
          <span className="text-sm text-muted-foreground">
            I agree that KÖBİ Kredit Platforması can share my information with
            selected lenders so they can contact me with offers. I understand
            that multiple hard inquiries may impact my credit temporarily.
          </span>
        </label>
      </div>

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={!confirmed || isLoading}
        className="w-full h-12 text-base font-heading font-semibold"
      >
        {isLoading
          ? "Submitting Applications..."
          : "Submit Applications to All Lenders"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting, you authorize lenders to contact you about their offers.
      </p>
    </div>
  );
}
