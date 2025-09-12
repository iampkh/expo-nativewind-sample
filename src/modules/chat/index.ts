/**
 * Chat Module Exports
 * 
 * Centralized exports for the chat module.
 * Provides clean interface for other parts of the app to import from.
 */

// Types
export * from './types/chat.types'

// Store
export * from './store'

// Repositories
export { ChatModuleRepository } from './repositories/ChatModuleRepository'

// Components
export { ChatCard } from './components/ChatCard'