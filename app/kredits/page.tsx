"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BOKTCard } from "@/components/BOKTCard";
import { BOKT, CreditProduct } from "@/lib/matching-engine";
import { Building2, LogOut, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function KreditsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [bokts, setBokts] = useState<BOKT[]>([]);
    const [userScore, setUserScore] = useState(0);
    const [companyName, setCompanyName] = useState("");
    const [userId, setUserId] = useState("");

    // Form state
    const [selectedBokt, setSelectedBokt] = useState<BOKT | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<CreditProduct | null>(null);
    const [amount, setAmount] = useState("");
    const [term, setTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applicationResult, setApplicationResult] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem("kobi_user_token");
            const storedUserId = localStorage.getItem("kobi_user_id");

            if (!token || !storedUserId) {
                router.push("/login");
                return;
            }

            setUserId(storedUserId);

            try {
                // Get user score
                const scoreResponse = await fetch("/api/score/calculate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: storedUserId }),
                });
                const scoreData = await scoreResponse.json();

                if (scoreData.success) {
                    setUserScore(scoreData.score.total_score);
                    setCompanyName(scoreData.companyName);
                }

                // Get BOKT list
                const boktResponse = await fetch("/api/bokt/list");
                const boktData = await boktResponse.json();

                if (boktData.success) {
                    setBokts(boktData.bokts);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [router]);

    const handleBoktSelect = (boktId: string) => {
        const bokt = bokts.find((b) => b.id === boktId);
        if (bokt && userScore >= bokt.minimum_score) {
            setSelectedBokt(bokt);
            setSelectedProduct(null);
            setAmount("");
            setTerm("");
            setApplicationResult(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBokt || !selectedProduct || !amount || !term) {
            alert("Bütün sahələri doldurun");
            return;
        }

        const amountNum = parseFloat(amount);
        const termNum = parseInt(term);

        if (
            amountNum < selectedProduct.min_amount ||
            amountNum > selectedProduct.max_amount
        ) {
            alert(
                `Məbləğ ${selectedProduct.min_amount.toLocaleString()} - ${selectedProduct.max_amount.toLocaleString()} AZN arasında olmalıdır`
            );
            return;
        }

        if (termNum < selectedProduct.min_term || termNum > selectedProduct.max_term) {
            alert(
                `Müddət ${selectedProduct.min_term} - ${selectedProduct.max_term} ay arasında olmalıdır`
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/bokt/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    boktId: selectedBokt.id,
                    productId: selectedProduct.id,
                    amount: amountNum,
                    term: termNum,
                }),
            });

            const data = await response.json();
            setApplicationResult(data);

            if (data.success) {
                // Scroll to result
                setTimeout(() => {
                    document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Xəta baş verdi");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <p className="text-muted-foreground">Yüklənir...</p>
                </div>
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
                            <Button variant="outline" onClick={() => router.push("/dashboard")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Çıxış
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Kredit Müraciəti</h2>
                        <p className="text-muted-foreground text-lg">
                            Skorunuz: <span className="font-bold text-primary">{userScore.toFixed(2)}/5.00</span>
                        </p>
                    </div>

                    {/* BOKT Selection */}
                    {!selectedBokt && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">BOKT Seçin</h3>
                                <p className="text-muted-foreground mb-6">
                                    Sizə uyğun olan BOKT-ləri seçə bilərsiniz
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bokts.map((bokt) => (
                                    <BOKTCard
                                        key={bokt.id}
                                        bokt={bokt}
                                        userScore={userScore}
                                        onSelect={handleBoktSelect}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product and Amount Selection */}
                    {selectedBokt && !applicationResult && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Kredit Məlumatları - {selectedBokt.name}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedBokt(null)}
                                    >
                                        Dəyiş
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Product Selection */}
                                    <div className="space-y-3">
                                        <Label>Kredit Növü</Label>
                                        <div className="grid gap-3">
                                            {selectedBokt.credit_products.map((product) => (
                                                <Card
                                                    key={product.id}
                                                    className={`cursor-pointer transition-all ${selectedProduct?.id === product.id
                                                            ? "border-2 border-primary shadow-md"
                                                            : "hover:border-primary/50"
                                                        }`}
                                                    onClick={() => setSelectedProduct(product)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-semibold">{product.name}</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Məbləğ: {product.min_amount.toLocaleString()} - {product.max_amount.toLocaleString()} AZN
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Müddət: {product.min_term} - {product.max_term} ay
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Faiz: {product.interest_rate}%
                                                                </p>
                                                            </div>
                                                            {selectedProduct?.id === product.id && (
                                                                <CheckCircle2 className="w-6 h-6 text-primary" />
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedProduct && (
                                        <>
                                            {/* Amount */}
                                            <div className="space-y-2">
                                                <Label htmlFor="amount">Kredit Məbləği (AZN)</Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    placeholder="Məsələn: 50000"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    min={selectedProduct.min_amount}
                                                    max={selectedProduct.max_amount}
                                                    required
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Minimum: {selectedProduct.min_amount.toLocaleString()} AZN,
                                                    Maksimum: {selectedProduct.max_amount.toLocaleString()} AZN
                                                </p>
                                            </div>

                                            {/* Term */}
                                            <div className="space-y-2">
                                                <Label htmlFor="term">Müddət (ay)</Label>
                                                <Input
                                                    id="term"
                                                    type="number"
                                                    placeholder="Məsələn: 24"
                                                    value={term}
                                                    onChange={(e) => setTerm(e.target.value)}
                                                    min={selectedProduct.min_term}
                                                    max={selectedProduct.max_term}
                                                    required
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Minimum: {selectedProduct.min_term} ay,
                                                    Maksimum: {selectedProduct.max_term} ay
                                                </p>
                                            </div>

                                            {/* Submit */}
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                size="lg"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "Göndərilir..." : "Müraciət Göndər"}
                                            </Button>
                                        </>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Application Result */}
                    {applicationResult && (
                        <Card id="result" className={applicationResult.success ? "border-2 border-green-500" : "border-2 border-red-500"}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {applicationResult.success ? (
                                        <>
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                            Uğurlu!
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-red-600">❌ Rədd edildi</span>
                                        </>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-lg">{applicationResult.message}</p>

                                {applicationResult.success && applicationResult.details && (
                                    <div className="bg-accent/10 rounded-lg p-4 space-y-2">
                                        <h4 className="font-semibold">Müraciət Detalları:</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="text-muted-foreground">BOKT:</span>
                                            <span className="font-medium">{applicationResult.details.bokt}</span>

                                            <span className="text-muted-foreground">Məhsul:</span>
                                            <span className="font-medium">{applicationResult.details.product}</span>

                                            <span className="text-muted-foreground">Məbləğ:</span>
                                            <span className="font-medium">{applicationResult.details.amount}</span>

                                            <span className="text-muted-foreground">Müddət:</span>
                                            <span className="font-medium">{applicationResult.details.term}</span>

                                            <span className="text-muted-foreground">Faiz dərəcəsi:</span>
                                            <span className="font-medium">{applicationResult.details.interestRate}</span>

                                            <span className="text-muted-foreground">Təxmini aylıq ödəniş:</span>
                                            <span className="font-medium">{applicationResult.details.estimatedMonthlyPayment.toLocaleString()} AZN</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-4">
                                            Müraciət ID: {applicationResult.applicationId}
                                        </p>
                                    </div>
                                )}

                                {!applicationResult.success && applicationResult.reasons && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-red-800 mb-2">Səbəblər:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                                            {applicationResult.reasons.map((reason: string, index: number) => (
                                                <li key={index}>{reason}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button onClick={() => {
                                        setApplicationResult(null);
                                        setSelectedBokt(null);
                                        setSelectedProduct(null);
                                        setAmount("");
                                        setTerm("");
                                    }}>
                                        Yeni Müraciət
                                    </Button>
                                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                                        Dashboard-a Qayıt
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
