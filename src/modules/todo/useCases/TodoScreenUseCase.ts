import { AbstractScreenUseCase } from '../../../core/useCases/BaseScreenUseCase';
import { UseCaseContext, UseCaseResult } from '../../../core/useCases/types';
import { TodoInteractor, CreateTodoRequest, UpdateTodoRequest } from '../interactors/TodoInteractor';
import { Todo, TodoStatus } from '../../../core/storage/database/models/Todo';
import { DatabaseResult } from '../../../shared/types/database.types';
import { 
  createTodoThunk, 
  fetchAllTodosThunk, 
  updateTodoThunk, 
  deleteTodoThunk,
  updateTodoStatusThunk,
  markTodoAsCompletedThunk,
  markTodoAsStartedThunk,
  markTodoAsOpenThunk
} from '../store/simpleTodoThunk';
import { 
  setFilter, 
  setSelectedTodo, 
  clearTodos,
  selectTodos,
  selectLoading,
  selectError
} from '../store/simpleTodoSlice';

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
    // Clear any selections
    this.dispatch(setSelectedTodo(null));
  }

  protected async onScreenFocus(): Promise<void> {
    console.log('Todo screen focused');
    // Refresh todos when screen comes into focus
    await this.loadTodos();
  }

  protected async onScreenBlur(): Promise<void> {
    console.log('Todo screen blurred');
    // Clear selection when leaving screen
    this.dispatch(setSelectedTodo(null));
  }

  // Todo operations
  private async loadTodos(params?: { refresh?: boolean }): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(fetchAllTodosThunk()).unwrap();
      console.log('Todos loaded successfully');
    }, 'Failed to load todos');
  }

  private async createTodo(data: CreateTodoRequest): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(createTodoThunk(data)).unwrap();
      console.log('Todo created successfully');
    }, 'Failed to create todo');
  }

  private async updateTodo(id: string, data: UpdateTodoRequest): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(updateTodoThunk({ id, request: data })).unwrap();
      console.log('Todo updated successfully');
    }, 'Failed to update todo');
  }

  private async deleteTodo(id: string): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(deleteTodoThunk(id)).unwrap();
      console.log('Todo deleted successfully');
    }, 'Failed to delete todo');
  }

  private async updateStatus(id: string, status: TodoStatus): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(updateTodoStatusThunk({ id, status })).unwrap();
      console.log('Todo status updated');
    }, 'Failed to update todo status');
  }

  // Filter and view operations
  private setFilter(filter: 'all' | 'open' | 'started' | 'completed'): UseCaseResult<void> {
    try {
      this.dispatch(setFilter(filter));
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
      this.dispatch(setSelectedTodo(todo));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private clearAllTodos(): UseCaseResult<void> {
    try {
      this.dispatch(clearTodos());
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Convenience methods for status updates
  async markAsCompleted(id: string): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(markTodoAsCompletedThunk(id)).unwrap();
      console.log('Todo marked as completed');
    }, 'Failed to mark todo as completed');
  }

  async markAsStarted(id: string): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(markTodoAsStartedThunk(id)).unwrap();
      console.log('Todo marked as started');
    }, 'Failed to mark todo as started');
  }

  async markAsOpen(id: string): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(markTodoAsOpenThunk(id)).unwrap();
      console.log('Todo marked as open');
    }, 'Failed to mark todo as open');
  }

  // Utility methods
  getCurrentFilter(): 'all' | 'open' | 'started' | 'completed' {
    const state = this.getState();
    return state.simpleTodo.filter;
  }

  getSelectedTodo(): Todo | null {
    const state = this.getState();
    return state.simpleTodo.selectedTodo;
  }

  getTodosStats() {
    const state = this.getState();
    const todos = state.simpleTodo.todos;
    
    return {
      total: todos.length,
      open: todos.filter(t => t.status === TodoStatus.open).length,
      started: todos.filter(t => t.status === TodoStatus.started).length,
      completed: todos.filter(t => t.status === TodoStatus.completed).length,
    };
  }

  isLoading(): boolean {
    const state = this.getState();
    return state.simpleTodo.loading;
  }

  getError(): string | null {
    const state = this.getState();
    return state.simpleTodo.error;
  }

  getTodos(): Todo[] {
    const state = this.getState();
    return state.simpleTodo.todos;
  }
}