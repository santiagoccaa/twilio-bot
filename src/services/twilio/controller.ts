import { Request, Response } from "express";
import twilio from "twilio";

/**
 * Iniciar llamada
 */
export const handleReceiveCall = (req: Request, res: Response) => {
  console.info("😀 [handleReceiveCall] started");

  console.log("📞 Incoming call");
  console.log("Body:", req.body);
  console.log("From:", req.body.From);
  console.log("To:", req.body.To);
  console.log("CallSid:", req.body.CallSid);

  const twiml = new twilio.twiml.VoiceResponse();

  const gather = twiml.gather({
    input: ["speech"],
    action: "/twilio/process",
    method: "POST",
    speechTimeout: "auto",
    language: "es-CO",
    timeout: 6,
    enhanced: true,
  });

  gather.say("Hola. ¿en que puedo ayudarte?");

  res.type("text/html");
  res.send(twiml.toString());

  console.info("😎 [handleReceiveCall] finished");
};

export const handleProcessSpeech = (req: Request, res: Response) => {
  console.info("🎤 [handleProcessSpeech] started");

  console.log("SpeechResult:", req.body.SpeechResult);

  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(`Entendí que dijiste: ${req.body.SpeechResult}`);

  res.type("text/xml");
  res.send(twiml.toString());

  console.info("😎 [handleProcessSpeech] finished");
};

// =================== Obtenccion de errores ================
export const getErrors = (req: Request, res: Response) => {
  console.error("💢 ERROR DETECTADO");
  console.info(req.body);
};
