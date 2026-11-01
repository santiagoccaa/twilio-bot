import { systemPrompt } from "@/config/openAi.prompt";
import { optimizeText } from "@/utils";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("🔑 GEMINI_API_KEY is required");
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";
const AI_TIMEOUT_MS = 8000;

export const respondUser = async (
  contents: string
): Promise<string> => {
  const question = contents.trim();

  if (!question) {
    throw new Error("EMPTY_USER_QUESTION");
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, AI_TIMEOUT_MS);

  const startTime = performance.now();

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        maxOutputTokens: 200,
        abortSignal: controller.signal,
      },
    });

    const rawText = response.text?.trim();

    if (!rawText) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    const cleanResponse = optimizeText(rawText);

    if (!cleanResponse.trim()) {
      throw new Error("EMPTY_CLEAN_RESPONSE");
    }

    const duration = Math.round(
      performance.now() - startTime
    );

    console.info("🤖 Gemini response", {
      durationMs: duration,
      text: cleanResponse,
    });

    return cleanResponse;

  } catch (error) {
    console.error("❌ Gemini error", {
      durationMs: Math.round(
        performance.now() - startTime
      ),
      error,
    });

    throw error;

  } finally {
    clearTimeout(timeout);
  }
};
