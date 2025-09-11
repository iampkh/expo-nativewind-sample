/**
 * Finance Module Types
 * 
 * Defines all TypeScript interfaces and types used across the finance module.
 * Includes state shapes, API responses, and component props.
 */

import { FinanceRecordModel, FinanceSplitModel } from '../../../core/storage/database/models/collaboration'

// Finance State Management Types
export interface FinanceState {
  expenses: FinanceRecordModel[]
  currentExpense: FinanceRecordModel | null
  userBalances: UserBalance[]
  loading: boolean
  error: string | null
  settlementInProgress: boolean
}

// Expense Creation Types
export interface CreateExpenseRequest {
  groupId: string
  title: string
  amount: number
  currency: string
  paidBy: string
  date: string
  notes?: string
  splits: Array<{
    userId: string
    shareAmount: number
  }>
}

// Expense Update Types
export interface UpdateExpenseRequest {
  expenseId: string
  title?: string
  amount?: number
  currency?: string
  date?: string
  notes?: string
}

// Settlement Types
export interface SettleExpenseRequest {
  expenseId: string
  userId: string
}

// User Balance Types
export interface UserBalance {
  userId: string
  totalOwed: number    // Money owed to this user
  totalOwes: number    // Money this user owes
  netBalance: number   // Positive = owed money, Negative = owes money
  currency: string
}

// Expense Filters
export interface ExpenseFilters {
  paidBy?: string
  createdBy?: string
  currency?: string
  isSettled?: boolean
  dateRange?: {
    from?: string
    to?: string
  }
  minAmount?: number
  maxAmount?: number
}

// Component Props Types
export interface FinanceCardProps {
  expense: FinanceRecordModel
  onSettle?: (expenseId: string, userId: string) => void
  onEdit?: (expenseId: string) => void
  onDelete?: (expenseId: string) => void
  className?: string
}

export interface ExpenseSplitProps {
  split: FinanceSplitModel
  onSettle?: (expenseId: string, userId: string) => void
  className?: string
}

// Hook Return Types
export interface UseFinanceReturn {
  expenses: FinanceRecordModel[]
  userBalances: UserBalance[]
  loading: boolean
  error: string | null
  settlementInProgress: boolean
  createExpense: (data: CreateExpenseRequest) => Promise<void>
  createEqualSplit: (data: EqualSplitRequest, participantIds: string[]) => Promise<void>
  updateExpense: (data: UpdateExpenseRequest) => Promise<void>
  deleteExpense: (expenseId: string) => Promise<void>
  settleExpense: (data: SettleExpenseRequest) => Promise<void>
  unsettleExpense: (data: SettleExpenseRequest) => Promise<void>
  settleUserDebts: (groupId: string, payerId: string, payeeId: string) => Promise<void>
  refreshExpenses: () => Promise<void>
  refreshBalances: () => Promise<void>
  clearError: () => void
}

// Spending Summary Types
export interface SpendingSummary {
  totalByCurrency: Record<string, number>
  expenseCount: number
  settledAmount: Record<string, number>
  pendingAmount: Record<string, number>
}

// Equal Split Helper
export interface EqualSplitRequest {
  groupId: string
  title: string
  amount: number
  currency: string
  paidBy: string
  date: string
  notes?: string
  participantIds: string[]
}