import { systemPrompt } from "@/config/openAi.prompt";
import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const gemini = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: "Why is the sky blue?",

    config: {
      systemInstruction: systemPrompt,
      temperature: 0.5,
      candidateCount: 500,
    },
  });
  console.log(response.text);
};
