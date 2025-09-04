import { secureCache } from '../../../core/storage/cache/SecureCache';
import {
  AuthRepository,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  UserSession,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshTokenRequest,
  AuthTokens,
  TokenValidationResult,
  User,
  GoogleOAuthCredentials,
  MFASetup,
  MFAVerification,
  AuthError,
  MFAToken,
} from '../types/auth.types';

export class AuthRepositoryImpl implements AuthRepository {
  private apiBaseUrl = 'http://10.0.2.2:3001/api/auth'; // Point to local auth service (Android emulator host)

  private async handleResponse<T>(response: Response): Promise<AuthResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || 'UNKNOWN_ERROR',
            message: data.error?.message || 'An error occurred',
            field: data.error?.field,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred',
        },
      };
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    body?: any,
    includeAuth: boolean = false
  ): Promise<AuthResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (includeAuth) {
        const accessToken = await secureCache.getAccessToken();
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred',
        },
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse<UserSession>> {
    // Transform credentials to match our API
    const loginData = {
      emailOrUsername: credentials.email,
      password: credentials.password,
    };
    
    const response = await this.makeRequest<any>('/login', 'POST', loginData);
    
    // If network error (server not running), provide mock data for demo@example.com
    if (!response.success && response.error?.code === 'NETWORK_ERROR' && 
        credentials.email === 'demo@example.com' && credentials.password === 'Test123!@#') {
      console.log('Server not available, using mock authentication for demo user');
      const mockSession = this.createMockUserSession();
      await this.saveSessionToCache(mockSession);
      return { success: true, data: mockSession };
    }
    
    if (response.success && response.data) {
      // Transform response to match UserSession interface
      const transformedSession = this.transformToUserSession(response.data);
      await this.saveSessionToCache(transformedSession);
      return { success: true, data: transformedSession };
    }
    
    return response;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse<UserSession>> {
    // Transform credentials to match our API
    const [firstName, lastName] = (credentials.name || '').split(' ');
    const signupData = {
      email: credentials.email,
      password: credentials.password,
      username: credentials.email.split('@')[0], // Use email prefix as username
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    };
    
    const response = await this.makeRequest<any>('/register', 'POST', signupData);
    
    if (response.success && response.data) {
      // Transform response to match UserSession interface
      const transformedSession = this.transformToUserSession(response.data);
      await this.saveSessionToCache(transformedSession);
      return { success: true, data: transformedSession };
    }
    
    return response;
  }

  async logout(): Promise<AuthResponse<boolean>> {
    try {
      // Get refresh token for logout
      const refreshToken = await secureCache.getRefreshToken();
      
      if (refreshToken) {
        // Call logout endpoint with refresh token
        await this.makeRequest<any>('/logout', 'POST', { refreshToken });
      }
      
      // Clear local cache regardless of API response
      await this.clearSessionFromCache();
      
      return { success: true, data: true };
    } catch (error) {
      // Even if API call fails, clear local cache
      await this.clearSessionFromCache();
      return { success: true, data: true };
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<AuthResponse<boolean>> {
    return this.makeRequest<boolean>('/forgot-password', 'POST', request);
  }

  async resetPassword(request: ResetPasswordRequest): Promise<AuthResponse<boolean>> {
    return this.makeRequest<boolean>('/reset-password', 'POST', request);
  }

  async changePassword(request: ChangePasswordRequest): Promise<AuthResponse<boolean>> {
    return this.makeRequest<boolean>('/change-password', 'POST', request, true);
  }

  async refreshTokens(request: RefreshTokenRequest): Promise<AuthResponse<AuthTokens>> {
    const response = await this.makeRequest<any>('/refresh', 'POST', request);
    
    if (response.success && response.data?.tokens) {
      // Transform tokens to match our interface
      const tokens: AuthTokens = {
        accessToken: response.data.tokens.accessToken,
        refreshToken: response.data.tokens.refreshToken,
        expiresIn: this.parseExpirationTime(response.data.tokens.expiresIn),
        tokenType: 'Bearer',
      };
      
      await this.saveTokensToCache(tokens);
      return { success: true, data: tokens };
    }
    
    return response;
  }

  async validateToken(token: string): Promise<AuthResponse<TokenValidationResult>> {
    const response = await this.makeRequest<any>('/validate', 'POST', {}, false);
    
    if (response.success && response.data?.user) {
      const result: TokenValidationResult = {
        isValid: true,
        user: this.transformUser(response.data.user),
        expiresAt: undefined, // Not provided by our API
      };
      return { success: true, data: result };
    }
    
    return {
      success: false,
      data: { isValid: false },
      error: response.error,
    };
  }

  async getCurrentUser(): Promise<AuthResponse<User>> {
    return this.makeRequest<User>('/me', 'GET', undefined, true);
  }

  async updateProfile(updates: Partial<User>): Promise<AuthResponse<User>> {
    const response = await this.makeRequest<User>('/profile', 'PUT', updates, true);
    
    if (response.success && response.data) {
      // Update user in cached session
      const session = await this.getSessionFromCache();
      if (session) {
        session.user = { ...session.user, ...response.data };
        await this.saveSessionToCache(session);
      }
    }
    
    return response;
  }

  async deleteAccount(): Promise<AuthResponse<boolean>> {
    const response = await this.makeRequest<boolean>('/delete-account', 'DELETE', {}, true);
    
    if (response.success) {
      await this.clearSessionFromCache();
    }
    
    return response;
  }

  // OAuth methods
  async loginWithGoogle(credentials: GoogleOAuthCredentials): Promise<AuthResponse<UserSession>> {
    const response = await this.makeRequest<UserSession>('/oauth/google', 'POST', credentials);
    
    if (response.success && response.data) {
      await this.saveSessionToCache(response.data);
    }
    
    return response;
  }

  // MFA methods
  async setupMFA(): Promise<AuthResponse<MFASetup>> {
    return this.makeRequest<MFASetup>('/mfa/setup', 'POST', {}, true);
  }

  async verifyMFA(verification: MFAVerification): Promise<AuthResponse<boolean>> {
    const response = await this.makeRequest<boolean>('/mfa/verify', 'POST', verification, true);
    
    if (response.success) {
      // Clear MFA token if verification succeeds
      await secureCache.removeItemWithRegistry('mfa_token');
    }
    
    return response;
  }

  async disableMFA(verification: MFAVerification): Promise<AuthResponse<boolean>> {
    return this.makeRequest<boolean>('/mfa/disable', 'POST', verification, true);
  }

  async generateBackupCodes(): Promise<AuthResponse<string[]>> {
    return this.makeRequest<string[]>('/mfa/backup-codes', 'POST', {}, true);
  }

  // Private cache management methods
  private async saveSessionToCache(session: UserSession): Promise<void> {
    try {
      await secureCache.setUserSession(session);
      await secureCache.setAccessToken(session.tokens.accessToken);
      await secureCache.setRefreshToken(session.tokens.refreshToken);
    } catch (error) {
      console.error('Failed to save session to cache:', error);
    }
  }

  private async getSessionFromCache(): Promise<UserSession | null> {
    try {
      return await secureCache.getUserSession<UserSession>();
    } catch (error) {
      console.error('Failed to get session from cache:', error);
      return null;
    }
  }

  private async saveTokensToCache(tokens: AuthTokens): Promise<void> {
    try {
      await secureCache.setAccessToken(tokens.accessToken);
      await secureCache.setRefreshToken(tokens.refreshToken);
      
      // Update tokens in session
      const session = await this.getSessionFromCache();
      if (session) {
        session.tokens = tokens;
        session.lastActivity = new Date().toISOString();
        await secureCache.setUserSession(session);
      }
    } catch (error) {
      console.error('Failed to save tokens to cache:', error);
    }
  }

  private async clearSessionFromCache(): Promise<void> {
    try {
      await secureCache.clearAuthData();
    } catch (error) {
      console.error('Failed to clear session from cache:', error);
    }
  }

  // Public cache management methods for use by other components
  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getSessionFromCache();
      const accessToken = await secureCache.getAccessToken();
      return !!(session?.isAuthenticated && accessToken);
    } catch (error) {
      return false;
    }
  }

  async getStoredSession(): Promise<UserSession | null> {
    return this.getSessionFromCache();
  }

  async getStoredTokens(): Promise<AuthTokens | null> {
    try {
      const accessToken = await secureCache.getAccessToken();
      const refreshToken = await secureCache.getRefreshToken();
      
      if (!accessToken || !refreshToken) {
        return null;
      }

      const session = await this.getSessionFromCache();
      return session?.tokens || null;
    } catch (error) {
      console.error('Failed to get stored tokens:', error);
      return null;
    }
  }

  async saveMFAToken(token: MFAToken): Promise<void> {
    try {
      // Use setObject which automatically handles JSON serialization
      // Then use setItemWithRegistry for the registry management
      const tokenJson = JSON.stringify(token);
      await secureCache.setItemWithRegistry('mfa_token', tokenJson);
    } catch (error) {
      console.error('Failed to save MFA token:', error);
      throw error;
    }
  }

  async getMFAToken(): Promise<MFAToken | null> {
    try {
      return await secureCache.getObject<MFAToken>('mfa_token');
    } catch (error) {
      console.error('Failed to get MFA token:', error);
      return null;
    }
  }

  async clearMFAToken(): Promise<void> {
    try {
      await secureCache.removeItemWithRegistry('mfa_token');
    } catch (error) {
      console.error('Failed to clear MFA token:', error);
    }
  }

  // Token refresh logic
  async refreshTokensAutomatically(): Promise<AuthResponse<AuthTokens>> {
    try {
      const refreshToken = await secureCache.getRefreshToken();
      
      if (!refreshToken) {
        return {
          success: false,
          error: {
            code: 'NO_REFRESH_TOKEN',
            message: 'No refresh token available',
          },
        };
      }

      return this.refreshTokens({ refreshToken });
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REFRESH_ERROR',
          message: error instanceof Error ? error.message : 'Token refresh failed',
        },
      };
    }
  }

  // Mock user session for development when server is not available
  private createMockUserSession(): UserSession {
    const user: User = {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Demo User',
      avatar: undefined,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tokens: AuthTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 900, // 15 minutes
      tokenType: 'Bearer',
    };

    return {
      user,
      tokens,
      isAuthenticated: true,
      loginMethod: 'email',
      mfaEnabled: false,
      sessionId: `mock-session-${Date.now()}`,
      lastActivity: new Date().toISOString(),
    };
  }

  // Helper methods for data transformation
  private transformUser(authUser: any): User {
    if (!authUser || typeof authUser !== 'object') {
      throw new Error('Invalid user data received from server');
    }

    return {
      id: authUser.id,
      email: authUser.email,
      name: [authUser.firstName, authUser.lastName].filter(Boolean).join(' ') || authUser.username || authUser.email,
      avatar: authUser.profile?.avatar || undefined,
      emailVerified: authUser.isEmailVerified || false,
      createdAt: authUser.createdAt,
      updatedAt: authUser.updatedAt || authUser.createdAt,
    };
  }

  private transformToUserSession(responseData: any): UserSession {
    if (!responseData || typeof responseData !== 'object') {
      throw new Error('Invalid session data received from server');
    }

    const authUser = responseData.user;
    const authTokens = responseData.tokens;

    if (!authUser || !authTokens) {
      throw new Error('Missing user or token data in server response');
    }

    const user = this.transformUser(authUser);

    const tokens: AuthTokens = {
      accessToken: authTokens.accessToken,
      refreshToken: authTokens.refreshToken,
      expiresIn: this.parseExpirationTime(authTokens.expiresIn || '15m'),
      tokenType: 'Bearer',
    };

    return {
      user,
      tokens,
      isAuthenticated: true,
      loginMethod: 'email',
      mfaEnabled: false, // TODO: Add MFA support when implemented
      sessionId: `session_${Date.now()}`,
      lastActivity: new Date().toISOString(),
    };
  }

  private parseExpirationTime(expiresIn: string): number {
    // Convert "15m" to seconds
    const match = expiresIn.match(/^(\d+)([mhd])$/);
    if (!match) return 900; // Default 15 minutes

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 900;
    }
  }
}