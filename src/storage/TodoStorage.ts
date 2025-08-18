import { PrismaClient } from '@prisma/client';
import { SQLiteStorage, DatabaseResult } from '../types/database.types';

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

export class TodoStorage implements SQLiteStorage {
  private static instance: TodoStorage;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): TodoStorage {
    if (!TodoStorage.instance) {
      TodoStorage.instance = new TodoStorage();
    }
    return TodoStorage.instance;
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    try {
      const result = await this.prisma.$queryRawUnsafe(sql, ...(params || []));
      return Array.isArray(result) ? result : [result];
    } catch (error) {
      throw error;
    }
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    try {
      await this.prisma.$executeRawUnsafe(sql, ...(params || []));
    } catch (error) {
      throw error;
    }
  }

  async createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseResult<Todo>> {
    try {
      const id = Date.now().toString();
      const now = new Date().toISOString();
      
      const newTodo: Todo = {
        ...todoData,
        id,
        createdAt: now,
        updatedAt: now,
      };

      await this.execute(
        'INSERT INTO todos (id, title, description, date, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [newTodo.id, newTodo.title, newTodo.description, newTodo.date, newTodo.status, newTodo.createdAt, newTodo.updatedAt]
      );

      return { success: true, data: newTodo };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodo(id: string): Promise<DatabaseResult<Todo>> {
    try {
      const results = await this.query('SELECT * FROM todos WHERE id = ?', [id]);
      
      if (results.length === 0) {
        return { success: false, error: 'Todo not found' };
      }

      return { success: true, data: results[0] as Todo };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<DatabaseResult<Todo>> {
    try {
      const updatedAt = new Date().toISOString();
      const updateFields = { ...updates, updatedAt };
      const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(updateFields), id];

      await this.execute(
        `UPDATE todos SET ${setClause} WHERE id = ?`,
        values
      );

      const updatedTodo = await this.getTodo(id);
      return updatedTodo;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteTodo(id: string): Promise<DatabaseResult<boolean>> {
    try {
      await this.execute('DELETE FROM todos WHERE id = ?', [id]);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAllTodos(): Promise<DatabaseResult<Todo[]>> {
    try {
      const results = await this.query('SELECT * FROM todos ORDER BY createdAt DESC');
      return { success: true, data: results as Todo[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByStatus(status: TodoStatus): Promise<DatabaseResult<Todo[]>> {
    try {
      const results = await this.query('SELECT * FROM todos WHERE status = ? ORDER BY createdAt DESC', [status]);
      return { success: true, data: results as Todo[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByDate(date: string): Promise<DatabaseResult<Todo[]>> {
    try {
      const results = await this.query('SELECT * FROM todos WHERE date = ? ORDER BY createdAt DESC', [date]);
      return { success: true, data: results as Todo[] };
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
    await this.prisma.$disconnect();
  }
}