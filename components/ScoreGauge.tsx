import { Progress } from "@/components/ui/progress";

interface ScoreGaugeProps {
    score: number; // 0-5 arası
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
    const percentage = (score / 5) * 100;
    const color =
        score >= 3.5
            ? "text-green-600"
            : score >= 2.5
                ? "text-yellow-600"
                : "text-red-600";

    const bgColor =
        score >= 3.5
            ? "bg-green-600"
            : score >= 2.5
                ? "bg-yellow-600"
                : "bg-red-600";

    return (
        <div className="space-y-4">
            <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-muted-foreground">
                    Kredit Skorunuz
                </h3>
                <div className={`text-5xl font-bold ${color}`}>
                    {score.toFixed(2)} <span className="text-2xl">/ 5.00</span>
                </div>
            </div>

            <div className="relative">
                <Progress value={percentage} className="h-3" />
                <style jsx global>{`
          .h-3 > div {
            background-color: ${score >= 3.5 ? '#16a34a' : score >= 2.5 ? '#ca8a04' : '#dc2626'};
          }
        `}</style>
            </div>

            <p className="text-center text-sm text-muted-foreground">
                {score >= 3.5
                    ? "Əla skor - çox yaxşı kredit şansınız var"
                    : score >= 2.5
                        ? "Yaxşı skor - bir neçə BOKT-dən müraciət edə bilərsiniz"
                        : "Aşağı skor - skorunuzu yüksəltməyə çalışın"}
            </p>
        </div>
    );
}
