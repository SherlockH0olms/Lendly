import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CriteriaBreakdown } from "@/lib/scoring-engine";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface CriteriaBreakdownProps {
    criteria: CriteriaBreakdown[];
}

export function CriteriaBreakdownComponent({ criteria }: CriteriaBreakdownProps) {
    const getIcon = (score: number, weight: number) => {
        const percentage = (score / (weight / 100)) * 100;
        if (percentage >= 80) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        if (percentage >= 50) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
        return <XCircle className="w-5 h-5 text-red-600" />;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Skorlaşdırma Kriteriləri</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {criteria.map((item, index) => {
                        const percentage = (item.score / (item.weight / 100)) * 100;

                        return (
                            <div key={index} className="space-y-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        {getIcon(item.score, item.weight)}
                                        <div>
                                            <p className="font-medium">{item.criteria}</p>
                                            <p className="text-sm text-muted-foreground">{item.explanation}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{item.score.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">Çəki: {item.weight}%</p>
                                    </div>
                                </div>
                                <div className="w-full bg-secondary/20 rounded-full h-2">
                                    <div
                                        className={`h-full rounded-full transition-all ${percentage >= 80 ? "bg-green-600" :
                                                percentage >= 50 ? "bg-yellow-600" : "bg-red-600"
                                            }`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
