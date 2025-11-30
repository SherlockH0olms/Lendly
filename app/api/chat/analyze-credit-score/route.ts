import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

interface ChatRequest {
    creditScore: {
        score: number;
        grade: string;
        breakdown: any;
        loanEligibility: {
            canApply: boolean;
            message: string;
        };
    };
    message: string;
    chatHistory?: Array<{ role: string; content: string }>;
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();
        const { creditScore, message, chatHistory = [] } = body;

        if (!message || !message.trim()) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Build context from credit score
        const breakdown = creditScore.breakdown;
        const criteriaText = Object.entries(breakdown)
            .map(([key, criterion]: [string, any]) => {
                const percentage = (criterion.points / criterion.maxPoints) * 100;
                return `- ${criterion.label}: ${criterion.points}/${criterion.maxPoints} (${Math.round(percentage)}%)`;
            })
            .join("\n");

        const scoreContext = `
**Credit Score Analysis**
Overall Score: ${creditScore.score}/100
Grade: ${creditScore.grade}

**Breakdown of 8 Criteria:**
${criteriaText}

**Eligibility Status:**
${creditScore.loanEligibility.canApply ? "Eligible to apply for loans" : "Below minimum threshold"}
Message: ${creditScore.loanEligibility.message}
`;

        const systemPrompt = `You are a financial advisor AI specialized in small business credit scoring. Your role is to help entrepreneurs understand their credit scores and provide actionable advice.

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

Remember: The goal is to help them improve their profile and qualify for better credit terms.

Current Credit Score Context:
${scoreContext}`;

        // Check if Gemini API is available
        if (!genAI || !process.env.GEMINI_API_KEY) {
            // Fallback response
            return NextResponse.json({
                message: `Based on your credit score of ${creditScore.score}/100 (Grade ${creditScore.grade}), here's my analysis:

${creditScore.score >= 70 ? "✅ You have a good credit profile!" : "⚠️ There's room for improvement in your credit profile."}

Key areas to focus on:
${Object.entries(breakdown)
                        .filter(([_, criterion]: [string, any]) => {
                            const percentage = (criterion.points / criterion.maxPoints) * 100;
                            return percentage < 60;
                        })
                        .map(([key, criterion]: [string, any]) => {
                            return `• ${criterion.label}: Consider improving this area`;
                        })
                        .slice(0, 3)
                        .join("\n")}

${creditScore.loanEligibility.canApply ? "You're eligible to apply for loans!" : "Work on improving your score to become eligible for better loan terms."}

Would you like specific advice on any particular area?`,
                suggestions: [
                    "How can I improve my score?",
                    "What affects my eligibility?",
                    "Which areas need most attention?",
                ],
            });
        }

        // Use Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build conversation history
        const conversationHistory = chatHistory
            .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
            .join("\n");

        const prompt = `${systemPrompt}

Previous conversation:
${conversationHistory}

User question: ${message}

Provide a helpful, specific response based on their credit score context. Keep it concise (2-3 paragraphs max).`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const responseText = response.text();

        // Generate suggestions based on score
        const suggestions: string[] = [];
        Object.entries(breakdown).forEach(([key, criterion]: [string, any]) => {
            const percentage = (criterion.points / criterion.maxPoints) * 100;
            if (percentage < 50 && suggestions.length < 3) {
                if (key === "taxDebt") {
                    suggestions.push("Why is my tax debt affecting my score so much?");
                } else if (key === "paymentHistory") {
                    suggestions.push("How can I improve my payment history?");
                } else if (key === "debtRatio") {
                    suggestions.push("My debt ratio is high - what should I do?");
                }
            }
        });

        if (suggestions.length === 0) {
            suggestions.push("What can I do to maintain my score?");
            suggestions.push("Which loan products are best for me?");
        }

        return NextResponse.json({
            message: responseText,
            suggestions: suggestions.slice(0, 3),
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate response",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
