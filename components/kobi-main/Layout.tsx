import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { CompanyData } from "@shared/api";

interface LayoutProps {
  children: ReactNode;
  companyData?: CompanyData | null;
  onLogout?: () => void;
}

export function Layout({ children, companyData, onLogout }: LayoutProps) {
  const location = useLocation();

  // Don't show navigation on certain pages if needed
  const showNavigation = true;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showNavigation && (
        <Navigation companyName={companyData?.name} onLogout={onLogout} />
      )}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 KÖBİ Kredit Platforması. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
