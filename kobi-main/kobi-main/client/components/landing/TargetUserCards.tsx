import { Lightbulb, BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconBg: string;
}

function TargetCard({ icon, title, description, bgColor, iconBg }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-8 border border-border",
        "hover:shadow-lg hover:translate-y-[-8px] transition-all duration-300",
        "min-h-80",
      )}
    >
      <div
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mb-6 text-white",
          iconBg,
        )}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function TargetUserCards() {
  const cards: CardProps[] = [
    {
      icon: <Lightbulb className="w-10 h-10" />,
      title: "Startup Qurucuları",
      description:
        "Potensial niş bazarlara girişi təsdiqləyin və lansmanlardan əvvəl inkişaf etməmiş sahələri təyin edin.",
      bgColor: "#E8F5E9",
      iconBg: "bg-gradient-to-br from-success to-emerald-600",
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "İnvestorlar və VC-lər",
      description:
        "Yüksək potensialı olan niş bazarları tapın və portfel şirkətlərinin böyümə fırsatlarını müəyyən edin.",
      bgColor: "#FEF3E2",
      iconBg: "bg-gradient-to-br from-warning to-orange-600",
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Texnoloji və Bazar Analitikləri",
      description:
        "Və miqyas AI-dən istifadə edərək baş verən trend davamları axtarın və rəqabətə tövbə qaldırın.",
      bgColor: "#EEF2FF",
      iconBg: "bg-gradient-to-br from-info to-blue-600",
    },
  ];

  return (
    <div className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-4">
            Kim üçündür?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trendlərin baş verməsinə imkan verməyən insanlar üçün yaradılıb
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <TargetCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
