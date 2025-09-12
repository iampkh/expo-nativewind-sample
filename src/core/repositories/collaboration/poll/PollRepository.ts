/**
 * PollRepository - Repository for poll management operations
 * 
 * PURPOSE:
 * Handles poll creation, management, and voting operations.
 * Provides complete poll lifecycle management from creation to results analysis.
 * Supports both single-choice and multiple-choice polls with expiration.
 * 
 * FEATURES:
 * - Poll CRUD operations
 * - Expiration management
 * - Vote counting and analysis
 * - Real-time results calculation
 * - Poll status tracking (active, expired)
 */

import { database } from '../../../storage/database'
import { DatabaseResult } from '../../../../shared/types/database.types'
import { PollModel, PollOptionModel, PollVoteModel } from '../../../storage/database/models/collaboration'
import { Q } from '@nozbe/watermelondb'

export interface CreatePollData {
  groupId: string
  createdBy: string
  question: string
  isMultipleChoice?: boolean
  expiresAt?: Date
  options: string[] // Array of option texts
}

export interface UpdatePollData {
  question?: string
  expiresAt?: Date
}

export interface PollFilters {
  isActive?: boolean // Not expired
  isExpired?: boolean
  createdBy?: string
  hasExpiry?: boolean
}

export class PollRepository {
  private static instance: PollRepository
  
  private constructor() {}
  
  public static getInstance(): PollRepository {
    if (!PollRepository.instance) {
      PollRepository.instance = new PollRepository()
    }
    return PollRepository.instance
  }

  /**
   * Creates a new poll with options
   * Automatically creates poll options and validates input
   */
  async createPoll(pollData: CreatePollData): Promise<DatabaseResult<PollModel>> {
    try {
      if (!pollData.options || pollData.options.length < 2) {
        return { success: false, error: 'Poll must have at least 2 options' }
      }

      if (pollData.options.length > 10) {
        return { success: false, error: 'Poll cannot have more than 10 options' }
      }

      const newPoll = await database.write(async () => {
        // Create the poll
        const pollCollection = database.get<PollModel>('polls')
        const poll = await pollCollection.create(pollRecord => {
          pollRecord.groupId = pollData.groupId
          pollRecord.createdBy = pollData.createdBy
          pollRecord.question = pollData.question
          pollRecord.isMultipleChoice = pollData.isMultipleChoice || false
          if (pollData.expiresAt) {
            pollRecord.expiresAt = pollData.expiresAt
          }
        })

        // Create poll options
        const optionCollection = database.get<PollOptionModel>('poll_options')
        await Promise.all(
          pollData.options.map(optionText =>
            optionCollection.create((option) => {
              option.pollId = poll.id
              option.optionText = optionText.trim()
            })
          )
        )

        return poll
      })

      return { success: true, data: newPoll }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create poll' 
      }
    }
  }

  /**
   * Retrieves a single poll by ID with its options
   */
  async getPoll(pollId: string): Promise<DatabaseResult<PollModel>> {
    try {
      const poll = await database.get<PollModel>('polls').find(pollId)
      
      if (!poll) {
        return { success: false, error: 'Poll not found' }
      }

      return { success: true, data: poll }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve poll' 
      }
    }
  }

  /**
   * Updates poll information (question, expiry)
   * Cannot change poll type or options after creation
   */
  async updatePoll(pollId: string, updates: UpdatePollData): Promise<DatabaseResult<PollModel>> {
    try {
      const updatedPoll = await database.write(async () => {
        const poll = await database.get<PollModel>('polls').find(pollId)
        
        // Check if poll is expired
        if (poll.isExpired) {
          throw new Error('Cannot update expired poll')
        }

        return await poll.update(pollRecord => {
          if (updates.question !== undefined) pollRecord.question = updates.question
          if (updates.expiresAt !== undefined) pollRecord.expiresAt = updates.expiresAt
        })
      })

      return { success: true, data: updatedPoll }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update poll' 
      }
    }
  }

  /**
   * Deletes a poll and all its options/votes
   * Should be restricted to poll creator or group admins
   */
  async deletePoll(pollId: string): Promise<DatabaseResult<boolean>> {
    try {
      await database.write(async () => {
        // Delete all votes first
        const votes = await database.get<PollVoteModel>('poll_votes').query(Q.where('poll_id', pollId)).fetch()
        await Promise.all(votes.map((vote) => vote.destroyPermanently()))

        // Delete all options
        const options = await database.get<PollOptionModel>('poll_options').query(Q.where('poll_id', pollId)).fetch()
        await Promise.all(options.map((option) => option.destroyPermanently()))

        // Delete the poll
        const poll = await database.get<PollModel>('polls').find(pollId)
        await poll.destroyPermanently()
      })

      return { success: true, data: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete poll' 
      }
    }
  }

  /**
   * Retrieves all polls for a specific group with filtering
   */
  async getPollsByGroup(groupId: string, filters?: PollFilters): Promise<DatabaseResult<PollModel[]>> {
    try {
      const conditions = [Q.where('group_id', groupId)]
      
      if (filters?.createdBy) {
        conditions.push(Q.where('created_by', filters.createdBy))
      }
      
      const query = database.get<PollModel>('polls').query(
        conditions.length === 1 ? conditions[0] : Q.and(...conditions)
      )

      const polls = await query.fetch()
      
      // Post-process for complex filters
      let filteredPolls = polls
      
      if (filters?.isActive !== undefined) {
        filteredPolls = polls.filter(poll => !poll.isExpired === filters.isActive)
      }
      
      if (filters?.isExpired !== undefined) {
        filteredPolls = polls.filter(poll => poll.isExpired === filters.isExpired)
      }
      
      if (filters?.hasExpiry !== undefined) {
        filteredPolls = polls.filter(poll => poll.hasExpiry === filters.hasExpiry)
      }

      // Sort by creation date (newest first)
      filteredPolls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      return { success: true, data: filteredPolls }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve polls' 
      }
    }
  }

  /**
   * Casts a vote in a poll
   * Validates voting rules and poll status
   */
  async voteInPoll(pollId: string, optionId: string, userId: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await database.write(async () => {
        const poll = await database.get<PollModel>('polls').find(pollId)
        
        // Check if poll is expired
        if (poll.isExpired) {
          throw new Error('Cannot vote in expired poll')
        }

        // Check if user already voted
        const existingVotes = await database.get<PollVoteModel>('poll_votes')
          .query(Q.and(Q.where('poll_id', pollId), Q.where('user_id', userId)))
          .fetch()

        // For single-choice polls, remove existing votes
        if (!poll.isMultipleChoice && existingVotes.length > 0) {
          await Promise.all(existingVotes.map((vote: any) => vote.destroyPermanently()))
        }

        // For multiple-choice polls, check if user already voted for this option
        if (poll.isMultipleChoice) {
          const existingVoteForOption = existingVotes.find((vote) => vote.optionId === optionId)
          if (existingVoteForOption) {
            throw new Error('User already voted for this option')
          }
        }

        // Create new vote
        const voteCollection = database.get<PollVoteModel>('poll_votes')
        await voteCollection.create((vote) => {
          vote.pollId = pollId
          vote.optionId = optionId
          vote.userId = userId
        })

        return true
      })

      return { success: true, data: result }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to vote in poll' 
      }
    }
  }

  /**
   * Removes a user's vote from a poll
   * For single-choice: removes their vote, for multiple-choice: removes vote for specific option
   */
  async removeVote(pollId: string, userId: string, optionId?: string): Promise<DatabaseResult<boolean>> {
    try {
      await database.write(async () => {
        const poll = await database.get<PollModel>('polls').find(pollId)
        
        if (poll.isExpired) {
          throw new Error('Cannot modify votes in expired poll')
        }

        const conditions = [Q.where('poll_id', pollId), Q.where('user_id', userId)]

        // For multiple-choice polls, specify which option to remove
        if (optionId) {
          conditions.push(Q.where('option_id', optionId))
        }
        
        const query = database.get<PollVoteModel>('poll_votes')
          .query(Q.and(...conditions))

        const votes = await query.fetch()
        await Promise.all(votes.map((vote) => vote.destroyPermanently()))
      })

      return { success: true, data: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove vote' 
      }
    }
  }

  /**
   * Gets detailed poll results with vote counts and percentages
   */
  async getPollResults(pollId: string): Promise<DatabaseResult<{
    poll: PollModel
    options: Array<{
      id: string
      text: string
      votes: number
      percentage: number
    }>
    totalVotes: number
    uniqueVoters: number
  }>> {
    try {
      const poll = await database.get<PollModel>('polls').find(pollId)
      
      // Get all options
      const options = await database.get<PollOptionModel>('poll_options')
        .query(Q.where('poll_id', pollId))
        .fetch()

      // Get all votes
      const votes = await database.get<PollVoteModel>('poll_votes')
        .query(Q.where('poll_id', pollId))
        .fetch()

      const totalVotes = votes.length
      const uniqueVoters = new Set(votes.map((vote) => vote.userId)).size

      // Calculate results for each option
      const results = await Promise.all(
        options.map(async (option) => {
          const optionVotes = votes.filter((vote) => vote.optionId === option.id)
          const voteCount = optionVotes.length
          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0

          return {
            id: option.id,
            text: option.optionText,
            votes: voteCount,
            percentage: Math.round(percentage * 10) / 10 // Round to 1 decimal
          }
        })
      )

      // Sort by vote count (descending)
      results.sort((a, b) => b.votes - a.votes)

      return {
        success: true,
        data: {
          poll,
          options: results,
          totalVotes,
          uniqueVoters
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get poll results' 
      }
    }
  }

  /**
   * Checks if a user has voted in a poll
   * Returns which options they voted for (useful for UI state)
   */
  async getUserVotes(pollId: string, userId: string): Promise<DatabaseResult<string[]>> {
    try {
      const votes = await database.get<PollVoteModel>('poll_votes')
        .query(Q.and(Q.where('poll_id', pollId), Q.where('user_id', userId)))
        .fetch()

      const optionIds = votes.map((vote) => vote.optionId)
      return { success: true, data: optionIds }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get user votes' 
      }
    }
  }

  /**
   * Extends poll expiration time
   * Useful for keeping active discussions going
   */
  async extendPollExpiry(pollId: string, additionalHours: number = 24): Promise<DatabaseResult<PollModel>> {
    try {
      const updatedPoll = await database.write(async () => {
        const poll = await database.get<PollModel>('polls').find(pollId)
        
        const currentExpiry = poll.expiresAt || new Date()
        const newExpiry = new Date(currentExpiry.getTime() + (additionalHours * 60 * 60 * 1000))
        
        return await poll.update(pollRecord => {
          pollRecord.expiresAt = newExpiry
        })
      })

      return { success: true, data: updatedPoll }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to extend poll expiry' 
      }
    }
  }

  /**
   * Gets active polls that are about to expire (for notifications)
   */
  async getExpiringPolls(groupId: string, hoursUntilExpiry: number = 24): Promise<DatabaseResult<PollModel[]>> {
    try {
      const polls = await database.get<PollModel>('polls')
        .query(Q.where('group_id', groupId))
        .fetch()

      const now = new Date()
      const expiryThreshold = new Date(now.getTime() + (hoursUntilExpiry * 60 * 60 * 1000))

      const expiringPolls = polls.filter((poll) => {
        return poll.hasExpiry && 
               !poll.isExpired && 
               poll.expiresAt && 
               poll.expiresAt <= expiryThreshold
      })

      return { success: true, data: expiringPolls }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get expiring polls' 
      }
    }
  }
}