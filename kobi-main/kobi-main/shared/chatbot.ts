import { CreditScoreResult, CreditScoreBreakdown } from "./api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  reasoning?: string;
}

/**
 * Build context from credit score breakdown for AI analysis
 */
export function buildCreditScoreContext(
  creditScore: CreditScoreResult,
): string {
  const breakdown = creditScore.breakdown;

  const criteriaText = Object.entries(breakdown)
    .map(([key, criterion]) => {
      const percentage = (criterion.points / criterion.maxPoints) * 100;
      return `- ${criterion.label}: ${criterion.points}/${criterion.maxPoints} (${Math.round(percentage)}%)`;
    })
    .join("\n");

  return `
**Credit Score Analysis**
Overall Score: ${creditScore.score}/100
Grade: ${creditScore.grade}

**Breakdown of 8 Criteria:**
${criteriaText}

**Eligibility Status:**
${creditScore.loanEligibility.canApply ? "Eligible to apply for loans" : "Below minimum threshold (40 required)"}
Message: ${creditScore.loanEligibility.message}
`;
}

/**
 * System prompt for credit score analysis chatbot
 */
export function getCreditScoreChatbotSystemPrompt(): string {
  return `You are a financial advisor AI specialized in small business credit scoring. Your role is to help entrepreneurs understand their credit scores and provide actionable advice.

Your responsibilities:
1. Analyze the provided credit score breakdown (8 criteria: company age, revenue, tax debt, employees, payment history, industry risk, debt ratio, growth trend)
2. Explain why certain areas scored low in clear, non-technical language
3. Provide specific, actionable recommendations to improve each low-scoring area
4. Be empathetic but honest about financial challenges
5. Focus on practical steps the business owner can take immediately

Guidelines:
- Use simple language, avoid jargon
- Be encouraging but realistic
- Prioritize the 2-3 most impactful areas for improvement
- Provide concrete examples when possible
- Keep responses concise but thorough
- If asked about loan products, explain how better scores lead to better rates
- Always relate advice back to their specific situation

When analyzing scores:
- Company Age < 2 years is concerning for traditional lenders
- Tax debt is a major red flag - strongly recommend resolution
- Payment history below 85% indicates reliability concerns
- High debt ratio (>1.0) shows overleveraging
- Negative/low growth may signal business viability issues

Remember: The goal is to help them improve their profile and qualify for better credit terms.`;
}

/**
 * Generate quick suggestion prompts based on credit breakdown
 */
export function getQuickSuggestions(creditScore: CreditScoreResult): string[] {
  const suggestions: string[] = [];
  const breakdown = creditScore.breakdown;

  // Tax debt
  if (breakdown.taxDebt.points < breakdown.taxDebt.maxPoints * 0.5) {
    suggestions.push("Why is my tax debt affecting my score so much?");
  }

  // Payment history
  if (
    breakdown.paymentHistory.points <
    breakdown.paymentHistory.maxPoints * 0.5
  ) {
    suggestions.push("How can I improve my payment history?");
  }

  // Debt ratio
  if (breakdown.debtRatio.points < breakdown.debtRatio.maxPoints * 0.5) {
    suggestions.push("My debt ratio is high - what should I do?");
  }

  // Revenue
  if (breakdown.revenue.points < breakdown.revenue.maxPoints * 0.5) {
    suggestions.push("How does my revenue affect my credit score?");
  }

  // Company age
  if (breakdown.companyAge.points < breakdown.companyAge.maxPoints * 0.5) {
    suggestions.push("Is my company too young for loans?");
  }

  // Default suggestions if score is good
  if (suggestions.length === 0) {
    suggestions.push("What can I do to maintain my excellent score?");
    suggestions.push("Which loan products are best for me?");
  }

  return suggestions.slice(0, 3);
}

/**
 * Validate message before sending to API
 */
export function validateUserMessage(message: string): {
  valid: boolean;
  error?: string;
} {
  if (!message || typeof message !== "string") {
    return { valid: false, error: "Message must be a non-empty string" };
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Message cannot be empty" };
  }

  if (trimmed.length > 2000) {
    return { valid: false, error: "Message is too long (max 2000 characters)" };
  }

  return { valid: true };
}

/**
 * Format chat history for API context
 */
export function formatChatHistory(
  messages: ChatMessage[],
): Array<{ role: string; content: string }> {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}
