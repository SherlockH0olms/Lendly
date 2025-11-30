import {
    analyzeKOBICreditRisk,
    generateScoreExplanation,
    AIAnalysis,
} from "./ai/gemini-client";
import { KOBIData, CriteriaBreakdown } from "./scoring-engine";

export interface EnhancedScoreResult {
    total_score: number; // Final weighted score (0-5)
    ml_score: number; // TensorFlow prediction (0-5) - disabled server-side
    rule_score: number; // Rule-based score (0-5)
    ai_analysis: AIAnalysis; // Gemini AI analysis
    breakdown: EnhancedCriteriaBreakdown[];
    recommendations: string[];
    risk_level: "Aşağı" | "Orta" | "Yüksək";
    confidence: number; // 0-1
}

export interface EnhancedCriteriaBreakdown extends CriteriaBreakdown {
    ai_explanation?: string; // AI-generated explanation
    max_score: number;
    percentage: number; // Score as percentage
}

/**
 * Enhanced scoring engine combining Rules and AI
 * Note: TensorFlow.js ML model disabled on server-side (Next.js API routes)
 * Server scoring: Rules (80%) + AI (20%)
 */
export async function calculateEnhancedScore(
    kobi: KOBIData
): Promise<EnhancedScoreResult> {
    try {
        // 1. Calculate rule-based score (primary)
        const ruleScore = calculateRuleBasedScore(kobi);

        // 2. Get AI analysis
        const aiAnalysis = await analyzeKOBICreditRisk(kobi);

        // 3. Calculate weighted final score (without ML on server)
        const aiScoreContribution = ((100 - aiAnalysis.risk_score) / 100) * 5;
        const totalScore = ruleScore * 0.8 + aiScoreContribution * 0.2;

        // 4. Generate detailed criteria breakdown
        const breakdown = await generateEnhancedBreakdown(kobi);

        // 5. Combine recommendations
        const recommendations = [
            ...aiAnalysis.recommendations,
            ...generateRuleBasedRecommendations(kobi),
        ];

        const uniqueRecommendations = Array.from(new Set(recommendations)).slice(0, 5);

        return {
            total_score: Math.min(5, Math.max(0, totalScore)),
            ml_score: 0, // ML not available on server
            rule_score: ruleScore,
            ai_analysis: aiAnalysis,
            breakdown,
            recommendations: uniqueRecommendations,
            risk_level: aiAnalysis.risk_level,
            confidence: aiAnalysis.confidence,
        };
    } catch (error) {
        console.error("Enhanced scoring error:", error);

        const ruleScore = calculateRuleBasedScore(kobi);
        const basicAnalysis: AIAnalysis = {
            risk_level: ruleScore >= 3.5 ? "Aşağı" : ruleScore >= 2.5 ? "Orta" : "Yüksək",
            risk_score: ruleScore * 20,
            strengths: ["Müəyyən güclü tərəflər mövcuddur"],
            weaknesses: ["Bəzi təkmilləşdirmə sahələri var"],
            recommendations: generateRuleBasedRecommendations(kobi),
            summary: "Sistem xətası səbəbilə əsas skorlaşdırma istifadə edildi.",
            confidence: 0.6,
        };

        return {
            total_score: ruleScore,
            ml_score: 0,
            rule_score: ruleScore,
            ai_analysis: basicAnalysis,
            breakdown: await generateEnhancedBreakdown(kobi),
            recommendations: basicAnalysis.recommendations,
            risk_level: basicAnalysis.risk_level,
            confidence: 0.6,
        };
    }
}

function calculateRuleBasedScore(kobi: KOBIData): number {
    let score = 0;

    score += Math.min(kobi.company_age / 5, 1) * 0.75;

    if (kobi.monthly_revenue >= 50000) score += 1.0;
    else if (kobi.monthly_revenue >= 20000) score += 0.7;
    else if (kobi.monthly_revenue >= 10000) score += 0.4;
    else score += 0.2;

    if (kobi.net_profit > 5000) score += 0.75;
    else if (kobi.net_profit > 0) score += 0.5;

    if (kobi.tax_debt === 0) score += 0.75;

    const sectorScores: Record<string, number> = {
        IT: 0.5,
        Ticarət: 0.35,
        İstehsalat: 0.3,
        Restoran: 0.25,
        Tikinti: 0.15,
    };
    score += sectorScores[kobi.sector] || 0.25;

    if (kobi.employee_count >= 10) score += 0.25;
    else if (kobi.employee_count >= 5) score += 0.15;
    else score += 0.05;

    if (kobi.cashflow_positive) score += 0.25;

    const loanCapacity = kobi.monthly_revenue * 0.3;
    if (loanCapacity >= 15000) score += 0.75;
    else if (loanCapacity >= 5000) score += 0.5;
    else score += 0.25;

    return Math.min(5, score);
}

async function generateEnhancedBreakdown(
    kobi: KOBIData
): Promise<EnhancedCriteriaBreakdown[]> {
    const criteria = [
        { name: "Şirkət Yaşı", value: kobi.company_age, weight: 15 },
        { name: "Aylıq Dövriyyə", value: kobi.monthly_revenue, weight: 20 },
        { name: "Xalis Gəlir", value: kobi.net_profit, weight: 15 },
        { name: "Vergi Borcu", value: kobi.tax_debt, weight: 15 },
        { name: "Sektor Riski", value: kobi.sector, weight: 10 },
        { name: "İşçi Sayı", value: kobi.employee_count, weight: 5 },
        { name: "Cashflow", value: kobi.cashflow_positive, weight: 5 },
        { name: "Kredit Kapasitesi", value: kobi.monthly_revenue * 0.3, weight: 15 },
    ];

    const breakdownPromises = criteria.map(async (c) => {
        const score = calculateCriteriaScore(c.name, c.value, kobi);
        const maxScore = (c.weight / 100) * 5;
        const percentage = (score / maxScore) * 100;

        let ai_explanation: string | undefined;
        try {
            ai_explanation = await generateScoreExplanation(c.name, score, maxScore, kobi);
        } catch {
            ai_explanation = undefined;
        }

        return {
            criteria: c.name,
            score,
            weight: c.weight,
            explanation: generateBasicExplanation(c.name, c.value, kobi),
            ai_explanation,
            max_score: maxScore,
            percentage: Math.round(percentage),
        };
    });

    return await Promise.all(breakdownPromises);
}

function calculateCriteriaScore(
    criteria: string,
    value: any,
    kobi: KOBIData
): number {
    const weight = getCriteriaWeight(criteria);
    const maxScore = (weight / 100) * 5;

    switch (criteria) {
        case "Şirkət Yaşı":
            return Math.min(value / 5, 1) * maxScore;
        case "Aylıq Dövriyyə":
            if (value >= 50000) return maxScore;
            if (value >= 20000) return maxScore * 0.7;
            if (value >= 10000) return maxScore * 0.4;
            return maxScore * 0.2;
        case "Xalis Gəlir":
            if (value > 5000) return maxScore;
            if (value > 0) return maxScore * 0.67;
            return 0;
        case "Vergi Borcu":
            return value === 0 ? maxScore : 0;
        case "Sektor Riski":
            const risks: Record<string, number> = {
                IT: 1.0,
                Ticarət: 0.7,
                İstehsalat: 0.6,
                Restoran: 0.5,
                Tikinti: 0.3,
            };
            return (risks[value] || 0.5) * maxScore;
        case "İşçi Sayı":
            if (value >= 10) return maxScore;
            if (value >= 5) return maxScore * 0.6;
            return maxScore * 0.2;
        case "Cashflow":
            return value ? maxScore : 0;
        case "Kredit Kapasitesi":
            if (value >= 15000) return maxScore;
            if (value >= 5000) return maxScore * 0.67;
            return maxScore * 0.33;
        default:
            return 0;
    }
}

function getCriteriaWeight(criteria: string): number {
    const weights: Record<string, number> = {
        "Şirkət Yaşı": 15,
        "Aylıq Dövriyyə": 20,
        "Xalis Gəlir": 15,
        "Vergi Borcu": 15,
        "Sektor Riski": 10,
        "İşçi Sayı": 5,
        Cashflow: 5,
        "Kredit Kapasitesi": 15,
    };
    return weights[criteria] || 10;
}

function generateBasicExplanation(
    criteria: string,
    value: any,
    kobi: KOBIData
): string {
    if (criteria === "Aylıq Dövriyyə") {
        return `${value.toLocaleString()} AZN`;
    }
    if (criteria === "Vergi Borcu") {
        return value === 0
            ? "Vergi borcu yoxdur"
            : `${value.toLocaleString()} AZN borc`;
    }
    if (criteria === "Cashflow") {
        return value ? "Müsbət" : "Mənfi";
    }
    return `${value}`;
}

function generateRuleBasedRecommendations(kobi: KOBIData): string[] {
    const recommendations: string[] = [];

    if (kobi.company_age < 2) {
        recommendations.push("Şirkətin fəaliyyət müddətini artırın");
    }
    if (kobi.tax_debt > 0) {
        recommendations.push("Vergi borcunu mütləq ödəyin");
    }
    if (kobi.net_profit <= 0) {
        recommendations.push("Gəlirliliyi artırmağa fokuslanın");
    }
    if (kobi.monthly_revenue < 30000) {
        recommendations.push("Satışları artırmaq üçün strategiya hazırlayın");
    }
    if (!kobi.cashflow_positive) {
        recommendations.push("Cashflow idarəetməsini yaxşılaşdırın");
    }

    return recommendations;
}
