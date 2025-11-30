import { RequestHandler } from "express";
import { CalculateCreditScoreRequest, CreditScoreResult } from "../../shared/api";
import { calculateCreditScore } from "../../shared/creditScoring";

// Calculate credit score based on company data
export const handleCalculateCreditScore: RequestHandler = (req, res) => {
  const { companyData } = req.body as CalculateCreditScoreRequest;

  if (!companyData) {
    res.status(400).json({
      error: "Company data is required",
    });
    return;
  }

  try {
    // Calculate score using the shared library function
    const result = calculateCreditScore(companyData) as CreditScoreResult;

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to calculate credit score",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
