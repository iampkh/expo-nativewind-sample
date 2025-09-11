/**
 * PostModel - Structured content for thread-type channels
 * 
 * PURPOSE:
 * Handles forum-style posts with title, content, and optional media.
 * Supports threaded discussions via comments and user engagement via reactions.
 * Used in channels that focus on structured discussions rather than real-time chat.
 * 
 * RELATIONS:
 * - Belongs to Channel (the forum/discussion space)
 * - Belongs to User (post author)
 * - Has many PostComments (threaded discussions)
 * - Has many PostReactions (user engagement/feedback)
 * 
 * FEATURES:
 * - Title + body content structure
 * - Media attachment support
 * - Comment threading
 * - Reaction system (like/love/laugh/etc.)
 * - Edit capabilities
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, writer, relation, children } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation, Collection } from '@nozbe/watermelondb'
import UserModel from '../core/UserModel'
import GroupModel from '../core/GroupModel'

export default class PostModel extends Model {
  static table = 'posts'

  static associations: Associations = {
    groups: { type: 'belongs_to', key: 'group_id' },
    users: { type: 'belongs_to', key: 'author_id' },
    post_comments: { type: 'has_many', foreignKey: 'post_id' },
    post_reactions: { type: 'has_many', foreignKey: 'post_id' },
  }

  @text('group_id') groupId!: string
  @text('author_id') authorId!: string
  @text('title') title!: string
  @text('content_text') contentText!: string
  @text('media_url') mediaUrl!: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Relations
  @relation('groups', 'group_id') group!: Relation<GroupModel>
  @relation('users', 'author_id') author!: Relation<UserModel>
  @children('post_comments') comments!: Collection<any>
  @children('post_reactions') reactions!: Collection<any>

  /**
   * Updates post content (title, body text, media)
   * Should only be allowed by post author within edit time limit
   * Used for post editing feature
   */
  @writer async updatePost(updates: {
    title?: string
    contentText?: string
    mediaUrl?: string
  }) {
    return await this.update(post => {
      if (updates.title !== undefined) post.title = updates.title
      if (updates.contentText !== undefined) post.contentText = updates.contentText
      if (updates.mediaUrl !== undefined) post.mediaUrl = updates.mediaUrl
    })
  }

  /**
   * Updates only the post title
   * Convenience method for title-only edits
   */
  @writer async updateTitle(newTitle: string) {
    return await this.update(post => {
      post.title = newTitle
    })
  }

  /**
   * Updates only the post body content
   * Convenience method for content-only edits
   */
  @writer async updateContent(newContent: string) {
    return await this.update(post => {
      post.contentText = newContent
    })
  }

  /**
   * Sets or updates the media attachment URL
   * Used for adding/changing images, videos, or files
   */
  @writer async setMediaUrl(url: string) {
    return await this.update(post => {
      post.mediaUrl = url
    })
  }

  // === POST HELPER METHODS ===

  /** Returns true if post has attached media (image, video, file) */
  get hasMedia() {
    return !!this.mediaUrl
  }

  /** 
   * Returns shortened preview of post content for lists
   * Truncates at 150 characters with ellipsis if longer
   */
  get preview() {
    const maxLength = 150
    if (this.contentText.length <= maxLength) {
      return this.contentText
    }
    return this.contentText.substring(0, maxLength) + '...'
  }

  /** 
   * Returns total number of comments on this post
   * Used for displaying comment counts in UI
   */
  async getCommentsCount() {
    return await this.comments.query().fetchCount()
  }

  /** 
   * Returns total number of reactions on this post
   * Used for displaying reaction counts and engagement metrics
   */
  async getReactionsCount() {
    return await this.reactions.query().fetchCount()
  }
}