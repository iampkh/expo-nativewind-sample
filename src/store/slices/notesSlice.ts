import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Note, CreateNoteData, UpdateNoteData, NotesFilter } from '../../shared/types/notes';
import { ListSliceState, FetchParams } from '../types';
import { NotesRepository } from '../../modules/sample/repositories/NotesRepository';

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (params: FetchParams & { filters?: NotesFilter } = {}, { extra }) => {
    const repository = (extra as any).notesRepository as NotesRepository;
    return await repository.findAll(params);
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (data: CreateNoteData, { extra }) => {
    const repository = (extra as any).notesRepository as NotesRepository;
    return await repository.create({
      title: data.title,
      content: data.content || '',
      completed: false,
      priority: data.priority || 'medium',
      tags: data.tags || [],
      dueDate: data.dueDate,
      reminderDate: data.reminderDate,
      color: data.color,
      archived: false,
    });
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, data }: { id: string; data: UpdateNoteData }, { extra }) => {
    const repository = (extra as any).notesRepository as NotesRepository;
    return await repository.update(id, data);
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id: string, { extra }) => {
    const repository = (extra as any).notesRepository as NotesRepository;
    await repository.delete(id);
    return id;
  }
);

export const toggleNoteComplete = createAsyncThunk(
  'notes/toggleComplete',
  async (id: string, { extra }) => {
    const repository = (extra as any).notesRepository as NotesRepository;
    return await repository.toggleComplete(id);
  }
);

export const archiveNote = createAsyncThunk(
  'notes/archiveNote',
  async (id: string, { extra }) => {
    const repository = (extra as any).notesRepository as NotesRepository;
    return await repository.archiveNote(id);
  }
);

export const unarchiveNote = createAsyncThunk(
  'notes/unarchiveNote',
  async (id: string, { extra }) => {
    const repository = (extra as any).notesRepository as NotesRepository;
    return await repository.unarchiveNote(id);
  }
);

export const deleteMultipleNotes = createAsyncThunk(
  'notes/deleteMultiple',
  async (ids: string[], { extra }) => {
    const repository = (extra as any).notesRepository as NotesRepository;
    await repository.deleteMany(ids);
    return ids;
  }
);

// Initial state
const initialState: ListSliceState<Note> & {
  filter: NotesFilter;
  selectedView: 'all' | 'active' | 'completed' | 'archived';
} = {
  items: [],
  selectedItems: [],
  loading: false,
  error: null,
  page: 1,
  limit: 50,
  total: 0,
  hasMore: true,
  filter: {
    archived: false,
  },
  selectedView: 'all',
};

// Slice
const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<NotesFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
      state.page = 1; // Reset pagination when filter changes
    },
    
    clearFilter: (state) => {
      state.filter = { archived: false };
      state.page = 1;
    },
    
    setSelectedView: (state, action: PayloadAction<'all' | 'active' | 'completed' | 'archived'>) => {
      state.selectedView = action.payload;
      state.page = 1;
      
      // Update filter based on selected view
      switch (action.payload) {
        case 'active':
          state.filter = { completed: false, archived: false };
          break;
        case 'completed':
          state.filter = { completed: true, archived: false };
          break;
        case 'archived':
          state.filter = { archived: true };
          break;
        case 'all':
        default:
          state.filter = { archived: false };
          break;
      }
    },
    
    selectNote: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.selectedItems.includes(id)) {
        state.selectedItems.push(id);
      }
    },
    
    deselectNote: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.selectedItems = state.selectedItems.filter(item => item !== id);
    },
    
    toggleSelectNote: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedItems.includes(id)) {
        state.selectedItems = state.selectedItems.filter(item => item !== id);
      } else {
        state.selectedItems.push(id);
      }
    },
    
    selectAllNotes: (state) => {
      state.selectedItems = state.items.map(note => note.id);
    },
    
    deselectAllNotes: (state) => {
      state.selectedItems = [];
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // Fetch notes
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.length;
        state.hasMore = action.payload.length === state.limit;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notes';
      });

    // Create note
    builder
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // Add to beginning
        state.total += 1;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create note';
      });

    // Update note
    builder
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.items.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update note';
      });

    // Delete note
    builder
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter(note => note.id !== action.payload);
        state.selectedItems = state.selectedItems.filter(id => id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete note';
      });

    // Toggle complete
    builder
      .addCase(toggleNoteComplete.fulfilled, (state, action) => {
        const index = state.items.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });

    // Archive note
    builder
      .addCase(archiveNote.fulfilled, (state, action) => {
        const index = state.items.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });

    // Unarchive note
    builder
      .addCase(unarchiveNote.fulfilled, (state, action) => {
        const index = state.items.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });

    // Delete multiple notes
    builder
      .addCase(deleteMultipleNotes.fulfilled, (state, action) => {
        state.items = state.items.filter(note => !action.payload.includes(note.id));
        state.selectedItems = [];
        state.total -= action.payload.length;
      });
  },
});

export const {
  setFilter,
  clearFilter,
  setSelectedView,
  selectNote,
  deselectNote,
  toggleSelectNote,
  selectAllNotes: selectAllNotesAction,
  deselectAllNotes,
  clearError,
} = notesSlice.actions;

export default notesSlice.reducer;

// Selectors
export const selectAllNotes = (state: { notes: typeof initialState }) => state.notes.items;
export const selectNotesLoading = (state: { notes: typeof initialState }) => state.notes.loading;
export const selectNotesError = (state: { notes: typeof initialState }) => state.notes.error;
export const selectSelectedNotes = (state: { notes: typeof initialState }) => state.notes.selectedItems;
export const selectNotesFilter = (state: { notes: typeof initialState }) => state.notes.filter;
export const selectSelectedView = (state: { notes: typeof initialState }) => state.notes.selectedView;

export const selectNotesStats = createSelector(
  [(state: { notes: typeof initialState }) => state.notes.items],
  (items) => ({
    total: items.length,
    completed: items.filter(n => n.completed && !n.archived).length,
    pending: items.filter(n => !n.completed && !n.archived).length,
    archived: items.filter(n => n.archived).length,
  })
);