import { systemPrompt } from "@/config/openAi.prompt";
import { optimizeText } from "@/utils";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const respondUser = async (contents: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        maxOutputTokens: 200,
      },
    });

    const rawText = response.text || "Disculpe, no pude procesar su pregunta.";

    // 4. Limpiar respuesta antes de pasar a la voz
    const cleanResponse = optimizeText(rawText);

    console.info("🤖 AI Response:", cleanResponse);

    return cleanResponse || "Disculpe, ¿podría repetir la pregunta?";

  } catch (error) {
    console.error("❌ Error en la llamada a Gemini:", error);
    // Mensaje de respaldo directo si falla la API
    return "En este momento tengo problemas para consultar la información. ¿Me repite su duda?";
  }
};
