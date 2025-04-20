export type MessageRole = "user" | "assistant";

export interface MessageContent {
  role: MessageRole;
  text: string;
  documentName?: string;
  documentId?: string;
  isStreaming?: boolean;
}

export interface Message {
  id?: string;
  content: MessageContent;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
