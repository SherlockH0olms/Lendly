import { useState, useCallback, useRef } from "react";
import { ChatMessage, ChatResponse, CreditScoreResult } from "@shared/api";
import { buildCreditScoreContext, getQuickSuggestions } from "@shared/chatbot";

export function useChatbot(creditScore: CreditScoreResult) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Initialize suggestions on mount
  const initializeSuggestions = useCallback(() => {
    const initialSuggestions = getQuickSuggestions(creditScore);
    setSuggestions(initialSuggestions);
  }, [creditScore]);

  // Send message and get AI response
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) {
        setError("Message cannot be empty");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Add user message to history
        const newUserMessage: ChatMessage = {
          role: "user",
          content: userMessage,
          timestamp: Date.now(),
        };

        const updatedMessages = [...messagesRef.current, newUserMessage];
        setMessages(updatedMessages);
        messagesRef.current = updatedMessages;

        // Prepare request payload
        const payload = {
          creditScore,
          message: userMessage,
          chatHistory: updatedMessages.slice(0, -1), // Don't include the message we just added
        };

        // Call backend API
        const response = await fetch("/api/chat/analyze-credit-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to get response");
        }

        const chatResponse: ChatResponse = await response.json();

        // Add AI response to history
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: chatResponse.message,
          timestamp: Date.now(),
        };

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        messagesRef.current = finalMessages;

        // Update suggestions if provided
        if (chatResponse.suggestions && chatResponse.suggestions.length > 0) {
          setSuggestions(chatResponse.suggestions);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Chatbot error:", err);

        // Remove the user message if API call failed
        const messagesWithoutLast = messagesRef.current.slice(0, -1);
        setMessages(messagesWithoutLast);
        messagesRef.current = messagesWithoutLast;
      } finally {
        setIsLoading(false);
      }
    },
    [creditScore],
  );

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
    messagesRef.current = [];
    setError(null);
    initializeSuggestions();
  }, [initializeSuggestions]);

  // Get welcome message
  const getWelcomeMessage = useCallback((): ChatMessage => {
    return {
      role: "assistant",
      content: `Hi there! 👋 I'm here to help you understand your credit score. You've scored ${creditScore.score}/100 (Grade ${creditScore.grade}). I can explain specific factors that affect your score and provide recommendations to improve it. What would you like to know?`,
      timestamp: Date.now(),
    };
  }, [creditScore]);

  return {
    messages,
    isLoading,
    error,
    suggestions,
    sendMessage,
    clearChat,
    getWelcomeMessage,
    initializeSuggestions,
  };
}
