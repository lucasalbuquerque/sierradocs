import { Message as MessageType } from "@/types/chat";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`inline-block p-3 rounded-lg max-w-[80%] text-sm ${
          message.role === "user"
            ? "border border-stone-900 text-white"
            : "bg-white text-black"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
