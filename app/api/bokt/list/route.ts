import { NextResponse } from "next/server";
import boktData from "@/public/bokt-list.json";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const minScore = searchParams.get("minScore");

        let bokts = boktData.bokts;

        if (minScore) {
            const minScoreNum = parseFloat(minScore);
            bokts = bokts.filter((bokt) => bokt.minimum_score <= minScoreNum);
        }

        return NextResponse.json({
            success: true,
            bokts,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
