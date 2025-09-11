/**
 * PollModel - Voting and surveys for poll channels
 * 
 * PURPOSE:
 * Enables democratic decision making through polls and surveys.
 * Supports both single-choice and multiple-choice voting.
 * Optional expiration dates for time-limited polls.
 * 
 * RELATIONS:
 * - Belongs to Channel (the voting space)
 * - Belongs to User (poll creator)
 * - Has many PollOptions (voting choices)
 * - Has many PollVotes (user votes)
 * 
 * POLL TYPES:
 * - Single choice: Traditional voting (one vote per user)
 * - Multiple choice: Allow users to select multiple options
 * 
 * FEATURES:
 * - Time-based expiration
 * - Vote counting and analytics
 * - Real-time results
 * - User participation tracking
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, writer, relation, children } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation, Collection } from '@nozbe/watermelondb'
import UserModel from '../core/UserModel'
import GroupModel from '../core/GroupModel'

export default class PollModel extends Model {
  static table = 'polls'

  static associations: Associations = {
    groups: { type: 'belongs_to', key: 'group_id' },
    users: { type: 'belongs_to', key: 'created_by' },
    poll_options: { type: 'has_many', foreignKey: 'poll_id' },
    poll_votes: { type: 'has_many', foreignKey: 'poll_id' },
  }

  @text('group_id') groupId!: string
  @text('question') question!: string
  @text('created_by') createdBy!: string
  @field('is_multiple_choice') isMultipleChoice!: boolean
  @date('expires_at') expiresAt!: Date

  @readonly @date('created_at') createdAt!: Date

  // Relations
  @relation('groups', 'group_id') group!: Relation<GroupModel>
  @relation('users', 'created_by') creator!: Relation<UserModel>
  @children('poll_options') options!: Collection<any>
  @children('poll_votes') votes!: Collection<any>

  @writer async updateQuestion(newQuestion: string) {
    return await this.update(poll => {
      poll.question = newQuestion
    })
  }

  @writer async setExpiry(expiryDate: Date) {
    return await this.update(poll => {
      poll.expiresAt = expiryDate
    })
  }

  @writer async extendExpiry(additionalHours: number = 24) {
    return await this.update(poll => {
      const currentExpiry = poll.expiresAt || new Date()
      const newExpiry = new Date(currentExpiry.getTime() + (additionalHours * 60 * 60 * 1000))
      poll.expiresAt = newExpiry
    })
  }

  // Helper methods
  get isExpired() {
    if (!this.expiresAt) return false
    return new Date() > this.expiresAt
  }

  get timeRemaining() {
    if (!this.expiresAt) return null
    const now = new Date()
    const remaining = this.expiresAt.getTime() - now.getTime()
    return remaining > 0 ? remaining : 0
  }

  get hasExpiry() {
    return !!this.expiresAt
  }

  get allowsMultipleVotes() {
    return this.isMultipleChoice
  }

  async getTotalVotes() {
    return await this.votes.query().fetchCount()
  }

  async getOptionsCount() {
    return await this.options.query().fetchCount()
  }

  async getVotesByOption(optionId: string) {
    const votes = await this.votes.query().fetch()
    return votes.filter((vote: any) => vote.optionId === optionId).length
  }
}