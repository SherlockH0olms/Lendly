import { LandingNav } from "@/components/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { TargetUserCards } from "@/components/landing/TargetUserCards";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingCards } from "@/components/landing/PricingCards";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Who It's For Section */}
      <section id="about">
        <TargetUserCards />
      </section>

      {/* How It Works Section */}
      <section id="platform">
        <HowItWorksSection />
      </section>

      {/* Pricing Section */}
      <section id="solutions">
        <PricingCards />
      </section>

      {/* FAQ Section */}
      <section id="resources">
        <FAQAccordion />
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
