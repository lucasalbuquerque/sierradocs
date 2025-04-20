interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="rounded-lg border-stone-900 border p-4 fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-black">
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-gray-300 hover:bg-gray-900 cursor-pointer">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSend()}
            placeholder="Type your message..."
            className="w-full rounded-lg px-4 py-2 text-white focus:outline-none"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={onSend}
          disabled={isLoading}
          className="rounded-lg p-2 text-white hover:bg-gray-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
