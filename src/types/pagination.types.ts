export interface PaginatedResponse<T> {
  total: number;
  documents: T[];
}
