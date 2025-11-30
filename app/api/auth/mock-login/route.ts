import { NextResponse } from "next/server";
import { getMockUserById } from "@/lib/mock-data";

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
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

        // Simple mock token
        const token = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');

        return NextResponse.json({
            success: true,
            token,
            user,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
