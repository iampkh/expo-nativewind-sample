/**
 * PollVoteModel - Individual user votes in polls
 * 
 * PURPOSE:
 * Records each vote cast by users in polls.
 * Tracks who voted for what option and when.
 * Enforces voting rules (single vs multiple choice).
 * 
 * RELATIONS:
 * - Belongs to Poll (the poll being voted in)
 * - Belongs to PollOption (the chosen option)
 * - Belongs to User (the voter)
 * 
 * FEATURES:
 * - Vote validation and rule enforcement
 * - Timestamp tracking
 * - Vote change detection
 * - Expiration checking
 */

import { Model } from '@nozbe/watermelondb'
import { text, date, readonly, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation } from '@nozbe/watermelondb'
import PollModel from './PollModel'
import PollOptionModel from './PollOptionModel'
import UserModel from '../core/UserModel'

export default class PollVoteModel extends Model {
  static table = 'poll_votes'

  static associations: Associations = {
    polls: { type: 'belongs_to', key: 'poll_id' },
    poll_options: { type: 'belongs_to', key: 'option_id' },
    users: { type: 'belongs_to', key: 'user_id' },
  }

  @text('poll_id') pollId!: string
  @text('option_id') optionId!: string
  @text('user_id') userId!: string

  @readonly @date('created_at') createdAt!: Date

  // Relations
  @relation('polls', 'poll_id') poll!: Relation<PollModel>
  @relation('poll_options', 'option_id') option!: Relation<PollOptionModel>
  @relation('users', 'user_id') voter!: Relation<UserModel>

  // Helper methods
  async isValidVote() {
    const poll = await this.poll.fetch()
    
    // Check if poll is expired
    if (poll.isExpired) return false
    
    // Check if user already voted (for single-choice polls)
    if (!poll.isMultipleChoice) {
      const allVotes = await poll.votes.query().fetch()
      const existingVotes = allVotes.filter((vote: any) => vote.userId === this.userId)
      
      // Allow if this is the only vote or if we're updating existing vote
      return existingVotes.length <= 1
    }
    
    return true
  }

  async getVoteTimestamp() {
    return this.createdAt
  }

  async canBeChanged() {
    const poll = await this.poll.fetch()
    return !poll.isExpired
  }
}