import { SqliteStorage, DatabaseResult } from '../types/database.types';

export enum TodoStatus {
  open = 'open',
  started = 'started',
  completed = 'completed'
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}

export class TodoStorage implements SqliteStorage {
  private static instance: TodoStorage;
  private todos: Todo[] = [];

  private constructor() {}

  public static getInstance(): TodoStorage {
    if (!TodoStorage.instance) {
      TodoStorage.instance = new TodoStorage();
    }
    return TodoStorage.instance;
  }

  async createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseResult<Todo>> {
    try {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        id: Math.random().toString(36).substr(2, 9),
        ...todoData,
        createdAt: now,
        updatedAt: now,
      };

      this.todos.push(newTodo);
      return { success: true, data: newTodo };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodo(id: string): Promise<DatabaseResult<Todo>> {
    try {
      const todo = this.todos.find(t => t.id === id);
      if (!todo) {
        return { success: false, error: 'Todo not found' };
      }
      return { success: true, data: todo };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<DatabaseResult<Todo>> {
    try {
      const todoIndex = this.todos.findIndex(t => t.id === id);
      if (todoIndex === -1) {
        return { success: false, error: 'Todo not found' };
      }

      const updatedTodo = {
        ...this.todos[todoIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      this.todos[todoIndex] = updatedTodo;
      return { success: true, data: updatedTodo };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteTodo(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const todoIndex = this.todos.findIndex(t => t.id === id);
      if (todoIndex === -1) {
        return { success: false, error: 'Todo not found' };
      }

      this.todos.splice(todoIndex, 1);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAllTodos(): Promise<DatabaseResult<Todo[]>> {
    try {
      const sortedTodos = [...this.todos].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return { success: true, data: sortedTodos };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByStatus(status: TodoStatus): Promise<DatabaseResult<Todo[]>> {
    try {
      const filteredTodos = this.todos
        .filter(todo => todo.status === status)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return { success: true, data: filteredTodos };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByDate(date: string): Promise<DatabaseResult<Todo[]>> {
    try {
      const filteredTodos = this.todos
        .filter(todo => todo.date === date)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return { success: true, data: filteredTodos };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async markAsCompleted(id: string): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status: TodoStatus.completed });
  }

  async markAsStarted(id: string): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status: TodoStatus.started });
  }

  async markAsOpen(id: string): Promise<DatabaseResult<Todo>> {
    return this.updateTodo(id, { status: TodoStatus.open });
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }
}