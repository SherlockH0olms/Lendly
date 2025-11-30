import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CreditScoreResult, ChatMessage } from "../../shared/api";
import {
  buildCreditScoreContext,
  getCreditScoreChatbotSystemPrompt,
  validateUserMessage,
  formatChatHistory,
  ChatResponse,
} from "../../shared/chatbot";

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Mock Gemini API response (fallback if no API key)
function getMockGeminiResponse(message: string): ChatResponse {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("tax") || lowerMessage.includes("debt")) {
    return {
      message:
        "Tax debt is a critical factor in your credit assessment. Outstanding tax obligations signal to lenders that you may have compliance or cash flow issues. To improve your score, I recommend: 1) Setting up a payment plan with tax authorities, 2) Allocating budget specifically for resolving tax debt, 3) Ensuring future filings are on time. Many lenders will work with you if you show commitment to resolving tax issues.",
      reasoning: "Addressed tax debt concerns directly with actionable steps",
      suggestions: [
        "How long does it take to improve credit after paying taxes?",
        "Are there lenders that accept businesses with tax debt?",
      ],
    };
  }

  if (lowerMessage.includes("payment") || lowerMessage.includes("history")) {
    return {
      message:
        "Your payment history shows how reliably you meet financial obligations. A lower payment history percentage indicates missed or late payments, which concerns lenders. To improve: 1) Set up automatic payments for critical obligations, 2) Prioritize vendor and loan payments, 3) Negotiate extended terms if needed, 4) Consider hiring a bookkeeper to track payments. Building a 6-month track record of on-time payments will noticeably boost your score.",
      reasoning: "Provided practical steps to improve payment reliability",
      suggestions: [
        "How long to see improvement in payment history?",
        "What payment tools can help me?",
      ],
    };
  }

  if (lowerMessage.includes("debt ratio") || lowerMessage.includes("debt")) {
    return {
      message:
        "Your debt ratio compares total debt to annual revenue. A high ratio indicates you're heavily leveraged, which increases lender risk. Strategies to improve: 1) Focus on revenue growth through sales/marketing, 2) Pay down existing debt with cash flow, 3) Avoid taking new debt until ratio improves, 4) Consider debt consolidation at better rates. Even a 10-20% improvement in revenue can significantly help your ratio.",
      reasoning: "Explained debt ratio impact with improvement strategies",
      suggestions: [
        "How much should my debt ratio be?",
        "What's the quickest way to lower debt?",
      ],
    };
  }

  if (lowerMessage.includes("young") || lowerMessage.includes("age")) {
    return {
      message:
        "Company age matters because newer businesses have limited track records. While you can't change your founding date, you can strengthen other areas: 1) Build solid financial records from day one, 2) Demonstrate consistent revenue and growth, 3) Maintain clean tax and payment history, 4) Look for lenders specializing in new businesses. Many modern lenders now focus on recent companies and may have better terms than traditional banks.",
      reasoning: "Addressed age concerns with alternative strategies",
      suggestions: [
        "Are there loans for new businesses like mine?",
        "How do I demonstrate reliability as a young company?",
      ],
    };
  }

  return {
    message:
      "That's a great question about your credit profile. Based on your breakdown, the key areas to focus on are your tax debt, payment history, and debt ratio. Each of these has a direct impact on how lenders view your business. Would you like me to dive deeper into any specific area? I can provide targeted advice to help you improve your score.",
    reasoning: "Provided general credit improvement guidance",
    suggestions: [
      "What's the most important factor to improve?",
      "How long does score improvement take?",
    ],
  };
}

// Rate limiting tracker
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (entry.count >= 30) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * POST /api/chat/analyze-credit-score
 * Analyze credit score using Gemini AI and provide credit score insights
 */
export const handleAnalyzeCreditScore: RequestHandler = async (req, res) => {
  try {
    const { creditScore, message, chatHistory } = req.body as {
      creditScore?: CreditScoreResult;
      message: string;
      chatHistory?: ChatMessage[];
    };

    // Validate input
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const validation = validateUserMessage(message);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // Rate limiting
    const clientId = req.ip || "unknown";
    if (!checkRateLimit(clientId)) {
      res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
      return;
    }

    // Require credit score on first message
    if (!chatHistory || chatHistory.length === 0) {
      if (!creditScore) {
        res
          .status(400)
          .json({ error: "Credit score required for initial message" });
        return;
      }
    }

    // Check if REAL Gemini API is available
    if (!genAI || !process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY not found, using fallback mock response");
      const mockResponse = getMockGeminiResponse(message);
      res.json({
        message: mockResponse.message,
        suggestions: mockResponse.suggestions || [],
        reasoning: mockResponse.reasoning,
      } as ChatResponse);
      return;
    }

    // REAL Gemini AI Integration
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Build context
      const systemPrompt = getCreditScoreChatbotSystemPrompt();
      const scoreContext = creditScore
        ? buildCreditScoreContext(creditScore)
        : "";

      // Format chat history  
      const formattedHistory = chatHistory ? formatChatHistory(chatHistory) : [];
      const conversationHistory = formattedHistory
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");

      const prompt = `${systemPrompt}

${scoreContext}

Previous conversation:
${conversationHistory}

User question: ${message}

Provide a helpful, specific response based on their credit score context. Keep it concise (2-3 paragraphs max). Be empathetic and actionable.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const aiMessage = response.text();

      console.log("✅ Gemini AI response generated successfully");

      res.json({
        message: aiMessage,
        suggestions: [],
        reasoning: "AI-generated analysis from Gemini 1.5 Flash",
      } as ChatResponse);
    } catch (aiError) {
      console.error("❌ Gemini API error, falling back to mock:", aiError);
      // Fallback to mock if AI fails
      const mockResponse = getMockGeminiResponse(message);
      res.json({
        message: mockResponse.message,
        suggestions: mockResponse.suggestions || [],
        reasoning: mockResponse.reasoning,
      } as ChatResponse);
    }
  } catch (error) {
    console.error("Error analyzing credit score:", error);
    res.status(500).json({
      error: "Failed to analyze credit score",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
