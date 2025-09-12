/**
 * GroupModel - Core collaboration space entity
 * 
 * PURPOSE:
 * The central unit of collaboration - can function as chat room, forum, 
 * poll space, finance tracker, or task board based on groupType.
 * Acts as a container for different types of collaborative activities.
 * 
 * RELATIONS:
 * - Belongs to creator (User who created it)
 * - Has many members via GroupMember (with roles and permissions)
 * - Contains messages, posts, polls, finance records, or tasks based on type
 * 
 * GROUP TYPES:
 * - CHAT: Real-time messaging (like WhatsApp groups)
 * - POST_THREAD: Structured discussions (like Reddit/forums)
 * - POLL: Voting and surveys
 * - FINANCE: Expense splitting (like Splitwise)
 * - TODO: Task management and delegation
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, writer, children, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Collection, Relation } from '@nozbe/watermelondb'
import { GroupType } from '../types'
import UserModel from './UserModel'

export default class GroupModel extends Model {
  static table = 'groups'

  static associations: Associations = {
    users: { type: 'belongs_to', key: 'created_by' },
    group_members: { type: 'has_many', foreignKey: 'group_id' },
    messages: { type: 'has_many', foreignKey: 'group_id' },
    posts: { type: 'has_many', foreignKey: 'group_id' },
    polls: { type: 'has_many', foreignKey: 'group_id' },
    finance_records: { type: 'has_many', foreignKey: 'group_id' },
    tasks: { type: 'has_many', foreignKey: 'group_id' },
  }

  @text('name') name!: string
  @text('description') description!: string
  @text('group_type') groupType!: GroupType
  @text('created_by') createdBy!: string
  @field('is_private') isPrivate!: boolean

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Relations
  @relation('users', 'created_by') creator!: Relation<UserModel>
  @children('group_members') members!: Collection<any>
  @children('messages') messages!: Collection<any>
  @children('posts') posts!: Collection<any>
  @children('polls') polls!: Collection<any>
  @children('finance_records') financeRecords!: Collection<any>
  @children('tasks') tasks!: Collection<any>

  /**
   * Updates group metadata (name, description, privacy)
   * Only admins should be able to call this method
   * Used in group settings and management screens
   */
  @writer async updateGroup(updates: {
    name?: string
    description?: string
    isPrivate?: boolean
  }) {
    return await this.update(group => {
      if (updates.name !== undefined) group.name = updates.name
      if (updates.description !== undefined) group.description = updates.description
      if (updates.isPrivate !== undefined) group.isPrivate = updates.isPrivate
    })
  }

  /**
   * Changes the group's functional type (chat -> poll, etc.)
   * This will affect which features are available and UI layout
   * Should be used carefully as it may make existing content inaccessible
   */
  @writer async changeGroupType(newType: GroupType) {
    return await this.update(group => {
      group.groupType = newType
    })
  }

  // === GROUP TYPE HELPERS ===
  // These getters help determine which UI components and features to show

  /** Returns true if this is a chat group (supports messages) */
  get isChatGroup() {
    return this.groupType === GroupType.CHAT
  }

  /** Returns true if this is a post/thread group (supports structured posts) */
  get isPostGroup() {
    return this.groupType === GroupType.POST_THREAD
  }

  /** Returns true if this is a poll group (supports voting) */
  get isPollGroup() {
    return this.groupType === GroupType.POLL
  }

  /** Returns true if this is a finance group (supports expense splitting) */
  get isFinanceGroup() {
    return this.groupType === GroupType.FINANCE
  }

  /** Returns true if this is a todo group (supports task management) */
  get isTodoGroup() {
    return this.groupType === GroupType.TODO
  }
}