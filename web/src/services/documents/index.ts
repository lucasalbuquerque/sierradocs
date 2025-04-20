import api from "../api";
import { AISearchResult, Document } from "./types";

export async function listDocuments(): Promise<Document[]> {
  const response = await api.get<Document[]>("/documents");
  return response.data;
}

export async function uploadDocuments(files: File[]): Promise<Document[]> {
  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post<Document[]>("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteDocument(id: string): Promise<void> {
  await api.delete(`/documents/${id}`);
}

export async function searchDocuments(query: string): Promise<Document[]> {
  const response = await api.get<Document[]>("/documents/search", {
    params: { query },
  });
  return response.data;
}

export async function semanticSearch(
  query: string,
  limit = 5
): Promise<AISearchResult[]> {
  const response = await api.get<AISearchResult[]>(
    "/documents/semantic-search",
    {
      params: { query, limit },
    }
  );
  return response.data;
}

export async function askQuestion(query: string): Promise<AISearchResult> {
  const response = await api.get<AISearchResult>("/documents/ask", {
    params: { query },
  });
  return response.data;
}

export const documentsService = {
  upload: uploadDocuments,
  delete: deleteDocument,
  search: searchDocuments,
  list: listDocuments,
  semanticSearch,
  askQuestion,
};
