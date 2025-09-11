/**
 * Poll Redux Slice
 * 
 * Manages poll state using Redux Toolkit.
 * Handles poll loading, creation, voting, and error states.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PollModel } from '../../../core/storage/database/models/collaboration'
import { PollState, PollResults } from '../types/poll.types'

const initialState: PollState = {
  polls: [],
  currentPoll: null,
  loading: false,
  error: null,
  votingInProgress: false,
}

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    // Loading States
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    setVotingInProgress: (state, action: PayloadAction<boolean>) => {
      state.votingInProgress = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // Poll Data Management
    setPolls: (state, action: PayloadAction<PollModel[]>) => {
      state.polls = action.payload
      state.error = null
    },
    
    addPoll: (state, action: PayloadAction<PollModel>) => {
      state.polls.unshift(action.payload) // Add to beginning
      state.error = null
    },
    
    updatePoll: (state, action: PayloadAction<PollModel>) => {
      const index = state.polls.findIndex(poll => poll.id === action.payload.id)
      if (index !== -1) {
        state.polls[index] = action.payload
      }
      
      // Update current poll if it matches
      if (state.currentPoll?.id === action.payload.id) {
        state.currentPoll = action.payload
      }
    },
    
    removePoll: (state, action: PayloadAction<string>) => {
      state.polls = state.polls.filter(poll => poll.id !== action.payload)
      
      // Clear current poll if it was deleted
      if (state.currentPoll?.id === action.payload) {
        state.currentPoll = null
      }
    },
    
    // Current Poll Management
    setCurrentPoll: (state, action: PayloadAction<PollModel | null>) => {
      state.currentPoll = action.payload
    },
    
    // Reset State
    resetPollState: (state) => {
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
  setVotingInProgress,
  setError,
  setPolls,
  addPoll,
  updatePoll,
  removePoll,
  setCurrentPoll,
  resetPollState,
  clearError,
} = pollSlice.actions

export default pollSlice.reducer