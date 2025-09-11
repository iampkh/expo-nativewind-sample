/**
 * Chat Redux Slice
 * 
 * Manages chat state using Redux Toolkit.
 * Handles conversations, messages, and real-time updates.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatState, ChatConversation, ChatMessage } from '../types/chat.types'

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