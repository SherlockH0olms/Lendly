import { NextRequest, NextResponse } from "next/server";
import { getMockUserById } from "@/lib/mock-data";
import { calculateEnhancedScore } from "@/lib/scoring-engine-v2";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCached, setCached, incrementAnalytics } from "@/lib/cache";

export const runtime = "edge";

export async function POST(request: NextRequest) {
    try {
        // Rate limiting (10 requests per minute per IP)
        const ip = request.headers.get("x-forwarded-for") || "anonymous";
        const { success, remaining } = await checkRateLimit(ip, 10, 60);

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                {
                    status: 429,
                    headers: {
                        "X-RateLimit-Remaining": remaining.toString(),
                    },
                }
            );
        }

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const user = getMockUserById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check cache first (1 hour TTL)
        const cacheKey = `score:${userId}`;
        const cached = await getCached(cacheKey);

        if (cached) {
            console.log("✅ Returning cached score");
            return NextResponse.json({
                success: true,
                userId,
                companyName: user.company_name,
                score: cached,
                cached: true,
                timestamp: new Date().toISOString(),
            });
        }

        // Calculate enhanced score (ML + Rules + AI)
        console.log("🧮 Calculating enhanced score...");
        const scoreResult = await calculateEnhancedScore(user);

        // Cache for 1 hour
        await setCached(cacheKey, scoreResult, 3600);

        // Log analytics
        await incrementAnalytics("scores", "total", 1);
        await incrementAnalytics("scores", `sector:${user.sector}`, 1);

        return NextResponse.json({
            success: true,
            userId,
            companyName: user.company_name,
            score: scoreResult,
            cached: false,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Score calculation error:", error);
        return NextResponse.json(
            {
                error: "Score calculation failed",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
