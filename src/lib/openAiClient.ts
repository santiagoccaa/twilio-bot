import { systemPrompt } from "@/config/openAi.prompt";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * https://platform.openai.com/docs/pricing
 */
export enum GptModel {
  GPT4 = "gpt-4",
  GPT35 = "gpt-3.5-turbo", // MORE EXPENSIVE NOW
  GPT4Mini = "gpt-4o-mini", // CHEAPER!!!
}

export const openAiClient = async (userPrompt: string) => {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: GptModel.GPT4Mini,
      messages,
      max_tokens: 2000,
      temperature: 1,
    });

    if (response.choices[0].finish_reason !== "stop") {
      console.error(
        `OpenAI didnt stop but ${response.choices[0].finish_reason}"`,
      );
      return null;
    }

    return response.choices[0].message?.content ?? "";
  } catch (error) {
    console.error("OpenAI error:", error);
    return null;
  }
};
