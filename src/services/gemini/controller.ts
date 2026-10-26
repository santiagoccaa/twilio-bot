import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const gemini = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: "Why is the sky blue?",
  });
  console.log(response.text);
  
};
