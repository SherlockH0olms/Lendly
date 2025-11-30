import { useState } from "react";
import { CreditScoreResult } from "@shared/api";
import { Chatbot } from "@/components/Chatbot";
import { cn } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";

interface ChatbotWidgetProps {
  creditScore: CreditScoreResult;
  className?: string;
}

export function ChatbotWidget({ creditScore, className }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-40",
          "w-14 h-14 rounded-full shadow-lg",
          "bg-primary hover:bg-secondary",
          "text-primary-foreground",
          "flex items-center justify-center",
          "transition-all duration-200 transform hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          className,
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50",
            "w-full sm:w-96 h-96 sm:h-[500px]",
            "max-w-[calc(100vw-48px)]",
            "animate-in slide-in-from-bottom-4 duration-300",
            "md:animate-in md:slide-in-from-right-4",
          )}
        >
          <Chatbot
            creditScore={creditScore}
            onClose={() => setIsOpen(false)}
            isExpanded
          />
        </div>
      )}
    </>
  );
}
