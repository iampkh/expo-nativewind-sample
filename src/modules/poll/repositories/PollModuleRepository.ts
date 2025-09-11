/**
 * Poll Module Repository
 * 
 * Module-specific repository that extends core PollRepository
 * with additional functionality specific to the poll module.
 */

import { PollRepository } from '../../../core/repositories/collaboration/poll/PollRepository'
import { DatabaseResult } from '../../../shared/types/database.types'
import { PollModel } from '../../../core/storage/database/models/collaboration'
import { PollResults } from '../types/poll.types'

export class PollModuleRepository {
  private pollRepository: PollRepository
  
  constructor() {
    this.pollRepository = PollRepository.getInstance()
  }

  /**
   * Get formatted poll results with additional UI-specific data
   */
  async getPollResultsForUI(pollId: string): Promise<DatabaseResult<PollResults>> {
    const result = await this.pollRepository.getPollResults(pollId)
    
    if (!result.success || !result.data) {
      return result as DatabaseResult<PollResults>
    }

    // Add UI-specific formatting
    const formattedResults: PollResults = {
      poll: result.data.poll,
      options: result.data.options.map(option => ({
        ...option,
        percentage: Math.round(option.percentage * 10) / 10 // Round to 1 decimal
      })),
      totalVotes: result.data.totalVotes,
      uniqueVoters: result.data.uniqueVoters
    }

    return {
      success: true,
      data: formattedResults
    }
  }

  /**
   * Get polls with user vote status
   */
  async getPollsWithUserVotes(groupId: string, userId: string): Promise<DatabaseResult<Array<{
    poll: PollModel
    userVotes: string[]
    hasVoted: boolean
  }>>> {
    try {
      const pollsResult = await this.pollRepository.getPollsByGroup(groupId)
      
      if (!pollsResult.success || !pollsResult.data) {
        return pollsResult as any
      }

      const pollsWithVotes = await Promise.all(
        pollsResult.data.map(async (poll) => {
          const votesResult = await this.pollRepository.getUserVotes(poll.id, userId)
          const userVotes = votesResult.success ? votesResult.data || [] : []
          
          return {
            poll,
            userVotes,
            hasVoted: userVotes.length > 0
          }
        })
      )

      return {
        success: true,
        data: pollsWithVotes
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get polls with user votes'
      }
    }
  }

  /**
   * Delegate to core repository methods
   */
  async createPoll(pollData: any) {
    return this.pollRepository.createPoll(pollData)
  }

  async getPoll(pollId: string) {
    return this.pollRepository.getPoll(pollId)
  }

  async updatePoll(pollId: string, updates: any) {
    return this.pollRepository.updatePoll(pollId, updates)
  }

  async deletePoll(pollId: string) {
    return this.pollRepository.deletePoll(pollId)
  }

  async getPollsByGroup(groupId: string, filters?: any) {
    return this.pollRepository.getPollsByGroup(groupId, filters)
  }

  async voteInPoll(pollId: string, optionId: string, userId: string) {
    return this.pollRepository.voteInPoll(pollId, optionId, userId)
  }

  async removeVote(pollId: string, userId: string, optionId?: string) {
    return this.pollRepository.removeVote(pollId, userId, optionId)
  }

  async getUserVotes(pollId: string, userId: string) {
    return this.pollRepository.getUserVotes(pollId, userId)
  }

  async extendPollExpiry(pollId: string, additionalHours?: number) {
    return this.pollRepository.extendPollExpiry(pollId, additionalHours)
  }

  async getExpiringPolls(groupId: string, hoursUntilExpiry?: number) {
    return this.pollRepository.getExpiringPolls(groupId, hoursUntilExpiry)
  }
}