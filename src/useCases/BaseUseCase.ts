import { UseCaseContext, BaseUseCase, UseCaseResult, AsyncUseCaseState } from './types';

export abstract class AbstractBaseUseCase implements BaseUseCase {
  protected context: UseCaseContext;
  protected state: AsyncUseCaseState;

  constructor(context: UseCaseContext) {
    this.context = context;
    this.state = {
      loading: false,
      error: null,
    };
  }

  // Abstract method that concrete use cases must implement
  abstract execute(...args: any[]): Promise<any> | any;

  // Helper methods for common operations
  protected async executeWithState<T>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<UseCaseResult<T>> {
    try {
      this.setLoading(true);
      this.clearError();
      
      const data = await operation();
      
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      const errorMsg = errorMessage || error.message || 'An error occurred';
      this.setError(errorMsg);
      
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      this.setLoading(false);
      this.state.lastExecuted = new Date();
    }
  }

  protected setLoading(loading: boolean): void {
    this.state.loading = loading;
  }

  protected setError(error: string | null): void {
    this.state.error = error;
  }

  protected clearError(): void {
    this.state.error = null;
  }

  protected getRepository<T>(repositoryName: string): T {
    const repository = this.context.repositories[repositoryName];
    if (!repository) {
      throw new Error(`Repository '${repositoryName}' not found`);
    }
    return repository as T;
  }

  protected get dispatch() {
    return this.context.dispatch;
  }

  protected get getState() {
    return this.context.getState;
  }

  // Getters for state
  get loading(): boolean {
    return this.state.loading;
  }

  get error(): string | null {
    return this.state.error;
  }

  get lastExecuted(): Date | undefined {
    return this.state.lastExecuted;
  }
}