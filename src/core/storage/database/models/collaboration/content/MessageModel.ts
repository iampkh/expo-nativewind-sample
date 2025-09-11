/**
 * MessageModel - Real-time chat messages for chat-type groups
 * 
 * PURPOSE:
 * Handles instant messaging within chat groups (like WhatsApp/Slack).
 * Supports text, media attachments, replies, and system messages.
 * Includes soft deletion to maintain conversation flow and context.
 * 
 * RELATIONS:
 * - Belongs to Group (the chat room)
 * - Belongs to User (message sender)
 * - Can reference another Message (for replies/threads)
 * 
 * MESSAGE TYPES:
 * - TEXT: Plain text messages
 * - IMAGE/VIDEO/FILE: Media messages with URLs
 * - SYSTEM: Automated notifications (user joined, settings changed)
 * 
 * FEATURES:
 * - Reply chains and threading
 * - Soft deletion (preserves conversation context)
 * - Media attachment support
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, writer, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation } from '@nozbe/watermelondb'
import { MessageContentType } from '../types'
import UserModel from '../core/UserModel'
import GroupModel from '../core/GroupModel'

export default class MessageModel extends Model {
  static table = 'messages'

  static associations: Associations = {
    groups: { type: 'belongs_to', key: 'group_id' },
    users: { type: 'belongs_to', key: 'sender_id' },
    messages: { type: 'belongs_to', key: 'reply_to_message_id' },
  }

  @text('group_id') groupId!: string
  @text('sender_id') senderId!: string
  @text('content_type') contentType!: MessageContentType
  @text('content_text') contentText!: string
  @text('media_url') mediaUrl!: string
  @text('reply_to_message_id') replyToMessageId!: string
  @field('is_deleted') isDeleted!: boolean

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Relations
  @relation('groups', 'group_id') group!: Relation<GroupModel>
  @relation('users', 'sender_id') sender!: Relation<UserModel>
  @relation('messages', 'reply_to_message_id') replyToMessage!: Relation<MessageModel>

  /**
   * Updates message text content (for text messages only)
   * Should only be allowed by message sender and within edit time limit
   * Used for message editing feature
   */
  @writer async updateContent(newContent: string) {
    return await this.update(message => {
      message.contentText = newContent
    })
  }

  /**
   * Soft deletes the message (marks as deleted but keeps in database)
   * Preserves conversation flow while hiding content
   * Used when user deletes their message
   */
  @writer async softDelete() {
    return await this.update(message => {
      message.isDeleted = true
    })
  }

  /**
   * Restores a soft-deleted message
   * Used for undo functionality or admin restoration
   * Only works on soft-deleted messages
   */
  @writer async restore() {
    return await this.update(message => {
      message.isDeleted = false
    })
  }

  // === MESSAGE TYPE HELPERS ===
  // These getters help determine how to render the message UI

  /** Returns true if this is a plain text message */
  get isTextMessage() {
    return this.contentType === MessageContentType.TEXT
  }

  /** Returns true if this message contains media (image, video, file) */
  get isMediaMessage() {
    return this.contentType === MessageContentType.IMAGE || 
           this.contentType === MessageContentType.VIDEO || 
           this.contentType === MessageContentType.FILE
  }

  /** Returns true if this is an automated system message */
  get isSystemMessage() {
    return this.contentType === MessageContentType.SYSTEM
  }

  /** Returns true if this message is replying to another message */
  get isReply() {
    return !!this.replyToMessageId
  }

  /** Returns true if this message has attached media */
  get hasMedia() {
    return !!this.mediaUrl
  }

  /** 
   * Returns display-ready content with fallbacks
   * Shows placeholder text for deleted messages and media
   */
  get displayContent() {
    if (this.isDeleted) return '[This message was deleted]'
    if (this.isSystemMessage) return this.contentText
    return this.contentText || '[Media]'
  }
}