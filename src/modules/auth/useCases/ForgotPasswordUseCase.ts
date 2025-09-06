import {
  ForgotPasswordUseCase,
  ForgotPasswordRequest,
  AuthResponse,
  ValidationResult,
  AuthRepository,
} from '../types/auth.types';

export class ForgotPasswordUseCaseImpl implements ForgotPasswordUseCase {
  constructor(private authRepository: AuthRepository) {}

  private validateRequest(request: ForgotPasswordRequest): ValidationResult {
    const errors: { [field: string]: string } = {};

    // Email validation
    if (!request.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
      errors.email = 'Please enter a valid email address';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async execute(request: ForgotPasswordRequest): Promise<AuthResponse<boolean>> {
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

      // Send forgot password request
      const response = await this.authRepository.forgotPassword(request);
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_ERROR',
          message: error instanceof Error ? error.message : 'Failed to send reset email',
        },
      };
    }
  }
}