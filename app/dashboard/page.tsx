"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreGauge } from "@/components/ScoreGauge";
import { CriteriaBreakdownComponent } from "@/components/CriteriaBreakdown";
import { AIExplanation } from "@/components/AIExplanation";
import { ScoreResult } from "@/lib/scoring-engine";
import { Building2, LogOut, CreditCard } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [scoreData, setScoreData] = useState<ScoreResult | null>(null);
    const [companyName, setCompanyName] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const loadUserScore = async () => {
            const token = localStorage.getItem("kobi_user_token");
            const storedUserId = localStorage.getItem("kobi_user_id");

            if (!token || !storedUserId) {
                router.push("/login");
                return;
            }

            setUserId(storedUserId);

            try {
                const response = await fetch("/api/score/calculate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: storedUserId }),
                });

                const data = await response.json();

                if (data.success) {
                    setScoreData(data.score);
                    setCompanyName(data.companyName);
                }
            } catch (error) {
                console.error("Error loading score:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserScore();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("kobi_user_token");
        localStorage.removeItem("kobi_user_id");
        router.push("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">Skorunuz hesablanır...</p>
                </div>
            </div>
        );
    }

    if (!scoreData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
                <Card className="p-8 text-center">
                    <p className="text-destructive">Məlumat yüklənmədi</p>
                    <Button onClick={() => router.push("/login")} className="mt-4">
                        Yenidən cəhd edin
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl">KOBİ Kredit Platforması</h1>
                                <p className="text-sm text-muted-foreground">{companyName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => router.push("/kredits")}
                                className="gap-2"
                            >
                                <CreditCard className="w-4 h-4" />
                                Kredit Müraciəti
                            </Button>
                            <Button variant="outline" onClick={handleLogout} className="gap-2">
                                <LogOut className="w-4 h-4" />
                                Çıxış
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Xoş gəlmisiniz!</h2>
                        <p className="text-muted-foreground text-lg">
                            AI əsaslı sistemimiz şirkətinizin kredit skorunu hesabladı
                        </p>
                    </div>

                    {/* Score Gauge */}
                    <Card className="p-8 shadow-lg">
                        <ScoreGauge score={scoreData.total_score} />
                    </Card>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Criteria Breakdown */}
                        <CriteriaBreakdownComponent criteria={scoreData.breakdown} />

                        {/* AI Explanation */}
                        <AIExplanation
                            recommendations={scoreData.recommendations}
                            score={scoreData.total_score}
                        />
                    </div>

                    {/* CTA */}
                    <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                        <h3 className="text-2xl font-bold mb-4">Kredit müraciəti etməyə hazırsınız?</h3>
                        <p className="text-muted-foreground mb-6">
                            Skorunuza uyğun BOKT-ləri görün və kredit müraciəti göndərin
                        </p>
                        <Button size="lg" onClick={() => router.push("/kredits")}>
                            <CreditCard className="w-5 h-5 mr-2" />
                            Kredit Seçiminə Keç
                        </Button>
                    </Card>
                </div>
            </main>
        </div>
    );
}
