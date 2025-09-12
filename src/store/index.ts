import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import notesSlice from './slices/notesSlice';
import simpleTodoSlice from '../modules/todo/store/simpleTodoSlice';
import authSlice from '../modules/auth/store/authSlice';
import pollSlice from '../modules/poll/store/pollSlice';
import financeSlice from '../modules/finance/store/financeSlice';
import taskSlice from '../modules/task/store/taskSlice';
import sampleSlice from '../modules/sample/store/sampleSlice';
import chatSlice from '../modules/chat/store/chatSlice';
// Note: geomap, and analytics slices are not yet fully implemented
// import geomapSlice from '../modules/geomap/store/geomapSlice';
// import analyticsSlice from '../modules/analytics/store/analyticsSlice';
import { NotesRepository } from '../modules/sample/repositories/NotesRepository';
import todoRegistry from '../modules/todo/store/todoRegistry';

// Create repositories
const notesRepository = new NotesRepository();

export const store = configureStore({
  reducer: {
    // Legacy slices
    notes: notesSlice,
    simpleTodo: simpleTodoSlice,
    
    // Module slices  
    auth: authSlice,
    poll: pollSlice,
    finance: financeSlice,
    task: taskSlice,
    sample: sampleSlice,
    chat: chatSlice,
    // Note: geomap, and analytics will be added when fully implemented
    // geomap: geomapSlice,
    // analytics: analyticsSlice,
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