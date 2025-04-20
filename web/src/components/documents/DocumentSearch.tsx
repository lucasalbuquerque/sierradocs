import { Loader2, Search } from "lucide-react";

interface DocumentSearchProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function DocumentSearch({ onSearch, isSearching }: DocumentSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search documents..."
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
        onChange={(e) => onSearch(e.target.value)}
      />
      {isSearching && (
        <Loader2 className="absolute right-3 top-3.5 animate-spin h-5 w-5 text-gray-400" />
      )}
    </div>
  );
}
