export interface ConversationState {
  turnCount: number;
  silenceCount: number;
}

export interface SpeechInput {
  callSid: string;
  speechResult: string;
  state: ConversationState;
}