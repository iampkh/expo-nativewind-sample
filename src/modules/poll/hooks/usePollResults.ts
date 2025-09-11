/**
 * usePollResults Hook
 * 
 * React hook for managing poll results and analytics.
 */

import { useState, useCallback, useEffect } from 'react'
import { PollModuleRepository } from '../repositories/PollModuleRepository'
import { PollResults, UsePollResultsReturn } from '../types/poll.types'

export const usePollResults = (pollId: string): UsePollResultsReturn => {
  const [results, setResults] = useState<PollResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pollRepository = new PollModuleRepository()

  const refreshResults = useCallback(async () => {
    if (!pollId) return

    setLoading(true)
    setError(null)

    try {
      const result = await pollRepository.getPollResultsForUI(pollId)
      
      if (result.success && result.data) {
        setResults(result.data)
      } else {
        setError(result.error || 'Failed to fetch poll results')
        setResults(null)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch poll results'
      setError(message)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [pollId, pollRepository])

  // Load results on mount and when pollId changes
  useEffect(() => {
    refreshResults()
  }, [refreshResults])

  return {
    results,
    loading,
    error,
    refreshResults,
  }
}