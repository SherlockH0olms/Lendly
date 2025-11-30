import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StepProps {
  number: number;
  title: string;
  description: string;
  isReverse?: boolean;
  children?: React.ReactNode;
}

function Step({
  number,
  title,
  description,
  isReverse = false,
  children,
}: StepProps) {
  const content = (
    <>
      {/* Number Circle */}
      <div className="mb-8">
        <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <span className="text-5xl font-heading font-bold text-success">
            {number}
          </span>
        </div>

        {/* Text Content */}
        <h3 className="text-3xl font-heading font-bold text-foreground mb-4">
          {title}
        </h3>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          {description}
        </p>

        {/* Search Bar Mockup (for step 1) */}
        {number === 1 && (
          <div className="mt-8">
            <div className="relative max-w-md">
              <div className="flex items-center gap-2 bg-white border border-border rounded-lg p-3 shadow-md">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Keyword..."
                  disabled
                  className="flex-1 bg-transparent outline-none text-sm text-muted-foreground placeholder-shown:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const visual = (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-border p-8 shadow-lg max-w-sm w-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-foreground">
              Ahead of the #AI3
            </div>
            <Badge
              variant="outline"
              className="bg-success/10 border-success text-success"
            >
              ✓
            </Badge>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 bg-muted rounded w-3/4"
                style={{ opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReverse ? "lg:auto-cols-max" : ""}`}
    >
      {isReverse ? (
        <>
          {visual}
          <div>{content}</div>
        </>
      ) : (
        <>
          <div>{content}</div>
          {visual}
        </>
      )}
    </div>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Ekosistemin skan edilməsi",
      description:
        "Bizim engine real-time olaraq sosial media platformalarında, forum diskussiyalarında və startup xəbərlərində nümunələri təhlil edir.",
    },
    {
      number: 2,
      title: "Ağrılı nöqtələri və nümunələri xəritəsi",
      description:
        "Potensial boşluqları müəyyən etmək üçün bizdə qrupla şəkil edin. Rəqabətçi landşaftı dərk edin.",
      isReverse: true,
    },
    {
      number: 3,
      title: "Gələcək tendencələri proqnozlaşdırın və boşluqları tapın",
      description:
        "Baş məlumatların üzərində AI modelimizi işlətməklə gələcəyin boşluqlarını müəyyən edin. Trendlərin başında olun.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-muted/30 to-background py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-4">
            Necə işləyir?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            3 addımda niş bazar boşluqlarını kəşf edin
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, idx) => (
            <Step
              key={idx}
              number={step.number}
              title={step.title}
              description={step.description}
              isReverse={step.isReverse}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
