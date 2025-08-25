import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import notesSlice from './slices/notesSlice';
import simpleTodoSlice from '../modules/todo/store/simpleTodoSlice';
import { NotesRepository } from '../core/repositories/NotesRepository';
import todoRegistry from '../modules/todo/store/todoRegistry';

// Create repositories
const notesRepository = new NotesRepository();

export const store = configureStore({
  reducer: {
    notes: notesSlice,
    simpleTodo: simpleTodoSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          notesRepository,
          todoRegistry,
        },
      },
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;