import { cn } from "@/lib/utils";

interface NavigationProps {
  companyName?: string;
  currentStep?: number;
  onLogout?: () => void;
  pathname?: string;
}

export function Navigation({
  companyName,
  currentStep = 1,
  onLogout,
  pathname = "/",
}: NavigationProps) {
  const steps = [
    { number: 1, label: "Login", path: "/" },
    { number: 2, label: "Credit Score", path: "/credit-score" },
    { number: 3, label: "Loan Options", path: "/loans" },
    { number: 4, label: "Apply", path: "/apply" },
  ];

  const getStepFromPath = (path: string): number => {
    if (path === "/") return 1;
    if (path.includes("credit-score")) return 2;
    if (path.includes("loans")) return 3;
    if (path.includes("apply")) return 4;
    return 1;
  };

  const activeStep = getStepFromPath(pathname);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg font-heading">
                  K
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-heading font-bold text-foreground leading-none">
                  KÖBİ
                </span>
                <span className="text-xs text-muted-foreground">
                  Credit Platform
                </span>
              </div>
            </div>
          </div>

          {/* Progress indicator - hide on mobile */}
          <div className="hidden sm:flex items-center gap-1 flex-1 mx-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all",
                    activeStep >= step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {step.number}
                </div>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-1 rounded-full transition-all",
                      activeStep > step.number ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right side - company name and logout */}
          <div className="flex items-center gap-4 ml-auto">
            {companyName && (
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-muted-foreground">Company</span>
                <span className="text-sm font-semibold text-foreground truncate max-w-[200px]">
                  {companyName}
                </span>
              </div>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  "text-secondary hover:bg-secondary/10",
                )}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile step indicator */}
        <div className="sm:hidden pb-2">
          <div className="flex items-center gap-1">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    activeStep >= step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {step.number}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-0.5 rounded-full transition-all",
                      activeStep > step.number ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
