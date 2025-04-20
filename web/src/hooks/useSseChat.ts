import { useState, useCallback, useEffect } from "react";
import { Message, ChatState } from "@/types/chat";

interface SseEvent {
  type: string;
  content?: string;
  documents?: any[];
  message?: string;
  result?: any;
}

export function useSseChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // Cleanup event source on unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || chatState.isLoading) return;

      // Close any existing event source
      if (eventSource) {
        eventSource.close();
      }

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
        // Create a placeholder message for the assistant's response
        const assistantMessageId = Date.now().toString();
        setChatState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: assistantMessageId,
              content: {
                role: "assistant",
                text: "",
                isStreaming: true,
              },
            },
          ],
        }));

        // Create SSE connection
        const encodedQuery = encodeURIComponent(content);
        const sse = new EventSource(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
          }/documents/ask/stream?query=${encodedQuery}`
        );
        setEventSource(sse);

        // Handle SSE events
        sse.onmessage = (event) => {
          const data: SseEvent = JSON.parse(event.data);

          switch (data.type) {
            case "status":
              // Update status if needed
              break;

            case "documents":
              // Store relevant documents if needed
              break;

            case "chunk":
              // Append content chunk to the current answer
              setChatState((prev) => {
                const updatedMessages = [...prev.messages];
                const assistantMessageIndex = updatedMessages.findIndex(
                  (msg) => msg.id === assistantMessageId
                );

                if (assistantMessageIndex !== -1) {
                  const assistantMessage =
                    updatedMessages[assistantMessageIndex];
                  updatedMessages[assistantMessageIndex] = {
                    ...assistantMessage,
                    content: {
                      ...assistantMessage.content,
                      text:
                        (assistantMessage.content.text || "") +
                        (data.content || ""),
                    },
                  };
                }

                return {
                  ...prev,
                  messages: updatedMessages,
                };
              });
              break;

            case "complete":
              // Final message with complete answer and document references
              setChatState((prev) => {
                const updatedMessages = [...prev.messages];
                const assistantMessageIndex = updatedMessages.findIndex(
                  (msg) => msg.id === assistantMessageId
                );

                if (assistantMessageIndex !== -1) {
                  updatedMessages[assistantMessageIndex] = {
                    id: assistantMessageId,
                    content: {
                      role: "assistant",
                      text: data.result.answer,
                      documentName: data.result.documentName,
                      documentId: data.result.documentId,
                      isStreaming: false,
                    },
                  };
                }

                return {
                  ...prev,
                  isLoading: false,
                  messages: updatedMessages,
                };
              });

              // Close connection
              sse.close();
              setEventSource(null);
              break;

            case "error":
              // Handle error
              setChatState((prev) => ({
                ...prev,
                isLoading: false,
                error: data.message || "An error occurred",
              }));

              // Close connection
              sse.close();
              setEventSource(null);
              break;
          }
        };

        sse.onerror = () => {
          setChatState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Connection error occurred",
          }));

          sse.close();
          setEventSource(null);
        };
      } catch (error) {
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "An error occurred while setting up the connection",
        }));
      }
    },
    [chatState.isLoading, eventSource]
  );

  return {
    ...chatState,
    sendMessage,
  };
}
