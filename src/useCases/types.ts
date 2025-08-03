import { AppDispatch, RootState } from '../store';

// Base use case interface
export interface BaseUseCase {
  execute(...args: any[]): Promise<any> | any;
}

// Use case context provides access to Redux store and repositories
export interface UseCaseContext {
  dispatch: AppDispatch;
  getState: () => RootState;
  repositories: Record<string, any>;
}

// Screen-specific use case interface
export interface ScreenUseCase extends BaseUseCase {
  // Screen initialization
  initialize?(): Promise<void> | void;
  
  // Screen cleanup
  cleanup?(): Promise<void> | void;
  
  // Navigation handlers
  onFocus?(): Promise<void> | void;
  onBlur?(): Promise<void> | void;
}

// Common use case result types
export interface UseCaseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

// Async operation states
export interface AsyncUseCaseState {
  loading: boolean;
  error: string | null;
  lastExecuted?: Date;
}

// Use case factory type
export type UseCaseFactory<T extends BaseUseCase> = (context: UseCaseContext) => T;