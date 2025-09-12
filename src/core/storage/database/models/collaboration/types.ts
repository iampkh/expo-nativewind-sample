/**
 * Collaboration Platform Types
 * 
 * This file defines all TypeScript interfaces and enums for the collaboration platform.
 * The platform supports multiple group types with different behaviors:
 * - Chat groups for real-time messaging
 * - Post/Thread groups for structured discussions
 * - Poll groups for voting and surveys  
 * - Finance groups for expense splitting (like Splitwise)
 * - Todo groups for task management
 * - Custom groups for extensible functionality
 */

// === ENUMS ===

/**
 * Defines the different types of groups available in the platform
 * Each type determines the group's behavior and available features
 */
export enum GroupType {
  CHAT = 'chat',
  POST_THREAD = 'post_thread',
  POLL = 'poll',
  FINANCE = 'finance',
  TODO = 'todo',
  CUSTOM = 'custom'
}

/**
 * Member roles within a group, determining permissions and capabilities
 * - ADMIN: Full control over group (manage members, settings, delete)
 * - MEMBER: Can post content and participate actively
 * - VIEWER: Read-only access, cannot create content
 */
export enum GroupMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

/**
 * Types of content that can be sent in messages
 * - TEXT: Plain text messages
 * - IMAGE/VIDEO/FILE: Media attachments with URLs
 * - SYSTEM: Automated messages (user joined, settings changed, etc.)
 */
export enum MessageContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  SYSTEM = 'system'
}

/**
 * Reaction types for posts (similar to Facebook reactions)
 * Users can react to posts with emotional responses
 */
export enum PostReactionType {
  LIKE = 'like',
  LOVE = 'love',
  LAUGH = 'laugh',
  SAD = 'sad',
  ANGRY = 'angry'
}

/**
 * Task/Todo status workflow
 * - TODO: Not started, in backlog
 * - IN_PROGRESS: Currently being worked on
 * - DONE: Completed task
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

/**
 * Task priority levels for sorting and visual indicators
 * - LOW: Nice to have, low urgency (green)
 * - MEDIUM: Standard priority (yellow)
 * - HIGH: Important, needs attention (orange)
 * - URGENT: Critical, immediate action required (red)
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Notification categories for different platform activities
 * Used for filtering, styling, and push notification routing
 */
export enum NotificationType {
  MESSAGE = 'message',
  POST = 'post',
  POLL = 'poll',
  FINANCE = 'finance',
  TODO = 'todo',
  SYSTEM = 'system'
}

/**
 * Device/platform types for session management and push notifications
 * Each device type may have different capabilities and notification formats
 */
export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web'
}

// === CORE INTERFACES ===

/**
 * User entity representing a platform user
 * Contains authentication, profile, and presence information
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  passwordHash: string;
  displayName: string;
  profilePictureUrl?: string;
  statusMessage?: string;
  lastSeenAt?: Date;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Group entity - the core unit of collaboration
 * Can behave as chat room, forum, poll space, finance tracker, or task board
 * Group type determines available features and UI layout
 */
export interface Group {
  id: string;
  name: string;
  description?: string;
  groupType: GroupType;
  createdBy: string; // User ID
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Group membership with role-based permissions
 * Links users to groups with specific access levels and notification preferences
 */
export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  joinedAt: Date;
  isMuted: boolean;
}

/**
 * Message entity for chat-type groups
 * Supports text, media, replies, and system messages
 * Includes soft deletion to maintain conversation context
 */
export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  contentType: MessageContentType;
  contentText?: string;
  mediaUrl?: string;
  replyToMessageId?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Post entity for thread-type groups
 * Structured content with title, body, and optional media
 * Supports comments and reactions for engagement
 */
export interface Post {
  id: string;
  groupId: string;
  authorId: string;
  title: string;
  contentText: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Comments on posts for threaded discussions
 * Simple text-based responses to posts
 */
export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  commentText: string;
  createdAt: Date;
}

/**
 * Emotional reactions to posts (like, love, laugh, etc.)
 * One reaction per user per post, can be changed
 */
export interface PostReaction {
  id: string;
  postId: string;
  userId: string;
  reactionType: PostReactionType;
  createdAt: Date;
}

/**
 * Poll entity for voting and surveys
 * Supports single/multiple choice with optional expiration
 * Contains question and tracks voting status
 */
export interface Poll {
  id: string;
  groupId: string;
  question: string;
  createdBy: string;
  isMultipleChoice: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

/**
 * Individual poll choices/options
 * Users vote for these options in polls
 */
export interface PollOption {
  id: string;
  pollId: string;
  optionText: string;
}

/**
 * User votes on poll options
 * Tracks who voted for what and when
 */
export interface PollVote {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: Date;
}

/**
 * Financial expense record (like Splitwise)
 * Tracks who paid, how much, and for what
 * Supports multiple currencies and detailed notes
 */
export interface FinanceRecord {
  id: string;
  groupId: string;
  createdBy: string;
  title: string;
  amount: number;
  currency: string;
  paidBy: string;
  date: string; // YYYY-MM-DD format
  notes?: string;
  createdAt: Date;
}

/**
 * Individual user's share of a financial expense
 * Tracks amount owed and settlement status per user
 */
export interface FinanceSplit {
  id: string;
  recordId: string;
  userId: string;
  shareAmount: number;
  isSettled: boolean;
}

/**
 * Task/Todo item for productivity groups
 * Supports assignment, priority, due dates, and status tracking
 * Can be used for project management and task delegation
 */
export interface Task {
  id: string;
  groupId: string;
  createdBy: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD format
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification for user alerts and updates
 * Links to specific entities (messages, posts, etc.) by ID
 * Supports read/unread status for UI indicators
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  entityId: string;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Device/Session tracking for multi-device support
 * Stores push notification tokens and tracks user presence
 * Used for session management and targeted notifications
 */
export interface Device {
  id: string;
  userId: string;
  deviceType: DeviceType;
  deviceToken?: string;
  ipAddress?: string;
  lastActiveAt: Date;
  createdAt: Date;
}