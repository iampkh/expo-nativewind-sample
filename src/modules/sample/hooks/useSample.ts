/**
 * useSample Hook
 * 
 * React hook for managing sample state and operations.
 * Provides a clean interface for components to interact with samples.
 */

import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { 
  fetchSamples, 
  createSample as createSampleThunk, 
  updateSampleThunk,
  deleteSample as deleteSampleThunk,
  fetchSample
} from '../store/sampleThunks'
import { clearError } from '../store/sampleSlice'
import { CreateSampleRequest, UpdateSampleRequest, SampleFilters, UseSampleReturn } from '../types/sample.types'

export const useSample = (): UseSampleReturn => {
  const dispatch = useDispatch<AppDispatch>()
  
  const { 
    samples,
    currentSample,
    loading, 
    error, 
    processing 
  } = useSelector((state: RootState) => state.sample)

  // Fetch all samples
  const refreshSamples = useCallback(async (filters?: SampleFilters) => {
    try {
      await dispatch(fetchSamples(filters || {})).unwrap()
    } catch (error) {
      console.error('Failed to fetch samples:', error)
    }
  }, [dispatch])

  // Create new sample
  const createSample = useCallback(async (data: CreateSampleRequest) => {
    try {
      await dispatch(createSampleThunk(data)).unwrap()
      // Samples are automatically added to state by the thunk
    } catch (error) {
      console.error('Failed to create sample:', error)
      throw error
    }
  }, [dispatch])

  // Update sample
  const updateSample = useCallback(async (data: UpdateSampleRequest) => {
    try {
      await dispatch(updateSampleThunk(data)).unwrap()
    } catch (error) {
      console.error('Failed to update sample:', error)
      throw error
    }
  }, [dispatch])

  // Delete sample
  const deleteSample = useCallback(async (sampleId: string) => {
    try {
      await dispatch(deleteSampleThunk(sampleId)).unwrap()
    } catch (error) {
      console.error('Failed to delete sample:', error)
      throw error
    }
  }, [dispatch])

  // Fetch single sample
  const getSample = useCallback(async (sampleId: string) => {
    try {
      const sample = await dispatch(fetchSample(sampleId)).unwrap()
      return sample
    } catch (error) {
      console.error('Failed to get sample:', error)
      throw error
    }
  }, [dispatch])

  // Clear error
  const clearSampleError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Load samples on mount
  useEffect(() => {
    refreshSamples()
  }, [refreshSamples])

  return {
    samples,
    currentSample,
    loading,
    error,
    processing,
    createSample,
    updateSample,
    deleteSample,
    refreshSamples,
    getSample,
    clearError: clearSampleError,
  }
}