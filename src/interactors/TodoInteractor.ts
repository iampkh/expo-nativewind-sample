import { TodoRepository } from '../repositories/TodoRepository';
import { Todo, TodoStatus } from '../storage';
import { DatabaseResult } from '../types/database.types';

export interface CreateTodoRequest {
  title: string;
  description?: string;
  date: string;
  status?: TodoStatus;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  date?: string;
  status?: TodoStatus;
}

export class TodoInteractor {
  constructor(private todoRepository: TodoRepository) {}

  async createTodo(request: CreateTodoRequest): Promise<DatabaseResult<Todo>> {
    try {
      if (!request.title.trim()) {
        return { success: false, error: 'Title is required' };
      }

      if (!request.date) {
        return { success: false, error: 'Date is required' };
      }

      const todoData = {
        title: request.title.trim(),
        description: request.description?.trim() || '',
        date: request.date,
        status: request.status || TodoStatus.open,
      };

      return await this.todoRepository.createTodo(todoData);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodo(id: string): Promise<DatabaseResult<Todo>> {
    try {
      if (!id) {
        return { success: false, error: 'Todo ID is required' };
      }

      return await this.todoRepository.getTodoById(id);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAllTodos(): Promise<DatabaseResult<Todo[]>> {
    try {
      return await this.todoRepository.getAllTodos();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateTodo(id: string, request: UpdateTodoRequest): Promise<DatabaseResult<Todo>> {
    try {
      if (!id) {
        return { success: false, error: 'Todo ID is required' };
      }

      const updates: Partial<Omit<Todo, 'id' | 'createdAt'>> = {};

      if (request.title !== undefined) {
        if (!request.title.trim()) {
          return { success: false, error: 'Title cannot be empty' };
        }
        updates.title = request.title.trim();
      }

      if (request.description !== undefined) {
        updates.description = request.description.trim();
      }

      if (request.date !== undefined) {
        if (!request.date) {
          return { success: false, error: 'Date cannot be empty' };
        }
        updates.date = request.date;
      }

      if (request.status !== undefined) {
        updates.status = request.status;
      }

      return await this.todoRepository.updateTodo(id, updates);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteTodo(id: string): Promise<DatabaseResult<boolean>> {
    try {
      if (!id) {
        return { success: false, error: 'Todo ID is required' };
      }

      return await this.todoRepository.deleteTodo(id);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByStatus(status: TodoStatus): Promise<DatabaseResult<Todo[]>> {
    try {
      return await this.todoRepository.getTodosByStatus(status);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByDate(date: string): Promise<DatabaseResult<Todo[]>> {
    try {
      if (!date) {
        return { success: false, error: 'Date is required' };
      }

      return await this.todoRepository.getTodosByDate(date);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async markTodoAsCompleted(id: string): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status: TodoStatus.completed });
  }

  async markTodoAsStarted(id: string): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status: TodoStatus.started });
  }

  async markTodoAsOpen(id: string): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status: TodoStatus.open });
  }

  async getOpenTodos(): Promise<DatabaseResult<Todo[]>> {
    return this.getTodosByStatus(TodoStatus.open);
  }

  async getStartedTodos(): Promise<DatabaseResult<Todo[]>> {
    return this.getTodosByStatus(TodoStatus.started);
  }

  async getCompletedTodos(): Promise<DatabaseResult<Todo[]>> {
    return this.getTodosByStatus(TodoStatus.completed);
  }
}