/**
 * Finance Redux Slice
 * 
 * Manages finance state using Redux Toolkit.
 * Handles expense loading, creation, settlement, and error states.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FinanceRecordModel } from '../../../core/storage/database/models/collaboration'
import { FinanceState, UserBalance } from '../types/finance.types'

const initialState: FinanceState = {
  expenses: [],
  currentExpense: null,
  userBalances: [],
  loading: false,
  error: null,
  settlementInProgress: false,
}

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    // Loading States
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    setSettlementInProgress: (state, action: PayloadAction<boolean>) => {
      state.settlementInProgress = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // Expense Data Management
    setExpenses: (state, action: PayloadAction<FinanceRecordModel[]>) => {
      state.expenses = action.payload
      state.error = null
    },
    
    addExpense: (state, action: PayloadAction<FinanceRecordModel>) => {
      state.expenses.unshift(action.payload) // Add to beginning
      state.error = null
    },
    
    updateExpense: (state, action: PayloadAction<FinanceRecordModel>) => {
      const index = state.expenses.findIndex(expense => expense.id === action.payload.id)
      if (index !== -1) {
        state.expenses[index] = action.payload
      }
      
      // Update current expense if it matches
      if (state.currentExpense?.id === action.payload.id) {
        state.currentExpense = action.payload
      }
    },
    
    removeExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload)
      
      // Clear current expense if it was deleted
      if (state.currentExpense?.id === action.payload) {
        state.currentExpense = null
      }
    },
    
    // Current Expense Management
    setCurrentExpense: (state, action: PayloadAction<FinanceRecordModel | null>) => {
      state.currentExpense = action.payload
    },
    
    // User Balances Management
    setUserBalances: (state, action: PayloadAction<UserBalance[]>) => {
      state.userBalances = action.payload
    },
    
    updateUserBalance: (state, action: PayloadAction<UserBalance>) => {
      const index = state.userBalances.findIndex(balance => balance.userId === action.payload.userId)
      if (index !== -1) {
        state.userBalances[index] = action.payload
      } else {
        state.userBalances.push(action.payload)
      }
    },
    
    // Reset State
    resetFinanceState: (state) => {
      Object.assign(state, initialState)
    },
    
    // Clear Errors
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setSettlementInProgress,
  setError,
  setExpenses,
  addExpense,
  updateExpense,
  removeExpense,
  setCurrentExpense,
  setUserBalances,
  updateUserBalance,
  resetFinanceState,
  clearError,
} = financeSlice.actions

export default financeSlice.reducer