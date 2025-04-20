export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  isProcessed: boolean;
  processedAt?: string;
}

export interface AISearchResult {
  documentId: string;
  documentName: string;
  content: string;
  score: number;
  answer?: string;
}
