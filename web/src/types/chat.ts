export type MessageRole = "user" | "assistant";

export interface MessageContent {
  role: MessageRole;
  text: string;
  documentName?: string;
  documentId?: string;
}

export interface Message {
  content: MessageContent;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
