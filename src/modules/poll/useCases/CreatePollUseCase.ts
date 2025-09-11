/**
 * Create Poll Use Case
 * 
 * Business logic for creating new polls with validation and error handling.
 */

import { BaseUseCase } from '../../../core/useCases/BaseUseCase'
import { PollModuleRepository } from '../repositories/PollModuleRepository'
import { DatabaseResult } from '../../../shared/types/database.types'
import { PollModel } from '../../../core/storage/database/models/collaboration'
import { CreatePollRequest } from '../types/poll.types'

export interface CreatePollData extends CreatePollRequest {
  createdBy: string
}

export class CreatePollUseCase extends BaseUseCase<CreatePollData, DatabaseResult<PollModel>> {
  private pollRepository: PollModuleRepository

  constructor() {
    super()
    this.pollRepository = new PollModuleRepository()
  }

  async execute(data: CreatePollData): Promise<DatabaseResult<PollModel>> {
    try {
      // Validate input
      const validationResult = this.validateInput(data)
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error
        }
      }

      // Create poll
      const result = await this.pollRepository.createPoll({
        groupId: data.groupId,
        createdBy: data.createdBy,
        question: data.question.trim(),
        options: data.options.map(opt => opt.trim()).filter(opt => opt.length > 0),
        isMultipleChoice: data.isMultipleChoice || false,
        expiresAt: data.expiresAt
      })

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create poll'
      }
    }
  }

  private validateInput(data: CreatePollData): { isValid: boolean; error?: string } {
    // Required fields
    if (!data.groupId?.trim()) {
      return { isValid: false, error: 'Group ID is required' }
    }

    if (!data.createdBy?.trim()) {
      return { isValid: false, error: 'Creator ID is required' }
    }

    if (!data.question?.trim()) {
      return { isValid: false, error: 'Poll question is required' }
    }

    // Question length validation
    if (data.question.trim().length < 5) {
      return { isValid: false, error: 'Poll question must be at least 5 characters long' }
    }

    if (data.question.trim().length > 500) {
      return { isValid: false, error: 'Poll question cannot exceed 500 characters' }
    }

    // Options validation
    if (!data.options || data.options.length < 2) {
      return { isValid: false, error: 'Poll must have at least 2 options' }
    }

    if (data.options.length > 10) {
      return { isValid: false, error: 'Poll cannot have more than 10 options' }
    }

    // Validate each option
    for (let i = 0; i < data.options.length; i++) {
      const option = data.options[i]?.trim()
      
      if (!option) {
        return { isValid: false, error: `Option ${i + 1} cannot be empty` }
      }

      if (option.length > 200) {
        return { isValid: false, error: `Option ${i + 1} cannot exceed 200 characters` }
      }
    }

    // Check for duplicate options
    const trimmedOptions = data.options.map(opt => opt.trim().toLowerCase())
    const uniqueOptions = new Set(trimmedOptions)
    if (uniqueOptions.size !== trimmedOptions.length) {
      return { isValid: false, error: 'Poll options must be unique' }
    }

    // Expiry date validation
    if (data.expiresAt) {
      const now = new Date()
      const expiryDate = new Date(data.expiresAt)
      
      if (expiryDate <= now) {
        return { isValid: false, error: 'Expiry date must be in the future' }
      }

      // Don't allow expiry more than 1 year in the future
      const maxExpiry = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000))
      if (expiryDate > maxExpiry) {
        return { isValid: false, error: 'Expiry date cannot be more than 1 year in the future' }
      }
    }

    return { isValid: true }
  }
}