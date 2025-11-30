import { GoogleGenerativeAI } from "@google/generative-ai";
import { KOBIData } from "../scoring-engine";
import { BOKT } from "../matching-engine";

// Initialize Gemini AI (API key from env)
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

export interface AIAnalysis {
    risk_level: "Aşağı" | "Orta" | "Yüksək";
    risk_score: number; // 0-100
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    summary: string;
    confidence: number; // 0-1
}

/**
 * Analyze KOBİ credit risk using Google Gemini AI
 */
export async function analyzeKOBICreditRisk(kobiData: KOBIData): Promise<AIAnalysis> {
    // Fallback if no API key
    if (!genAI) {
        return generateFallbackAnalysis(kobiData);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Sen kredit risk analiz ekspertsən. Aşağıdaki KOBİ məlumatlarına əsasən kredit risk analizi et:

Şirkət məlumatları:
- Şirkət adı: ${kobiData.company_name}
- Şirkət yaşı: ${kobiData.company_age} il
- Aylıq dövriyyə: ${kobiData.monthly_revenue.toLocaleString()} AZN
- Xalis gəlir: ${kobiData.net_profit.toLocaleString()} AZN
- Vergi borcu: ${kobiData.tax_debt.toLocaleString()} AZN
- Sektor: ${kobiData.sector}
- İşçi sayı: ${kobiData.employee_count}
- Cashflow: ${kobiData.cashflow_positive ? 'Müsbət' : 'Mənfi'}

Tələblər:
1. Risk səviyyəsini qiymətləndir (Aşağı/Orta/Yüksək)
2. 3 əsas güclü tərəf
3. 3 əsas zəif tərəf
4. 3 konkret tövsiyə
5. Ümumi qiymət (100-150 söz)

MƏCBUR JSON formatında cavab ver (başqa heç nə yazma):
{
  "risk_level": "string (Aşağı/Orta/Yüksək)",
  "risk_score": number (0-100, 0=yüksək risk, 100=aşağı risk),
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "recommendations": ["string", "string", "string"],
  "summary": "string",
  "confidence": number (0-1)
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.warn("AI response format error, using fallback");
            return generateFallbackAnalysis(kobiData);
        }

        const analysis = JSON.parse(jsonMatch[0]);
        return analysis;

    } catch (error) {
        console.error("Gemini API error:", error);
        return generateFallbackAnalysis(kobiData);
    }
}

/**
 * Generate AI explanation for a specific scoring criteria
 */
export async function generateScoreExplanation(
    criteria: string,
    score: number,
    weight: number,
    kobiData: KOBIData
): Promise<string> {
    if (!genAI) {
        return generateFallbackExplanation(criteria, score, kobiData);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Sen kredit məsləhətçisisən. KOBİ sahibkarına aşağıdaki skor kriteriyasını izah et:

Kriteriya: ${criteria}
Alınan skor: ${score.toFixed(2)} / ${weight.toFixed(2)}
Şirkət: ${kobiData.company_name}
Aylıq dövriyyə: ${kobiData.monthly_revenue.toLocaleString()} AZN

1-2 cümlədə, sadə dildə izah et niyə bu skor alındı və necə yüksəldilə bilər.
Cavabı birbaşa ver, JSON yox. Maksimum 100 söz.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();

    } catch (error) {
        console.error("Gemini explanation error:", error);
        return generateFallbackExplanation(criteria, score, kobiData);
    }
}

/**
 * Recommend best BOKT using AI
 */
export async function recommendBestBOKT(
    score: number,
    bokts: BOKT[],
    loanAmount: number,
    loanTerm: number
): Promise<string> {
    const eligibleBokts = bokts.filter((b) => score >= b.minimum_score);

    if (eligibleBokts.length === 0) {
        return "Hazırda heç bir BOKT-ə uyğun deyilsiniz. Skorunuzu yüksəltməyə çalışın.";
    }

    if (!genAI) {
        // Simple fallback recommendation
        const best = eligibleBokts[0];
        return `${best.name} tövsiyə edirik - minimum skor tələbi (${best.minimum_score}) sizin skorunuzla (${score.toFixed(2)}) uyğundur.`;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Sen kredit məsləhətçisisən. İstifadəçiyə hansı BOKT-u seçməsini tövsiyə et:

İstifadəçi profili:
- Kredit skoru: ${score.toFixed(2)} / 5.0
- İstənilən məbləğ: ${loanAmount.toLocaleString()} AZN
- Müddət: ${loanTerm} ay

Uyğun BOKT-lər:
${eligibleBokts.map((b) => `
- ${b.name}
  Minimum skor: ${b.minimum_score}
  Faiz aralığı: ${b.interest_rate_range}
  Maksimum məbləğ: ${b.max_amount.toLocaleString()} AZN
`).join('\n')}

2-3 cümlədə tövsiyə ver: hansını seçməli və niyə?
Birbaşa cavab ver, JSON yox. Maksimum 80 söz.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();

    } catch (error) {
        console.error("Gemini recommendation error:", error);
        const best = eligibleBokts[0];
        return `${best.name} tövsiyə edirik - faiz dərəcəsi ${best.interest_rate_range} və maksimum məbləğ ${best.max_amount.toLocaleString()} AZN.`;
    }
}

/**
 * Fallback analysis when AI is not available
 */
function generateFallbackAnalysis(kobiData: KOBIData): AIAnalysis {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Analyze strengths
    if (kobiData.monthly_revenue >= 50000) {
        strengths.push("Yüksək aylıq dövriyyə - maliyyə sabitliyini göstərir");
    }
    if (kobiData.tax_debt === 0) {
        strengths.push("Vergi borcu yoxdur - yaxşı maliyyə disiplini");
    }
    if (kobiData.company_age >= 3) {
        strengths.push("Təcrübəli şirkət - bazar bilgisi və stabillik");
    }

    // Analyze weaknesses
    if (kobiData.tax_debt > 0) {
        weaknesses.push(`${kobiData.tax_debt.toLocaleString()} AZN vergi borcu - risk faktoru`);
    }
    if (kobiData.monthly_revenue < 20000) {
        weaknesses.push("Aşağı dövriyyə - kredit ödəmə qabiliyyəti məhdud ola bilər");
    }
    if (!kobiData.cashflow_positive) {
        weaknesses.push("Mənfi cashflow - likvidlik problemi");
    }

    // Generate recommendations
    if (kobiData.tax_debt > 0) {
        recommendations.push("Vergi borcunu ödəyin - bu skorunuzu əhəmiyyətli dərəcədə yüksəldəcək");
    }
    if (kobiData.monthly_revenue < 50000) {
        recommendations.push("Satış strategiyalarını yaxşılaşdırın və dövriyyəni artırın");
    }
    recommendations.push("Maliyyə uçotunu düzgün aparın və sənədləşdirin");

    // Calculate risk score
    let riskScore = 50; // Base
    if (kobiData.monthly_revenue >= 50000) riskScore += 20;
    if (kobiData.tax_debt === 0) riskScore += 15;
    if (kobiData.net_profit > 5000) riskScore += 10;
    if (!kobiData.cashflow_positive) riskScore -= 15;
    if (kobiData.company_age < 2) riskScore -= 10;

    const risk_level = riskScore >= 70 ? "Aşağı" : riskScore >= 40 ? "Orta" : "Yüksək";

    return {
        risk_level,
        risk_score: Math.max(0, Math.min(100, riskScore)),
        strengths: strengths.length > 0 ? strengths : ["Müəyyən güclü tərəflər mövcuddur"],
        weaknesses: weaknesses.length > 0 ? weaknesses : ["Bəzi təkmilləşdirmə sahələri var"],
        recommendations,
        summary: `${kobiData.company_name} şirkəti ${risk_level.toLowerCase()} risk səviyyəsinə malikdir. Əsas diqqət: ${weaknesses[0] || "maliyyə göstəricilərinin monitorinqi"}.`,
        confidence: 0.75,
    };
}

/**
 * Fallback explanation when AI is not available
 */
function generateFallbackExplanation(criteria: string, score: number, kobiData: KOBIData): string {
    const maxScore = score > 0 ? score * 2 : 1; // Rough estimate
    const percentage = (score / maxScore) * 100;

    if (criteria.includes("Dövriyyə")) {
        return `Aylıq dövriyyəniz ${kobiData.monthly_revenue.toLocaleString()} AZN. ${percentage > 70 ? "Yaxşı göstəricidir" : "Daha yüksək dövriyyə skorunuzu artırar"}.`;
    }
    if (criteria.includes("Vergi")) {
        return kobiData.tax_debt === 0
            ? "Vergi borcunuz yoxdur - bu çox yaxşıdır və skorunuza müsbət təsir edir."
            : `${kobiData.tax_debt.toLocaleString()} AZN vergi borcunuz var. Bunu ödəməklə skorunuzu əhəmiyyətli artıra bilərsiniz.`;
    }
    return `Bu kriteriya üzrə ${score.toFixed(2)} bal aldınız. ${percentage > 70 ? "Yaxşı nəticədir" : "Təkmilləşdirmə potensialı var"}.`;
}
