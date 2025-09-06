import {
  MFAVerificationUseCase,
  MFAVerification,
  AuthResponse,
  ValidationResult,
  AuthRepository,
} from '../types/auth.types';

export class MFAVerificationUseCaseImpl implements MFAVerificationUseCase {
  constructor(private authRepository: AuthRepository) {}

  private validateVerification(verification: MFAVerification): ValidationResult {
    const errors: { [field: string]: string } = {};

    // Check if either code or backup code is provided
    if (!verification.code && !verification.backupCode) {
      errors.code = 'Please enter a verification code or backup code';
      return {
        isValid: false,
        errors,
      };
    }

    // Validate TOTP code format (6 digits)
    if (verification.code) {
      if (!/^\d{6}$/.test(verification.code)) {
        errors.code = 'Verification code must be 6 digits';
      }
    }

    // Validate backup code format (typically 8-10 characters alphanumeric)
    if (verification.backupCode) {
      if (verification.backupCode.length < 8 || verification.backupCode.length > 10) {
        errors.backupCode = 'Invalid backup code format';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async execute(verification: MFAVerification): Promise<AuthResponse<boolean>> {
    try {
      // Validate input
      const validation = this.validateVerification(verification);
      if (!validation.isValid) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Please correct the errors below',
            field: Object.keys(validation.errors)[0],
          },
        };
      }

      // Check if user is authenticated (has an active session or MFA token)
      const isAuthenticated = await this.authRepository.isAuthenticated();
      const mfaToken = await this.authRepository.getMFAToken();
      
      if (!isAuthenticated && !mfaToken) {
        return {
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required for MFA verification',
          },
        };
      }

      // Verify MFA code
      const response = await this.authRepository.verifyMFA(verification);

      if (!response.success) {
        // Check for specific error types
        if (response.error?.code === 'INVALID_CODE') {
          return {
            success: false,
            error: {
              code: 'INVALID_CODE',
              message: 'Invalid verification code. Please try again.',
            },
          };
        }

        if (response.error?.code === 'CODE_EXPIRED') {
          return {
            success: false,
            error: {
              code: 'CODE_EXPIRED',
              message: 'Verification code has expired. Please generate a new one.',
            },
          };
        }

        if (response.error?.code === 'BACKUP_CODE_USED') {
          return {
            success: false,
            error: {
              code: 'BACKUP_CODE_USED',
              message: 'This backup code has already been used.',
            },
          };
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MFA_VERIFICATION_ERROR',
          message: error instanceof Error ? error.message : 'MFA verification failed',
        },
      };
    }
  }

  // Helper method to disable MFA
  async disableMFA(verification: MFAVerification): Promise<AuthResponse<boolean>> {
    try {
      // Validate the verification first
      const validation = this.validateVerification(verification);
      if (!validation.isValid) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Please correct the errors below',
            field: Object.keys(validation.errors)[0],
          },
        };
      }

      // Check authentication
      const isAuthenticated = await this.authRepository.isAuthenticated();
      
      if (!isAuthenticated) {
        return {
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'You must be logged in to disable MFA',
          },
        };
      }

      // Disable MFA
      const response = await this.authRepository.disableMFA(verification);

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MFA_DISABLE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to disable MFA',
        },
      };
    }
  }

  // Helper method to check if MFA token is expired
  async isMFATokenExpired(): Promise<boolean> {
    try {
      const mfaToken = await this.authRepository.getMFAToken();
      
      if (!mfaToken) {
        return true;
      }

      const expiresAt = new Date(mfaToken.expiresAt);
      const now = new Date();

      return now >= expiresAt;
    } catch (error) {
      console.error('Error checking MFA token expiry:', error);
      return true;
    }
  }

  // Helper method to clear expired MFA token
  async clearExpiredMFAToken(): Promise<void> {
    try {
      const isExpired = await this.isMFATokenExpired();
      
      if (isExpired) {
        await this.authRepository.clearMFAToken();
      }
    } catch (error) {
      console.error('Error clearing expired MFA token:', error);
    }
  }
}