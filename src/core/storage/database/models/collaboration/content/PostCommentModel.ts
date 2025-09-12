/**
 * PostCommentModel - Comments on posts for threaded discussions
 * 
 * PURPOSE:
 * Enables threaded discussions under posts in forum-style channels.
 * Simple text-based responses that create conversation threads.
 * Supports editing but not nested replies (keep threading simple).
 * 
 * RELATIONS:
 * - Belongs to Post (the post being commented on)
 * - Belongs to User (comment author)
 * 
 * FEATURES:
 * - Simple text comments
 * - Edit capability
 * - Preview generation
 * - Validation helpers
 */

import { Model } from '@nozbe/watermelondb'
import { text, date, readonly, writer, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation } from '@nozbe/watermelondb'
import UserModel from '../core/UserModel'
import PostModel from './PostModel'

export default class PostCommentModel extends Model {
  static table = 'post_comments'

  static associations: Associations = {
    posts: { type: 'belongs_to', key: 'post_id' },
    users: { type: 'belongs_to', key: 'author_id' },
  }

  @text('post_id') postId!: string
  @text('author_id') authorId!: string
  @text('comment_text') commentText!: string

  @readonly @date('created_at') createdAt!: Date

  // Relations
  @relation('posts', 'post_id') post!: Relation<PostModel>
  @relation('users', 'author_id') author!: Relation<UserModel>

  /**
   * Updates comment text
   * Should only be allowed by comment author within edit time limit
   */
  @writer async updateComment(newText: string) {
    return await this.update(comment => {
      comment.commentText = newText
    })
  }

  // === COMMENT HELPERS ===

  /** Returns shortened preview for comment lists (100 chars max) */
  get preview() {
    const maxLength = 100
    if (this.commentText.length <= maxLength) {
      return this.commentText
    }
    return this.commentText.substring(0, maxLength) + '...'
  }

  /** Returns true if comment has no meaningful content */
  get isEmpty() {
    return !this.commentText || this.commentText.trim().length === 0
  }
}