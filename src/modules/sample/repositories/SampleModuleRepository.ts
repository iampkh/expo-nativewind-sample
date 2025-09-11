/**
 * Sample Module Repository
 * 
 * Repository for sample data operations with placeholder methods.
 * Since there's no core SampleRepository, this implements basic CRUD operations.
 */

import { DatabaseResult } from '../../../shared/types/database.types'
import { SampleItem, SampleCategory, SampleStatus, SampleFilters, SampleStats } from '../types/sample.types'

export class SampleModuleRepository {
  // In-memory storage for samples (placeholder implementation)
  private samples: SampleItem[] = [
    {
      id: '1',
      name: 'Demo Sample',
      description: 'This is a demo sample for testing',
      category: SampleCategory.DEMO,
      status: SampleStatus.ACTIVE,
      data: { key1: 'value1', key2: 'value2' },
      createdAt: new Date(),
      createdBy: 'system'
    },
    {
      id: '2',
      name: 'Test Sample',
      description: 'Test sample for development',
      category: SampleCategory.TEST,
      status: SampleStatus.DRAFT,
      data: { testProp: true, count: 42 },
      createdAt: new Date(),
      createdBy: 'system'
    }
  ]

  /**
   * Create a new sample
   */
  async createSample(sampleData: {
    name: string
    description: string
    category: SampleCategory
    data?: Record<string, any>
    createdBy: string
  }): Promise<DatabaseResult<SampleItem>> {
    try {
      const newSample: SampleItem = {
        id: Date.now().toString(),
        name: sampleData.name,
        description: sampleData.description,
        category: sampleData.category,
        status: SampleStatus.DRAFT,
        data: sampleData.data || {},
        createdAt: new Date(),
        createdBy: sampleData.createdBy
      }

      this.samples.unshift(newSample)
      return { success: true, data: newSample }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create sample'
      }
    }
  }

  /**
   * Get a single sample by ID
   */
  async getSample(sampleId: string): Promise<DatabaseResult<SampleItem>> {
    try {
      const sample = this.samples.find(s => s.id === sampleId)
      
      if (!sample) {
        return { success: false, error: 'Sample not found' }
      }

      return { success: true, data: sample }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get sample'
      }
    }
  }

  /**
   * Update a sample
   */
  async updateSample(
    sampleId: string, 
    updates: {
      name?: string
      description?: string
      category?: SampleCategory
      status?: SampleStatus
      data?: Record<string, any>
    }
  ): Promise<DatabaseResult<SampleItem>> {
    try {
      const index = this.samples.findIndex(s => s.id === sampleId)
      
      if (index === -1) {
        return { success: false, error: 'Sample not found' }
      }

      const updatedSample = {
        ...this.samples[index],
        ...updates,
        updatedAt: new Date()
      }

      this.samples[index] = updatedSample
      return { success: true, data: updatedSample }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update sample'
      }
    }
  }

  /**
   * Delete a sample
   */
  async deleteSample(sampleId: string): Promise<DatabaseResult<boolean>> {
    try {
      const index = this.samples.findIndex(s => s.id === sampleId)
      
      if (index === -1) {
        return { success: false, error: 'Sample not found' }
      }

      this.samples.splice(index, 1)
      return { success: true, data: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete sample'
      }
    }
  }

  /**
   * Get all samples with optional filters
   */
  async getAllSamples(filters?: SampleFilters): Promise<DatabaseResult<SampleItem[]>> {
    try {
      let filteredSamples = [...this.samples]

      if (filters) {
        if (filters.category) {
          filteredSamples = filteredSamples.filter(s => s.category === filters.category)
        }
        if (filters.status) {
          filteredSamples = filteredSamples.filter(s => s.status === filters.status)
        }
        if (filters.createdBy) {
          filteredSamples = filteredSamples.filter(s => s.createdBy === filters.createdBy)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredSamples = filteredSamples.filter(s => 
            s.name.toLowerCase().includes(searchLower) ||
            s.description.toLowerCase().includes(searchLower)
          )
        }
      }

      // Sort by creation date (newest first)
      filteredSamples.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      return { success: true, data: filteredSamples }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get samples'
      }
    }
  }

  /**
   * Get sample statistics
   */
  async getSampleStats(): Promise<DatabaseResult<SampleStats>> {
    try {
      const samplesByCategory = {
        [SampleCategory.DEMO]: this.samples.filter(s => s.category === SampleCategory.DEMO).length,
        [SampleCategory.TEST]: this.samples.filter(s => s.category === SampleCategory.TEST).length,
        [SampleCategory.PROTOTYPE]: this.samples.filter(s => s.category === SampleCategory.PROTOTYPE).length,
        [SampleCategory.TEMPLATE]: this.samples.filter(s => s.category === SampleCategory.TEMPLATE).length,
        [SampleCategory.EXAMPLE]: this.samples.filter(s => s.category === SampleCategory.EXAMPLE).length,
      }

      const samplesByStatus = {
        [SampleStatus.DRAFT]: this.samples.filter(s => s.status === SampleStatus.DRAFT).length,
        [SampleStatus.ACTIVE]: this.samples.filter(s => s.status === SampleStatus.ACTIVE).length,
        [SampleStatus.INACTIVE]: this.samples.filter(s => s.status === SampleStatus.INACTIVE).length,
        [SampleStatus.ARCHIVED]: this.samples.filter(s => s.status === SampleStatus.ARCHIVED).length,
      }

      const recentSamples = this.samples
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)

      const stats: SampleStats = {
        totalSamples: this.samples.length,
        samplesByCategory,
        samplesByStatus,
        recentSamples
      }

      return { success: true, data: stats }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get sample stats'
      }
    }
  }
}