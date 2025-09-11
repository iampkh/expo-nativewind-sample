/**
 * Sample Redux Thunks
 * 
 * Async actions for sample operations using Redux Toolkit.
 * Coordinates between repositories and state management.
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import { SampleModuleRepository } from '../repositories/SampleModuleRepository'
import { CreateSampleRequest, UpdateSampleRequest, SampleFilters } from '../types/sample.types'
import { 
  setLoading, 
  setProcessing, 
  setError, 
  setSamples, 
  addSample, 
  updateSample, 
  removeSample,
  setCurrentSample
} from './sampleSlice'

const sampleRepository = new SampleModuleRepository()

// Fetch All Samples
export const fetchSamples = createAsyncThunk(
  'sample/fetchSamples',
  async (filters: SampleFilters = {}, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await sampleRepository.getAllSamples(filters)
      
      if (result.success && result.data) {
        dispatch(setSamples(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch samples'))
        throw new Error(result.error || 'Failed to fetch samples')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch samples'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Create New Sample
export const createSample = createAsyncThunk(
  'sample/createSample',
  async (sampleData: CreateSampleRequest, { dispatch }) => {
    dispatch(setProcessing(true))
    dispatch(setError(null))
    
    try {
      const createData = {
        ...sampleData,
        createdBy: 'current-user-id', // TODO: Get from auth state
      }
      
      const result = await sampleRepository.createSample(createData)
      
      if (result.success && result.data) {
        dispatch(addSample(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to create sample'))
        throw new Error(result.error || 'Failed to create sample')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create sample'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setProcessing(false))
    }
  }
)

// Update Sample
export const updateSampleThunk = createAsyncThunk(
  'sample/updateSample',
  async ({ sampleId, ...updates }: UpdateSampleRequest, { dispatch }) => {
    dispatch(setProcessing(true))
    dispatch(setError(null))
    
    try {
      const result = await sampleRepository.updateSample(sampleId, updates)
      
      if (result.success && result.data) {
        dispatch(updateSample(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to update sample'))
        throw new Error(result.error || 'Failed to update sample')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update sample'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setProcessing(false))
    }
  }
)

// Delete Sample
export const deleteSample = createAsyncThunk(
  'sample/deleteSample',
  async (sampleId: string, { dispatch }) => {
    dispatch(setProcessing(true))
    dispatch(setError(null))
    
    try {
      const result = await sampleRepository.deleteSample(sampleId)
      
      if (result.success) {
        dispatch(removeSample(sampleId))
        return sampleId
      } else {
        dispatch(setError(result.error || 'Failed to delete sample'))
        throw new Error(result.error || 'Failed to delete sample')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete sample'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setProcessing(false))
    }
  }
)

// Fetch Sample by ID
export const fetchSample = createAsyncThunk(
  'sample/fetchSample',
  async (sampleId: string, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await sampleRepository.getSample(sampleId)
      
      if (result.success && result.data) {
        dispatch(setCurrentSample(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch sample'))
        throw new Error(result.error || 'Failed to fetch sample')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch sample'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)