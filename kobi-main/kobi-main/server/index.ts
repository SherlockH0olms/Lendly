import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleASANAuth } from "./routes/asan";
import { handleCalculateCreditScore } from "./routes/creditScore";
import { handleGetLoans } from "./routes/loans";
import { handleSubmitApplication } from "./routes/applications";
import { handleAnalyzeCreditScore } from "./routes/gemini";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Utility routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // KÖBİ Kredit Platform routes
  app.post("/api/asan-auth", handleASANAuth);
  app.post("/api/credit-score", handleCalculateCreditScore);
  app.get("/api/loans", handleGetLoans);
  app.post("/api/applications", handleSubmitApplication);

  // Chatbot routes
  app.post("/api/chat/analyze-credit-score", handleAnalyzeCreditScore);

  return app;
}
