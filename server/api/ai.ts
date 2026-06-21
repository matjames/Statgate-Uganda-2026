import { Router } from "express";

export const aiRouter = Router();

aiRouter.post("/chat", (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  // Very basic simulated intelligence response for now.
  const responseContent = `I am analyzing your request regarding "${query}". Currently, our Semantic Data Layer and Predictive Systems are compiling real-time aggregations.`;
  
  // Fake latency to pretend it's thinking
  setTimeout(() => {
    res.json({ role: "ai", content: responseContent });
  }, 1000);
});
