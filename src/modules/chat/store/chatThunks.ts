/**
 * Chat Redux Thunks
 * 
 * Async actions for chat operations using Redux Toolkit thunks.
 * Handles conversation and message operations with repository integration.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChatModuleRepository } from '../repositories/ChatModuleRepository';
import { ConversationType, MessageType, ChatFilters, CreateConversationRequest, SendMessageRequest } from '../types/chat.types';

// Create repository instance
const chatRepository = new ChatModuleRepository();

/**
 * Fetch all conversations
 */
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (filters: ChatFilters | undefined, { rejectWithValue }) => {
    try {
      const result = await chatRepository.getConversations(filters);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error || 'Failed to fetch conversations');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch conversations');
    }
  }
);

/**
 * Create a new conversation
 */
export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (conversationData: CreateConversationRequest & { createdBy: string }, { rejectWithValue }) => {
    try {
      const result = await chatRepository.createConversation({
        name: conversationData.name,
        type: conversationData.type,
        participants: conversationData.participants,
        createdBy: conversationData.createdBy
      });
      
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error || 'Failed to create conversation');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create conversation');
    }
  }
);

/**
 * Fetch messages for a conversation
 */
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const result = await chatRepository.getMessages(conversationId);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error || 'Failed to fetch messages');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch messages');
    }
  }
);

/**
 * Send a message
 */
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData: SendMessageRequest & { senderId: string }, { rejectWithValue }) => {
    try {
      const result = await chatRepository.sendMessage({
        conversationId: messageData.conversationId,
        senderId: messageData.senderId,
        content: messageData.content,
        messageType: messageData.messageType,
        replyTo: messageData.replyTo
      });
      
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error || 'Failed to send message');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to send message');
    }
  }
);

/**
 * Mark conversation as read
 */
export const markConversationAsRead = createAsyncThunk(
  'chat/markAsRead',
  async ({ conversationId, userId }: { conversationId: string; userId: string }, { rejectWithValue }) => {
    try {
      const result = await chatRepository.markAsRead(conversationId, userId);
      if (result.success) {
        return { conversationId, userId };
      } else {
        return rejectWithValue(result.error || 'Failed to mark as read');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to mark as read');
    }
  }
);

/**
 * Get conversation by ID
 */
export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const result = await chatRepository.getConversation(conversationId);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error || 'Failed to fetch conversation');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch conversation');
    }
  }
);