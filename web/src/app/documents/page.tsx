"use client";

import { useDocuments } from "@/hooks/useDocuments";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { DocumentSearch } from "@/components/documents/DocumentSearch";

export default function DocumentsPage() {
  const {
    filteredDocuments,
    isSearching,
    addDocuments,
    deleteDocument,
    searchDocuments,
  } = useDocuments();

  return (
    <div className="container mx-auto mt-10">
      <div className="bg-gray-50 rounded-4xl">
        <div className="p-10">
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
              <p className="mt-1 text-sm text-gray-500">
                Upload, manage and search your documents
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <DocumentSearch
                onSearch={searchDocuments}
                isSearching={isSearching}
              />
              <DocumentUpload onDrop={addDocuments} />
            </div>

            <DocumentList
              documents={filteredDocuments}
              onDelete={deleteDocument}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
