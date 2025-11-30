import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQItemComponentProps extends FAQItem {
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItemComponent({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: FAQItemComponentProps) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden hover:border-secondary transition-colors">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start gap-4 text-left">
          <div className="w-8 h-8 rounded-full bg-foreground text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
            Q{index + 1}
          </div>
          <span className="text-base font-medium text-foreground pt-0.5">
            {question}
          </span>
        </div>
        <div
          className={cn(
            "w-8 h-8 rounded-full bg-foreground text-white flex items-center justify-center flex-shrink-0 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-border bg-muted/20">
          <p className="text-muted-foreground leading-relaxed pl-12">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Hansı platformaları skan edirsiniz?",
      answer:
        "Bizim AI motoru Twitter, Reddit, ProductHunt, LinkedIn, Hacker News, TechCrunch və daha 15+ başlıca platformaya real-time müraciət edir. Gözəyən məlumatları işləyir və haqqında müşahidə edib anlayışlı nəticə verir.",
    },
    {
      question: "Web scraping ilə ChatGPT istifadə etməkdən nə fərqi var?",
      answer:
        "Bizim metodologiya sadəcə məlumatları toplamaqdan çox dərindən gedir. AI sistemi kəmiyyət analitikası aparır, paylı şəkildə nəticə verir və fəlsəfə məmətlərini digər veriliənlərlə düzəltir. Beləliklə sən gerçek, əsl boşluqları taparsın.",
    },
    {
      question: "Insights nə vaxt yenilənir?",
      answer:
        "Platformamız 24/7 real-time məlumatları işləyir. Əsas məlumatlar saatda bir dəfə yenilənir, daha dəqiq boşluq analitikası isə günündə iki dəfə aparılır. Enterprise abunəçiləri real-time yeniləmə əldə edə bilərlər.",
    },
    {
      question: "Dataları öz alətlərimə export edə bilərəm?",
      answer:
        "Bəli! Business planı və üzərində olan abunəçilər CSV, JSON və PDF formatlarında məlumatları export edə bilərlər. API əlaqəsi isə Enterprise planında mövcüddur.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-muted/20 to-background py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-6">
            Qurucuların və investorların adətən verdiyi suallar
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItemComponent
              key={idx}
              {...faq}
              index={idx}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
