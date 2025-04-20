"use client";

import { useState } from "react";
import { useSseChat } from "@/hooks/useSseChat";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

export default function AIAssistantPage() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, isLoading, error, sendMessage } = useSseChat();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage("");
    await sendMessage(message);
  };

  return (
    <div className="container mx-auto mt-8 mb-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-white">
            AI Document Assistant
          </h1>
          <p className="text-gray-500">
            Ask questions about your documents and get instant answers
          </p>
        </div>

        <div className="rounded-lg p-6 mb-6 min-h-[400px] flex flex-col">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow py-12 text-center">
              <div className="mb-4 p-4 rounded-full bg-black border-white border">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                How can I help you?
              </h3>
              <p className="text-gray-400 max-w-md">
                Ask me anything about your uploaded documents. I can search for
                information, answer questions, and provide relevant sources.
              </p>
            </div>
          ) : (
            <MessageList messages={messages} isLoading={isLoading} />
          )}
        </div>

        {error && (
          <div className="text-red-500 bg-red-100 border border-red-300 rounded px-4 py-2 mb-4">
            {error}
          </div>
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
