import {
  SignupUseCase,
  SignupCredentials,
  AuthResponse,
  UserSession,
  ValidationResult,
  ValidationRules,
  AuthRepository,
} from '../types/auth.types';

export class SignupUseCaseImpl implements SignupUseCase {
  constructor(private authRepository: AuthRepository) {}

  private validateCredentials(credentials: SignupCredentials): ValidationResult {
    const rules: ValidationRules = {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, // At least 1 uppercase, 1 lowercase, 1 number, 1 special char
      },
      name: {
        minLength: 2,
        maxLength: 50,
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
    } else if (credentials.password.length < (rules.password.minLength || 8)) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!rules.password.pattern?.test(credentials.password)) {
      errors.password = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character';
    }

    // Confirm password validation
    if (!credentials.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Name validation (if provided)
    if (credentials.name) {
      if (credentials.name.length < (rules.name.minLength || 2)) {
        errors.name = 'Name must be at least 2 characters long';
      } else if (credentials.name.length > (rules.name.maxLength || 50)) {
        errors.name = 'Name must be less than 50 characters long';
      }
    }

    // Terms acceptance validation
    if (!credentials.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async execute(credentials: SignupCredentials): Promise<AuthResponse<UserSession>> {
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

      // Attempt signup
      const response = await this.authRepository.signup(credentials);
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SIGNUP_ERROR',
          message: error instanceof Error ? error.message : 'Signup failed',
        },
      };
    }
  }
}