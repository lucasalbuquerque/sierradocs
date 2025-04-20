import { Message as MessageType } from "@/types/chat";
import { UserCircle } from "lucide-react";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.content.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`rounded-lg p-4 max-w-[85%] ${
          isUser
            ? "bg-black border-stone-900 border text-white rounded-br-none"
            : "bg-white text-black rounded-bl-none shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          {!isUser && (
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-8 w-8 rounded-full bg-black border-stone-900 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="whitespace-pre-wrap">{message.content.text}</div>
          </div>

          {isUser && (
            <div className="flex-shrink-0 mt-0.5">
              <UserCircle className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
