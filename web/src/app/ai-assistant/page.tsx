"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

export default function AIAssistantPage() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, isLoading, error, sendMessage } = useChat();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    await sendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <div className="container mx-auto mt-20">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            How can I help you today?
          </h1>
          <p className="text-gray-400 text-sm">
            Ask anything about the documents you've uploaded.
          </p>
        </div>
      </div>
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <MessageList messages={messages} isLoading={isLoading} />
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
