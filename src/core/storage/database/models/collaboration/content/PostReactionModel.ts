/**
 * PostReactionModel - Emotional reactions to posts
 * 
 * PURPOSE:
 * Handles user reactions to posts (like Facebook-style reactions).
 * Allows users to express emotions beyond simple likes.
 * One reaction per user per post, but can be changed.
 * 
 * RELATIONS:
 * - Belongs to Post (the post being reacted to)
 * - Belongs to User (person giving the reaction)
 * 
 * REACTION TYPES:
 * - LIKE: 👍 General approval
 * - LOVE: ❤️ Strong positive feeling
 * - LAUGH: 😂 Funny/amusing content
 * - SAD: 😢 Sad/disappointing content
 * - ANGRY: 😠 Upset/disagreement
 */

import { Model } from '@nozbe/watermelondb'
import { text, date, readonly, writer, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation } from '@nozbe/watermelondb'
import { PostReactionType } from '../types'
import UserModel from '../core/UserModel'
import PostModel from './PostModel'

export default class PostReactionModel extends Model {
  static table = 'post_reactions'

  static associations: Associations = {
    posts: { type: 'belongs_to', key: 'post_id' },
    users: { type: 'belongs_to', key: 'user_id' },
  }

  @text('post_id') postId!: string
  @text('user_id') userId!: string
  @text('reaction_type') reactionType!: PostReactionType

  @readonly @date('created_at') createdAt!: Date

  // Relations
  @relation('posts', 'post_id') post!: Relation<PostModel>
  @relation('users', 'user_id') user!: Relation<UserModel>

  /**
   * Changes the reaction type (like -> love, etc.)
   * Users can change their reaction without creating duplicates
   */
  @writer async changeReaction(newType: PostReactionType) {
    return await this.update(reaction => {
      reaction.reactionType = newType
    })
  }

  // === REACTION TYPE HELPERS ===
  // Quick checks for specific reaction types
  get isLike() {
    return this.reactionType === PostReactionType.LIKE
  }

  get isLove() {
    return this.reactionType === PostReactionType.LOVE
  }

  get isLaugh() {
    return this.reactionType === PostReactionType.LAUGH
  }

  get isSad() {
    return this.reactionType === PostReactionType.SAD
  }

  get isAngry() {
    return this.reactionType === PostReactionType.ANGRY
  }

  get emoji() {
    switch (this.reactionType) {
      case PostReactionType.LIKE: return '👍'
      case PostReactionType.LOVE: return '❤️'
      case PostReactionType.LAUGH: return '😂'
      case PostReactionType.SAD: return '😢'
      case PostReactionType.ANGRY: return '😠'
      default: return '👍'
    }
  }

  get label() {
    switch (this.reactionType) {
      case PostReactionType.LIKE: return 'Like'
      case PostReactionType.LOVE: return 'Love'
      case PostReactionType.LAUGH: return 'Laugh'
      case PostReactionType.SAD: return 'Sad'
      case PostReactionType.ANGRY: return 'Angry'
      default: return 'Like'
    }
  }
}