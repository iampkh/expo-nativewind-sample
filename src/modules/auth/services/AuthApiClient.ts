import { AuthApiClient } from '../types/auth.types';

export class HttpAuthApiClient implements AuthApiClient {
  private baseUrl: string;
  private timeout: number;
  
  constructor(baseUrl: string, timeout: number = 10000) {
    // Use your actual IP address here - replace with your local IP
    // You can find it with: ifconfig (Mac/Linux) or ipconfig (Windows)
    this.baseUrl = baseUrl || 'http://192.168.1.100:3001/api/auth';
    this.timeout = timeout;
  }
  
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP Error: ${response.status}`);
      }
      
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }
  
  async put<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    });
  }
  
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}