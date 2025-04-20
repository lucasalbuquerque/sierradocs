import { useState, useCallback } from "react";
import { Message, ChatState } from "@/types/chat";
import api from "@/services/api";

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || chatState.isLoading) return;

      setChatState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        messages: [
          ...prev.messages,
          {
            content: {
              role: "user",
              text: content,
            },
          },
        ],
      }));

      try {
        // Call backend AI assistant API
        const response = await api.get("/documents/ask", {
          params: { query: content },
        });

        // Create assistant message with response data
        const assistantMessage: Message = {
          content: {
            role: "assistant",
            text:
              response.data.answer ||
              "I couldn't find an answer to your question in the documents.",
            documentName: response.data.documentName,
            documentId: response.data.documentId,
          },
        };

        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          messages: [...prev.messages, assistantMessage],
        }));
      } catch (error) {
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching the answer",
        }));
      }
    },
    [chatState.isLoading]
  );

  return {
    ...chatState,
    sendMessage,
  };
}
