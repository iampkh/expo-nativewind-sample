/**
 * useChat Hook
 * 
 * React hook for managing chat state and operations.
 * Provides a clean interface for components to interact with chats.
 */

import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { 
  fetchConversations, 
  createConversation, 
  fetchMessages, 
  sendMessage, 
  markConversationAsRead, 
  fetchConversation 
} from '../store/chatThunks'
import { clearError } from '../store/chatSlice'
import { 
  CreateConversationRequest, 
  SendMessageRequest, 
  ChatFilters, 
  UseChatReturn 
} from '../types/chat.types'

export const useChat = (): UseChatReturn => {
  const dispatch = useDispatch<AppDispatch>()
  
  const { 
    conversations, 
    messages,
    currentConversation,
    loading, 
    error, 
    sendingMessage 
  } = useSelector((state: RootState) => state.chat)

  // Load conversations
  const refreshConversations = useCallback(async (filters?: ChatFilters) => {
    try {
      await dispatch(fetchConversations(filters)).unwrap()
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }, [dispatch])

  // Create new conversation
  const createNewConversation = useCallback(async (data: CreateConversationRequest & { createdBy: string }) => {
    try {
      await dispatch(createConversation(data)).unwrap()
    } catch (error) {
      console.error('Failed to create conversation:', error)
      throw error
    }
  }, [dispatch])

  // Load messages for a conversation
  const refreshMessages = useCallback(async (conversationId: string) => {
    try {
      await dispatch(fetchMessages(conversationId)).unwrap()
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }, [dispatch])

  // Send a message
  const sendNewMessage = useCallback(async (data: SendMessageRequest & { senderId: string }) => {
    try {
      await dispatch(sendMessage(data)).unwrap()
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }, [dispatch])

  // Select a conversation
  const selectConversation = useCallback(async (conversationId: string) => {
    try {
      await dispatch(fetchConversation(conversationId)).unwrap()
      await dispatch(fetchMessages(conversationId)).unwrap()
    } catch (error) {
      console.error('Failed to select conversation:', error)
    }
  }, [dispatch])

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId: string, userId: string) => {
    try {
      await dispatch(markConversationAsRead({ conversationId, userId })).unwrap()
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }, [dispatch])

  // Clear error
  const clearChatError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Auto-load conversations on mount
  useEffect(() => {
    refreshConversations()
  }, [refreshConversations])

  return {
    conversations,
    messages,
    currentConversation,
    loading,
    error,
    sendingMessage,
    createConversation: createNewConversation,
    sendMessage: sendNewMessage,
    selectConversation,
    markAsRead,
    refreshConversations,
    refreshMessages,
    clearError: clearChatError,
  }
}