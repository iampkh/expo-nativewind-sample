import {
  ResetPasswordUseCase,
  ResetPasswordRequest,
  AuthResponse,
  ValidationResult,
  AuthRepository,
} from '../types/auth.types';

export class ResetPasswordUseCaseImpl implements ResetPasswordUseCase {
  constructor(private authRepository: AuthRepository) {}

  private validateRequest(request: ResetPasswordRequest): ValidationResult {
    const errors: { [field: string]: string } = {};

    // Token validation
    if (!request.token) {
      errors.token = 'Reset token is required';
    }

    // Password validation
    if (!request.password) {
      errors.password = 'New password is required';
    } else if (request.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(request.password)) {
      errors.password = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character';
    }

    // Confirm password validation
    if (!request.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (request.password !== request.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async execute(request: ResetPasswordRequest): Promise<AuthResponse<boolean>> {
    try {
      // Validate input
      const validation = this.validateRequest(request);
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

      // Reset password
      const response = await this.authRepository.resetPassword(request);
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'RESET_PASSWORD_ERROR',
          message: error instanceof Error ? error.message : 'Failed to reset password',
        },
      };
    }
  }
}