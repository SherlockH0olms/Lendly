import { KOBIData } from "./scoring-engine";

export interface CreditProduct {
    id: string;
    name: string;
    min_amount: number;
    max_amount: number;
    min_term: number;
    max_term: number;
    interest_rate: number;
}

export interface BOKT {
    id: string;
    name: string;
    logo: string;
    minimum_score: number;
    interest_rate_range: string;
    max_amount: number;
    credit_products: CreditProduct[];
}

export interface MatchResult {
    eligible: boolean;
    message: string;
    reasons: string[];
}

export function checkBOKTEligibility(
    kobi: KOBIData,
    kobi_score: number,
    bokt: BOKT,
    loan_amount?: number
): MatchResult {
    const reasons: string[] = [];
    let eligible = true;

    // Check minimum score
    if (kobi_score < bokt.minimum_score) {
        eligible = false;
        reasons.push(
            `Skorunuz (${kobi_score.toFixed(2)}) minimum tələbdən (${bokt.minimum_score.toFixed(2)}) aşağıdır`
        );
    }

    // Check tax debt
    if (kobi.tax_debt > 0) {
        eligible = false;
        reasons.push(
            `${kobi.tax_debt.toLocaleString()} AZN vergi borcu mövcuddur`
        );
    }

    // Check loan amount vs revenue if provided
    if (loan_amount && loan_amount > kobi.monthly_revenue * 0.5) {
        eligible = false;
        reasons.push(
            `Məbləğ çox yüksəkdir (aylıq dövriyyənin 50%-dən çox)`
        );
    }

    // Check max amount
    if (loan_amount && loan_amount > bokt.max_amount) {
        eligible = false;
        reasons.push(
            `Məbləğ BOKT limitindən (${bokt.max_amount.toLocaleString()} AZN) yüksəkdir`
        );
    }

    let message = "";
    if (eligible) {
        message = "UYĞUN - Müraciət göndərilə bilər";
    } else if (kobi_score < bokt.minimum_score) {
        message = "REDDEDİLDİ - Skorunuz çatmır";
    } else if (kobi.tax_debt > 0) {
        message = "PROBLEMLİ - Vergi borcu mövcuddur";
    } else {
        message = "RİSKLİ - Şərtlər uyğun deyil";
    }

    return {
        eligible,
        message,
        reasons: eligible ? ["Bütün şərtlərə uyğunsunuz"] : reasons,
    };
}
