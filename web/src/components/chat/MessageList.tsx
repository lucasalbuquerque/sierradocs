import { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { Message as MessageComponent } from "./Message";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if there's already a streaming message
  const hasStreamingMessage = messages.some(
    (message) => message.content.isStreaming
  );

  return (
    <div className="space-y-4 mb-4 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageComponent key={message.id || index} message={message} />
      ))}
      {isLoading && !hasStreamingMessage && (
        <div className="flex justify-start">
          <div className="inline-block p-3 rounded-lg bg-white text-black text-sm">
            <div className="flex gap-2">
              <div className="animate-bounce">.</div>
              <div className="animate-bounce delay-100">.</div>
              <div className="animate-bounce delay-200">.</div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
