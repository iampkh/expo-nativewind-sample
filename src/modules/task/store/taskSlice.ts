/**
 * Task Redux Slice
 * 
 * Manages task state using Redux Toolkit.
 * Handles task loading, creation, status updates, and error states.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TaskModel } from '../../../core/storage/database/models/collaboration'
import { TaskState, TaskCounts } from '../types/task.types'

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  taskCounts: {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0,
  },
  loading: false,
  error: null,
  updatingStatus: false,
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Loading States
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    setUpdatingStatus: (state, action: PayloadAction<boolean>) => {
      state.updatingStatus = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // Task Data Management
    setTasks: (state, action: PayloadAction<TaskModel[]>) => {
      state.tasks = action.payload
      state.error = null
    },
    
    addTask: (state, action: PayloadAction<TaskModel>) => {
      state.tasks.unshift(action.payload) // Add to beginning
      state.error = null
    },
    
    updateTask: (state, action: PayloadAction<TaskModel>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
      
      // Update current task if it matches
      if (state.currentTask?.id === action.payload.id) {
        state.currentTask = action.payload
      }
    },
    
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
      
      // Clear current task if it was deleted
      if (state.currentTask?.id === action.payload) {
        state.currentTask = null
      }
    },
    
    // Current Task Management
    setCurrentTask: (state, action: PayloadAction<TaskModel | null>) => {
      state.currentTask = action.payload
    },
    
    // Task Counts Management
    setTaskCounts: (state, action: PayloadAction<TaskCounts>) => {
      state.taskCounts = action.payload
    },
    
    updateTaskCounts: (state, action: PayloadAction<Partial<TaskCounts>>) => {
      state.taskCounts = { ...state.taskCounts, ...action.payload }
    },
    
    // Bulk Operations
    bulkUpdateTasks: (state, action: PayloadAction<TaskModel[]>) => {
      action.payload.forEach(updatedTask => {
        const index = state.tasks.findIndex(task => task.id === updatedTask.id)
        if (index !== -1) {
          state.tasks[index] = updatedTask
        }
      })
    },
    
    // Reset State
    resetTaskState: (state) => {
      Object.assign(state, initialState)
    },
    
    // Clear Errors
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setUpdatingStatus,
  setError,
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setCurrentTask,
  setTaskCounts,
  updateTaskCounts,
  bulkUpdateTasks,
  resetTaskState,
  clearError,
} = taskSlice.actions

export default taskSlice.reducer