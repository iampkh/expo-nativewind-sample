/**
 * Sample Module Types
 * 
 * Defines all TypeScript interfaces and types used across the sample module.
 * Includes state shapes, API responses, and component props.
 */

// Sample State Management Types
export interface SampleState {
  samples: SampleItem[]
  currentSample: SampleItem | null
  loading: boolean
  error: string | null
  processing: boolean
}

// Core Sample Types
export interface SampleItem {
  id: string
  name: string
  description: string
  category: SampleCategory
  status: SampleStatus
  data: Record<string, any>
  createdAt: Date
  updatedAt?: Date
  createdBy: string
}

// Sample Categories
export enum SampleCategory {
  DEMO = 'demo',
  TEST = 'test',
  PROTOTYPE = 'prototype',
  TEMPLATE = 'template',
  EXAMPLE = 'example'
}

// Sample Status
export enum SampleStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

// Sample Creation Types
export interface CreateSampleRequest {
  name: string
  description: string
  category: SampleCategory
  data?: Record<string, any>
}

// Sample Update Types
export interface UpdateSampleRequest {
  sampleId: string
  name?: string
  description?: string
  category?: SampleCategory
  status?: SampleStatus
  data?: Record<string, any>
}

// Sample Filters
export interface SampleFilters {
  category?: SampleCategory
  status?: SampleStatus
  createdBy?: string
  search?: string
}

// Component Props Types
export interface SampleCardProps {
  sample: SampleItem
  onEdit?: (sampleId: string) => void
  onDelete?: (sampleId: string) => void
  onStatusChange?: (sampleId: string, status: SampleStatus) => void
  className?: string
}

// Hook Return Types
export interface UseSampleReturn {
  samples: SampleItem[]
  currentSample: SampleItem | null
  loading: boolean
  error: string | null
  processing: boolean
  createSample: (data: CreateSampleRequest) => Promise<void>
  updateSample: (data: UpdateSampleRequest) => Promise<void>
  deleteSample: (sampleId: string) => Promise<void>
  getSample: (sampleId: string) => Promise<SampleItem>
  refreshSamples: () => Promise<void>
  clearError: () => void
}

// Sample Statistics
export interface SampleStats {
  totalSamples: number
  samplesByCategory: Record<SampleCategory, number>
  samplesByStatus: Record<SampleStatus, number>
  recentSamples: SampleItem[]
}