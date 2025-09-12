import { CreateTodoRequest, TodoInteractor, UpdateTodoRequest } from '../interactors/TodoInteractor';
import { Todo, TodoStatus } from '../../../core/storage/database/models/Todo';
import { DatabaseResult } from '../../../shared/types/database.types';
import { BaseUseCase } from '../../../core/useCases/BaseUseCase';
import { UseCaseContext } from '../../../core/useCases/types';

export interface TodoUseCaseState {
  isLoading: boolean;
  error: string | null;
}

export class SimpleTodoUseCase extends BaseUseCase {
  private todoInteractor: TodoInteractor;

  constructor(context: UseCaseContext, todoInteractor: TodoInteractor) {
    super(context);
    this.todoInteractor = todoInteractor;
  }

  async execute(...args: any[]): Promise<any> {
    // Base execute method - can be used for generic operations
    return Promise.resolve();
  }

  public async createTodo(request: CreateTodoRequest): Promise<DatabaseResult<Todo>> {
    this.setLoading(true);
    this.clearError();

    try {
      const result = await this.todoInteractor.createTodo(request);
      
      if (!result.success) {
        this.setError(result.error || 'Failed to create todo');
        return result;
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      this.setLoading(false);
    }
  }

  public async getAllTodos(): Promise<DatabaseResult<Todo[]>> {
    this.setLoading(true);
    this.clearError();

    try {
      const result = await this.todoInteractor.getAllTodos();
      
      if (!result.success) {
        this.setError(result.error || 'Failed to fetch todos');
        return result;
      }

      // Success - loading will be set to false in finally block
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      this.setLoading(false);
    }
  }

  public async getTodo(id: string): Promise<DatabaseResult<Todo>> {
    this.setLoading(true);
    this.clearError();

    try {
      const result = await this.todoInteractor.getTodo(id);
      
      if (!result.success) {
        this.setError(result.error || 'Failed to fetch todo');
        return result;
      }

      // Success - loading will be set to false in finally block
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      this.setLoading(false);
    }
  }

  public async updateTodo(id: string, request: UpdateTodoRequest): Promise<DatabaseResult<Todo>> {
    this.setLoading(true);
    this.clearError();

    try {
      const result = await this.todoInteractor.updateTodo(id, request);
      
      if (!result.success) {
        this.setError(result.error || 'Failed to update todo');
        return result;
      }

      // Success - loading will be set to false in finally block
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      this.setLoading(false);
    }
  }

  public async deleteTodo(id: string): Promise<DatabaseResult<boolean>> {
    this.setLoading(true);
    this.clearError();

    try {
      const result = await this.todoInteractor.deleteTodo(id);
      
      if (!result.success) {
        this.setError(result.error || 'Failed to delete todo');
        return result;
      }

      // Success - loading will be set to false in finally block
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      this.setLoading(false);
    }
  }

  public async getTodosByStatus(status: TodoStatus): Promise<DatabaseResult<Todo[]>> {
    this.setLoading(true);
    this.clearError();

    try {
      const result = await this.todoInteractor.getTodosByStatus(status);
      
      if (!result.success) {
        this.setError(result.error || 'Failed to fetch todos by status');
        return result;
      }

      // Success - loading will be set to false in finally block
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      this.setLoading(false);
    }
  }

  public async markTodoAsCompleted(id: string): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status: TodoStatus.completed });
  }

  public async markTodoAsStarted(id: string): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status: TodoStatus.started });
  }

  public async markTodoAsOpen(id: string): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status: TodoStatus.open });
  }

  public async getOpenTodos(): Promise<DatabaseResult<Todo[]>> {
    return this.getTodosByStatus(TodoStatus.open);
  }

  public async getStartedTodos(): Promise<DatabaseResult<Todo[]>> {
    return this.getTodosByStatus(TodoStatus.started);
  }

  public async getCompletedTodos(): Promise<DatabaseResult<Todo[]>> {
    return this.getTodosByStatus(TodoStatus.completed);
  }

  public getIsLoading(): boolean {
    return this.loading;
  }

  public getError(): string | null {
    return this.error;
  }

  public clearUseCaseError(): void {
    this.clearError();
  }
}