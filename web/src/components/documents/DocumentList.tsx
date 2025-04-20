import { Document } from "@/types/document";
import { File } from "lucide-react";
import { DocumentCard } from "./DocumentCard";

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <File className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-4 text-gray-500 text-lg">No documents uploaded yet</p>
        <p className="mt-2 text-gray-400 text-sm">
          Upload documents to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(documents) &&
          documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onDelete={onDelete} />
          ))}
      </div>
    </div>
  );
}
