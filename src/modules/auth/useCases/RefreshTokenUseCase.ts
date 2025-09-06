import {
  RefreshTokenUseCase,
  AuthResponse,
  AuthTokens,
  AuthRepository,
} from '../types/auth.types';

export class RefreshTokenUseCaseImpl implements RefreshTokenUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<AuthResponse<AuthTokens>> {
    try {
      // Get the refresh token from secure storage via repository
      const storedTokens = await this.authRepository.getStoredTokens();
      
      if (!storedTokens?.refreshToken) {
        return {
          success: false,
          error: {
            code: 'NO_REFRESH_TOKEN',
            message: 'No refresh token available. Please login again.',
          },
        };
      }

      // Attempt to refresh tokens
      const response = await this.authRepository.refreshTokens({
        refreshToken: storedTokens.refreshToken,
      });

      if (!response.success) {
        // If refresh fails, clear stored tokens
        await this.authRepository.logout();
        return {
          success: false,
          error: {
            code: 'REFRESH_FAILED',
            message: 'Session expired. Please login again.',
          },
        };
      }

      return response;
    } catch (error) {
      // Clear stored tokens on any error
      await this.authRepository.logout();
      
      return {
        success: false,
        error: {
          code: 'REFRESH_ERROR',
          message: error instanceof Error ? error.message : 'Token refresh failed',
        },
      };
    }
  }

  // Helper method to check if token needs refresh
  async shouldRefreshToken(): Promise<boolean> {
    try {
      const storedTokens = await this.authRepository.getStoredTokens();
      
      if (!storedTokens) {
        return false;
      }

      // Check if token is close to expiry (refresh if less than 5 minutes remaining)
      const expiryTime = new Date().getTime() + (storedTokens.expiresIn * 1000);
      const fiveMinutesFromNow = new Date().getTime() + (5 * 60 * 1000);
      
      return expiryTime < fiveMinutesFromNow;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return false;
    }
  }
}