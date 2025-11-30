import { LoanOffer } from "@shared/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Calendar, CheckCircle } from "lucide-react";

interface LoanCardProps {
  loan: LoanOffer;
  onApply?: (loanId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export function LoanCard({
  loan,
  onApply,
  isSelected = false,
  className,
}: LoanCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border transition-all duration-200 overflow-hidden",
        isSelected
          ? "border-primary shadow-lg ring-2 ring-primary/20"
          : "border-border hover:shadow-md hover:border-primary/50",
      )}
    >
      {/* Header with BOKT name and rate highlight */}
      <div className="px-6 py-4 bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border flex items-start justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">
            {loan.boktName}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {loan.processingTime} processing
          </p>
        </div>
        {isSelected && (
          <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
        )}
      </div>

      {/* Main content */}
      <div className="px-6 py-4 space-y-4">
        {/* Interest rate - highlighted */}
        <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">
                Annual Interest Rate
              </p>
              <p className="text-lg font-heading font-bold text-primary">
                {loan.annualInterestRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Loan amount and repayment period */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(loan.loanAmountMin)} -{" "}
              {formatCurrency(loan.loanAmountMax)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Repayment Period
            </p>
            <p className="text-sm font-semibold text-foreground">
              {loan.repaymentPeriodMonths} months
            </p>
          </div>
        </div>

        {/* Credit score requirement */}
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="bg-secondary/5">
            Min Score: {loan.minCreditScore}
          </Badge>
        </div>

        {/* Features */}
        {loan.features.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {loan.features.slice(0, 3).map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {loan.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{loan.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer with apply button */}
      <div className="px-6 py-4 border-t border-border bg-muted/20 flex gap-2">
        <Button
          onClick={() => onApply?.(loan.id)}
          variant={isSelected ? "default" : "outline"}
          className="flex-1"
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
