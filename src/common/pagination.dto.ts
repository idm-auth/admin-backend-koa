export interface PaginationQuery {
  page?: number;
  limit?: number;
  filter?: string;
  sortBy?: string;
  descending?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}
