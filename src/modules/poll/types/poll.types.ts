/**
 * Poll Module Types
 * 
 * Defines all TypeScript interfaces and types used across the poll module.
 * Includes state shapes, API responses, and component props.
 */

import { PollModel, PollOptionModel, PollVoteModel } from '../../../core/storage/database/models/collaboration'

// Poll State Management Types
export interface PollState {
  polls: PollModel[]
  currentPoll: PollModel | null
  loading: boolean
  error: string | null
  votingInProgress: boolean
}

// Poll Creation Types
export interface CreatePollRequest {
  groupId: string
  question: string
  options: string[]
  isMultipleChoice?: boolean
  expiresAt?: Date
}

// Poll Voting Types
export interface VotePollRequest {
  pollId: string
  optionId: string
  userId: string
}

// Poll Results Types
export interface PollResults {
  poll: PollModel
  options: Array<{
    id: string
    text: string
    votes: number
    percentage: number
  }>
  totalVotes: number
  uniqueVoters: number
}

// Poll Filters
export interface PollFilters {
  isActive?: boolean
  isExpired?: boolean
  createdBy?: string
  hasExpiry?: boolean
}

// Component Props Types
export interface PollCardProps {
  poll: PollModel
  onVote?: (pollId: string, optionId: string) => void
  onViewResults?: (pollId: string) => void
  className?: string
}

export interface PollOptionProps {
  option: PollOptionModel
  isSelected?: boolean
  onSelect?: (optionId: string) => void
  showResults?: boolean
  voteCount?: number
  percentage?: number
}

// Hook Return Types
export interface UsePollsReturn {
  polls: PollModel[]
  loading: boolean
  error: string | null
  votingInProgress: boolean
  createPoll: (data: CreatePollRequest) => Promise<void>
  votePoll: (data: VotePollRequest) => Promise<void>
  removeVote: (pollId: string, userId: string, optionId?: string) => Promise<void>
  deletePoll: (pollId: string) => Promise<void>
  refreshPolls: () => Promise<void>
  clearError: () => void
}

export interface UsePollResultsReturn {
  results: PollResults | null
  loading: boolean
  error: string | null
  refreshResults: () => Promise<void>
}