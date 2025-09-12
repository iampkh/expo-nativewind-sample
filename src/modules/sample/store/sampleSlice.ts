/**
 * Sample Redux Slice
 * 
 * Manages sample state using Redux Toolkit.
 * Handles sample loading, creation, updates, and error states.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SampleState, SampleItem } from '../types/sample.types'

const initialState: SampleState = {
  samples: [],
  currentSample: null,
  loading: false,
  error: null,
  processing: false,
}

const sampleSlice = createSlice({
  name: 'sample',
  initialState,
  reducers: {
    // Loading States
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // Sample Data Management
    setSamples: (state, action: PayloadAction<SampleItem[]>) => {
      state.samples = action.payload
      state.error = null
    },
    
    addSample: (state, action: PayloadAction<SampleItem>) => {
      state.samples.unshift(action.payload) // Add to beginning
      state.error = null
    },
    
    updateSample: (state, action: PayloadAction<SampleItem>) => {
      const index = state.samples.findIndex(sample => sample.id === action.payload.id)
      if (index !== -1) {
        state.samples[index] = action.payload
      }
      
      // Update current sample if it matches
      if (state.currentSample?.id === action.payload.id) {
        state.currentSample = action.payload
      }
    },
    
    removeSample: (state, action: PayloadAction<string>) => {
      state.samples = state.samples.filter(sample => sample.id !== action.payload)
      
      // Clear current sample if it was deleted
      if (state.currentSample?.id === action.payload) {
        state.currentSample = null
      }
    },
    
    // Current Sample Management
    setCurrentSample: (state, action: PayloadAction<SampleItem | null>) => {
      state.currentSample = action.payload
    },
    
    // Reset State
    resetSampleState: (state) => {
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
  setProcessing,
  setError,
  setSamples,
  addSample,
  updateSample,
  removeSample,
  setCurrentSample,
  resetSampleState,
  clearError,
} = sampleSlice.actions

export default sampleSlice.reducer