import { AbstractBaseRepository } from '../../../core/repositories/BaseRepository';
import { BaseRemoteDataStore } from '../../../core/remoteDataStores/types';
import { RepositoryConfig } from '../../../core/repositories/types';
import { Todo, TodoStatus } from '../../../core/storage/database/models/Todo';
import { TodoStorage } from '../../../core/storage/database/TodoStorage';
import { DatabaseResult } from '../../../shared/types/database.types';

export interface TodoEntity extends Todo {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class TodoRepository extends AbstractBaseRepository<TodoEntity> {
  private todoStorage: TodoStorage;

  constructor(
    remoteDataStore: BaseRemoteDataStore,
    config: RepositoryConfig = {}
  ) {
    super(remoteDataStore, config);
    this.todoStorage = TodoStorage.getInstance();
  }

  getResourcePath(): string {
    return 'todos';
  }

  transformToEntity(data: any): TodoEntity {
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      date: data.date,
      status: data.status as TodoStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  transformFromEntity(entity: Omit<TodoEntity, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      title: entity.title,
      description: entity.description,
      date: entity.date,
      status: entity.status,
    };
  }

  async createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseResult<Todo>> {
    try {
      const result = await this.todoStorage.createTodo(todoData);
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodoById(id: string): Promise<DatabaseResult<Todo>> {
    try {
      const result = await this.todoStorage.getTodo(id);
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAllTodos(): Promise<DatabaseResult<Todo[]>> {
    try {
      const result = await this.todoStorage.getAllTodos();
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<DatabaseResult<Todo>> {
    try {
      const result = await this.todoStorage.updateTodo(id, updates);
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteTodo(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.todoStorage.deleteTodo(id);
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByStatus(status: TodoStatus): Promise<DatabaseResult<Todo[]>> {
    try {
      const result = await this.todoStorage.getTodosByStatus(status);
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByDate(date: string): Promise<DatabaseResult<Todo[]>> {
    try {
      const result = await this.todoStorage.getTodosByDate(date);
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateTodoStatus(id: string, status: TodoStatus): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status });
  }
}