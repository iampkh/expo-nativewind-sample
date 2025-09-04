import {
  LoginUseCase,
  LoginCredentials,
  AuthResponse,
  UserSession,
  ValidationResult,
  ValidationRules,
  AuthRepository,
} from '../types/auth.types';

export class LoginUseCaseImpl implements LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  private validateCredentials(credentials: LoginCredentials): ValidationResult {
    const rules: ValidationRules = {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 6,
      },
    };

    const errors: { [field: string]: string } = {};

    // Email validation
    if (!credentials.email) {
      errors.email = 'Email is required';
    } else if (!rules.email.pattern?.test(credentials.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!credentials.password) {
      errors.password = 'Password is required';
    } else if (credentials.password.length < (rules.password.minLength || 6)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async execute(credentials: LoginCredentials): Promise<AuthResponse<UserSession>> {
    try {
      // Validate input
      const validation = this.validateCredentials(credentials);
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

      // Attempt login
      const response = await this.authRepository.login(credentials);
      
      if (!response.success) {
        return response;
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: error instanceof Error ? error.message : 'Login failed',
        },
      };
    }
  }
}