export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  isProcessed: boolean;
  processedAt?: Date;
}

export interface AISearchResult {
  documentId: string;
  documentName: string;
  content: string;
  score: number;
  answer?: string;
}
