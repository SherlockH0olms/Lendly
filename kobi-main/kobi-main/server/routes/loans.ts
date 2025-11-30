import { RequestHandler } from "express";
import { GetLoansResponse } from "../../shared/api";
import { getEligibleLoans } from "../../shared/loanMatching";

// Get eligible loans based on credit score
export const handleGetLoans: RequestHandler = (req, res) => {
  const { score, limit } = req.query;

  if (!score || typeof score !== "string") {
    res.status(400).json({
      error: "Credit score is required",
    });
    return;
  }

  try {
    const creditScore = parseInt(score, 10);

    if (isNaN(creditScore) || creditScore < 0 || creditScore > 100) {
      res.status(400).json({
        error: "Credit score must be a number between 0 and 100",
      });
      return;
    }

    // Get eligible loans using the shared library function
    const limitNum = limit ? parseInt(limit as string, 10) : undefined;
    const loans = getEligibleLoans(creditScore, limitNum);

    const response: GetLoansResponse = {
      loans,
      total: loans.length,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve loans",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
