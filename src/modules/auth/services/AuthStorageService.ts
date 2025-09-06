import { localCache } from '@/src/core/storage/cache/LocalCache';
import { AuthStorage, UserSession, AuthTokens, MFAToken } from '../types/auth.types';

export class LocalAuthStorage implements AuthStorage {
  private static readonly KEYS = {
    SESSION: 'auth_session',
    TOKENS: 'auth_tokens',
    MFA_TOKEN: 'auth_mfa_token',
  };
  
  async saveSession(session: UserSession): Promise<void> {
    try {
      await localCache.setObject(LocalAuthStorage.KEYS.SESSION, session);
    } catch (error) {
      console.error('Failed to save session:', error);
      throw new Error('Failed to save authentication session');
    }
  }
  
  async getSession(): Promise<UserSession | null> {
    try {
      const session = await localCache.getObject<UserSession>(LocalAuthStorage.KEYS.SESSION);
      return session;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }
  
  async clearSession(): Promise<void> {
    try {
      await Promise.all([
        localCache.removeItem(LocalAuthStorage.KEYS.SESSION),
        localCache.removeItem(LocalAuthStorage.KEYS.TOKENS),
        localCache.removeItem(LocalAuthStorage.KEYS.MFA_TOKEN),
      ]);
    } catch (error) {
      console.error('Failed to clear session:', error);
      // Don't throw error here as clearing should always succeed from user perspective
    }
  }
  
  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      await localCache.setObject(LocalAuthStorage.KEYS.TOKENS, tokens);
    } catch (error) {
      console.error('Failed to save tokens:', error);
      throw new Error('Failed to save authentication tokens');
    }
  }
  
  async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokens = await localCache.getObject<AuthTokens>(LocalAuthStorage.KEYS.TOKENS);
      return tokens;
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return null;
    }
  }
  
  async clearTokens(): Promise<void> {
    try {
      await localCache.removeItem(LocalAuthStorage.KEYS.TOKENS);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }
  
  async saveMFAToken(token: MFAToken): Promise<void> {
    try {
      await localCache.setObject(LocalAuthStorage.KEYS.MFA_TOKEN, token);
    } catch (error) {
      console.error('Failed to save MFA token:', error);
      throw new Error('Failed to save MFA token');
    }
  }
  
  async getMFAToken(): Promise<MFAToken | null> {
    try {
      const token = await localCache.getObject<MFAToken>(LocalAuthStorage.KEYS.MFA_TOKEN);
      return token;
    } catch (error) {
      console.error('Failed to get MFA token:', error);
      return null;
    }
  }
  
  async clearMFAToken(): Promise<void> {
    try {
      await localCache.removeItem(LocalAuthStorage.KEYS.MFA_TOKEN);
    } catch (error) {
      console.error('Failed to clear MFA token:', error);
    }
  }
}