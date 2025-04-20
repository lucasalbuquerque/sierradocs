import { Message } from "@/types/chat";
import { UserCircle } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  console.log("message", message);
  const isUser = message.content.role === "user";
  const messageContent = message.content.text;

  // Check if there's a source to display
  const hasSource =
    message.content.documentName && message.content.role === "assistant";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-800 text-white rounded-bl-none"
        }`}
      >
        <div className="flex items-start gap-3">
          {!isUser && (
            <div className="flex-shrink-0 mt-1">
              <div className="h-8 w-8 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="whitespace-pre-wrap">{messageContent}</div>

            {hasSource && (
              <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                Source:{" "}
                <span className="font-medium">
                  {message.content.documentName}
                </span>
              </div>
            )}
          </div>

          {isUser && (
            <div className="flex-shrink-0 mt-1">
              <UserCircle className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
