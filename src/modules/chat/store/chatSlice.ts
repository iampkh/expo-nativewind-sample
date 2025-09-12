/**
 * Chat Redux Slice
 * 
 * Manages chat state using Redux Toolkit.
 * Handles conversations, messages, and real-time updates.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatState, ChatConversation, ChatMessage } from '../types/chat.types'
import { 
  fetchConversations, 
  createConversation, 
  fetchMessages, 
  sendMessage, 
  markConversationAsRead, 
  fetchConversation 
} from './chatThunks'

const initialState: ChatState = {
  conversations: [],
  messages: [],
  currentConversation: null,
  loading: false,
  error: null,
  sendingMessage: false,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    setSendingMessage: (state, action: PayloadAction<boolean>) => {
      state.sendingMessage = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    setConversations: (state, action: PayloadAction<ChatConversation[]>) => {
      state.conversations = action.payload
      state.error = null
    },
    
    addConversation: (state, action: PayloadAction<ChatConversation>) => {
      state.conversations.unshift(action.payload)
      state.error = null
    },
    
    updateConversation: (state, action: PayloadAction<ChatConversation>) => {
      const index = state.conversations.findIndex(conv => conv.id === action.payload.id)
      if (index !== -1) {
        state.conversations[index] = action.payload
      }
    },
    
    setCurrentConversation: (state, action: PayloadAction<ChatConversation | null>) => {
      state.currentConversation = action.payload
    },
    
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload
      state.error = null
    },
    
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
      state.error = null
    },
    
    resetChatState: (state) => {
      Object.assign(state, initialState)
    },
    
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false
        state.conversations = action.payload || []
        state.error = null
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // Create Conversation
    builder
      .addCase(createConversation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.conversations.unshift(action.payload)
        }
        state.error = null
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // Fetch Messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload || []
        state.error = null
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false
        if (action.payload) {
          state.messages.push(action.payload)
          
          // Update conversation's last message
          const conversationIndex = state.conversations.findIndex(
            conv => conv.id === action.payload?.conversationId
          )
          if (conversationIndex !== -1 && action.payload) {
            state.conversations[conversationIndex].lastMessage = action.payload
            state.conversations[conversationIndex].updatedAt = new Date()
          }
        }
        state.error = null
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false
        state.error = action.payload as string
      })
    
    // Mark as Read
    builder
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === action.payload.conversationId
        )
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].unreadCount = 0
        }
        
        // Mark messages as read
        state.messages = state.messages.map(msg => 
          msg.conversationId === action.payload.conversationId && 
          msg.senderId !== action.payload.userId
            ? { ...msg, isRead: true }
            : msg
        )
      })
    
    // Fetch Conversation
    builder
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.currentConversation = action.payload || null
      })
  },
})

export const {
  setLoading,
  setSendingMessage,
  setError,
  setConversations,
  addConversation,
  updateConversation,
  setCurrentConversation,
  setMessages,
  addMessage,
  resetChatState,
  clearError,
} = chatSlice.actions

export default chatSlice.reducer