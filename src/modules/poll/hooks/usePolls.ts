/**
 * usePolls Hook
 * 
 * React hook for managing polls state and operations.
 * Provides a clean interface for components to interact with polls.
 */

import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { 
  fetchPollsByGroup, 
  createPoll as createPollThunk, 
  votePoll as votePollThunk,
  deletePoll as deletePollThunk,
  removeVote as removeVoteThunk
} from '../store/pollThunks'
import { clearError } from '../store/pollSlice'
import { CreatePollRequest, VotePollRequest, PollFilters, UsePollsReturn } from '../types/poll.types'

export const usePolls = (groupId: string): UsePollsReturn => {
  const dispatch = useDispatch<AppDispatch>()
  
  const { 
    polls, 
    loading, 
    error, 
    votingInProgress 
  } = useSelector((state: RootState) => state.poll)

  // Fetch polls for group
  const refreshPolls = useCallback(async (filters?: PollFilters) => {
    if (!groupId) return
    
    try {
      await dispatch(fetchPollsByGroup({ groupId, filters })).unwrap()
    } catch (error) {
      console.error('Failed to fetch polls:', error)
    }
  }, [dispatch, groupId])

  // Create new poll
  const createPoll = useCallback(async (data: CreatePollRequest) => {
    try {
      await dispatch(createPollThunk(data)).unwrap()
      // Polls are automatically added to state by the thunk
    } catch (error) {
      console.error('Failed to create poll:', error)
      throw error
    }
  }, [dispatch])

  // Vote in poll
  const votePoll = useCallback(async (data: VotePollRequest) => {
    try {
      await dispatch(votePollThunk(data)).unwrap()
    } catch (error) {
      console.error('Failed to vote in poll:', error)
      throw error
    }
  }, [dispatch])

  // Remove vote
  const removeVote = useCallback(async (pollId: string, userId: string, optionId?: string) => {
    try {
      await dispatch(removeVoteThunk({ pollId, userId, optionId })).unwrap()
    } catch (error) {
      console.error('Failed to remove vote:', error)
      throw error
    }
  }, [dispatch])

  // Delete poll
  const deletePoll = useCallback(async (pollId: string) => {
    try {
      await dispatch(deletePollThunk(pollId)).unwrap()
    } catch (error) {
      console.error('Failed to delete poll:', error)
      throw error
    }
  }, [dispatch])

  // Clear error
  const clearPollError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Load polls on mount and when groupId changes
  useEffect(() => {
    refreshPolls()
  }, [refreshPolls])

  return {
    polls,
    loading,
    error,
    votingInProgress,
    createPoll,
    votePoll,
    removeVote,
    deletePoll,
    refreshPolls,
    clearError: clearPollError,
  }
}