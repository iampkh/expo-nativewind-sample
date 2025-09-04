import {
  MFASetupUseCase,
  AuthResponse,
  MFASetup,
  AuthRepository,
} from '../types/auth.types';

export class MFASetupUseCaseImpl implements MFASetupUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<AuthResponse<MFASetup>> {
    try {
      // Check if user is authenticated
      const isAuthenticated = await this.authRepository.isAuthenticated();
      
      if (!isAuthenticated) {
        return {
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'You must be logged in to set up MFA',
          },
        };
      }

      // Get MFA setup information from backend
      const response = await this.authRepository.setupMFA();

      if (!response.success || !response.data) {
        return response;
      }

      // Validate the setup data
      if (!response.data.secret || !response.data.qrCode) {
        return {
          success: false,
          error: {
            code: 'INVALID_MFA_SETUP',
            message: 'Invalid MFA setup data received',
          },
        };
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MFA_SETUP_ERROR',
          message: error instanceof Error ? error.message : 'Failed to set up MFA',
        },
      };
    }
  }

  // Helper method to generate backup codes
  async generateBackupCodes(): Promise<AuthResponse<string[]>> {
    try {
      const isAuthenticated = await this.authRepository.isAuthenticated();
      
      if (!isAuthenticated) {
        return {
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'You must be logged in to generate backup codes',
          },
        };
      }

      return await this.authRepository.generateBackupCodes();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BACKUP_CODES_ERROR',
          message: error instanceof Error ? error.message : 'Failed to generate backup codes',
        },
      };
    }
  }

  // Helper method to validate TOTP secret format
  private isValidTOTPSecret(secret: string): boolean {
    // TOTP secrets are typically base32 encoded
    const base32Regex = /^[A-Z2-7]+=*$/;
    return base32Regex.test(secret) && secret.length >= 16;
  }

  // Helper method to validate QR code format
  private isValidQRCode(qrCode: string): boolean {
    // QR codes for TOTP typically start with "otpauth://totp/"
    return qrCode.startsWith('otpauth://totp/') || qrCode.startsWith('data:image/');
  }
}