import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function LandingNav() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Haqqımızda", href: "#about" },
    { label: "Platformamız", href: "#platform" },
    { label: "Həllər", href: "#solutions" },
    { label: "Xidmətlər", href: "#services" },
    { label: "Resurslar", href: "#resources" },
  ];

  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-lg">
              L
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-heading font-bold text-foreground leading-none">
              Lendly
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Right Side - Login Button & Menu Toggle */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleLoginClick}
            className="hidden sm:inline-flex bg-secondary hover:bg-secondary/90"
          >
            Giriş
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm font-medium text-muted-foreground hover:text-secondary transition-colors px-2 py-2"
            >
              {link.label}
            </a>
          ))}
          <Button
            onClick={handleLoginClick}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            Giriş
          </Button>
        </div>
      )}
    </nav>
  );
}
