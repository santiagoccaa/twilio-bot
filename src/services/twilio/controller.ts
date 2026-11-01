import { Request, Response } from "express";
import {
  getConversationState,
} from "./model";
import {
  startConversation,
  processConversation,
} from "./conversation.service";

// ==============================
// HTTP HELPER
// ==============================

const sendTwiml = (
  res: Response,
  xml: string
): void => {
  res.type("text/xml").send(xml);
};

// ==============================
// RECEIVE CALL
// ==============================

export const handleReceiveCall = (
  req: Request,
  res: Response
): void => {
  console.info("📞 Incoming call", {
    callSid: req.body.CallSid,
  });

  const xml = startConversation();

  sendTwiml(res, xml);
};

// ==============================
// PROCESS SPEECH
// ==============================

export const handleProcessSpeech = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const callSid =
      typeof req.body.CallSid === "string"
        ? req.body.CallSid
        : "";

    const speechResult =
      typeof req.body.SpeechResult === "string"
        ? req.body.SpeechResult.trim()
        : "";

    const state = getConversationState(
      req.query
    );

    const xml = await processConversation({
      callSid,
      speechResult,
      state,
    });

    sendTwiml(res, xml);

  } catch (error) {
    console.error("❌ Controller error", error);

    const fallback =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<Response>' +
      '<Say language="es-MX">' +
      'Ocurrió un error inesperado.' +
      '</Say>' +
      '<Hangup/>' +
      '</Response>';

    sendTwiml(res, fallback);
  }
};

// ==============================
// TWILIO ERRORS
// ==============================

export const getErrors = (
  req: Request,
  res: Response
): void => {
  console.error("💢 Twilio error", req.body);

  res.sendStatus(200);
};
