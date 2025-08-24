import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createTodoThunk,
  fetchAllTodosThunk,
  fetchTodoByIdThunk,
  updateTodoThunk,
  deleteTodoThunk,
  fetchTodosByStatusThunk,
  updateTodoStatusThunk,
  markTodoAsCompletedThunk,
  markTodoAsStartedThunk,
  markTodoAsOpenThunk,
  fetchOpenTodosThunk,
  fetchStartedTodosThunk,
  fetchCompletedTodosThunk,
} from '../thunk/simpleTodoThunk';
import { Todo, TodoStatus } from '../../storage';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  selectedTodo: Todo | null;
  filter: 'all' | 'open' | 'started' | 'completed';
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  selectedTodo: null,
  filter: 'all',
};

const simpleTodoSlice = createSlice({
  name: 'simpleTodo',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },

    // Todo CRUD operations
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      state.loading = false;
      state.error = null;
    },

    // Todo status updates
    updateTodoStatus: (state, action: PayloadAction<{ id: string; status: TodoStatus }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.status = action.payload.status;
        todo.updatedAt = new Date().toISOString();
      }
    },

    // Selection
    setSelectedTodo: (state, action: PayloadAction<Todo | null>) => {
      state.selectedTodo = action.payload;
    },

    // Filtering
    setFilter: (state, action: PayloadAction<'all' | 'open' | 'started' | 'completed'>) => {
      state.filter = action.payload;
    },

    // Bulk operations
    addTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = [...action.payload, ...state.todos];
      state.loading = false;
      state.error = null;
    },

    updateTodos: (state, action: PayloadAction<Todo[]>) => {
      action.payload.forEach(updatedTodo => {
        const index = state.todos.findIndex(todo => todo.id === updatedTodo.id);
        if (index !== -1) {
          state.todos[index] = updatedTodo;
        }
      });
      state.loading = false;
      state.error = null;
    },

    // Clear all todos
    clearTodos: (state) => {
      state.todos = [];
      state.selectedTodo = null;
      state.error = null;
    },

    // Reset state
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    // Create Todo
    builder
      .addCase(createTodoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.unshift(action.payload);
      })
      .addCase(createTodoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create todo';
      });

    // Fetch All Todos
    builder
      .addCase(fetchAllTodosThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTodosThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchAllTodosThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch todos';
      });

    // Fetch Todo By ID
    builder
      .addCase(fetchTodoByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodoByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTodo = action.payload;
        // Update the todo in the list if it exists
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(fetchTodoByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch todo';
      });

    // Update Todo
    builder
      .addCase(updateTodoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodoThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        if (state.selectedTodo?.id === action.payload.id) {
          state.selectedTodo = action.payload;
        }
      })
      .addCase(updateTodoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update todo';
      });

    // Delete Todo
    builder
      .addCase(deleteTodoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
        if (state.selectedTodo?.id === action.payload) {
          state.selectedTodo = null;
        }
      })
      .addCase(deleteTodoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete todo';
      });

    // Update Todo Status
    builder
      .addCase(updateTodoStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodoStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        if (state.selectedTodo?.id === action.payload.id) {
          state.selectedTodo = action.payload;
        }
      })
      .addCase(updateTodoStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update todo status';
      });

    // Mark as Completed
    builder
      .addCase(markTodoAsCompletedThunk.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      });

    // Mark as Started
    builder
      .addCase(markTodoAsStartedThunk.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      });

    // Mark as Open
    builder
      .addCase(markTodoAsOpenThunk.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      });

    // Fetch Todos by Status
    builder
      .addCase(fetchTodosByStatusThunk.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(fetchOpenTodosThunk.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(fetchStartedTodosThunk.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(fetchCompletedTodosThunk.fulfilled, (state, action) => {
        state.todos = action.payload;
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setTodos,
  addTodo,
  updateTodo,
  removeTodo,
  updateTodoStatus,
  setSelectedTodo,
  setFilter,
  addTodos,
  updateTodos,
  clearTodos,
  resetState,
} = simpleTodoSlice.actions;

export default simpleTodoSlice.reducer;

// Selectors
export const selectTodos = (state: { simpleTodo: TodoState }) => state.simpleTodo.todos;
export const selectLoading = (state: { simpleTodo: TodoState }) => state.simpleTodo.loading;
export const selectError = (state: { simpleTodo: TodoState }) => state.simpleTodo.error;
export const selectSelectedTodo = (state: { simpleTodo: TodoState }) => state.simpleTodo.selectedTodo;
export const selectFilter = (state: { simpleTodo: TodoState }) => state.simpleTodo.filter;

// Filtered selectors
export const selectFilteredTodos = (state: { simpleTodo: TodoState }) => {
  const { todos, filter } = state.simpleTodo;
  
  switch (filter) {
    case 'open':
      return todos.filter(todo => todo.status === TodoStatus.open);
    case 'started':
      return todos.filter(todo => todo.status === TodoStatus.started);
    case 'completed':
      return todos.filter(todo => todo.status === TodoStatus.completed);
    default:
      return todos;
  }
};

export const selectTodosByStatus = (status: TodoStatus) => (state: { simpleTodo: TodoState }) => {
  return state.simpleTodo.todos.filter(todo => todo.status === status);
};

export const selectTodoById = (id: string) => (state: { simpleTodo: TodoState }) => {
  return state.simpleTodo.todos.find(todo => todo.id === id);
};