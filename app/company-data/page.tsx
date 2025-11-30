"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface CompanyData {
    name: string;
    registrationNumber: string;
    foundingDate: string;
    industry: string;
    employees: number;
    annualRevenue: number;
    taxDebt: number;
    totalDebt: number;
    paymentHistory: number;
    growthRate: number;
}

export default function CompanyDataPage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Demo company data
    const [companyData, setCompanyData] = useState<CompanyData>({
        name: "TechHub MMC",
        registrationNumber: "1234567890",
        foundingDate: "2020-01-15",
        industry: "IT",
        employees: 15,
        annualRevenue: 780000,
        taxDebt: 0,
        totalDebt: 50000,
        paymentHistory: 95,
        growthRate: 25,
    });

    const handleInputChange = (field: keyof CompanyData, value: any) => {
        setCompanyData((prev) => ({ ...prev, [field]: value }));
    };

    const handleContinue = async () => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Store in localStorage for next page
            localStorage.setItem("company_data", JSON.stringify(companyData));
            router.push("/credit-score");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                        Verify Your Company Data
                    </h1>
                    <p className="text-muted-foreground">
                        Review and update your company information pulled from ASAN İmza
                    </p>
                </div>

                <div className="bg-card rounded-lg shadow-md p-6 sm:p-8 border">
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg text-foreground border-b pb-3">
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Company Name</Label>
                                    <Input
                                        id="name"
                                        value={companyData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        disabled={!isEditing}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="regNumber">Registration Number</Label>
                                    <Input
                                        id="regNumber"
                                        value={companyData.registrationNumber}
                                        onChange={(e) =>
                                            handleInputChange("registrationNumber", e.target.value)
                                        }
                                        disabled={!isEditing}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="founding">Founding Date</Label>
                                    <Input
                                        id="founding"
                                        type="date"
                                        value={companyData.foundingDate}
                                        onChange={(e) =>
                                            handleInputChange("foundingDate", e.target.value)
                                        }
                                        disabled={!isEditing}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        value={companyData.industry}
                                        onChange={(e) =>
                                            handleInputChange("industry", e.target.value)
                                        }
                                        disabled={!isEditing}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg text-foreground border-b pb-3">
                                Financial Information
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="employees">Number of Employees</Label>
                                    <Input
                                        id="employees"
                                        type="number"
                                        value={companyData.employees}
                                        onChange={(e) =>
                                            handleInputChange("employees", parseInt(e.target.value))
                                        }
                                        disabled={!isEditing}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="revenue">Annual Revenue (AZN)</Label>
                                    <Input
                                        id="revenue"
                                        type="number"
                                        value={companyData.annualRevenue}
                                        onChange={(e) =>
                                            handleInputChange("annualRevenue", parseFloat(e.target.value))
                                        }
                                        disabled={!isEditing}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxDebt">Outstanding Tax Debt (AZN)</Label>
                                    <Input
                                        id="taxDebt"
                                        type="number"
                                        value={companyData.taxDebt}
                                        onChange={(e) =>
                                            handleInputChange("taxDebt", parseFloat(e.target.value))
                                        }
                                        disabled={!isEditing}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="totalDebt">Total Debt (AZN)</Label>
                                    <Input
                                        id="totalDebt"
                                        type="number"
                                        value={companyData.totalDebt}
                                        onChange={(e) =>
                                            handleInputChange("totalDebt", parseFloat(e.target.value))
                                        }
                                        disabled={!isEditing}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg text-foreground border-b pb-3">
                                Performance Metrics
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="paymentHistory">
                                        Payment History ({companyData.paymentHistory}% on-time)
                                    </Label>
                                    <Input
                                        id="paymentHistory"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={companyData.paymentHistory}
                                        onChange={(e) =>
                                            handleInputChange("paymentHistory", parseInt(e.target.value))
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="growthRate">
                                        YoY Growth Rate ({companyData.growthRate}%)
                                    </Label>
                                    <Input
                                        id="growthRate"
                                        type="range"
                                        min="-50"
                                        max="50"
                                        value={companyData.growthRate}
                                        onChange={(e) =>
                                            handleInputChange("growthRate", parseInt(e.target.value))
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Info box */}
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Note:</span> This
                                data was pulled from ASAN İmza.
                                {isEditing
                                    ? " You can edit it for testing purposes."
                                    : ' Click "Edit" to make changes.'}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border">
                        {!isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1"
                                >
                                    Edit Information
                                </Button>
                                <Button
                                    onClick={handleContinue}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    Continue to Credit Score
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
