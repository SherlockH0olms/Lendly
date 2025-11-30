import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  price: number;
  customPrice?: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  featured?: boolean;
}

interface PricingCardProps extends PricingTier {
  index: number;
}

function PricingCard({
  name,
  price,
  customPrice,
  description,
  features,
  cta,
  featured = false,
  index,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300",
        "hover:shadow-xl",
        featured &&
        "lg:scale-105 shadow-2xl lg:border-2 lg:border-success relative",
      )}
    >
      {featured && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Badge className="bg-gradient-to-r from-success to-emerald-600 text-white uppercase text-xs font-bold px-4 py-1 rounded-full">
            Ən Populyar
          </Badge>
        </div>
      )}

      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Price */}
        <div className="py-4">
          {customPrice ? (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-heading font-bold text-foreground">
                {customPrice}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "font-heading font-bold",
                  featured
                    ? "text-6xl text-secondary"
                    : "text-5xl text-foreground",
                )}
              >
                ₼{price}
              </span>
              <span className="text-2xl text-muted-foreground">.00</span>
              <span className="text-base text-muted-foreground ml-2">/ay</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button
          className={cn(
            "w-full h-12 font-heading font-semibold text-base",
            featured ? "bg-secondary hover:bg-secondary/90" : "",
          )}
          variant={featured ? "default" : "outline"}
        >
          {cta}
        </Button>

        {/* Features List */}
        <div className="border-t border-border pt-6 space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
              )}
              <span
                className={cn(
                  "text-sm",
                  feature.included
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50",
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricingCards() {
  const tiers: PricingTier[] = [
    {
      name: "Basic Access",
      price: 0,
      description: "Micro-entrepreneurs, first-time users, risk-averse business owners",
      cta: "Başlayın",
      features: [
        { text: "1 credit comparison per month", included: true },
        { text: "Basic AI Scoring (Lite – approximate only)", included: true },
        { text: "API integrations", included: false },
        { text: "Limited & randomized access to MFI (BOKT) offers", included: true },
        { text: "Ads included", included: true },
        { text: "PDF reports: 2 AZN/report", included: true },
        { text: "Loan-application fee: 3% of approved loan amount", included: true },
      ],
    },
    {
      name: "Business Pro",
      price: 39,
      description: "Growing SMEs with stable cashflow and 5+ employees",
      cta: "Başlayın",
      featured: true,
      features: [
        { text: "Unlimited credit comparisons", included: true },
        { text: "Advanced AI Scoring (full ML model)", included: true },
        { text: "Smart Failover: alternative loan suggestions", included: true },
        { text: "Unlimited Document OCR", included: true },
        { text: "Automated Financial Health Check", included: true },
        { text: "AI Cashflow Forecasting", included: true },
        { text: "Priority customer support", included: true },
      ],
    },
    {
      name: "Corporate / MMC",
      price: 149,
      description: "MMCs, holding companies, multi-branch businesses",
      cta: "Bizimlə əlaqə saxlayın",
      features: [
        { text: "Real-time API access with all MFIs", included: true },
        { text: "Dedicated AI Financial Advisor", included: true },
        { text: "24/7 AI Legal & Audit Assistant", included: true },
        { text: "Workflow automation (Finance, HR, Payments)", included: true },
        { text: "Up to 10 employee accounts", included: true },
        { text: "Custom AI Scoring Models", included: true },
        { text: "Full compliance & audit logs", included: true },
        { text: "Annual Financial Risk Dashboard", included: true },
      ],
    },
  ];

  return (
    <div className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-4">
            Gələcəyi araşdırmağa başlayın
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Solopreneurlər, komandalar və fondlar üçün çevik seçimlər
          </p>

          {/* Toggle - Monthly/Yearly */}
          <div className="inline-flex gap-1 bg-muted rounded-lg p-1 w-max">
            <button className="px-6 py-2 bg-white rounded-md text-sm font-medium text-foreground shadow-sm transition-all">
              Aylıq
            </button>
            <button className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
              İllik
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {tiers.map((tier, idx) => (
            <PricingCard key={idx} {...tier} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
