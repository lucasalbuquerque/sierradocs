"use client";

import { useState, useEffect } from "react";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { DocumentSearch } from "@/components/documents/DocumentSearch";
import { Document } from "@/services/documents/types";
import {
  uploadDocuments,
  deleteDocument,
  searchDocuments,
  listDocuments,
} from "@/services/documents";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await listDocuments();
      setDocuments(data ?? []);
      setError(null);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to fetch documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (files: File[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const newDocs = await uploadDocuments(files);
      setDocuments((prev) => [...(prev ?? []), ...(newDocs ?? [])]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload documents"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await searchDocuments(query);
      setDocuments(results ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search documents"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteDocument(id);
      setDocuments((prev) => (prev ?? []).filter((doc) => doc?.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete document"
      );
    }
  };

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
              <DocumentSearch onSearch={handleSearch} isSearching={isLoading} />
              <DocumentUpload onDrop={handleUpload} />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <DocumentList documents={documents} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}
