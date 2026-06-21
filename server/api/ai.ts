import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

export const aiRouter = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

aiRouter.post("/chat", async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{text: `You are the StatGate AI Consultant, a secure data intelligence consultant for StatGate Uganda. 
Respond professionally as an AI assistant regarding national demographics, economic indicators, or policy simulations.
User query: ${query}`}],
        }
      ],
      config: {
        temperature: 0.3,
        systemInstruction: "You are StatGate AI Consultant. Provide concise, highly analytical, and professional responses grounded in statistical logic. Frame your insights within the context of Ugandan national demographics, health, or economic policies where relevant. State that you are analyzing the StatGate Sovereign Database."
      }
    });

    const responseContent = aiResponse.text || "No insights could be generated at this time.";

    res.json({ role: "ai", content: responseContent });
  } catch (error) {
    console.error("[AI API] Gemini connection error:", error);
    res.json({ role: "ai", content: `I am analyzing your request regarding "${query}". Currently, our Semantic Data Layer and Predictive Systems are compiling real-time aggregations (Offline mode simulation due to missing API configurations).` });
  }
});
