import { CreditScoreBreakdown } from "@shared/api";
import { cn } from "@/lib/utils";
import {
  Building2,
  TrendingUp,
  Receipt,
  Users,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

interface CriteriaBreakdownProps {
  breakdown: CreditScoreBreakdown;
  className?: string;
}

export function CriteriaBreakdown({
  breakdown,
  className,
}: CriteriaBreakdownProps) {
  const criteria = [
    {
      key: "companyAge" as const,
      icon: Building2,
      color: "from-blue-500 to-blue-600",
    },
    {
      key: "revenue" as const,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      key: "taxDebt" as const,
      icon: Receipt,
      color: "from-orange-500 to-orange-600",
    },
    {
      key: "employees" as const,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      key: "paymentHistory" as const,
      icon: CheckCircle,
      color: "from-teal-500 to-teal-600",
    },
    {
      key: "industryRisk" as const,
      icon: AlertCircle,
      color: "from-amber-500 to-amber-600",
    },
    {
      key: "debtRatio" as const,
      icon: CreditCard,
      color: "from-red-500 to-red-600",
    },
    {
      key: "growthTrend" as const,
      icon: ArrowUpRight,
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-heading font-bold text-foreground">
        Score Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {criteria.map(({ key, icon: Icon, color }) => {
          const criterion = breakdown[key];
          const percentage = (criterion.points / criterion.maxPoints) * 100;
          const isPositive = percentage >= 75;

          return (
            <div
              key={key}
              className="bg-white rounded-lg p-4 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "p-2 rounded-lg text-white",
                    `bg-gradient-to-br ${color}`,
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div
                  className={cn(
                    "text-xs font-bold px-2 py-1 rounded",
                    isPositive
                      ? "bg-success/10 text-success"
                      : percentage >= 50
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive",
                  )}
                >
                  {criterion.points}/{criterion.maxPoints}
                </div>
              </div>

              {/* Criterion label */}
              <div className="text-sm font-medium text-foreground mb-3">
                {criterion.label}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isPositive
                      ? "bg-gradient-to-r from-success to-green-500"
                      : percentage >= 50
                        ? "bg-gradient-to-r from-warning to-amber-500"
                        : "bg-gradient-to-r from-destructive to-red-500",
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Percentage */}
              <div className="text-xs text-muted-foreground mt-2 text-right">
                {Math.round(percentage)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary info */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Total Points:{" "}
            {Object.values(breakdown).reduce((sum, c) => sum + c.points, 0)}/100
          </span>
          <br />
          Your credit score is calculated based on these 8 key financial
          criteria. Each criterion contributes to your overall creditworthiness
          assessment.
        </p>
      </div>
    </div>
  );
}
