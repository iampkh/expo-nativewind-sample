/**
 * Create Expense Use Case
 * 
 * Business logic for creating new expenses with validation and error handling.
 */

import { BaseUseCase } from '../../../core/useCases/BaseUseCase'
import { FinanceModuleRepository } from '../repositories/FinanceModuleRepository'
import { DatabaseResult } from '../../../shared/types/database.types'
import { FinanceRecordModel } from '../../../core/storage/database/models/collaboration'
import { CreateExpenseRequest } from '../types/finance.types'

export interface CreateExpenseData extends CreateExpenseRequest {
  createdBy: string
}

export class CreateExpenseUseCase extends BaseUseCase<CreateExpenseData, DatabaseResult<FinanceRecordModel>> {
  private financeRepository: FinanceModuleRepository

  constructor() {
    super()
    this.financeRepository = new FinanceModuleRepository()
  }

  async execute(data: CreateExpenseData): Promise<DatabaseResult<FinanceRecordModel>> {
    try {
      // Validate input
      const validationResult = this.validateInput(data)
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error
        }
      }

      // Create expense
      const result = await this.financeRepository.createExpense({
        groupId: data.groupId,
        createdBy: data.createdBy,
        title: data.title.trim(),
        amount: data.amount,
        currency: data.currency.toUpperCase(),
        paidBy: data.paidBy,
        date: data.date,
        notes: data.notes?.trim() || '',
        splits: data.splits
      })

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create expense'
      }
    }
  }

  private validateInput(data: CreateExpenseData): { isValid: boolean; error?: string } {
    // Required fields
    if (!data.groupId?.trim()) {
      return { isValid: false, error: 'Group ID is required' }
    }

    if (!data.createdBy?.trim()) {
      return { isValid: false, error: 'Creator ID is required' }
    }

    if (!data.title?.trim()) {
      return { isValid: false, error: 'Expense title is required' }
    }

    if (!data.paidBy?.trim()) {
      return { isValid: false, error: 'Payer ID is required' }
    }

    if (!data.currency?.trim()) {
      return { isValid: false, error: 'Currency is required' }
    }

    if (!data.date?.trim()) {
      return { isValid: false, error: 'Date is required' }
    }

    // Title validation
    if (data.title.trim().length < 2) {
      return { isValid: false, error: 'Expense title must be at least 2 characters long' }
    }

    if (data.title.trim().length > 200) {
      return { isValid: false, error: 'Expense title cannot exceed 200 characters' }
    }

    // Amount validation
    if (typeof data.amount !== 'number' || isNaN(data.amount)) {
      return { isValid: false, error: 'Amount must be a valid number' }
    }

    if (data.amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than zero' }
    }

    if (data.amount > 1000000) {
      return { isValid: false, error: 'Amount cannot exceed 1,000,000' }
    }

    // Round to 2 decimal places
    if (Math.round(data.amount * 100) / 100 !== data.amount) {
      return { isValid: false, error: 'Amount cannot have more than 2 decimal places' }
    }

    // Currency validation
    const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR', 'CNY']
    if (!supportedCurrencies.includes(data.currency.toUpperCase())) {
      return { isValid: false, error: 'Unsupported currency. Supported: ' + supportedCurrencies.join(', ') }
    }

    // Date validation
    const expenseDate = new Date(data.date)
    if (isNaN(expenseDate.getTime())) {
      return { isValid: false, error: 'Invalid date format. Use YYYY-MM-DD' }
    }

    // Don't allow future dates beyond tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 59, 999)

    if (expenseDate > tomorrow) {
      return { isValid: false, error: 'Expense date cannot be more than 1 day in the future' }
    }

    // Don't allow dates older than 1 year
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    if (expenseDate < oneYearAgo) {
      return { isValid: false, error: 'Expense date cannot be more than 1 year old' }
    }

    // Splits validation
    if (!data.splits || data.splits.length === 0) {
      return { isValid: false, error: 'Expense must have at least one split' }
    }

    if (data.splits.length > 50) {
      return { isValid: false, error: 'Cannot split expense among more than 50 people' }
    }

    // Validate each split
    let totalSplits = 0
    const userIds = new Set<string>()

    for (let i = 0; i < data.splits.length; i++) {
      const split = data.splits[i]
      
      if (!split.userId?.trim()) {
        return { isValid: false, error: `Split ${i + 1}: User ID is required` }
      }

      if (userIds.has(split.userId)) {
        return { isValid: false, error: `Split ${i + 1}: Duplicate user ID (${split.userId})` }
      }
      userIds.add(split.userId)

      if (typeof split.shareAmount !== 'number' || isNaN(split.shareAmount)) {
        return { isValid: false, error: `Split ${i + 1}: Share amount must be a valid number` }
      }

      if (split.shareAmount <= 0) {
        return { isValid: false, error: `Split ${i + 1}: Share amount must be greater than zero` }
      }

      // Round to 2 decimal places
      if (Math.round(split.shareAmount * 100) / 100 !== split.shareAmount) {
        return { isValid: false, error: `Split ${i + 1}: Share amount cannot have more than 2 decimal places` }
      }

      totalSplits += split.shareAmount
    }

    // Validate splits total equals expense amount (with tolerance for rounding)
    const tolerance = 0.01
    if (Math.abs(totalSplits - data.amount) > tolerance) {
      return { 
        isValid: false, 
        error: `Split amounts (${totalSplits.toFixed(2)}) must equal the total expense amount (${data.amount.toFixed(2)})`
      }
    }

    // Validate payer is included in splits
    if (!userIds.has(data.paidBy)) {
      return { isValid: false, error: 'The person who paid must be included in the splits' }
    }

    // Notes validation (optional)
    if (data.notes && data.notes.length > 500) {
      return { isValid: false, error: 'Notes cannot exceed 500 characters' }
    }

    return { isValid: true }
  }
}