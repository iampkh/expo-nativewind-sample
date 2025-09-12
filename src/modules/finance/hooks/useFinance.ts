/**
 * useFinance Hook
 * 
 * React hook for managing finance state and operations.
 * Provides a clean interface for components to interact with expenses and balances.
 */

import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { 
  fetchExpensesByGroup, 
  createExpense as createExpenseThunk, 
  updateExpenseThunk,
  deleteExpense as deleteExpenseThunk,
  settleExpense as settleExpenseThunk,
  unsettleExpense as unsettleExpenseThunk,
  fetchGroupBalances,
  createEqualSplitExpense,
  settleUserDebts as settleUserDebtsThunk
} from '../store/financeThunks'
import { clearError } from '../store/financeSlice'
import { CreateExpenseRequest, UpdateExpenseRequest, SettleExpenseRequest, ExpenseFilters, EqualSplitRequest, UseFinanceReturn } from '../types/finance.types'

export const useFinance = (groupId: string): UseFinanceReturn => {
  const dispatch = useDispatch<AppDispatch>()
  
  const { 
    expenses, 
    userBalances,
    loading, 
    error, 
    settlementInProgress 
  } = useSelector((state: RootState) => state.finance)

  // Fetch expenses for group
  const refreshExpenses = useCallback(async (filters?: ExpenseFilters) => {
    if (!groupId) return
    
    try {
      await dispatch(fetchExpensesByGroup({ groupId, filters })).unwrap()
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    }
  }, [dispatch, groupId])

  // Fetch user balances
  const refreshBalances = useCallback(async (currency?: string) => {
    if (!groupId) return
    
    try {
      await dispatch(fetchGroupBalances({ groupId, currency })).unwrap()
    } catch (error) {
      console.error('Failed to fetch balances:', error)
    }
  }, [dispatch, groupId])

  // Create new expense
  const createExpense = useCallback(async (data: CreateExpenseRequest) => {
    try {
      await dispatch(createExpenseThunk(data)).unwrap()
      // Expenses are automatically added to state by the thunk
    } catch (error) {
      console.error('Failed to create expense:', error)
      throw error
    }
  }, [dispatch])

  // Create equal split expense
  const createEqualSplit = useCallback(async (data: EqualSplitRequest) => {
    try {
      await dispatch(createEqualSplitExpense(data)).unwrap()
    } catch (error) {
      console.error('Failed to create equal split expense:', error)
      throw error
    }
  }, [dispatch])

  // Update expense
  const updateExpense = useCallback(async (data: UpdateExpenseRequest) => {
    try {
      await dispatch(updateExpenseThunk(data)).unwrap()
    } catch (error) {
      console.error('Failed to update expense:', error)
      throw error
    }
  }, [dispatch])

  // Delete expense
  const deleteExpense = useCallback(async (expenseId: string) => {
    try {
      await dispatch(deleteExpenseThunk(expenseId)).unwrap()
    } catch (error) {
      console.error('Failed to delete expense:', error)
      throw error
    }
  }, [dispatch])

  // Settle expense
  const settleExpense = useCallback(async (data: SettleExpenseRequest) => {
    try {
      await dispatch(settleExpenseThunk(data)).unwrap()
      // Refresh balances after settlement
      await refreshBalances()
    } catch (error) {
      console.error('Failed to settle expense:', error)
      throw error
    }
  }, [dispatch, refreshBalances])

  // Unsettle expense
  const unsettleExpense = useCallback(async (data: SettleExpenseRequest) => {
    try {
      await dispatch(unsettleExpenseThunk(data)).unwrap()
      // Refresh balances after unsettlement
      await refreshBalances()
    } catch (error) {
      console.error('Failed to unsettle expense:', error)
      throw error
    }
  }, [dispatch, refreshBalances])

  // Settle user debts
  const settleUserDebts = useCallback(async (payerId: string, payeeId: string) => {
    try {
      await dispatch(settleUserDebtsThunk({ groupId, payerId, payeeId })).unwrap()
      // Balances are automatically refreshed by the thunk
    } catch (error) {
      console.error('Failed to settle user debts:', error)
      throw error
    }
  }, [dispatch, groupId])

  // Clear error
  const clearFinanceError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Load expenses and balances on mount and when groupId changes
  useEffect(() => {
    if (groupId) {
      refreshExpenses()
      refreshBalances()
    }
  }, [refreshExpenses, refreshBalances, groupId])

  return {
    expenses,
    userBalances,
    loading,
    error,
    settlementInProgress,
    createExpense,
    createEqualSplit,
    updateExpense,
    deleteExpense,
    settleExpense,
    unsettleExpense,
    settleUserDebts,
    refreshExpenses,
    refreshBalances,
    clearError: clearFinanceError,
  }
}