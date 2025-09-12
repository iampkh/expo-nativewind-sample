/**
 * Finance Redux Thunks
 * 
 * Async actions for finance operations using Redux Toolkit.
 * Coordinates between repositories and state management.
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import { FinanceRepository } from '../../../core/repositories/collaboration/finance/FinanceRepository'
import { CreateExpenseRequest, UpdateExpenseRequest, SettleExpenseRequest, ExpenseFilters, EqualSplitRequest } from '../types/finance.types'
import { 
  setLoading, 
  setSettlementInProgress, 
  setError, 
  setExpenses, 
  addExpense, 
  updateExpense, 
  removeExpense,
  setCurrentExpense,
  setUserBalances
} from './financeSlice'

const financeRepository = FinanceRepository.getInstance()

// Fetch Expenses for Group
export const fetchExpensesByGroup = createAsyncThunk(
  'finance/fetchExpensesByGroup',
  async ({ groupId, filters }: { groupId: string; filters?: ExpenseFilters }, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await financeRepository.getExpensesByGroup(groupId, filters)
      
      if (result.success && result.data) {
        dispatch(setExpenses(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch expenses'))
        throw new Error(result.error || 'Failed to fetch expenses')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch expenses'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Create New Expense
export const createExpense = createAsyncThunk(
  'finance/createExpense',
  async (expenseData: CreateExpenseRequest, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const createData = {
        groupId: expenseData.groupId,
        createdBy: 'current-user-id', // TODO: Get from auth state
        title: expenseData.title,
        amount: expenseData.amount,
        currency: expenseData.currency,
        paidBy: expenseData.paidBy,
        date: expenseData.date,
        notes: expenseData.notes,
        splits: expenseData.splits
      }
      
      const result = await financeRepository.createExpense(createData)
      
      if (result.success && result.data) {
        dispatch(addExpense(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to create expense'))
        throw new Error(result.error || 'Failed to create expense')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create expense'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Create Equal Split Expense
export const createEqualSplitExpense = createAsyncThunk(
  'finance/createEqualSplitExpense',
  async (splitData: EqualSplitRequest, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const expenseData = {
        groupId: splitData.groupId,
        title: splitData.title,
        amount: splitData.amount,
        currency: splitData.currency,
        paidBy: splitData.paidBy,
        date: splitData.date,
        notes: splitData.notes,
        createdBy: 'current-user-id', // TODO: Get from auth state
      }
      
      const result = await financeRepository.createEqualSplit(expenseData, splitData.participantIds)
      
      if (result.success && result.data) {
        dispatch(addExpense(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to create equal split expense'))
        throw new Error(result.error || 'Failed to create equal split expense')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create equal split expense'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Update Expense
export const updateExpenseThunk = createAsyncThunk(
  'finance/updateExpense',
  async ({ expenseId, ...updates }: UpdateExpenseRequest, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await financeRepository.updateExpense(expenseId, updates)
      
      if (result.success && result.data) {
        dispatch(updateExpense(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to update expense'))
        throw new Error(result.error || 'Failed to update expense')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update expense'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Settle Expense
export const settleExpense = createAsyncThunk(
  'finance/settleExpense',
  async ({ expenseId, userId }: SettleExpenseRequest, { dispatch }) => {
    dispatch(setSettlementInProgress(true))
    dispatch(setError(null))
    
    try {
      const result = await financeRepository.settleSplit(expenseId, userId)
      
      if (result.success) {
        // Refresh the expense to get updated settlement status
        const expenseResult = await financeRepository.getExpense(expenseId)
        if (expenseResult.success && expenseResult.data) {
          dispatch(updateExpense(expenseResult.data))
        }
        return true
      } else {
        dispatch(setError(result.error || 'Failed to settle expense'))
        throw new Error(result.error || 'Failed to settle expense')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to settle expense'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setSettlementInProgress(false))
    }
  }
)

// Unsettle Expense
export const unsettleExpense = createAsyncThunk(
  'finance/unsettleExpense',
  async ({ expenseId, userId }: SettleExpenseRequest, { dispatch }) => {
    dispatch(setSettlementInProgress(true))
    dispatch(setError(null))
    
    try {
      const result = await financeRepository.unsettleSplit(expenseId, userId)
      
      if (result.success) {
        // Refresh the expense to get updated settlement status
        const expenseResult = await financeRepository.getExpense(expenseId)
        if (expenseResult.success && expenseResult.data) {
          dispatch(updateExpense(expenseResult.data))
        }
        return true
      } else {
        dispatch(setError(result.error || 'Failed to unsettle expense'))
        throw new Error(result.error || 'Failed to unsettle expense')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to unsettle expense'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setSettlementInProgress(false))
    }
  }
)

// Fetch Expense by ID
export const fetchExpense = createAsyncThunk(
  'finance/fetchExpense',
  async (expenseId: string, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await financeRepository.getExpense(expenseId)
      
      if (result.success && result.data) {
        dispatch(setCurrentExpense(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch expense'))
        throw new Error(result.error || 'Failed to fetch expense')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch expense'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Delete Expense
export const deleteExpense = createAsyncThunk(
  'finance/deleteExpense',
  async (expenseId: string, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await financeRepository.deleteExpense(expenseId)
      
      if (result.success) {
        dispatch(removeExpense(expenseId))
        return expenseId
      } else {
        dispatch(setError(result.error || 'Failed to delete expense'))
        throw new Error(result.error || 'Failed to delete expense')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete expense'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Fetch Group Balance Summary
export const fetchGroupBalances = createAsyncThunk(
  'finance/fetchGroupBalances',
  async ({ groupId, currency }: { groupId: string; currency?: string }, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await financeRepository.getGroupBalanceSummary(groupId, currency)
      
      if (result.success && result.data) {
        dispatch(setUserBalances(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch group balances'))
        throw new Error(result.error || 'Failed to fetch group balances')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch group balances'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Settle User Debts
export const settleUserDebts = createAsyncThunk(
  'finance/settleUserDebts',
  async ({ groupId, payerId, payeeId }: { groupId: string; payerId: string; payeeId: string }, { dispatch }) => {
    dispatch(setSettlementInProgress(true))
    dispatch(setError(null))
    
    try {
      const result = await financeRepository.settleUserDebts(groupId, payerId, payeeId)
      
      if (result.success) {
        // Refresh balances after settlement
        const balanceResult = await financeRepository.getGroupBalanceSummary(groupId)
        if (balanceResult.success && balanceResult.data) {
          dispatch(setUserBalances(balanceResult.data))
        }
        return true
      } else {
        dispatch(setError(result.error || 'Failed to settle user debts'))
        throw new Error(result.error || 'Failed to settle user debts')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to settle user debts'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setSettlementInProgress(false))
    }
  }
)