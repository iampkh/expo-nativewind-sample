/**
 * NotificationModel - User alerts and activity updates
 * 
 * PURPOSE:
 * Manages all user notifications across the platform.
 * Links to specific entities (messages, posts, polls, etc.) by ID.
 * Supports read/unread status for UI indicators and badge counts.
 * 
 * RELATIONS:
 * - Belongs to User (notification recipient)
 * - References any entity via entityId (polymorphic reference)
 * 
 * NOTIFICATION TYPES:
 * - MESSAGE: New chat messages
 * - POST: New posts or comments
 * - POLL: Poll activity (new polls, voting reminders)
 * - FINANCE: Expense updates and settlements
 * - TODO: Task assignments and due dates
 * - SYSTEM: Platform announcements and updates
 * 
 * FEATURES:
 * - Read/unread status tracking
 * - Type-based filtering and styling
 * - Time-based organization
 * - Entity linking for navigation
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, writer, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation } from '@nozbe/watermelondb'
import { NotificationType } from '../types'
import UserModel from '../core/UserModel'

export default class NotificationModel extends Model {
  static table = 'notifications'

  static associations: Associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  }

  @text('user_id') userId!: string
  @text('type') type!: NotificationType
  @text('entity_id') entityId!: string // Points to message/post/poll/etc.
  @field('is_read') isRead!: boolean

  @readonly @date('created_at') createdAt!: Date

  // Relations
  @relation('users', 'user_id') user!: Relation<UserModel>

  @writer async markAsRead() {
    return await this.update(notification => {
      notification.isRead = true
    })
  }

  @writer async markAsUnread() {
    return await this.update(notification => {
      notification.isRead = false
    })
  }

  @writer async toggleRead() {
    return await this.update(notification => {
      notification.isRead = !notification.isRead
    })
  }

  // Helper methods
  get isUnread() {
    return !this.isRead
  }

  get isMessageNotification() {
    return this.type === NotificationType.MESSAGE
  }

  get isPostNotification() {
    return this.type === NotificationType.POST
  }

  get isPollNotification() {
    return this.type === NotificationType.POLL
  }

  get isFinanceNotification() {
    return this.type === NotificationType.FINANCE
  }

  get isTodoNotification() {
    return this.type === NotificationType.TODO
  }

  get isSystemNotification() {
    return this.type === NotificationType.SYSTEM
  }

  get typeLabel() {
    switch (this.type) {
      case NotificationType.MESSAGE: return 'Message'
      case NotificationType.POST: return 'Post'
      case NotificationType.POLL: return 'Poll'
      case NotificationType.FINANCE: return 'Finance'
      case NotificationType.TODO: return 'Task'
      case NotificationType.SYSTEM: return 'System'
      default: return 'Notification'
    }
  }

  get icon() {
    switch (this.type) {
      case NotificationType.MESSAGE: return '💬'
      case NotificationType.POST: return '📝'
      case NotificationType.POLL: return '📊'
      case NotificationType.FINANCE: return '💰'
      case NotificationType.TODO: return '✅'
      case NotificationType.SYSTEM: return '⚙️'
      default: return '🔔'
    }
  }

  get color() {
    switch (this.type) {
      case NotificationType.MESSAGE: return '#3b82f6' // blue
      case NotificationType.POST: return '#10b981' // green
      case NotificationType.POLL: return '#8b5cf6' // purple
      case NotificationType.FINANCE: return '#f59e0b' // yellow
      case NotificationType.TODO: return '#ef4444' // red
      case NotificationType.SYSTEM: return '#6b7280' // gray
      default: return '#6b7280'
    }
  }

  get timeAgo() {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - this.createdAt.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d ago`
    }
  }

  get isRecent() {
    const now = new Date()
    const diffInHours = (now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60)
    return diffInHours <= 24 // Within last 24 hours
  }
}