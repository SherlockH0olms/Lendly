import { NextResponse } from "next/server";
import { getMockUserById } from "@/lib/mock-data";
import { calculateCreditScore } from "@/lib/scoring-engine";
import { checkBOKTEligibility } from "@/lib/matching-engine";
import boktData from "@/public/bokt-list.json";

export async function POST(request: Request) {
    try {
        const { userId, boktId, productId, amount, term } = await request.json();

        if (!userId || !boktId || !productId || !amount || !term) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const user = getMockUserById(userId);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const bokt = boktData.bokts.find((b) => b.id === boktId);
        if (!bokt) {
            return NextResponse.json(
                { error: "BOKT not found" },
                { status: 404 }
            );
        }

        const product = bokt.credit_products.find((p) => p.id === productId);
        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        const scoreResult = calculateCreditScore(user);
        const eligibility = checkBOKTEligibility(
            user,
            scoreResult.total_score,
            bokt,
            amount
        );

        if (!eligibility.eligible) {
            return NextResponse.json({
                success: false,
                message: eligibility.message,
                reasons: eligibility.reasons,
            });
        }

        // Generate mock application ID
        const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        return NextResponse.json({
            success: true,
            applicationId,
            message: "Müraciətiniz uğurla göndərildi!",
            details: {
                bokt: bokt.name,
                product: product.name,
                amount: `${amount.toLocaleString()} AZN`,
                term: `${term} ay`,
                interestRate: `${product.interest_rate}%`,
                estimatedMonthlyPayment: Math.round((amount * (1 + product.interest_rate / 100)) / term),
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
