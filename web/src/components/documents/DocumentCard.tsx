import { Document } from "@/types/document";
import { Download, Trash2 } from "lucide-react";

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  return (
    <div className="bg-white p-6 border-1 border-gray-100 rounded-lg">
      <div className="flex items-start space-x-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {document.name}
          </h3>
          <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
            <span>{new Date(document.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{(document.size / 1024).toFixed(1)} KB</span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            onClick={() => onDelete(document.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
