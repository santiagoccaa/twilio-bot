import { systemPromptMenu } from "@/config/menu.prompt";
import { optimizeText } from "@/utils";
import { Content, GoogleGenAI } from "@google/genai";
import { AddOrderRequest } from "@shared-types/order.types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("🔑 GEMINI_API_KEY is required");
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";
const AI_TIMEOUT_MS = 20000;

export const respondUser = async (
  questionUser: string,
  history: Content[] = [],
): Promise<string> => {
  const question = questionUser.trim();

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
      contents: [
        ...history,
        {
          role: "user",
          parts: [{ text: question }],
        },
      ],
      config: {
        systemInstruction: systemPromptMenu,
        temperature: 0.3,
        maxOutputTokens: 500,
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

    // const duration = Math.round(performance.now() - startTime);

    // console.info("🤖 Gemini response", {
    //   durationMs: duration,
    //   text: cleanResponse,
    // });

    // console.info("ℹ️ CONVERSATION DEBUG", {
    //   historyLength: history.length,
    //   lastMessages: history.slice(-8).map((message) => ({
    //     role: message.role,
    //     text: message.parts
    //       ?.map((part) => ("text" in part ? part.text : ""))
    //       .join(""),
    //   })),
    //   currentQuestion: questionUser,
    // });

    return cleanResponse;
  } catch (error) {
    console.error("❌ Gemini error", {
      durationMs: Math.round(performance.now() - startTime),
      error,
    });

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};


export const createOrder = async (order: AddOrderRequest): Promise<boolean> => {

  console.log(order)
  return true;
};
