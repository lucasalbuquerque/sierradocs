import { useState, useCallback } from "react";
import { Document, DocumentState } from "@/types/document";

export function useDocuments() {
  const [documentState, setDocumentState] = useState<DocumentState>({
    documents: [],
    isSearching: false,
    searchQuery: "",
    error: null,
  });

  const addDocuments = useCallback((files: File[]) => {
    const newDocs = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
    }));

    setDocumentState((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocs],
    }));
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocumentState((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }));
  }, []);

  const searchDocuments = useCallback((query: string) => {
    setDocumentState((prev) => ({
      ...prev,
      searchQuery: query,
      isSearching: true,
    }));

    // Simulate API delay
    setTimeout(() => {
      setDocumentState((prev) => ({
        ...prev,
        isSearching: false,
      }));
    }, 500);
  }, []);

  const filteredDocuments = documentState.documents.filter((doc) =>
    doc.name.toLowerCase().includes(documentState.searchQuery.toLowerCase())
  );

  return {
    ...documentState,
    filteredDocuments,
    addDocuments,
    deleteDocument,
    searchDocuments,
  };
}
