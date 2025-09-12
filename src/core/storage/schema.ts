import { appSchema, tableSchema } from '@nozbe/watermelondb'

/**
 * Main WatermelonDB schema aggregating all database schemas
 * When adding new databases, import their schemas and add to tables array
 */
export default appSchema({
  version: 2,
  tables: [
    // Legacy TestDB schemas
    tableSchema({
      name: 'test_users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'age', type: 'number' }
      ]
    }),
    // Legacy Todo schemas
    tableSchema({
      name: 'todos',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'date', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    // Legacy Notes schemas for DatabaseExample
    tableSchema({
      name: 'notes',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'priority', type: 'string' },
        { name: 'completed', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),

    // === COLLABORATION PLATFORM SCHEMA ===
    
    // Core: Users
    tableSchema({
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

    // Core: Groups
    tableSchema({
      name: 'groups',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'group_type', type: 'string' }, // chat, post_thread, poll, finance, todo, custom
        { name: 'created_by', type: 'string' }, // FK to users.id
        { name: 'is_private', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),

    // Core: Group Members
    tableSchema({
      name: 'group_members',
      columns: [
        { name: 'group_id', type: 'string' }, // FK to groups.id
        { name: 'user_id', type: 'string' }, // FK to users.id
        { name: 'role', type: 'string' }, // admin, member, viewer
        { name: 'joined_at', type: 'number' },
        { name: 'is_muted', type: 'boolean' }
      ]
    }),

    // Content: Messages
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'group_id', type: 'string' }, // FK to groups.id
        { name: 'sender_id', type: 'string' }, // FK to users.id
        { name: 'content_type', type: 'string' }, // text, image, video, file, system
        { name: 'content_text', type: 'string', isOptional: true },
        { name: 'media_url', type: 'string', isOptional: true },
        { name: 'reply_to_message_id', type: 'string', isOptional: true }, // FK to messages.id
        { name: 'is_deleted', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),

    // Content: Posts
    tableSchema({
      name: 'posts',
      columns: [
        { name: 'group_id', type: 'string' }, // FK to groups.id
        { name: 'author_id', type: 'string' }, // FK to users.id
        { name: 'title', type: 'string' },
        { name: 'content_text', type: 'string' },
        { name: 'media_url', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),

    // Content: Post Comments
    tableSchema({
      name: 'post_comments',
      columns: [
        { name: 'post_id', type: 'string' }, // FK to posts.id
        { name: 'author_id', type: 'string' }, // FK to users.id
        { name: 'comment_text', type: 'string' },
        { name: 'created_at', type: 'number' }
      ]
    }),

    // Content: Post Reactions
    tableSchema({
      name: 'post_reactions',
      columns: [
        { name: 'post_id', type: 'string' }, // FK to posts.id
        { name: 'user_id', type: 'string' }, // FK to users.id
        { name: 'reaction_type', type: 'string' }, // like, love, laugh, sad, angry
        { name: 'created_at', type: 'number' }
      ]
    }),

    // Features: Polls
    tableSchema({
      name: 'polls',
      columns: [
        { name: 'group_id', type: 'string' }, // FK to groups.id
        { name: 'question', type: 'string' },
        { name: 'created_by', type: 'string' }, // FK to users.id
        { name: 'is_multiple_choice', type: 'boolean' },
        { name: 'expires_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' }
      ]
    }),

    // Features: Poll Options
    tableSchema({
      name: 'poll_options',
      columns: [
        { name: 'poll_id', type: 'string' }, // FK to polls.id
        { name: 'option_text', type: 'string' }
      ]
    }),

    // Features: Poll Votes
    tableSchema({
      name: 'poll_votes',
      columns: [
        { name: 'poll_id', type: 'string' }, // FK to polls.id
        { name: 'option_id', type: 'string' }, // FK to poll_options.id
        { name: 'user_id', type: 'string' }, // FK to users.id
        { name: 'created_at', type: 'number' }
      ]
    }),

    // Features: Finance Records
    tableSchema({
      name: 'finance_records',
      columns: [
        { name: 'group_id', type: 'string' }, // FK to groups.id
        { name: 'created_by', type: 'string' }, // FK to users.id
        { name: 'title', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'string' },
        { name: 'paid_by', type: 'string' }, // FK to users.id
        { name: 'date', type: 'string' }, // DATE as string (YYYY-MM-DD)
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' }
      ]
    }),

    // Features: Finance Splits
    tableSchema({
      name: 'finance_splits',
      columns: [
        { name: 'record_id', type: 'string' }, // FK to finance_records.id
        { name: 'user_id', type: 'string' }, // FK to users.id
        { name: 'share_amount', type: 'number' },
        { name: 'is_settled', type: 'boolean' }
      ]
    }),

    // Features: Tasks/Todos
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'group_id', type: 'string' }, // FK to groups.id
        { name: 'created_by', type: 'string' }, // FK to users.id
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'status', type: 'string' }, // todo, in_progress, done
        { name: 'priority', type: 'string' }, // low, medium, high, urgent
        { name: 'due_date', type: 'string', isOptional: true }, // DATE as string (YYYY-MM-DD)
        { name: 'assigned_to', type: 'string', isOptional: true }, // FK to users.id
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),

    // System: Notifications
    tableSchema({
      name: 'notifications',
      columns: [
        { name: 'user_id', type: 'string' }, // FK to users.id
        { name: 'type', type: 'string' }, // message, post, poll, finance, todo, system
        { name: 'entity_id', type: 'string' }, // Points to message/post/poll/etc.
        { name: 'is_read', type: 'boolean' },
        { name: 'created_at', type: 'number' }
      ]
    }),

    // System: Devices/Sessions
    tableSchema({
      name: 'devices',
      columns: [
        { name: 'user_id', type: 'string' }, // FK to users.id
        { name: 'device_type', type: 'string' }, // android, ios, web
        { name: 'device_token', type: 'string', isOptional: true },
        { name: 'ip_address', type: 'string', isOptional: true },
        { name: 'last_active_at', type: 'number' },
        { name: 'created_at', type: 'number' }
      ]
    })
  ]
})