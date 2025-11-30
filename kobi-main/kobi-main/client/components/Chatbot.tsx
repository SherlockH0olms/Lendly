import { useState, useEffect, useRef } from "react";
import { CreditScoreResult, ChatMessage } from "@shared/api";
import { useChatbot } from "@/hooks/useChatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send, X, AlertCircle, Loader } from "lucide-react";

interface ChatbotProps {
  creditScore: CreditScoreResult;
  onClose?: () => void;
  isExpanded?: boolean;
}

export function Chatbot({
  creditScore,
  onClose,
  isExpanded = true,
}: ChatbotProps) {
  const {
    messages,
    isLoading,
    error,
    suggestions,
    sendMessage,
    clearChat,
    getWelcomeMessage,
    initializeSuggestions,
  } = useChatbot(creditScore);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize suggestions on first render
  useEffect(() => {
    if (!hasInitialized.current) {
      initializeSuggestions();
      hasInitialized.current = true;
    }
  }, [initializeSuggestions]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    await sendMessage(textToSend);
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  if (!isExpanded) {
    return null;
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <h3 className="font-heading font-bold text-foreground">
            Credit Score Assistant
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!hasMessages ? (
          // Welcome state
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-primary rounded-full" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Welcome to Credit Score Assistant
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Ask me anything about your credit score, factors affecting it,
                or how to improve it.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-2",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-muted-foreground border border-border rounded-bl-none",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="bg-muted px-4 py-2 rounded-lg text-muted-foreground border border-border rounded-bl-none flex gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Suggestions */}
      {!hasMessages && suggestions.length > 0 && (
        <div className="px-4 py-3 border-t border-border space-y-2 bg-muted/20">
          <p className="text-xs font-medium text-muted-foreground">
            Quick questions:
          </p>
          <div className="space-y-1.5">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left text-xs p-2 hover:bg-muted rounded-lg transition-colors border border-border hover:border-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4 space-y-2 bg-muted/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage();
              }
            }}
            placeholder="Ask about your score..."
            disabled={isLoading}
            className="text-sm"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {hasMessages && (
          <button
            onClick={clearChat}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>
    </div>
  );
}
