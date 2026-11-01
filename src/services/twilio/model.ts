import { CALL_CONFIG } from "@/config/twilio.config";
import { ConversationState } from "@shared-types/index";

const parseCounter = (
  value: unknown,
  fallback: number,
  max: number,
): number => {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    return fallback;
  }

  return Math.min(parsed, max);
};

export const getConversationState = (
  query: Record<string, unknown>,
): ConversationState => ({
  turnCount: parseCounter(query.turnCount, 0, CALL_CONFIG.MAX_TURNS),

  silenceCount: parseCounter(query.silenceCount, 0, CALL_CONFIG.MAX_SILENCES),
});

export const incrementTurn = (state: ConversationState): ConversationState => ({
  turnCount: state.turnCount + 1,
  silenceCount: 0,
});

export const incrementSilence = (
  state: ConversationState,
): ConversationState => ({
  ...state,
  silenceCount: state.silenceCount + 1,
});
