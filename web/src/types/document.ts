export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: Date;
}

export interface DocumentState {
  documents: Document[];
  isSearching: boolean;
  searchQuery: string;
  error: string | null;
}
