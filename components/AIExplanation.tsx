import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";

interface AIExplanationProps {
    recommendations: string[];
    score: number;
}

export function AIExplanation({ recommendations, score }: AIExplanationProps) {
    const insights = [
        {
            icon: <TrendingUp className="w-5 h-5" />,
            title: "Skorunuzun Mənası",
            description: score >= 3.5
                ? "Skorunuz yüksəkdir və kredit almaq şansınız çox yaxşıdır. Bir çox BOKT sizinlə əməkdaşlıq etməyə hazırdır."
                : score >= 2.5
                    ? "Skorunuz orta səviyyədədir. Bəzi BOKT-lər sizə kredit verə bilər, lakin şərtlər daha ciddi ola bilər."
                    : "Skorunuz aşağıdır. Kredit almaq çətin ola bilər. Aşağıdakı tövsiyələri nəzərə alın.",
        },
        {
            icon: <Lightbulb className="w-5 h-5" />,
            title: "AI Tövsiyələri",
            description: recommendations.length > 0
                ? "Skorunuzu yüksəltmək üçün aşağıdakı tövsiyələrə əməl edin:"
                : "Skorunuz yaxşıdır! İşlərinizi belə davam etdirin.",
        },
    ];

    return (
        <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-accent" />
                    </div>
                    AI İzahatları
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="text-accent">{insight.icon}</div>
                            <h4 className="font-semibold">{insight.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-7">
                            {insight.description}
                        </p>
                    </div>
                ))}

                {recommendations.length > 0 && (
                    <div className="ml-7 space-y-2 mt-4">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                <p className="text-sm">{rec}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4 pt-4 border-t">
                    <Badge variant="outline" className="text-xs">
                        🤖 AI-powered scoring system
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
