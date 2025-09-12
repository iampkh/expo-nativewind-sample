/**
 * Finance Module Repository
 * 
 * Module-specific repository that extends core FinanceRepository
 * with additional functionality specific to the finance module.
 */

import { FinanceRepository } from '../../../core/repositories/collaboration/finance/FinanceRepository'
import { DatabaseResult } from '../../../shared/types/database.types'
import { FinanceRecordModel } from '../../../core/storage/database/models/collaboration'
import { UserBalance } from '../types/finance.types'

export class FinanceModuleRepository {
  private financeRepository: FinanceRepository
  
  constructor() {
    this.financeRepository = FinanceRepository.getInstance()
  }

  /**
   * Get expenses with enhanced UI formatting
   */
  async getExpensesForUI(groupId: string, userId: string): Promise<DatabaseResult<Array<{
    expense: FinanceRecordModel
    userOwes: number
    userShare: number
    isUserPayer: boolean
    settlementStatus: 'settled' | 'pending' | 'partial'
  }>>> {
    try {
      const expensesResult = await this.financeRepository.getExpensesByGroup(groupId)
      
      if (!expensesResult.success || !expensesResult.data) {
        return expensesResult as any
      }

      const enhancedExpenses = await Promise.all(
        expensesResult.data.map(async (expense) => {
          // Get user's split for this expense
          const userSplit = await expense.getSplitForUser(userId)
          const isUserPayer = expense.paidBy === userId
          
          // Calculate settlement status
          const settlementStatus = await expense.getSettlementStatus()
          let status: 'settled' | 'pending' | 'partial' = 'pending'
          
          if (settlementStatus.isComplete) {
            status = 'settled'
          } else if (settlementStatus.settled > 0) {
            status = 'partial'
          }

          return {
            expense,
            userOwes: userSplit?.shareAmount || 0,
            userShare: userSplit?.shareAmount || 0,
            isUserPayer,
            settlementStatus: status
          }
        })
      )

      return {
        success: true,
        data: enhancedExpenses
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get expenses for UI'
      }
    }
  }

  /**
   * Get user's financial summary for a group
   */
  async getUserFinancialSummary(groupId: string, userId: string): Promise<DatabaseResult<{
    totalSpent: number
    totalOwed: number
    totalOwes: number
    netBalance: number
    expenseCount: number
    settledExpenses: number
    pendingExpenses: number
  }>> {
    try {
      // Get user balance
      const balanceResult = await this.financeRepository.getGroupBalanceSummary(groupId)
      if (!balanceResult.success || !balanceResult.data) {
        return balanceResult as any
      }

      const userBalance = balanceResult.data.find(balance => balance.userId === userId)
      
      // Get user's expenses
      const expensesResult = await this.financeRepository.getExpensesByGroup(groupId)
      if (!expensesResult.success || !expensesResult.data) {
        return expensesResult as any
      }

      // Calculate summary
      let totalSpent = 0
      let expenseCount = 0
      let settledExpenses = 0
      let pendingExpenses = 0

      for (const expense of expensesResult.data) {
        if (expense.paidBy === userId) {
          totalSpent += expense.amount
          expenseCount++

          const isSettled = await expense.isFullySettled()
          if (isSettled) {
            settledExpenses++
          } else {
            pendingExpenses++
          }
        }
      }

      const summary = {
        totalSpent,
        totalOwed: userBalance?.totalOwed || 0,
        totalOwes: userBalance?.totalOwes || 0,
        netBalance: userBalance?.netBalance || 0,
        expenseCount,
        settledExpenses,
        pendingExpenses
      }

      return {
        success: true,
        data: summary
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user financial summary'
      }
    }
  }

  /**
   * Get quick settlement suggestions
   */
  async getSettlementSuggestions(groupId: string): Promise<DatabaseResult<Array<{
    payerId: string
    payeeId: string
    amount: number
    currency: string
    expenseCount: number
  }>>> {
    try {
      const balanceResult = await this.financeRepository.getGroupBalanceSummary(groupId)
      
      if (!balanceResult.success || !balanceResult.data) {
        return balanceResult as any
      }

      const suggestions: Array<{
        payerId: string
        payeeId: string
        amount: number
        currency: string
        expenseCount: number
      }> = []

      // Simple algorithm: match users who owe money with those who are owed money
      const debtors = balanceResult.data.filter(balance => balance.netBalance < 0)
      const creditors = balanceResult.data.filter(balance => balance.netBalance > 0)

      for (const debtor of debtors) {
        for (const creditor of creditors) {
          if (debtor.currency === creditor.currency) {
            const settleAmount = Math.min(Math.abs(debtor.netBalance), creditor.netBalance)
            
            if (settleAmount > 0) {
              suggestions.push({
                payerId: debtor.userId,
                payeeId: creditor.userId,
                amount: settleAmount,
                currency: debtor.currency,
                expenseCount: 1 // Simplified for now
              })
            }
          }
        }
      }

      return {
        success: true,
        data: suggestions
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get settlement suggestions'
      }
    }
  }

  /**
   * Delegate to core repository methods
   */
  async createExpense(expenseData: any) {
    return this.financeRepository.createExpense(expenseData)
  }

  async getExpense(expenseId: string) {
    return this.financeRepository.getExpense(expenseId)
  }

  async updateExpense(expenseId: string, updates: any) {
    return this.financeRepository.updateExpense(expenseId, updates)
  }

  async deleteExpense(expenseId: string) {
    return this.financeRepository.deleteExpense(expenseId)
  }

  async getExpensesByGroup(groupId: string, filters?: any) {
    return this.financeRepository.getExpensesByGroup(groupId, filters)
  }

  async settleSplit(expenseId: string, userId: string) {
    return this.financeRepository.settleSplit(expenseId, userId)
  }

  async unsettleSplit(expenseId: string, userId: string) {
    return this.financeRepository.unsettleSplit(expenseId, userId)
  }

  async getGroupBalanceSummary(groupId: string, currency?: string) {
    return this.financeRepository.getGroupBalanceSummary(groupId, currency)
  }

  async getUserUnsettledExpenses(groupId: string, userId: string) {
    return this.financeRepository.getUserUnsettledExpenses(groupId, userId)
  }

  async getGroupSpendingSummary(groupId: string) {
    return this.financeRepository.getGroupSpendingSummary(groupId)
  }

  async createEqualSplit(expenseData: any, participantIds: string[]) {
    return this.financeRepository.createEqualSplit(expenseData, participantIds)
  }

  async settleUserDebts(groupId: string, payerId: string, payeeId: string) {
    return this.financeRepository.settleUserDebts(groupId, payerId, payeeId)
  }
}