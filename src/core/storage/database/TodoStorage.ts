import { DatabaseResult } from '../../../shared/types/database.types';
import { Todo, TodoStatus } from './models/Todo';
import TodoModel from './models/TodoModel';

export class TodoStorage {
  private static instance: TodoStorage;

  private constructor() {}

  public static getInstance(): TodoStorage {
    if (!TodoStorage.instance) {
      TodoStorage.instance = new TodoStorage();
    }
    return TodoStorage.instance;
  }

  private async getDatabase() {
    const { database } = await import('../database');
    return database;
  }

  async createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseResult<Todo>> {
    try {
      const database = await this.getDatabase();
      
      const newTodo = await database.write(async () => {
        const todoCollection = database.get<TodoModel>('todos');
        const todo = await todoCollection.create(todoRecord => {
          todoRecord.title = todoData.title;
          todoRecord.description = todoData.description || '';
          todoRecord.date = todoData.date;
          todoRecord.status = todoData.status;
        });
        return todo;
      });

      const todoData_result: Todo = {
        id: newTodo.id,
        title: newTodo.title,
        description: newTodo.description,
        date: newTodo.date,
        status: newTodo.status,
        createdAt: newTodo.createdAt.toISOString(),
        updatedAt: newTodo.updatedAt.toISOString(),
      };

      return { success: true, data: todoData_result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodo(id: string): Promise<DatabaseResult<Todo>> {
    try {
      const database = await this.getDatabase();
      const todoModel = await database.get<TodoModel>('todos').find(id);
      
      if (!todoModel) {
        return { success: false, error: 'Todo not found' };
      }

      const todo: Todo = {
        id: todoModel.id,
        title: todoModel.title,
        description: todoModel.description,
        date: todoModel.date,
        status: todoModel.status,
        createdAt: todoModel.createdAt.toISOString(),
        updatedAt: todoModel.updatedAt.toISOString(),
      };

      return { success: true, data: todo };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<DatabaseResult<Todo>> {
    try {
      const database = await this.getDatabase();
      
      const updatedTodo = await database.write(async () => {
        const todoModel = await database.get<TodoModel>('todos').find(id);
        return await todoModel.update(todo => {
          if (updates.title !== undefined) todo.title = updates.title;
          if (updates.description !== undefined) todo.description = updates.description;
          if (updates.date !== undefined) todo.date = updates.date;
          if (updates.status !== undefined) todo.status = updates.status;
        });
      });

      const todo: Todo = {
        id: updatedTodo.id,
        title: updatedTodo.title,
        description: updatedTodo.description,
        date: updatedTodo.date,
        status: updatedTodo.status,
        createdAt: updatedTodo.createdAt.toISOString(),
        updatedAt: updatedTodo.updatedAt.toISOString(),
      };

      return { success: true, data: todo };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteTodo(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const database = await this.getDatabase();
      
      await database.write(async () => {
        const todoModel = await database.get<TodoModel>('todos').find(id);
        await todoModel.destroyPermanently();
      });

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAllTodos(): Promise<DatabaseResult<Todo[]>> {
    try {
      const database = await this.getDatabase();
      const todoModels = await database.get<TodoModel>('todos').query().fetch();
      
      const todos: Todo[] = todoModels.map(todoModel => ({
        id: todoModel.id,
        title: todoModel.title,
        description: todoModel.description,
        date: todoModel.date,
        status: todoModel.status,
        createdAt: todoModel.createdAt.toISOString(),
        updatedAt: todoModel.updatedAt.toISOString(),
      }));

      // Sort by createdAt descending
      todos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return { success: true, data: todos };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByStatus(status: TodoStatus): Promise<DatabaseResult<Todo[]>> {
    try {
      const database = await this.getDatabase();
      const todoModels = await database.get<TodoModel>('todos').query().fetch();
      
      // Filter by status (WatermelonDB query filters can be added here for better performance)
      const filteredModels = todoModels.filter(todo => todo.status === status);
      
      const todos: Todo[] = filteredModels.map(todoModel => ({
        id: todoModel.id,
        title: todoModel.title,
        description: todoModel.description,
        date: todoModel.date,
        status: todoModel.status,
        createdAt: todoModel.createdAt.toISOString(),
        updatedAt: todoModel.updatedAt.toISOString(),
      }));

      // Sort by createdAt descending
      todos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return { success: true, data: todos };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTodosByDate(date: string): Promise<DatabaseResult<Todo[]>> {
    try {
      const database = await this.getDatabase();
      const todoModels = await database.get<TodoModel>('todos').query().fetch();
      
      // Filter by date
      const filteredModels = todoModels.filter(todo => todo.date === date);
      
      const todos: Todo[] = filteredModels.map(todoModel => ({
        id: todoModel.id,
        title: todoModel.title,
        description: todoModel.description,
        date: todoModel.date,
        status: todoModel.status,
        createdAt: todoModel.createdAt.toISOString(),
        updatedAt: todoModel.updatedAt.toISOString(),
      }));

      // Sort by createdAt descending
      todos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return { success: true, data: todos };
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
    // WatermelonDB doesn't require explicit disconnect
    return Promise.resolve();
  }
}