export interface KOBIData {
    id: string;
    voen: string;
    company_name: string;
    company_age: number; // İl
    monthly_revenue: number; // AZN
    net_profit: number; // AZN
    tax_debt: number; // AZN
    sector: string;
    employee_count: number;
    cashflow_positive: boolean;
    owner_name: string;
    email: string;
}

export interface CriteriaBreakdown {
    criteria: string;
    score: number;
    weight: number;
    explanation: string;
}

export interface ScoreResult {
    total_score: number; // 0-5 arası
    breakdown: CriteriaBreakdown[];
    recommendations: string[];
}

export function calculateCreditScore(kobi: KOBIData): ScoreResult {
    let totalScore = 0;
    const breakdown: CriteriaBreakdown[] = [];

    // 1. Şirkət Yaşı (15% - 0.75 bal)
    const ageScore = Math.min(kobi.company_age / 5, 1) * 0.75;
    totalScore += ageScore;
    breakdown.push({
        criteria: "Şirkət Yaşı",
        score: ageScore,
        weight: 15,
        explanation:
            kobi.company_age < 2
                ? "Şirkət yenidir, risk yüksəkdir"
                : "Şirkət təcrübəlidir",
    });

    // 2. Aylıq Dövriyyə (20% - 1.0 bal)
    const revenueScore =
        kobi.monthly_revenue >= 50000
            ? 1.0
            : kobi.monthly_revenue >= 20000
                ? 0.7
                : kobi.monthly_revenue >= 10000
                    ? 0.4
                    : 0.2;
    totalScore += revenueScore;
    breakdown.push({
        criteria: "Aylıq Dövriyyə",
        score: revenueScore,
        weight: 20,
        explanation: `Aylıq dövriyyə: ${kobi.monthly_revenue.toLocaleString()} AZN`,
    });

    // 3. Xalis Gəlir (15% - 0.75 bal)
    const profitScore = kobi.net_profit > 5000 ? 0.75 : kobi.net_profit > 0 ? 0.5 : 0;
    totalScore += profitScore;
    breakdown.push({
        criteria: "Xalis Gəlir",
        score: profitScore,
        weight: 15,
        explanation:
            kobi.net_profit > 0 ? "Gəlirlilik müsbətdir" : "Zərər mövcuddur",
    });

    // 4. Vergi Borcu (15% - 0.75 bal)
    const taxScore = kobi.tax_debt === 0 ? 0.75 : 0;
    totalScore += taxScore;
    breakdown.push({
        criteria: "Vergi Borcu",
        score: taxScore,
        weight: 15,
        explanation:
            kobi.tax_debt > 0
                ? `${kobi.tax_debt.toLocaleString()} AZN vergi borcu mövcuddur`
                : "Vergi borcu yoxdur",
    });

    // 5. Sektor Riski (10% - 0.5 bal)
    const sectorRisk: Record<string, number> = {
        IT: 0.5,
        Ticarət: 0.35,
        Restoran: 0.25,
        Tikinti: 0.15,
    };
    const sectorScore = sectorRisk[kobi.sector] || 0.25;
    totalScore += sectorScore;
    breakdown.push({
        criteria: "Sektor Riski",
        score: sectorScore,
        weight: 10,
        explanation: `Sektor: ${kobi.sector}`,
    });

    // 6. İşçi Sayı (5% - 0.25 bal)
    const employeeScore =
        kobi.employee_count >= 10 ? 0.25 : kobi.employee_count >= 5 ? 0.15 : 0.05;
    totalScore += employeeScore;
    breakdown.push({
        criteria: "İşçi Sayı",
        score: employeeScore,
        weight: 5,
        explanation: `${kobi.employee_count} işçi`,
    });

    // 7. Cashflow (5% - 0.25 bal)
    const cashflowScore = kobi.cashflow_positive ? 0.25 : 0;
    totalScore += cashflowScore;
    breakdown.push({
        criteria: "Cashflow",
        score: cashflowScore,
        weight: 5,
        explanation: kobi.cashflow_positive
            ? "Nağd axın müsbətdir"
            : "Nağd axın problemlidir",
    });

    // Recommendations
    const recommendations: string[] = [];
    if (ageScore < 0.3)
        recommendations.push("Şirkət yaşını artırmaq üçün zaman lazımdır");
    if (taxScore === 0) recommendations.push("Vergi borcunu ödəyin");
    if (profitScore < 0.5) recommendations.push("Gəlirliliyi artırmağa çalışın");
    if (revenueScore < 0.5)
        recommendations.push("Aylıq dövriyyəni yüksəltməyə çalışın");

    return {
        total_score: Math.round(totalScore * 100) / 100,
        breakdown,
        recommendations,
    };
}
