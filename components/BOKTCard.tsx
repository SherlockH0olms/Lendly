import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BOKT } from "@/lib/matching-engine";
import { Building2, TrendingUp } from "lucide-react";

interface BOKTCardProps {
    bokt: BOKT;
    userScore: number;
    onSelect: (boktId: string) => void;
}

export function BOKTCard({ bokt, userScore, onSelect }: BOKTCardProps) {
    const isEligible = userScore >= bokt.minimum_score;

    return (
        <Card className={`transition-all hover:shadow-lg ${!isEligible ? "opacity-60" : ""}`}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{bokt.name}</CardTitle>
                    </div>
                    {isEligible ? (
                        <Badge variant="success">Uyğun</Badge>
                    ) : (
                        <Badge variant="destructive">Skor Çatmır</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Minimum skor:</span>
                        <span className="font-medium">{bokt.minimum_score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Faiz dərəcəsi:</span>
                        <span className="font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {bokt.interest_rate_range}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Kredit növləri:</span>
                        <span className="font-medium">{bokt.credit_products.length} məhsul</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Maksimum məbləğ:</span>
                        <span className="font-medium">{bokt.max_amount.toLocaleString()} AZN</span>
                    </div>
                </div>

                <Button
                    className="w-full mt-4"
                    disabled={!isEligible}
                    onClick={() => onSelect(bokt.id)}
                >
                    {isEligible ? "Müraciət Et" : "Skorunuzu Yüksəldin"}
                </Button>
            </CardContent>
        </Card>
    );
}
