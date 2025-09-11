/**
 * Poll Redux Thunks
 * 
 * Async actions for poll operations using Redux Toolkit.
 * Coordinates between repositories and state management.
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import { PollRepository } from '../../../core/repositories/collaboration/poll/PollRepository'
import { CreatePollRequest, VotePollRequest, PollFilters } from '../types/poll.types'
import { 
  setLoading, 
  setVotingInProgress, 
  setError, 
  setPolls, 
  addPoll, 
  updatePoll, 
  setCurrentPoll 
} from './pollSlice'

const pollRepository = PollRepository.getInstance()

// Fetch Polls for Group
export const fetchPollsByGroup = createAsyncThunk(
  'poll/fetchPollsByGroup',
  async ({ groupId, filters }: { groupId: string; filters?: PollFilters }, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await pollRepository.getPollsByGroup(groupId, filters)
      
      if (result.success && result.data) {
        dispatch(setPolls(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch polls'))
        throw new Error(result.error || 'Failed to fetch polls')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch polls'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Create New Poll
export const createPoll = createAsyncThunk(
  'poll/createPoll',
  async (pollData: CreatePollRequest, { dispatch, getState }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const createData = {
        groupId: pollData.groupId,
        createdBy: 'current-user-id', // TODO: Get from auth state
        question: pollData.question,
        options: pollData.options,
        isMultipleChoice: pollData.isMultipleChoice,
        expiresAt: pollData.expiresAt,
      }
      
      const result = await pollRepository.createPoll(createData)
      
      if (result.success && result.data) {
        dispatch(addPoll(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to create poll'))
        throw new Error(result.error || 'Failed to create poll')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create poll'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Vote in Poll
export const votePoll = createAsyncThunk(
  'poll/votePoll',
  async ({ pollId, optionId, userId }: VotePollRequest, { dispatch }) => {
    dispatch(setVotingInProgress(true))
    dispatch(setError(null))
    
    try {
      const result = await pollRepository.voteInPoll(pollId, optionId, userId)
      
      if (result.success) {
        // Refresh the poll to get updated vote counts
        const pollResult = await pollRepository.getPoll(pollId)
        if (pollResult.success && pollResult.data) {
          dispatch(updatePoll(pollResult.data))
        }
        return true
      } else {
        dispatch(setError(result.error || 'Failed to vote'))
        throw new Error(result.error || 'Failed to vote')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to vote'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setVotingInProgress(false))
    }
  }
)

// Fetch Poll by ID
export const fetchPoll = createAsyncThunk(
  'poll/fetchPoll',
  async (pollId: string, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await pollRepository.getPoll(pollId)
      
      if (result.success && result.data) {
        dispatch(setCurrentPoll(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch poll'))
        throw new Error(result.error || 'Failed to fetch poll')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch poll'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Delete Poll
export const deletePoll = createAsyncThunk(
  'poll/deletePoll',
  async (pollId: string, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await pollRepository.deletePoll(pollId)
      
      if (result.success) {
        // Remove from state after successful deletion
        return pollId
      } else {
        dispatch(setError(result.error || 'Failed to delete poll'))
        throw new Error(result.error || 'Failed to delete poll')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete poll'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Remove Vote
export const removeVote = createAsyncThunk(
  'poll/removeVote',
  async ({ pollId, userId, optionId }: { pollId: string; userId: string; optionId?: string }, { dispatch }) => {
    dispatch(setVotingInProgress(true))
    dispatch(setError(null))
    
    try {
      const result = await pollRepository.removeVote(pollId, userId, optionId)
      
      if (result.success) {
        // Refresh the poll to get updated vote counts
        const pollResult = await pollRepository.getPoll(pollId)
        if (pollResult.success && pollResult.data) {
          dispatch(updatePoll(pollResult.data))
        }
        return true
      } else {
        dispatch(setError(result.error || 'Failed to remove vote'))
        throw new Error(result.error || 'Failed to remove vote')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove vote'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setVotingInProgress(false))
    }
  }
)