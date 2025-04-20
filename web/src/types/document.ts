export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
}

export interface DocumentState {
  documents: Document[];
  isSearching: boolean;
  searchQuery: string;
  error: string | null;
}
