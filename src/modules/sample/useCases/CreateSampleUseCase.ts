/**
 * Create Sample Use Case
 * 
 * Business logic for creating new samples with validation and error handling.
 */

import { BaseUseCase } from '../../../core/useCases/BaseUseCase'
import { SampleModuleRepository } from '../repositories/SampleModuleRepository'
import { DatabaseResult } from '../../../shared/types/database.types'
import { SampleItem, CreateSampleRequest } from '../types/sample.types'

export interface CreateSampleData extends CreateSampleRequest {
  createdBy: string
}

export class CreateSampleUseCase extends BaseUseCase<CreateSampleData, DatabaseResult<SampleItem>> {
  private sampleRepository: SampleModuleRepository

  constructor() {
    super()
    this.sampleRepository = new SampleModuleRepository()
  }

  async execute(data: CreateSampleData): Promise<DatabaseResult<SampleItem>> {
    try {
      // Validate input
      const validationResult = this.validateInput(data)
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error
        }
      }

      // Create sample
      const result = await this.sampleRepository.createSample({
        name: data.name.trim(),
        description: data.description.trim(),
        category: data.category,
        data: data.data || {},
        createdBy: data.createdBy
      })

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create sample'
      }
    }
  }

  private validateInput(data: CreateSampleData): { isValid: boolean; error?: string } {
    // Required fields
    if (!data.name?.trim()) {
      return { isValid: false, error: 'Sample name is required' }
    }

    if (!data.description?.trim()) {
      return { isValid: false, error: 'Sample description is required' }
    }

    if (!data.category) {
      return { isValid: false, error: 'Sample category is required' }
    }

    if (!data.createdBy?.trim()) {
      return { isValid: false, error: 'Creator ID is required' }
    }

    // Name validation
    if (data.name.trim().length < 2) {
      return { isValid: false, error: 'Sample name must be at least 2 characters long' }
    }

    if (data.name.trim().length > 100) {
      return { isValid: false, error: 'Sample name cannot exceed 100 characters' }
    }

    // Description validation
    if (data.description.trim().length < 5) {
      return { isValid: false, error: 'Sample description must be at least 5 characters long' }
    }

    if (data.description.trim().length > 500) {
      return { isValid: false, error: 'Sample description cannot exceed 500 characters' }
    }

    // Data validation (optional)
    if (data.data) {
      try {
        JSON.stringify(data.data)
      } catch (error) {
        return { isValid: false, error: 'Sample data must be serializable' }
      }

      // Check data size (rough estimate)
      const dataString = JSON.stringify(data.data)
      if (dataString.length > 10000) {
        return { isValid: false, error: 'Sample data is too large (max 10KB)' }
      }
    }

    return { isValid: true }
  }
}