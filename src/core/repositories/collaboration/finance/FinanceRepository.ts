/**
 * FinanceRepository - Repository for expense tracking and splitting (like Splitwise)
 * 
 * PURPOSE:
 * Handles financial expense records and split calculations for groups.
 * Provides comprehensive expense splitting functionality with settlement tracking.
 * Supports multiple currencies and complex split scenarios.
 * 
 * FEATURES:
 * - Expense CRUD operations
 * - Automatic split calculation
 * - Settlement tracking
 * - Multi-currency support
 * - Debt calculation between users
 * - Payment history and reconciliation
 */

import { database } from '../../../storage/database'
import { DatabaseResult } from '../../../../shared/types/database.types'
import { FinanceRecordModel, FinanceSplitModel } from '../../../storage/database/models/collaboration'
import { Q } from '@nozbe/watermelondb'

export interface CreateExpenseData {
  groupId: string
  createdBy: string
  title: string
  amount: number
  currency: string
  paidBy: string
  date: string // YYYY-MM-DD format
  notes?: string
  splits: Array<{
    userId: string
    shareAmount: number
  }>
}

export interface UpdateExpenseData {
  title?: string
  amount?: number
  currency?: string
  date?: string
  notes?: string
}

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

export interface UserBalance {
  userId: string
  totalOwed: number    // Money owed to this user
  totalOwes: number    // Money this user owes
  netBalance: number   // Positive = owed money, Negative = owes money
  currency: string
}

export class FinanceRepository {
  private static instance: FinanceRepository
  
  private constructor() {}
  
  public static getInstance(): FinanceRepository {
    if (!FinanceRepository.instance) {
      FinanceRepository.instance = new FinanceRepository()
    }
    return FinanceRepository.instance
  }

  /**
   * Creates a new expense record with automatic split creation
   * Validates splits add up to total amount
   */
  async createExpense(expenseData: CreateExpenseData): Promise<DatabaseResult<FinanceRecordModel>> {
    try {
      // Validate splits add up to total amount
      const totalSplits = expenseData.splits.reduce((sum, split) => sum + split.shareAmount, 0)
      const tolerance = 0.01 // Allow 1 cent difference for rounding
      
      if (Math.abs(totalSplits - expenseData.amount) > tolerance) {
        return { success: false, error: 'Split amounts must equal the total expense amount' }
      }

      if (expenseData.splits.length === 0) {
        return { success: false, error: 'Expense must have at least one split' }
      }

      const newExpense = await database.write(async () => {
        // Create the expense record
        const expenseCollection = database.get<FinanceRecordModel>('finance_records')
        const expense = await expenseCollection.create(record => {
          record.groupId = expenseData.groupId
          record.createdBy = expenseData.createdBy
          record.title = expenseData.title
          record.amount = expenseData.amount
          record.currency = expenseData.currency
          record.paidBy = expenseData.paidBy
          record.date = expenseData.date
          record.notes = expenseData.notes || ''
        })

        // Create split records
        const splitCollection = database.get<FinanceSplitModel>('finance_splits')
        await Promise.all(
          expenseData.splits.map(splitData =>
            splitCollection.create(split => {
              split.recordId = expense.id
              split.userId = splitData.userId
              split.shareAmount = splitData.shareAmount
              split.isSettled = splitData.userId === expenseData.paidBy // Payer is automatically settled
            })
          )
        )

        return expense
      })

      return { success: true, data: newExpense }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create expense' 
      }
    }
  }

  /**
   * Retrieves a single expense with its splits
   */
  async getExpense(expenseId: string): Promise<DatabaseResult<FinanceRecordModel>> {
    try {
      const expense = await database.get<FinanceRecordModel>('finance_records').find(expenseId)
      
      if (!expense) {
        return { success: false, error: 'Expense not found' }
      }

      return { success: true, data: expense }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve expense' 
      }
    }
  }

  /**
   * Updates expense information (not splits - those require separate operations)
   */
  async updateExpense(expenseId: string, updates: UpdateExpenseData): Promise<DatabaseResult<FinanceRecordModel>> {
    try {
      const updatedExpense = await database.write(async () => {
        const expense = await database.get<FinanceRecordModel>('finance_records').find(expenseId)
        
        return await expense.update(record => {
          if (updates.title !== undefined) record.title = updates.title
          if (updates.amount !== undefined) record.amount = updates.amount
          if (updates.currency !== undefined) record.currency = updates.currency
          if (updates.date !== undefined) record.date = updates.date
          if (updates.notes !== undefined) record.notes = updates.notes
        })
      })

      return { success: true, data: updatedExpense }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update expense' 
      }
    }
  }

  /**
   * Deletes an expense and all its splits
   * Should be restricted to expense creator or group admins
   */
  async deleteExpense(expenseId: string): Promise<DatabaseResult<boolean>> {
    try {
      await database.write(async () => {
        // Delete all splits first
        const splits = await database.get<FinanceSplitModel>('finance_splits')
          .query(Q.where('record_id', expenseId))
          .fetch()
        
        await Promise.all(splits.map((split) => split.destroyPermanently()))

        // Delete the expense
        const expense = await database.get<FinanceRecordModel>('finance_records').find(expenseId)
        await expense.destroyPermanently()
      })

      return { success: true, data: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete expense' 
      }
    }
  }

  /**
   * Retrieves all expenses for a group with filtering
   */
  async getExpensesByGroup(groupId: string, filters?: ExpenseFilters): Promise<DatabaseResult<FinanceRecordModel[]>> {
    try {
      // Build query conditions
      const conditions = [Q.where('group_id', groupId)]
      
      // Apply simple filters
      if (filters?.paidBy) {
        conditions.push(Q.where('paid_by', filters.paidBy))
      }
      if (filters?.createdBy) {
        conditions.push(Q.where('created_by', filters.createdBy))
      }
      if (filters?.currency) {
        conditions.push(Q.where('currency', filters.currency))
      }
      
      const query = database.get<FinanceRecordModel>('finance_records').query(
        conditions.length === 1 ? conditions[0] : Q.and(...conditions)
      )

      const expenses = await query.fetch()
      
      // Post-process for complex filters
      let filteredExpenses = expenses
      
      if (filters?.dateRange) {
        filteredExpenses = filteredExpenses.filter(expense => {
          const { from, to } = filters.dateRange!
          const expenseDate = expense.date
          
          if (from && expenseDate < from) return false
          if (to && expenseDate > to) return false
          
          return true
        })
      }
      
      if (filters?.minAmount !== undefined) {
        filteredExpenses = filteredExpenses.filter((expense) => expense.amount >= filters.minAmount!)
      }
      
      if (filters?.maxAmount !== undefined) {
        filteredExpenses = filteredExpenses.filter((expense) => expense.amount <= filters.maxAmount!)
      }
      
      if (filters?.isSettled !== undefined) {
        // This requires checking splits, which is complex
        const expensesWithSettlement = await Promise.all(
          filteredExpenses.map(async (expense) => {
            const isSettled = await expense.isFullySettled()
            return { expense, isSettled }
          })
        )
        
        filteredExpenses = expensesWithSettlement
          .filter((item) => item.isSettled === filters.isSettled)
          .map((item) => item.expense)
      }

      // Sort by date (newest first)
      filteredExpenses.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })

      return { success: true, data: filteredExpenses }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve expenses' 
      }
    }
  }

  /**
   * Marks a user's split as settled (they've paid their share)
   */
  async settleSplit(expenseId: string, userId: string): Promise<DatabaseResult<boolean>> {
    try {
      await database.write(async () => {
        const splits = await database.get<FinanceSplitModel>('finance_splits')
          .query(Q.and(Q.where('record_id', expenseId), Q.where('user_id', userId)))
          .fetch()

        if (splits.length === 0) {
          throw new Error('Split not found for this user')
        }

        await Promise.all(
          splits.map((split) => 
            split.update((splitRecord) => {
              splitRecord.isSettled = true
            })
          )
        )
      })

      return { success: true, data: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to settle split' 
      }
    }
  }

  /**
   * Marks a user's split as unsettled (reverses settlement)
   */
  async unsettleSplit(expenseId: string, userId: string): Promise<DatabaseResult<boolean>> {
    try {
      await database.write(async () => {
        const splits = await database.get<FinanceSplitModel>('finance_splits')
          .query(Q.and(Q.where('record_id', expenseId), Q.where('user_id', userId)))
          .fetch()

        await Promise.all(
          splits.map((split) => 
            split.update((splitRecord) => {
              splitRecord.isSettled = false
            })
          )
        )
      })

      return { success: true, data: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to unsettle split' 
      }
    }
  }

  /**
   * Calculates balance summary for all users in a group
   * Shows who owes what to whom
   */
  async getGroupBalanceSummary(groupId: string, currency?: string): Promise<DatabaseResult<UserBalance[]>> {
    try {
      // Get all expenses for the group
      const expenses = await database.get<FinanceRecordModel>('finance_records')
        .query(Q.where('group_id', groupId))
        .fetch()

      // Filter by currency if specified
      const filteredExpenses = currency 
        ? expenses.filter((expense) => expense.currency === currency)
        : expenses

      // Get all splits for these expenses
      const allSplits = await Promise.all(
        filteredExpenses.map((expense) => 
          database.get<FinanceSplitModel>('finance_splits')
            .query(Q.where('record_id', expense.id))
            .fetch()
        )
      )

      const flatSplits = allSplits.flat()

      // Calculate balances per user
      const userBalances = new Map<string, UserBalance>()

      for (const expense of filteredExpenses) {
        const payer = expense.paidBy
        const expenseSplits = flatSplits.filter((split) => split.recordId === expense.id)

        // Initialize balances if needed
        if (!userBalances.has(payer)) {
          userBalances.set(payer, {
            userId: payer,
            totalOwed: 0,
            totalOwes: 0,
            netBalance: 0,
            currency: expense.currency
          })
        }

        for (const split of expenseSplits) {
          if (!userBalances.has(split.userId)) {
            userBalances.set(split.userId, {
              userId: split.userId,
              totalOwed: 0,
              totalOwes: 0,
              netBalance: 0,
              currency: expense.currency
            })
          }

          const userBalance = userBalances.get(split.userId)!
          const payerBalance = userBalances.get(payer)!

          if (split.userId === payer) {
            // Payer paid for themselves - no debt
            continue
          }

          if (split.isSettled) {
            // Split is settled - no current debt
            continue
          }

          // User owes money to payer
          userBalance.totalOwes += split.shareAmount
          payerBalance.totalOwed += split.shareAmount
        }
      }

      // Calculate net balances
      for (const balance of userBalances.values()) {
        balance.netBalance = balance.totalOwed - balance.totalOwes
      }

      return { success: true, data: Array.from(userBalances.values()) }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to calculate group balance' 
      }
    }
  }

  /**
   * Gets unsettled expenses for a specific user
   * Shows what they owe and what's owed to them
   */
  async getUserUnsettledExpenses(groupId: string, userId: string): Promise<DatabaseResult<{
    owes: FinanceRecordModel[]      // Expenses where user owes money
    isOwed: FinanceRecordModel[]    // Expenses where user is owed money
  }>> {
    try {
      const expenses = await this.getExpensesByGroup(groupId, { isSettled: false })
      
      if (!expenses.success || !expenses.data) {
        return expenses as any
      }

      const owes: FinanceRecordModel[] = []
      const isOwed: FinanceRecordModel[] = []

      for (const expense of expenses.data) {
        // Check if user is the payer (owed money)
        if (expense.paidBy === userId) {
          const settlement = await expense.getSettlementStatus()
          if (!settlement.isComplete) {
            isOwed.push(expense)
          }
        } else {
          // Check if user has unsettled splits (owes money)
          const userSplit = await expense.getSplitForUser(userId)
          if (userSplit && !userSplit.isSettled) {
            owes.push(expense)
          }
        }
      }

      return { 
        success: true, 
        data: { owes, isOwed }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get user unsettled expenses' 
      }
    }
  }

  /**
   * Calculates total amounts by currency for a group
   * Useful for group spending summaries
   */
  async getGroupSpendingSummary(groupId: string): Promise<DatabaseResult<{
    totalByCurrency: Record<string, number>
    expenseCount: number
    settledAmount: Record<string, number>
    pendingAmount: Record<string, number>
  }>> {
    try {
      const expenses = await this.getExpensesByGroup(groupId)
      
      if (!expenses.success || !expenses.data) {
        return expenses as any
      }

      const summary = {
        totalByCurrency: {} as Record<string, number>,
        expenseCount: expenses.data.length,
        settledAmount: {} as Record<string, number>,
        pendingAmount: {} as Record<string, number>
      }

      for (const expense of expenses.data) {
        const currency = expense.currency
        
        // Initialize currency totals
        if (!summary.totalByCurrency[currency]) {
          summary.totalByCurrency[currency] = 0
          summary.settledAmount[currency] = 0
          summary.pendingAmount[currency] = 0
        }

        summary.totalByCurrency[currency] += expense.amount

        // Check settlement status
        const isSettled = await expense.isFullySettled()
        if (isSettled) {
          summary.settledAmount[currency] += expense.amount
        } else {
          summary.pendingAmount[currency] += expense.amount
        }
      }

      return { success: true, data: summary }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get spending summary' 
      }
    }
  }

  /**
   * Creates equal splits for an expense among specified users
   * Convenience method for common split scenarios
   */
  async createEqualSplit(
    expenseData: Omit<CreateExpenseData, 'splits'>, 
    participantIds: string[]
  ): Promise<DatabaseResult<FinanceRecordModel>> {
    if (participantIds.length === 0) {
      return { success: false, error: 'Must have at least one participant' }
    }

    const shareAmount = Math.round((expenseData.amount / participantIds.length) * 100) / 100
    const remainder = Math.round((expenseData.amount - (shareAmount * participantIds.length)) * 100) / 100

    const splits = participantIds.map((userId, index) => ({
      userId,
      shareAmount: index === 0 ? shareAmount + remainder : shareAmount // Add remainder to first person
    }))

    return this.createExpense({
      ...expenseData,
      splits
    })
  }

  /**
   * Settles all debts between two users in a group
   * Marks all relevant splits as settled
   */
  async settleUserDebts(groupId: string, payerId: string, payeeId: string): Promise<DatabaseResult<boolean>> {
    try {
      await database.write(async () => {
        // Find all expenses where payeeId paid and payerId owes
        const expenses = await database.get<FinanceRecordModel>('finance_records')
          .query(Q.and(Q.where('group_id', groupId), Q.where('paid_by', payeeId)))
          .fetch()

        // Find unsettled splits for the payer
        for (const expense of expenses) {
          const splits = await database.get<FinanceSplitModel>('finance_splits')
            .query(Q.and(
              Q.where('record_id', expense.id), 
              Q.where('user_id', payerId), 
              Q.where('is_settled', false)
            ))
            .fetch()

          await Promise.all(
            splits.map((split) => 
              split.update((splitRecord) => {
                splitRecord.isSettled = true
              })
            )
          )
        }
      })

      return { success: true, data: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to settle user debts' 
      }
    }
  }
}