import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Users, Lock, ArrowRight } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                Bazar boşluqlarını trend olmadan əvvəl tapın
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
                AI Market Gap Finder sosial media və biznes fürsətlərini
                proqnozlaşdıran niş imkanları üzə çıxarır.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="bg-success hover:bg-success/90 h-14 text-base font-heading font-semibold group"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Başlayın
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 text-base font-heading font-semibold border-2"
              >
                Planı Araşdırın
              </Button>
            </div>

            {/* Badge */}
            <div>
              <Badge
                variant="secondary"
                className="bg-blue-50 border-blue-200 text-blue-700"
              >
                <span className="mr-2">✓</span>
                Multi-platform, real-time insights
              </Badge>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in-delayed">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-border transform hover:scale-105 transition-transform duration-300 -rotate-2 hover:rotate-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-sm text-foreground">
                      Market Gaps
                    </h3>
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50"
                      >
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <div className="flex-1 h-2 bg-gradient-to-r from-secondary to-primary rounded" />
                        <span className="text-xs text-success font-semibold">
                          +{15 + i * 5}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Real-time insights from 10K+ sources
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 bg-secondary/5 rounded-2xl p-8 sm:p-12 border border-border/50">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-heading font-bold text-secondary mb-2">
              12,000+
            </div>
            <p className="text-sm text-muted-foreground">
              Small businesses analyzed
            </p>
          </div>
          <div className="text-center border-l border-r border-border/50">
            <div className="text-4xl sm:text-5xl font-heading font-bold text-secondary mb-2">
              8.2M AZN
            </div>
            <p className="text-sm text-muted-foreground">Loans matched</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-heading font-bold text-secondary mb-2">
              95%
            </div>
            <p className="text-sm text-muted-foreground">Success rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
