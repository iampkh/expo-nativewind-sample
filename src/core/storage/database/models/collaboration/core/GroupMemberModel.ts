/**
 * GroupMemberModel - User membership in groups with role-based permissions
 * 
 * PURPOSE:
 * Links users to groups with specific roles and permissions.
 * Controls who can access what groups and what they can do inside them.
 * Handles notification preferences and member management.
 * 
 * RELATIONS:
 * - Belongs to a Group (the group they're part of)
 * - Belongs to a User (the member)
 * - Junction table for many-to-many User<->Group relationship
 * 
 * ROLE HIERARCHY:
 * - ADMIN: Full control (manage members, settings, delete group)
 * - MEMBER: Can create content and participate actively
 * - VIEWER: Read-only access, cannot create content
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, writer, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation } from '@nozbe/watermelondb'
import { GroupMemberRole } from '../types'
import UserModel from './UserModel'
import GroupModel from './GroupModel'

export default class GroupMemberModel extends Model {
  static table = 'group_members'

  static associations: Associations = {
    groups: { type: 'belongs_to', key: 'group_id' },
    users: { type: 'belongs_to', key: 'user_id' },
  }

  @text('group_id') groupId!: string
  @text('user_id') userId!: string
  @text('role') role!: GroupMemberRole
  @date('joined_at') joinedAt!: Date
  @field('is_muted') isMuted!: boolean

  // Relations
  @relation('groups', 'group_id') group!: Relation<GroupModel>
  @relation('users', 'user_id') user!: Relation<UserModel>

  /**
   * Updates member's role in the group
   * Only admins should be able to promote/demote other members
   * Used for member management and permission changes
   */
  @writer async updateRole(newRole: GroupMemberRole) {
    return await this.update(member => {
      member.role = newRole
    })
  }

  /**
   * Toggles notification muting for this member in this group
   * Muted members won't receive push notifications for group activity
   * Used for notification management and reducing spam
   */
  @writer async toggleMute() {
    return await this.update(member => {
      member.isMuted = !member.isMuted
    })
  }

  /**
   * Sets specific mute status for notifications
   * Explicit version of toggleMute for clearer intent
   * Used when you need to ensure a specific mute state
   */
  @writer async setMuted(muted: boolean) {
    return await this.update(member => {
      member.isMuted = muted
    })
  }

  // === ROLE CHECKING HELPERS ===
  // These getters help determine what UI elements to show and permissions to allow

  /** Returns true if member has admin privileges */
  get isAdmin() {
    return this.role === GroupMemberRole.ADMIN
  }

  /** Returns true if member has regular member privileges */
  get isMember() {
    return this.role === GroupMemberRole.MEMBER
  }

  /** Returns true if member has only viewing privileges */
  get isViewer() {
    return this.role === GroupMemberRole.VIEWER
  }

  /** Returns true if member can manage group settings and members */
  get canManageGroup() {
    return this.role === GroupMemberRole.ADMIN
  }

  /** Returns true if member can create posts, messages, polls, etc. */
  get canPost() {
    return this.role === GroupMemberRole.ADMIN || this.role === GroupMemberRole.MEMBER
  }

  /** Returns true if member can only read content (no posting) */
  get canOnlyView() {
    return this.role === GroupMemberRole.VIEWER
  }
}