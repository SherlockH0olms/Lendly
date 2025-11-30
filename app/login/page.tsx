"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Shield } from "lucide-react";
import { getMockUsers } from "@/lib/mock-data";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const mockUsers = getMockUsers();

    const handleLogin = async (userId: string) => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/mock-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (data.success) {
                // Store user session
                localStorage.setItem("kobi_user_token", data.token);
                localStorage.setItem("kobi_user_id", userId);

                // Redirect to dashboard
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">KOBİ Kredit Platforması</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Demo üçün aşağıdakı şirkətlərdən birini seçin
                    </p>
                </div>

                {/* ASAN İmza Mock Login */}
                <Card className="border-2 border-primary/20">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Shield className="w-6 h-6 text-primary" />
                            <CardTitle>ASAN İmza ilə Daxil Ol</CardTitle>
                        </div>
                        <CardDescription>
                            Real sistemdə ASAN İmza ilə təhlükəsiz giriş edəcəksiniz
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4">
                            {mockUsers.map((user) => (
                                <Card
                                    key={user.id}
                                    className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
                                    onClick={() => handleLogin(user.id)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-5 h-5 text-primary" />
                                                    <h3 className="font-semibold text-lg">{user.company_name}</h3>
                                                </div>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <p>Sahibkar: {user.owner_name}</p>
                                                    <p>VÖEN: {user.voen}</p>
                                                    <p>Sektor: {user.sector}</p>
                                                    <p>Aylıq Dövriyyə: {user.monthly_revenue.toLocaleString()} AZN</p>
                                                </div>
                                            </div>
                                            <Button
                                                disabled={isLoading}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLogin(user.id);
                                                }}
                                            >
                                                {isLoading ? "Yüklənir..." : "Seç"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-sm text-center">
                            <p className="text-muted-foreground">
                                ℹ️ Bu demo versiyasıdır. Real sistemdə ASAN İmza API inteqrasiyası olacaq.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Back Button */}
                <div className="text-center">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/")}
                    >
                        Ana səhifəyə qayıt
                    </Button>
                </div>
            </div>
        </div>
    );
}
