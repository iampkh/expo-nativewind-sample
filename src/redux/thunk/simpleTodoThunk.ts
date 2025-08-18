import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreateTodoRequest, UpdateTodoRequest } from '../../interactors/TodoInteractor';
import { Todo, TodoStatus } from '../../storage/TodoStorage';
import { DatabaseResult } from '../../types/database.types';
import { SimpleTodoUseCase } from '../../useCases/SimpleTodoUseCase';
import todoRegistry from '../registry/todoRegistry';

export interface ThunkExtraArgument {
  simpleTodoUseCase: SimpleTodoUseCase;
}

// Thunk for creating a new todo
export const createTodoThunk = createAsyncThunk<
  Todo,
  CreateTodoRequest,
  { rejectValue: string }
>(
  'simpleTodo/createTodo',
  async (request, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.createTodo(request);
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to create todo');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for fetching all todos
export const fetchAllTodosThunk = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>(
  'simpleTodo/fetchAllTodos',
  async (_, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.getAllTodos();
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to fetch todos');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for fetching a single todo by ID
export const fetchTodoByIdThunk = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>(
  'simpleTodo/fetchTodoById',
  async (id, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.getTodo(id);
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to fetch todo');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for updating a todo
export const updateTodoThunk = createAsyncThunk<
  Todo,
  { id: string; request: UpdateTodoRequest },
  { rejectValue: string }
>(
  'simpleTodo/updateTodo',
  async ({ id, request }, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.updateTodo(id, request);
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to update todo');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for deleting a todo
export const deleteTodoThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'simpleTodo/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.deleteTodo(id);
      
      if (!result.success) {
        return rejectWithValue(result.error || 'Failed to delete todo');
      }
      
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for fetching todos by status
export const fetchTodosByStatusThunk = createAsyncThunk<
  Todo[],
  TodoStatus,
  { rejectValue: string }
>(
  'simpleTodo/fetchTodosByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.getTodosByStatus(status);
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to fetch todos by status');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for updating todo status
export const updateTodoStatusThunk = createAsyncThunk<
  Todo,
  { id: string; status: TodoStatus },
  { rejectValue: string }
>(
  'simpleTodo/updateTodoStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.updateTodo(id, { status });
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to update todo status');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Convenience thunks for specific status updates
export const markTodoAsCompletedThunk = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>(
  'simpleTodo/markAsCompleted',
  async (id, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.markTodoAsCompleted(id);
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to mark todo as completed');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markTodoAsStartedThunk = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>(
  'simpleTodo/markAsStarted',
  async (id, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.markTodoAsStarted(id);
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to mark todo as started');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markTodoAsOpenThunk = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>(
  'simpleTodo/markAsOpen',
  async (id, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.markTodoAsOpen(id);
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to mark todo as open');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunks for fetching todos by specific status
export const fetchOpenTodosThunk = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>(
  'simpleTodo/fetchOpenTodos',
  async (_, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.getOpenTodos();
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to fetch open todos');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchStartedTodosThunk = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>(
  'simpleTodo/fetchStartedTodos',
  async (_, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.getStartedTodos();
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to fetch started todos');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCompletedTodosThunk = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>(
  'simpleTodo/fetchCompletedTodos',
  async (_, { rejectWithValue }) => {
    try {
      const simpleTodoUseCase = todoRegistry.getSimpleTodoUseCase();
      const result = await simpleTodoUseCase.getCompletedTodos();
      
      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Failed to fetch completed todos');
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);