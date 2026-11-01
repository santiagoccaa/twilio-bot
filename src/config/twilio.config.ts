import { ConversationState } from "@shared-types/index";

export const CALL_CONFIG = {
  MAX_TURNS: 50, // 👈 Maximo de respuestas por parte de la IA
  MAX_SILENCES: 3, // 👈 Maximo de veces que la IA vuelve a preguntar la informacion

  VOICE: "Google.es-US-Chirp3-HD-Aoede", // 👈 VOz de la IA
  VOICE_LANGUAGE: "es-MX",
  SPEECH_LANGUAGE: "es-CO",

  GATHER_TIMEOUT: 6, // 👈 Minutos que el bot espera sin respuesta del usuario
  PROCESS_URL: "/twilio/process",
} as const;

export const INITIAL_STATE: ConversationState = {
  turnCount: 0,
  silenceCount: 0,
};
