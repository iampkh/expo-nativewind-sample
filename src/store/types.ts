// Common types for Redux state management

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AsyncState {
  loading: boolean;
  error: string | null;
}

export interface PaginatedState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface AsyncSliceState<T> extends AsyncState {
  data: T;
  initialized: boolean;
}

export interface ListSliceState<T> extends AsyncState, PaginatedState {
  items: T[];
  selectedItems: string[];
}

// Generic action types
export interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateParams<T> {
  data: Omit<T, keyof BaseEntity>;
}

export interface UpdateParams<T> {
  id: string;
  data: Partial<Omit<T, keyof BaseEntity>>;
}

export interface DeleteParams {
  id: string;
}