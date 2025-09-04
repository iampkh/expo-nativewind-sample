import {
  LogoutUseCase,
  AuthResponse,
  AuthRepository,
} from '../types/auth.types';

export class LogoutUseCaseImpl implements LogoutUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<AuthResponse<boolean>> {
    try {
      // Always attempt to logout, even if network fails
      const response = await this.authRepository.logout();
      
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      // Even if logout fails on the server, we consider it successful locally
      return {
        success: true,
        data: true,
      };
    }
  }
}