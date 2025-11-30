import { Github, Linkedin, Twitter } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: "Dashboard", href: "#" },
    { label: "Trend Predictor", href: "#" },
    { label: "Gap Finder", href: "#" },
    { label: "For Investors & VCs", href: "#" },
  ];

  const resourcesLinks = [
    { label: "Blogs & Insights", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Contact us", href: "#" },
  ];

  return (
    <footer className="bg-foreground text-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-success to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">
                  K
                </span>
              </div>
              <span className="text-sm font-heading font-bold">KÖBİ</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 max-w-xs">
              AI bazar boşluqları Finder HD founders və investors üçün
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Github, label: "GitHub" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-success/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-gray-300">
              Məhsul və Həllər
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-success transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-gray-300">
              Resurslar və Şirkət
            </h4>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-success transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-gray-300">
              Xəbərdarlıqlar
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Son trendlər haqqında məlumat alın
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-success/50"
              />
              <button className="px-3 py-2 bg-success hover:bg-success/90 rounded-lg text-sm font-medium transition-colors">
                Yolla
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} KÖBİ. Bütün hüquqlar qorunur.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-success transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-success transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-success transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
