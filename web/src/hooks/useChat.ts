import { useState, useCallback } from "react";
import { Message, ChatState } from "@/types/chat";

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
        messages: [...prev.messages, { role: "user", content }],
      }));

      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          messages: [
            ...prev.messages,
            {
              role: "assistant",
              content:
                "This is a placeholder response. The actual API integration will be implemented later.",
            },
          ],
        }));
      } catch (error) {
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "An error occurred",
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
