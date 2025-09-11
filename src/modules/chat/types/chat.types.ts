/**
 * Chat Module Types
 * 
 * Defines all TypeScript interfaces and types used across the chat module.
 * Includes state shapes, API responses, and component props.
 */

// Chat State Management Types
export interface ChatState {
  conversations: ChatConversation[]
  messages: ChatMessage[]
  currentConversation: ChatConversation | null
  loading: boolean
  error: string | null
  sendingMessage: boolean
}

// Core Chat Types
export interface ChatConversation {
  id: string
  name: string
  type: ConversationType
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: Date
  updatedAt?: Date
  createdBy: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  messageType: MessageType
  timestamp: Date
  isRead: boolean
  replyTo?: string
  attachments?: ChatAttachment[]
}

export interface ChatAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  url: string
}

// Enums
export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  CHANNEL = 'channel'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VOICE = 'voice',
  SYSTEM = 'system'
}

// Chat Creation Types
export interface CreateConversationRequest {
  name?: string
  type: ConversationType
  participants: string[]
}

export interface SendMessageRequest {
  conversationId: string
  content: string
  messageType: MessageType
  replyTo?: string
  attachments?: File[]
}

// Chat Filters
export interface ChatFilters {
  type?: ConversationType
  hasUnread?: boolean
  participantId?: string
  search?: string
}

// Component Props Types
export interface ChatCardProps {
  conversation: ChatConversation
  onSelect?: (conversationId: string) => void
  className?: string
}

export interface MessageCardProps {
  message: ChatMessage
  onReply?: (messageId: string) => void
  className?: string
}

// Hook Return Types
export interface UseChatReturn {
  conversations: ChatConversation[]
  messages: ChatMessage[]
  currentConversation: ChatConversation | null
  loading: boolean
  error: string | null
  sendingMessage: boolean
  createConversation: (data: CreateConversationRequest) => Promise<void>
  sendMessage: (data: SendMessageRequest) => Promise<void>
  selectConversation: (conversationId: string) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
  refreshConversations: () => Promise<void>
  refreshMessages: (conversationId: string) => Promise<void>
}