export interface BaseEntity {
  message?: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  PagesCount: number;
  total: number;
}

export interface PaginatedResponse<T> {
  message?: string;
  data: T[];
  meta: PaginatedMeta;
}
