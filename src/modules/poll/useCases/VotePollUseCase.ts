/**
 * Vote Poll Use Case
 * 
 * Business logic for voting in polls with validation and error handling.
 */

import { BaseUseCase } from '../../../core/useCases/BaseUseCase'
import { PollModuleRepository } from '../repositories/PollModuleRepository'
import { DatabaseResult } from '../../../shared/types/database.types'
import { VotePollRequest } from '../types/poll.types'

export class VotePollUseCase extends BaseUseCase<VotePollRequest, DatabaseResult<boolean>> {
  private pollRepository: PollModuleRepository

  constructor() {
    super()
    this.pollRepository = new PollModuleRepository()
  }

  async execute(data: VotePollRequest): Promise<DatabaseResult<boolean>> {
    try {
      // Validate input
      const validationResult = this.validateInput(data)
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error
        }
      }

      // Check if poll exists and is active
      const pollResult = await this.pollRepository.getPoll(data.pollId)
      if (!pollResult.success || !pollResult.data) {
        return {
          success: false,
          error: 'Poll not found'
        }
      }

      const poll = pollResult.data

      // Check if poll is expired
      if (poll.isExpired) {
        return {
          success: false,
          error: 'Cannot vote in expired poll'
        }
      }

      // Check existing votes for voting rules
      const userVotesResult = await this.pollRepository.getUserVotes(data.pollId, data.userId)
      if (userVotesResult.success && userVotesResult.data) {
        const existingVotes = userVotesResult.data

        // For single-choice polls, check if user already voted
        if (!poll.isMultipleChoice && existingVotes.length > 0) {
          return {
            success: false,
            error: 'You have already voted in this poll. Remove your current vote to vote again.'
          }
        }

        // For multiple-choice polls, check if user already voted for this specific option
        if (poll.isMultipleChoice && existingVotes.includes(data.optionId)) {
          return {
            success: false,
            error: 'You have already voted for this option'
          }
        }
      }

      // Cast the vote
      const result = await this.pollRepository.voteInPoll(data.pollId, data.optionId, data.userId)

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to vote in poll'
      }
    }
  }

  private validateInput(data: VotePollRequest): { isValid: boolean; error?: string } {
    if (!data.pollId?.trim()) {
      return { isValid: false, error: 'Poll ID is required' }
    }

    if (!data.optionId?.trim()) {
      return { isValid: false, error: 'Option ID is required' }
    }

    if (!data.userId?.trim()) {
      return { isValid: false, error: 'User ID is required' }
    }

    return { isValid: true }
  }
}