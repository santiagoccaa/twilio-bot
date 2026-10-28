import { systemPrompt } from "@/config/openAi.prompt";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Función auxiliar para limpiar Markdown del texto.
 * Twilio (Polly) leería literalmente caracteres como *, #, -, etc.
 */
const cleanTextForTTS = (text: string): string => {
  return text
    .replace(/[*_~`#]/g, "") // Elimina *, _, ~, `, #
    .replace(/\[.*?\]\(.*?\)/g, "") // Elimina links en formato [texto](url)
    .replace(/^[-+*]\s+/gm, "") // Elimina viñetas de listas
    .replace(/\s+/g, " ") // Remueve espacios dobles o saltos de línea innecesarios
    .trim();
};

export const respondUser = async (contents: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      // 1. Usar modelo válido y ultrarrápido
      model: "gemini-3.6-flash", 

      contents: contents,

      config: {
        systemInstruction: systemPrompt,
        // 2. Reducir temperatura para respuestas precisas y consistentes
        temperature: 0.3, 
        // 3. Limitar longitud de respuesta para reducir tiempo de espera e importe de Twilio
        maxOutputTokens: 250, 
      },
    });

    const rawText = response.text || "";
    
    // 4. Limpiar respuesta antes de pasar a la voz
    const cleanResponse = cleanTextForTTS(rawText);

    console.info("🤖 AI Response:", cleanResponse);

    return cleanResponse || "Disculpe, ¿podría repetir la pregunta?";

  } catch (error) {
    console.error("❌ Error en la llamada a Gemini:", error);
    // Mensaje de respaldo directo si falla la API
    return "En este momento tengo problemas para consultar la información. ¿Me repite su duda?";
  }
};