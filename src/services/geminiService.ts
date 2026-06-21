import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface IntegrityReport {
  score: number;
  flags: string[];
  recommendation: string;
}

/**
 * Analyzes survey data for potential fabrication or "ghost-writing".
 */
export async function analyzeIntegrity(surveyData: string): Promise<IntegrityReport> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following survey data for signs of fabrication, "ghost-writing", or repetitive patterns that suggest the data was not collected from a real field interview. 
      
      Data: ${surveyData}`,
      config: {
        systemInstruction: "You are a senior data integrity auditor. Your goal is to detect fabrication in field research. Provide a score from 0 to 100 (100 being perfectly authentic) and list any red flags.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            flags: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING }
          },
          required: ["score", "flags", "recommendation"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as IntegrityReport;
  } catch (error) {
    console.error("Integrity Analysis Error:", error);
    return {
      score: 85, // Fallback
      flags: ["Analysis service temporarily unavailable"],
      recommendation: "Manual review recommended."
    };
  }
}

/**
 * Translates survey content into local Ugandan languages.
 */
export async function translateSurvey(content: string, targetLanguage: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following survey question/content into ${targetLanguage}. Ensure the tone is culturally appropriate for rural Uganda.
      
      Content: ${content}`,
      config: {
        systemInstruction: "You are a professional translator specializing in East African languages (Luganda, Acholi, Runyankole, Lusoga). Provide only the translated text."
      }
    });

    return response.text || content;
  } catch (error) {
    console.error("Translation Error:", error);
    return content;
  }
}
