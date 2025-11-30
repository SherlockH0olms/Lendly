import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompanyData } from "@/hooks/useCompanyData";
import { ArrowRight, Zap, Lock, Users } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { mockASANLogin, isLoading } = useCompanyData();
  const [email, setEmail] = useState("demo@example.com");
  const [pin, setPin] = useState("1234");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const companyData = await mockASANLogin(email, pin);
      // Navigate to company data page with company data
      navigate("/company-data", { state: { companyData } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                  Fair Credit{" "}
                  <span className="text-primary">for Small Businesses</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Get your AI-powered credit score and discover loans from
                  multiple lenders in minutes. No bias, no guesswork—just fair
                  assessment.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">
                      AI-Powered Assessment
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get scored based on 8 financial criteria, not subjective
                      decisions
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">
                      Multiple Lenders
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      See loans from all qualifying lenders in one place
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">
                      Secure & Private
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is encrypted and protected. ASAN İmza verified.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Free to use. No hidden fees. No credit check impact.
              </p>
            </div>

            {/* Right side - Login Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Get Started Now
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Login with your ASAN İmza account to pull your company data
                    automatically
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (ASAN Account)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="demo@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Demo: Use demo@example.com
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pin">PIN Code</Label>
                    <Input
                      id="pin"
                      type="password"
                      placeholder="Enter your PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      required
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Demo: Use 1234
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-base font-heading font-semibold"
                  >
                    {isLoading
                      ? "Connecting to ASAN İmza..."
                      : "Login with ASAN İmza"}
                    {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-muted-foreground">
                      Already have ASAN İmza?
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Your data is protected with end-to-end encryption. We never
                  share your information without permission.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-primary/5 border-y border-primary/10 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-heading font-bold text-primary">
                  12,000+
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Small businesses analyzed
                </p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-heading font-bold text-primary">
                  8.2M AZN
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Loans matched
                </p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-heading font-bold text-primary">
                  95%
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Success rate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              {
                number: "1",
                title: "Connect",
                description:
                  "Login with ASAN İmza to auto-fill your company data",
              },
              {
                number: "2",
                title: "Score",
                description:
                  "Get your AI-powered credit score based on 8 criteria",
              },
              {
                number: "3",
                title: "Match",
                description:
                  "See all loans you qualify for from multiple lenders",
              },
              {
                number: "4",
                title: "Apply",
                description: "Apply to multiple lenders with one click",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-heading font-bold text-lg mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
