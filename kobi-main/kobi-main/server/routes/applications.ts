import { RequestHandler } from "express";
import {
  SubmitApplicationRequest,
  SubmitApplicationResponse,
} from "../../shared/api";

// Submit loan applications
export const handleSubmitApplication: RequestHandler = (req, res) => {
  const { companyData, loanOfferIds } = req.body as SubmitApplicationRequest;

  if (!companyData || !loanOfferIds || loanOfferIds.length === 0) {
    res.status(400).json({
      error: "Company data and at least one loan offer ID are required",
    });
    return;
  }

  try {
    // Generate application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // In production, this would:
    // 1. Save application to database
    // 2. Send application to each BOKT (lender) via API
    // 3. Send confirmation email to company
    // 4. Set up webhook handlers to receive lender responses

    // Mock response
    const response: SubmitApplicationResponse = {
      applicationId,
      status: "submitted",
      message: `Your application has been submitted to ${loanOfferIds.length} lender(s). You will receive updates shortly.`,
    };

    // Log for debugging
    console.log(
      `Application ${applicationId} submitted for company: ${companyData.name}`,
    );
    console.log(
      `Applying to ${loanOfferIds.length} lenders: ${loanOfferIds.join(", ")}`,
    );

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: "Failed to submit application",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
