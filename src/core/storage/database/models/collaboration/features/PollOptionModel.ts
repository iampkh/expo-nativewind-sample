/**
 * PollOptionModel - Individual voting choices in polls
 * 
 * PURPOSE:
 * Represents each option/choice that users can vote for in polls.
 * Tracks vote counts and percentages for each option.
 * 
 * RELATIONS:
 * - Belongs to Poll (the poll this option belongs to)
 * - Has many PollVotes (votes cast for this option)
 * 
 * FEATURES:
 * - Vote counting and percentage calculation
 * - User vote tracking
 * - Option text management
 */

import { Model } from '@nozbe/watermelondb'
import { text, writer, relation, children } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation, Collection } from '@nozbe/watermelondb'
import PollModel from './PollModel'

export default class PollOptionModel extends Model {
  static table = 'poll_options'

  static associations: Associations = {
    polls: { type: 'belongs_to', key: 'poll_id' },
    poll_votes: { type: 'has_many', foreignKey: 'option_id' },
  }

  @text('poll_id') pollId!: string
  @text('option_text') optionText!: string

  // Relations
  @relation('polls', 'poll_id') poll!: Relation<PollModel>
  @children('poll_votes') votes!: Collection<any>

  @writer async updateText(newText: string) {
    return await this.update(option => {
      option.optionText = newText
    })
  }

  // Helper methods
  get isEmpty() {
    return !this.optionText || this.optionText.trim().length === 0
  }

  get preview() {
    const maxLength = 50
    if (this.optionText.length <= maxLength) {
      return this.optionText
    }
    return this.optionText.substring(0, maxLength) + '...'
  }

  async getVotesCount() {
    return await this.votes.query().fetchCount()
  }

  async getVotePercentage() {
    const poll = await this.poll.fetch()
    const totalVotes = await poll.getTotalVotes()
    const optionVotes = await this.getVotesCount()
    
    if (totalVotes === 0) return 0
    return (optionVotes / totalVotes) * 100
  }

  async hasVoteFromUser(userId: string) {
    const userVotes = await this.votes.query().fetch()
    const filteredVotes = userVotes.filter((vote: any) => vote.userId === userId)
    
    return filteredVotes.length > 0
  }
}