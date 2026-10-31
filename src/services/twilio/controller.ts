
import { Request, Response } from "express";
import twilio from "twilio";
import { respondUser } from "./service";

const MAX_TURNS = 50;
const MAX_SILENCES = 3;

const VOICE = "Google.es-US-Chirp3-HD-Aoede";
const VOICE_LANGUAGE = "es-MX";
const SPEECH_LANGUAGE = "es-CO";

type ConversationState = {
  turnCount: number;
  silenceCount: number;
};

// ==============================
// HELPERS
// ==============================

const sendTwiml = (
  res: Response,
  twiml: twilio.twiml.VoiceResponse
) => {
  res.type("text/xml").send(twiml.toString());
};

const parseCounter = (
  value: unknown,
  fallback: number,
  max: number
): number => {
  if (typeof value !== "string") return fallback;

  const number = Number(value);

  if (!Number.isSafeInteger(number) || number < 0) {
    return fallback;
  }

  return Math.min(number, max);
};

const getState = (req: Request): ConversationState => ({
  turnCount: parseCounter(
    req.query.turnCount,
    0,
    MAX_TURNS + 1
  ),
  silenceCount: parseCounter(
    req.query.silenceCount,
    0,
    MAX_SILENCES
  ),
});

const getActionUrl = (
  state: ConversationState
): string => {
  const params = new URLSearchParams({
    turnCount: String(state.turnCount),
    silenceCount: String(state.silenceCount),
  });

  return `/twilio/process?${params.toString()}`;
};

// ==============================
// REUSABLE GATHER
// ==============================

const listenToUser = (
  twiml: twilio.twiml.VoiceResponse,
  state: ConversationState,
  message?: string
) => {
  const gather = twiml.gather({
    input: ["speech"],
    action: getActionUrl(state),
    method: "POST",
    language: SPEECH_LANGUAGE,
    speechTimeout: "auto",
    timeout: 6,
    bargeIn: true,
    actionOnEmptyResult: true,
  });

  if (message) {
    gather.say(
      {
        voice: VOICE,
        language: VOICE_LANGUAGE,
      },
      message
    );
  }

  return gather;
};

// ==============================
// END CALL
// ==============================

const endCall = (
  twiml: twilio.twiml.VoiceResponse,
  message: string
) => {
  twiml.say(
    {
      voice: VOICE,
      language: VOICE_LANGUAGE,
    },
    message
  );

  twiml.hangup();
};

// ==============================
// DETECT GOODBYE
// ==============================

const wantsToEndCall = (speech: string): boolean => {
  const normalized = speech
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const goodbyePatterns = [
    /\badios\b/,
    /\bhasta luego\b/,
    /\bpuedes colgar\b/,
    /\bquiero colgar\b/,
    /\bterminar la llamada\b/,
    /\bno necesito nada mas\b/,
    /\beso es todo\b/,
  ];

  return goodbyePatterns.some((pattern) =>
    pattern.test(normalized)
  );
};

// ==============================
// RECEIVE CALL
// ==============================

export const handleReceiveCall = (
  req: Request,
  res: Response
) => {
  console.info("📞 Incoming call", {
    callSid: req.body.CallSid,
  });

  const twiml = new twilio.twiml.VoiceResponse();

  listenToUser(
    twiml,
    {
      turnCount: 0,
      silenceCount: 0,
    },
    "Hola, bienvenido a Audífonos CGT. ¿En qué puedo ayudarte?"
  );

  return sendTwiml(res, twiml);
};

// ==============================
// PROCESS SPEECH
// ==============================

export const handleProcessSpeech = async (
  req: Request,
  res: Response
) => {
  const twiml = new twilio.twiml.VoiceResponse();

  const state = getState(req);

  const speechResult =
    typeof req.body.SpeechResult === "string"
      ? req.body.SpeechResult.trim()
      : "";

  console.info("🎤 Processing speech", {
    callSid: req.body.CallSid,
    turnCount: state.turnCount,
    silenceCount: state.silenceCount,
    speechResult,
  });

  // 1. MANEJAR SILENCIO

  if (!speechResult) {
    const nextSilenceCount = state.silenceCount + 1;

    if (nextSilenceCount >= MAX_SILENCES) {
      endCall(
        twiml,
        "No he recibido respuesta. Gracias por llamar. Hasta pronto."
      );

      return sendTwiml(res, twiml);
    }

    listenToUser(
      twiml,
      {
        turnCount: state.turnCount,
        silenceCount: nextSilenceCount,
      },
      "Disculpa, no te escuché. ¿Puedes repetir tu pregunta?"
    );

    return sendTwiml(res, twiml);
  }

  // 2. DETECTAR DESPEDIDA

  if (wantsToEndCall(speechResult)) {
    endCall(
      twiml,
      "Gracias por comunicarte con nosotros. Que tengas un excelente día."
    );

    return sendTwiml(res, twiml);
  }

  // 3. VALIDAR LÍMITE DE TURNOS

  if (state.turnCount >= MAX_TURNS) {
    endCall(
      twiml,
      "Hemos llegado al límite de esta conversación. Gracias por llamar."
    );

    return sendTwiml(res, twiml);
  }

  // 4. CONSULTAR IA

  try {
    const aiResponse = await respondUser(speechResult);

    if (
      typeof aiResponse !== "string" ||
      !aiResponse.trim()
    ) {
      throw new Error("Empty AI response");
    }

    const nextState: ConversationState = {
      turnCount: state.turnCount + 1,
      silenceCount: 0,
    };

    console.info("✅ AI response generated", {
      callSid: req.body.CallSid,
      turnCount: nextState.turnCount,
    });

    // 5. RESPONDER Y ESCUCHAR NUEVAMENTE

    listenToUser(
      twiml,
      nextState,
      aiResponse.trim()
    );

  } catch (error) {
    console.error("❌ AI processing error", {
      callSid: req.body.CallSid,
      error,
    });

    // No colgar inmediatamente por un error
    listenToUser(
      twiml,
      state,
      "Disculpa, tuve un inconveniente al procesar tu pregunta. ¿Puedes repetirla?"
    );
  }

  return sendTwiml(res, twiml);
};

// ==============================
// TWILIO ERRORS
// ==============================

export const getErrors = (
  req: Request,
  res: Response
) => {
  console.error("💢 Twilio error", req.body);

  return res.sendStatus(200);
};
