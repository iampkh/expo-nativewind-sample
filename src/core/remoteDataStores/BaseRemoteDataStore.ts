import { BaseRemoteDataStore, ApiResponse, RequestConfig } from './types';

export class HttpRemoteDataStore implements BaseRemoteDataStore {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...config?.headers };
    const timeout = config?.timeout || 10000;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const requestInit: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (data && method !== 'GET') {
        requestInit.body = JSON.stringify(data);
      }

      // Add query params for GET requests
      if (config?.params && method === 'GET') {
        const searchParams = new URLSearchParams(config.params);
        const separator = url.includes('?') ? '&' : '?';
        const finalUrl = `${url}${separator}${searchParams.toString()}`;
      }

      const response = await fetch(url, requestInit);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`) as any;
        error.statusCode = response.status;
        error.details = errorData;
        throw error;
      }

      const responseData = await response.json();
      
      return {
        data: responseData.data || responseData,
        message: responseData.message,
        success: true,
        statusCode: response.status,
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout') as any;
        timeoutError.statusCode = 408;
        throw timeoutError;
      }

      if (error.statusCode) {
        throw error;
      }

      const networkError = new Error(error.message || 'Network error occurred') as any;
      networkError.statusCode = 0;
      networkError.details = error;
      throw networkError;
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

