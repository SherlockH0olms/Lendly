import { CreditScoreResult } from "@shared/api";
import { cn } from "@/lib/utils";

interface CreditScoreCardProps {
  score: CreditScoreResult;
  className?: string;
}

export function CreditScoreCard({ score, className }: CreditScoreCardProps) {
  const getScoreColor = (grade: string) => {
    switch (grade) {
      case "A":
        return { bg: "from-success to-green-500", text: "text-success" };
      case "B":
        return { bg: "from-primary to-blue-500", text: "text-primary" };
      case "C":
        return { bg: "from-warning to-amber-500", text: "text-warning" };
      case "D":
        return { bg: "from-destructive to-red-500", text: "text-destructive" };
      default:
        return { bg: "from-muted to-gray-400", text: "text-muted-foreground" };
    }
  };

  const colors = getScoreColor(score.grade);
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (score.score / 100) * circumference;

  return (
    <div className={cn("bg-white rounded-lg shadow-md p-8", className)}>
      <div className="flex flex-col items-center">
        {/* Circular progress */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-6">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 200 200"
          >
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={`var(--${getScoreColor(score.grade).text.replace("text-", "")})`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          {/* Center content */}
          <div className="absolute flex flex-col items-center">
            <div className={cn("text-5xl font-heading font-bold", colors.text)}>
              {score.score}
            </div>
            <div className="text-sm text-muted-foreground font-heading">
              Credit Score
            </div>
            <div
              className={cn(
                "mt-2 px-3 py-1 rounded-full text-xs font-bold text-white",
                colors.bg.replace("from-", "bg-").split(" ")[0],
              )}
            >
              Grade {score.grade}
            </div>
          </div>
        </div>

        {/* Score interpretation */}
        <div className="w-full mt-4 text-center">
          <p className="text-sm font-medium text-foreground mb-1">
            {getScoreInterpretation(score.grade)}
          </p>
          <p className="text-xs text-muted-foreground">
            {score.loanEligibility.message}
          </p>
        </div>

        {/* Grade legend */}
        <div className="w-full mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div>
              <div className="font-bold text-success">A</div>
              <div className="text-muted-foreground">85+</div>
            </div>
            <div>
              <div className="font-bold text-primary">B</div>
              <div className="text-muted-foreground">70-84</div>
            </div>
            <div>
              <div className="font-bold text-warning">C</div>
              <div className="text-muted-foreground">55-69</div>
            </div>
            <div>
              <div className="font-bold text-destructive">D</div>
              <div className="text-muted-foreground">&lt;55</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getScoreInterpretation(grade: string): string {
  switch (grade) {
    case "A":
      return "Excellent Credit Profile";
    case "B":
      return "Good Credit Profile";
    case "C":
      return "Fair Credit Profile";
    case "D":
      return "Limited Credit Profile";
    default:
      return "Credit Profile";
  }
}
