import { Content } from "@google/genai";
import { Request, Response } from "express";
import { createOrder, respondUser } from "./service";

interface ConversationRequest {
  questionUser: string;
  history: Content[];
}

export const Conversation = async (
  req: Request<{}, {}, ConversationRequest>,
  res: Response,
) => {
  console.info("👀 [Conversation] started");

  try {
    const { questionUser, history = [] } = req.body;

    // 1. Llamas a la IA (tu servicio ya le pasa el history actual a Gemini)
    const aiTextResponse = await respondUser(questionUser, history);

    const rawText = aiTextResponse.trim();

    // Detectar si la orden finalizó e interceptar el JSON
    if (rawText.includes("[ORDENCOMPLETADA]")) {
      const parts = rawText.split("[ORDENCOMPLETADA]");

      try {
        const parsedOrder = JSON.parse(parts[1].trim());
        createOrder(parsedOrder)
      } catch (jsonError) {
        console.error("Error parseando el JSON de la orden:", jsonError);
      }
    }

    history.push(
      {
        role: "user",
        parts: [{ text: questionUser }],
      },
      {
        role: "model",
        parts: [{ text: aiTextResponse }],
      },
    );

    const response = {
      success: true,
      data: history,
      message: "Get response successfully",
      statusCode: 200,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ [Conversation] error", error);

    const response = {
      success: true,
      data: null,
      message: "Get response successfully",
      statusCode: 500,
    };

    res.status(500).json(response);
  } finally {
    console.log("🤩 [Conversation] finished");
  }
};
