import twilio from "twilio";
import { respondUser } from "./service";
import { SpeechInput, ConversationState } from "@shared-types/index";
import {
  incrementTurn,
  incrementSilence,
  getHistory,
  addExchange,
} from "./model";
import { CALL_CONFIG, INITIAL_STATE } from "@/config/twilio.config";
import { Content } from "@google/genai";

const VoiceResponse = twilio.twiml.VoiceResponse;

// ==============================
// TWIML HELPERS
// ==============================

const createResponse = () => {
  return new VoiceResponse();
};

const getActionUrl = (state: ConversationState): string => {
  const params = new URLSearchParams({
    turnCount: String(state.turnCount),
    silenceCount: String(state.silenceCount),
  });

  return `${CALL_CONFIG.PROCESS_URL}?${params}`;
};

const listenToUser = (
  twiml: twilio.twiml.VoiceResponse,
  state: ConversationState,
  message?: string,
): void => {
  const gather = twiml.gather({
    input: ["speech"],
    action: getActionUrl(state),
    method: "POST",

    language: CALL_CONFIG.SPEECH_LANGUAGE,
    speechTimeout: "auto",
    timeout: CALL_CONFIG.GATHER_TIMEOUT,

    bargeIn: true,
    actionOnEmptyResult: true,
  });

  if (message) {
    gather.say(
      {
        voice: CALL_CONFIG.VOICE,
        language: CALL_CONFIG.VOICE_LANGUAGE,
      },
      message,
    );
  }
};

const endCall = (
  twiml: twilio.twiml.VoiceResponse,
  message: string,
  history: Content[],
): void => {
  twiml.say(
    {
      voice: CALL_CONFIG.VOICE,
      language: CALL_CONFIG.VOICE_LANGUAGE,
    },
    message,
  );

  twiml.hangup();

  console.log("📖 HISTORIAL:", history)
};

// ==============================
// SPEECH HELPERS
// ==============================

const normalizeSpeech = (speech: string): string => {
  return speech
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?¿¡]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const wantsToEndCall = (speech: string): boolean => {
  const normalized = normalizeSpeech(speech);

  const patterns = [
    /\badios\b/,
    /\bhasta luego\b/,
    /\bpuedes colgar\b/,
    /\bquiero colgar\b/,
    /\bterminar la llamada\b/,
    /\bno necesito nada mas\b/,
    /\beso es todo\b/,
  ];

  return patterns.some((pattern) => pattern.test(normalized));
};

// ==============================
// START CONVERSATION
// ==============================

export const startConversation = (): string => {
  const twiml = createResponse();

  listenToUser(
    twiml,
    INITIAL_STATE,
    "Hola, bienvenido. ¿En qué puedo ayudarte?",
  );

  return twiml.toString();
};

// ==============================
// HANDLE SILENCE
// ==============================

const handleSilence = (
  twiml: twilio.twiml.VoiceResponse,
  state: ConversationState,
  callSid:string
): void => {
  const nextState = incrementSilence(state);

  if (nextState.silenceCount >= CALL_CONFIG.MAX_SILENCES) {
    endCall(
      twiml,
      "No he recibido respuesta. Gracias por llamar. Hasta pronto.",
      getHistory(callSid),
    );

    return;
  }

  listenToUser(
    twiml,
    nextState,
    "Disculpa, no te escuché. ¿Puedes repetir tu pregunta?",
  );
};

// ==============================
// PROCESS CONVERSATION
// ==============================

export const processConversation = async (
  input: SpeechInput,
): Promise<string> => {
  const { callSid, speechResult, state } = input;

  const twiml = createResponse();

  console.info("🎤 Processing conversation", {
    callSid,
    turnCount: state.turnCount,
    silenceCount: state.silenceCount,
    speechResult,
  });

  // 1. SILENCE
  if (!speechResult) {
    handleSilence(twiml, state, callSid);
    return twiml.toString();
  }

  // 2. GOODBYE
  if (wantsToEndCall(speechResult)) {
    endCall(
      twiml,
      "Gracias por comunicarte con nosotros. Que tengas un excelente día.",
      getHistory(callSid),
    );

    return twiml.toString();
  }

  // 3. TURN LIMIT
  if (state.turnCount >= CALL_CONFIG.MAX_TURNS) {
    endCall(
      twiml,
      "Hemos llegado al límite de esta conversación. Gracias por llamar.",
      getHistory(callSid),
    );

    return twiml.toString();
  }

  // 4. AI PROCESSING
  try {
    const history = getHistory(callSid);

    const aiResponse = await respondUser(speechResult, history);

    if (!aiResponse.trim()) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    // 5. SAVE CONVERSATION HISTORY
    addExchange(callSid, speechResult, aiResponse);

    // 6. INCREMENT TURN
    const nextState = incrementTurn(state);

    console.info("✅ AI response", {
      callSid,
      turnCount: nextState.turnCount,
      historyLength: getHistory(callSid).length,
    });

    // 7. RESPOND AND LISTEN AGAIN
    listenToUser(twiml, nextState, aiResponse.trim());
  } catch (error) {
    console.error("❌ Conversation error", {
      callSid,
      error,
    });

    listenToUser(
      twiml,
      {
        ...state,
        silenceCount: 0,
      },
      "Disculpa, tuve un inconveniente al procesar tu pregunta. ¿Puedes repetirla?",
    );
  }

  return twiml.toString();
};
