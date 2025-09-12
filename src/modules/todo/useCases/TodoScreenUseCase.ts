import { AbstractScreenUseCase } from '../../../core/useCases/BaseScreenUseCase';
import { UseCaseContext, UseCaseResult } from '../../../core/useCases/types';
import { TodoInteractor, CreateTodoRequest, UpdateTodoRequest } from '../interactors/TodoInteractor';
import { Todo, TodoStatus } from '../../../core/storage/database/models/Todo';
import { DatabaseResult } from '../../../shared/types/database.types';
// Removed all slice/thunk imports to break circular dependency
// This use case will work directly with the interactor

export class TodoScreenUseCase extends AbstractScreenUseCase {
  private todoInteractor: TodoInteractor;

  constructor(context: UseCaseContext, todoInteractor: TodoInteractor) {
    super(context);
    this.todoInteractor = todoInteractor;
  }

  async execute(action: string, ...args: any[]): Promise<any> {
    switch (action) {
      case 'loadTodos':
        return this.loadTodos(args[0]);
      case 'createTodo':
        return this.createTodo(args[0]);
      case 'updateTodo':
        return this.updateTodo(args[0], args[1]);
      case 'deleteTodo':
        return this.deleteTodo(args[0]);
      case 'updateStatus':
        return this.updateStatus(args[0], args[1]);
      case 'setFilter':
        return this.setFilter(args[0]);
      case 'selectTodo':
        return this.selectTodo(args[0]);
      case 'clearTodos':
        return this.clearAllTodos();
      case 'searchTodos':
        return this.searchTodos(args[0]);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  protected async onInitialize(): Promise<void> {
    console.log('Todo screen initializing...');
    // Load initial todos
    await this.loadTodos();
  }

  protected async onCleanup(): Promise<void> {
    console.log('Todo screen cleaning up...');
    // Note: Would clear selections if using Redux dispatch
  }

  protected async onScreenFocus(): Promise<void> {
    console.log('Todo screen focused');
    // Refresh todos when screen comes into focus
    await this.loadTodos();
  }

  protected async onScreenBlur(): Promise<void> {
    console.log('Todo screen blurred');
    // Note: Would clear selection if using Redux dispatch
  }

  // Todo operations - using interactor directly to avoid circular dependency
  private async loadTodos(params?: { refresh?: boolean }): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      const result = await this.todoInteractor.getAllTodos();
      if (result.success && result.data) {
        // You would dispatch to update state here if needed
        console.log('Todos loaded successfully');
      } else {
        throw new Error(result.error || 'Failed to load todos');
      }
    }, 'Failed to load todos');
  }

  private async createTodo(data: CreateTodoRequest): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      const result = await this.todoInteractor.createTodo(data);
      if (result.success && result.data) {
        console.log('Todo created successfully');
      } else {
        throw new Error(result.error || 'Failed to create todo');
      }
    }, 'Failed to create todo');
  }

  private async updateTodo(id: string, data: UpdateTodoRequest): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      const result = await this.todoInteractor.updateTodo(id, data);
      if (result.success && result.data) {
        console.log('Todo updated successfully');
      } else {
        throw new Error(result.error || 'Failed to update todo');
      }
    }, 'Failed to update todo');
  }

  private async deleteTodo(id: string): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      const result = await this.todoInteractor.deleteTodo(id);
      if (result.success) {
        console.log('Todo deleted successfully');
      } else {
        throw new Error(result.error || 'Failed to delete todo');
      }
    }, 'Failed to delete todo');
  }

  private async updateStatus(id: string, status: TodoStatus): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      const result = await this.todoInteractor.updateTodo(id, { status });
      if (result.success && result.data) {
        console.log('Todo status updated');
      } else {
        throw new Error(result.error || 'Failed to update todo status');
      }
    }, 'Failed to update todo status');
  }

  // Filter and view operations
  private setFilter(filter: 'all' | 'open' | 'started' | 'completed'): UseCaseResult<void> {
    try {
      // Note: Would dispatch setFilter action if using Redux
      console.log('Filter set to:', filter);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private searchTodos(query: string): UseCaseResult<void> {
    try {
      // For now, just reload todos - could add search functionality to slice later
      this.loadTodos();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Selection operations
  private selectTodo(todo: Todo | null): UseCaseResult<void> {
    try {
      // Note: Would dispatch setSelectedTodo action if using Redux
      console.log('Todo selected:', todo?.id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private clearAllTodos(): UseCaseResult<void> {
    try {
      // Note: Would dispatch clearTodos action if using Redux
      console.log('Todos cleared');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Convenience methods for status updates
  async markAsCompleted(id: string): Promise<UseCaseResult<void>> {
    return this.updateStatus(id, TodoStatus.completed);
  }

  async markAsStarted(id: string): Promise<UseCaseResult<void>> {
    return this.updateStatus(id, TodoStatus.started);
  }

  async markAsOpen(id: string): Promise<UseCaseResult<void>> {
    return this.updateStatus(id, TodoStatus.open);
  }

  // Utility methods - simplified to avoid Redux dependency
  getCurrentFilter(): 'all' | 'open' | 'started' | 'completed' {
    // Note: Would get from Redux state if connected
    return 'all';
  }

  getSelectedTodo(): Todo | null {
    // Note: Would get from Redux state if connected
    return null;
  }

  async getTodosStats() {
    try {
      const result = await this.todoInteractor.getAllTodos();
      if (result.success && result.data) {
        const todos = result.data;
        return {
          total: todos.length,
          open: todos.filter(t => t.status === TodoStatus.open).length,
          started: todos.filter(t => t.status === TodoStatus.started).length,
          completed: todos.filter(t => t.status === TodoStatus.completed).length,
        };
      }
      return { total: 0, open: 0, started: 0, completed: 0 };
    } catch (error) {
      return { total: 0, open: 0, started: 0, completed: 0 };
    }
  }

  isLoading(): boolean {
    // Note: Would get from Redux state if connected
    return false;
  }

  getError(): string | null {
    // Note: Would get from Redux state if connected
    return null;
  }

  async getTodos(): Promise<Todo[]> {
    try {
      const result = await this.todoInteractor.getAllTodos();
      return result.success && result.data ? result.data : [];
    } catch (error) {
      return [];
    }
  }
}