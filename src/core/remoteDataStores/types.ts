// Base types for remote data store operations

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// Base remote data store interface
export interface BaseRemoteDataStore {
  get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

// Network status
export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
}