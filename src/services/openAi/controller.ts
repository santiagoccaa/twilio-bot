import { openAiClient } from "@/lib";
import { Request, Response } from "express";

export const generateResponse = (req: Request, res: Response) => {
  try {
    const respuesta = openAiClient(
      "¿Cuánto tiempo dura la batería de los auriculares y cuánto tardan en cargarse?",
    );
    return respuesta;
    
  } catch (error) {
    console.error("ERROR", error);
    return null;
  }
};
