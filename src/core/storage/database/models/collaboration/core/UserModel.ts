/**
 * UserModel - Core user entity for the collaboration platform
 * 
 * PURPOSE:
 * Represents a platform user with authentication, profile, and presence data.
 * Central entity that connects to all user activities across channels.
 * 
 * RELATIONS:
 * - Creates channels (one-to-many via created_by)
 * - Member of multiple channels (many-to-many via channel_members)
 * - Sends messages, creates posts, votes in polls, manages finances, and tasks
 * - Receives notifications and manages multiple device sessions
 * 
 * KEY FEATURES:
 * - Profile management with avatar and status
 * - Online/offline presence tracking
 * - Authentication via username/email/phone
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, writer, children } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Collection } from '@nozbe/watermelondb'

export default class UserModel extends Model {
  static table = 'users'

  static associations: Associations = {
    groups: { type: 'has_many', foreignKey: 'created_by' },
    group_members: { type: 'has_many', foreignKey: 'user_id' },
    messages: { type: 'has_many', foreignKey: 'sender_id' },
    posts: { type: 'has_many', foreignKey: 'author_id' },
    post_comments: { type: 'has_many', foreignKey: 'author_id' },
    post_reactions: { type: 'has_many', foreignKey: 'user_id' },
    polls: { type: 'has_many', foreignKey: 'created_by' },
    poll_votes: { type: 'has_many', foreignKey: 'user_id' },
    finance_records: { type: 'has_many', foreignKey: 'created_by' },
    finance_splits: { type: 'has_many', foreignKey: 'user_id' },
    tasks: { type: 'has_many', foreignKey: 'created_by' },
    assigned_tasks: { type: 'has_many', foreignKey: 'assigned_to' },
    notifications: { type: 'has_many', foreignKey: 'user_id' },
    devices: { type: 'has_many', foreignKey: 'user_id' },
  }

  @text('username') username!: string
  @text('email') email!: string
  @text('phone_number') phoneNumber!: string
  @text('password_hash') passwordHash!: string
  @text('display_name') displayName!: string
  @text('profile_picture_url') profilePictureUrl!: string
  @text('status_message') statusMessage!: string
  @date('last_seen_at') lastSeenAt!: Date
  @field('is_online') isOnline!: boolean

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Associations
  @children('groups') createdGroups!: Collection<any>
  @children('group_members') groupMemberships!: Collection<any>
  @children('messages') sentMessages!: Collection<any>
  @children('posts') authoredPosts!: Collection<any>
  @children('post_comments') postComments!: Collection<any>
  @children('post_reactions') postReactions!: Collection<any>
  @children('polls') createdPolls!: Collection<any>
  @children('poll_votes') pollVotes!: Collection<any>
  @children('finance_records') createdFinanceRecords!: Collection<any>
  @children('finance_splits') financeSplits!: Collection<any>
  @children('tasks') createdTasks!: Collection<any>
  @children('tasks') assignedTasks!: Collection<any>
  @children('notifications') notifications!: Collection<any>
  @children('devices') devices!: Collection<any>

  /**
   * Updates user profile information
   * Allows partial updates - only provided fields are changed
   * Used for settings screen and profile editing
   */
  @writer async updateProfile(updates: {
    displayName?: string
    email?: string
    phoneNumber?: string
    profilePictureUrl?: string
    statusMessage?: string
  }) {
    return await this.update(user => {
      if (updates.displayName !== undefined) user.displayName = updates.displayName
      if (updates.email !== undefined) user.email = updates.email
      if (updates.phoneNumber !== undefined) user.phoneNumber = updates.phoneNumber
      if (updates.profilePictureUrl !== undefined) user.profilePictureUrl = updates.profilePictureUrl
      if (updates.statusMessage !== undefined) user.statusMessage = updates.statusMessage
    })
  }

  /**
   * Sets user online/offline status
   * Automatically updates lastSeenAt when going offline
   * Used for presence indicators and "last seen" timestamps
   */
  @writer async setOnlineStatus(isOnline: boolean) {
    return await this.update(user => {
      user.isOnline = isOnline
      if (!isOnline) {
        user.lastSeenAt = new Date()
      }
    })
  }

  /**
   * Updates the last activity timestamp
   * Called periodically to track user presence and activity
   * Used for determining online status and session management
   */
  @writer async updateLastSeen() {
    return await this.update(user => {
      user.lastSeenAt = new Date()
    })
  }
}