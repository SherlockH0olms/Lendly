import mockKobiData from "@/public/mock-kobi-data.json";
import { KOBIData } from "./scoring-engine";

export function getMockUsers(): KOBIData[] {
    return mockKobiData.users;
}

export function getMockUserById(userId: string): KOBIData | null {
    const user = mockKobiData.users.find((u) => u.id === userId);
    return user || null;
}
