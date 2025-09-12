import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations'
import { TestUser } from './database/testdb'
import TodoModel from './database/models/TodoModel'
import NoteModel from './database/models/NoteModel'

// Import Collaboration Models
import {
  UserModel,
  GroupModel,
  GroupMemberModel,
  MessageModel,
  PostModel,
  PostCommentModel,
  PostReactionModel,
  PollModel,
  PollOptionModel,
  PollVoteModel,
  FinanceRecordModel,
  FinanceSplitModel,
  TaskModel,
  NotificationModel,
  DeviceModel
} from './database/models/collaboration'

import schema from './schema'

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'CollaborationApp',
  migrations: schemaMigrations({
    migrations: [
      {
        toVersion: 2,
        steps: [
          // Add all collaboration platform tables in version 2
          createTable({
            name: 'users',
            columns: [
              { name: 'username', type: 'string' },
              { name: 'email', type: 'string', isOptional: true },
              { name: 'phone_number', type: 'string', isOptional: true },
              { name: 'password_hash', type: 'string' },
              { name: 'display_name', type: 'string' },
              { name: 'profile_picture_url', type: 'string', isOptional: true },
              { name: 'status_message', type: 'string', isOptional: true },
              { name: 'last_seen_at', type: 'number', isOptional: true },
              { name: 'is_online', type: 'boolean' },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'groups',
            columns: [
              { name: 'name', type: 'string' },
              { name: 'description', type: 'string', isOptional: true },
              { name: 'group_type', type: 'string' },
              { name: 'created_by', type: 'string' },
              { name: 'is_private', type: 'boolean' },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'group_members',
            columns: [
              { name: 'group_id', type: 'string' },
              { name: 'user_id', type: 'string' },
              { name: 'role', type: 'string' },
              { name: 'joined_at', type: 'number' },
              { name: 'is_muted', type: 'boolean' }
            ]
          }),
          createTable({
            name: 'messages',
            columns: [
              { name: 'group_id', type: 'string' },
              { name: 'sender_id', type: 'string' },
              { name: 'content_type', type: 'string' },
              { name: 'content_text', type: 'string', isOptional: true },
              { name: 'media_url', type: 'string', isOptional: true },
              { name: 'reply_to_message_id', type: 'string', isOptional: true },
              { name: 'is_deleted', type: 'boolean' },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'posts',
            columns: [
              { name: 'group_id', type: 'string' },
              { name: 'author_id', type: 'string' },
              { name: 'title', type: 'string' },
              { name: 'content_text', type: 'string' },
              { name: 'media_url', type: 'string', isOptional: true },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'post_comments',
            columns: [
              { name: 'post_id', type: 'string' },
              { name: 'author_id', type: 'string' },
              { name: 'comment_text', type: 'string' },
              { name: 'created_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'post_reactions',
            columns: [
              { name: 'post_id', type: 'string' },
              { name: 'user_id', type: 'string' },
              { name: 'reaction_type', type: 'string' },
              { name: 'created_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'polls',
            columns: [
              { name: 'group_id', type: 'string' },
              { name: 'question', type: 'string' },
              { name: 'created_by', type: 'string' },
              { name: 'is_multiple_choice', type: 'boolean' },
              { name: 'expires_at', type: 'number', isOptional: true },
              { name: 'created_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'poll_options',
            columns: [
              { name: 'poll_id', type: 'string' },
              { name: 'option_text', type: 'string' }
            ]
          }),
          createTable({
            name: 'poll_votes',
            columns: [
              { name: 'poll_id', type: 'string' },
              { name: 'option_id', type: 'string' },
              { name: 'user_id', type: 'string' },
              { name: 'created_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'finance_records',
            columns: [
              { name: 'group_id', type: 'string' },
              { name: 'created_by', type: 'string' },
              { name: 'title', type: 'string' },
              { name: 'amount', type: 'number' },
              { name: 'currency', type: 'string' },
              { name: 'paid_by', type: 'string' },
              { name: 'date', type: 'string' },
              { name: 'notes', type: 'string', isOptional: true },
              { name: 'created_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'finance_splits',
            columns: [
              { name: 'record_id', type: 'string' },
              { name: 'user_id', type: 'string' },
              { name: 'share_amount', type: 'number' },
              { name: 'is_settled', type: 'boolean' }
            ]
          }),
          createTable({
            name: 'tasks',
            columns: [
              { name: 'group_id', type: 'string' },
              { name: 'created_by', type: 'string' },
              { name: 'title', type: 'string' },
              { name: 'description', type: 'string', isOptional: true },
              { name: 'status', type: 'string' },
              { name: 'priority', type: 'string' },
              { name: 'due_date', type: 'string', isOptional: true },
              { name: 'assigned_to', type: 'string', isOptional: true },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'notifications',
            columns: [
              { name: 'user_id', type: 'string' },
              { name: 'type', type: 'string' },
              { name: 'entity_id', type: 'string' },
              { name: 'is_read', type: 'boolean' },
              { name: 'created_at', type: 'number' }
            ]
          }),
          createTable({
            name: 'devices',
            columns: [
              { name: 'user_id', type: 'string' },
              { name: 'device_type', type: 'string' },
              { name: 'device_token', type: 'string', isOptional: true },
              { name: 'ip_address', type: 'string', isOptional: true },
              { name: 'last_active_at', type: 'number' },
              { name: 'created_at', type: 'number' }
            ]
          })
        ]
      }
    ]
  }),
})

export const database = new Database({
  adapter,
  modelClasses: [
    // Legacy models
    TestUser,
    TodoModel,
    NoteModel,
    
    // Collaboration Platform models
    // Core
    UserModel,
    GroupModel,
    GroupMemberModel,
    
    // Content
    MessageModel,
    PostModel,
    PostCommentModel,
    PostReactionModel,
    
    // Features
    PollModel,
    PollOptionModel,
    PollVoteModel,
    FinanceRecordModel,
    FinanceSplitModel,
    TaskModel,
    NotificationModel,
    DeviceModel,
  ],
})