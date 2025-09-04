import * as SecureStore from 'expo-secure-store';
import { CacheStorage } from '../../../shared/types/database.types';

export interface SecureCacheOptions {
  requireAuthentication?: boolean;
  authenticationPrompt?: string;
  keychainService?: string;
}

export class SecureCache implements CacheStorage {
  private prefix: string;
  private options: SecureCacheOptions;

  constructor(prefix: string = 'secure_cache_', options: SecureCacheOptions = {}) {
    this.prefix = prefix;
    this.options = {
      requireAuthentication: false,
      authenticationPrompt: 'Authenticate to access secure data',
      keychainService: 'com.expo.app',
      ...options,
    };
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private getSecureStoreOptions() {
    return {
      requireAuthentication: this.options.requireAuthentication || false,
      authenticationPrompt: this.options.authenticationPrompt,
      keychainService: this.options.keychainService,
    };
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(
        this.getKey(key),
        this.getSecureStoreOptions()
      );
      return value;
    } catch (error) {
      console.error('SecureCache getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        this.getKey(key),
        value,
        this.getSecureStoreOptions()
      );
    } catch (error) {
      console.error('SecureCache setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(
        this.getKey(key),
        this.getSecureStoreOptions()
      );
    } catch (error) {
      console.error('SecureCache removeItem error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      // SecureStore doesn't have a bulk clear method, so we need to track keys
      const keysToRemove = await this.getAllKeys();
      await Promise.all(
        keysToRemove.map(key => this.removeItem(key))
      );
    } catch (error) {
      console.error('SecureCache clear error:', error);
      throw error;
    }
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error('SecureCache setObject error:', error);
      throw error;
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('SecureCache getObject error:', error);
      return null;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      console.error('SecureCache has error:', error);
      return false;
    }
  }

  // Note: SecureStore doesn't provide a way to list all keys
  // This implementation maintains a separate key registry for tracking
  private keyRegistryKey = 'key_registry';

  async getAllKeys(): Promise<string[]> {
    try {
      const registry = await this.getObject<string[]>(this.keyRegistryKey);
      return registry || [];
    } catch (error) {
      console.error('SecureCache getAllKeys error:', error);
      return [];
    }
  }

  private async addKeyToRegistry(key: string): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      if (!keys.includes(key)) {
        keys.push(key);
        await this.setObject(this.keyRegistryKey, keys);
      }
    } catch (error) {
      console.error('SecureCache addKeyToRegistry error:', error);
    }
  }

  private async removeKeyFromRegistry(key: string): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      const filteredKeys = keys.filter(k => k !== key);
      await this.setObject(this.keyRegistryKey, filteredKeys);
    } catch (error) {
      console.error('SecureCache removeKeyFromRegistry error:', error);
    }
  }

  // Override setItem to maintain key registry
  async setItemWithRegistry(key: string, value: string): Promise<void> {
    await this.setItem(key, value);
    await this.addKeyToRegistry(key);
  }

  // Override removeItem to maintain key registry
  async removeItemWithRegistry(key: string): Promise<void> {
    await this.removeItem(key);
    await this.removeKeyFromRegistry(key);
  }

  // Token-specific methods for auth
  async setAccessToken(token: string): Promise<void> {
    await this.setItemWithRegistry('access_token', token);
  }

  async getAccessToken(): Promise<string | null> {
    return this.getItem('access_token');
  }

  async setRefreshToken(token: string): Promise<void> {
    await this.setItemWithRegistry('refresh_token', token);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.getItem('refresh_token');
  }

  async setUserSession(session: any): Promise<void> {
    await this.setObject('user_session', session);
    await this.addKeyToRegistry('user_session');
  }

  async getUserSession<T>(): Promise<T | null> {
    return this.getObject<T>('user_session');
  }

  async clearAuthData(): Promise<void> {
    const authKeys = ['access_token', 'refresh_token', 'user_session', 'mfa_token'];
    await Promise.all(
      authKeys.map(key => this.removeItemWithRegistry(key))
    );
  }
}

// Global instance for use across the app
export const secureCache = new SecureCache('auth_secure_');