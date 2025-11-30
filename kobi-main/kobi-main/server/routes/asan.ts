import { RequestHandler } from "express";
import { ASANAuthResponse, CompanyData } from "../../shared/api";

// Mock ASAN İmza authentication
// In production, this would integrate with the real ASAN İmza service
export const handleASANAuth: RequestHandler = (req, res) => {
  const { email, pin } = req.body;

  // Mock validation
  if (!email || !pin) {
    res.status(400).json({
      success: false,
      error: "Email and PIN are required",
    } as ASANAuthResponse);
    return;
  }

  // Mock successful authentication with sample company data
  // In production, this would return actual data from ASAN İmza
  const mockCompanyData: CompanyData = {
    id: `company-${Date.now()}`,
    name:
      email.split("@")[0] === "demo"
        ? "Demo Tech Solutions LLC"
        : "Sample Business Company",
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

  res.json({
    success: true,
    companyData: mockCompanyData,
  } as ASANAuthResponse);
};
