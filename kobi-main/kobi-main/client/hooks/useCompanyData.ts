import { useState, useCallback } from "react";
import { CompanyData } from "@shared/api";

// Mock default data for testing
const DEFAULT_COMPANY_DATA: CompanyData = {
  id: "demo-001",
  name: "",
  registrationNumber: "",
  foundingDate: new Date().toISOString().split("T")[0],
  industry: "",
  employees: 0,
  annualRevenue: 0,
  taxDebt: 0,
  totalDebt: 0,
  paymentHistory: 85,
  growthRate: 10,
};

export function useCompanyData() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCompanyData = useCallback((data: Partial<CompanyData>) => {
    setCompanyData((prev) => {
      if (!prev) return DEFAULT_COMPANY_DATA;
      return { ...prev, ...data };
    });
  }, []);

  const setCompanyDataFull = useCallback((data: CompanyData) => {
    setCompanyData(data);
  }, []);

  const initializeWithDefaults = useCallback(() => {
    setCompanyData(DEFAULT_COMPANY_DATA);
  }, []);

  const mockASANLogin = useCallback(
    async (email: string, pin: string): Promise<CompanyData> => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock successful response with sample data
        const mockData: CompanyData = {
          id: `company-${Date.now()}`,
          name:
            email.split("@")[0] === "demo"
              ? "Demo Tech Solutions"
              : "Sample Company LLC",
          registrationNumber: "ATN-2021-12345",
          foundingDate: "2020-03-15",
          industry: "Technology",
          employees: 45,
          annualRevenue: 450000,
          taxDebt: 2500,
          totalDebt: 85000,
          paymentHistory: 88,
          growthRate: 15,
        };

        setCompanyData(mockData);
        return mockData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearCompanyData = useCallback(() => {
    setCompanyData(null);
    setError(null);
  }, []);

  return {
    companyData,
    setCompanyDataFull,
    updateCompanyData,
    mockASANLogin,
    initializeWithDefaults,
    clearCompanyData,
    isLoading,
    error,
  };
}
