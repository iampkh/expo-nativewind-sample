/**
 * FinanceRecordModel - Expense tracking for finance channels (like Splitwise)
 * 
 * PURPOSE:
 * Tracks shared expenses and who paid for what.
 * Core entity for expense splitting functionality.
 * Supports multiple currencies and detailed expense records.
 * 
 * RELATIONS:
 * - Belongs to Channel (the expense group/workspace)
 * - Belongs to User (expense creator)
 * - Belongs to User (person who paid - payer)
 * - Has many FinanceSplits (individual user shares)
 * 
 * FEATURES:
 * - Multi-currency support
 * - Expense categorization and notes
 * - Settlement tracking
 * - Split calculations
 * - Payment history
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, writer, relation, children } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation, Collection } from '@nozbe/watermelondb'
import UserModel from '../core/UserModel'
import GroupModel from '../core/GroupModel'

export default class FinanceRecordModel extends Model {
  static table = 'finance_records'

  static associations: Associations = {
    groups: { type: 'belongs_to', key: 'group_id' },
    users: { type: 'belongs_to', key: 'created_by' },
    payer: { type: 'belongs_to', key: 'paid_by' },
    finance_splits: { type: 'has_many', foreignKey: 'record_id' },
  }

  @text('group_id') groupId!: string
  @text('created_by') createdBy!: string
  @text('title') title!: string
  @field('amount') amount!: number
  @text('currency') currency!: string
  @text('paid_by') paidBy!: string
  @text('date') date!: string // YYYY-MM-DD format
  @text('notes') notes!: string

  @readonly @date('created_at') createdAt!: Date

  // Relations
  @relation('groups', 'group_id') group!: Relation<GroupModel>
  @relation('users', 'created_by') creator!: Relation<UserModel>
  @relation('users', 'paid_by') payer!: Relation<UserModel>
  @children('finance_splits') splits!: Collection<any>

  @writer async updateRecord(updates: {
    title?: string
    amount?: number
    currency?: string
    date?: string
    notes?: string
  }) {
    return await this.update(record => {
      if (updates.title !== undefined) record.title = updates.title
      if (updates.amount !== undefined) record.amount = updates.amount
      if (updates.currency !== undefined) record.currency = updates.currency
      if (updates.date !== undefined) record.date = updates.date
      if (updates.notes !== undefined) record.notes = updates.notes
    })
  }

  @writer async updateAmount(newAmount: number) {
    return await this.update(record => {
      record.amount = newAmount
    })
  }

  @writer async updatePayer(newPayerId: string) {
    return await this.update(record => {
      record.paidBy = newPayerId
    })
  }

  @writer async addNotes(notes: string) {
    return await this.update(record => {
      record.notes = notes
    })
  }

  // Helper methods
  get formattedAmount() {
    return `${this.currency} ${this.amount.toFixed(2)}`
  }

  get parsedDate() {
    return new Date(this.date)
  }

  get isToday() {
    const today = new Date().toISOString().split('T')[0]
    return this.date === today
  }

  get hasNotes() {
    return !!this.notes && this.notes.trim().length > 0
  }

  async getTotalSplitAmount() {
    const splits = await this.splits.query().fetch()
    return splits.reduce((total: number, split: any) => total + split.shareAmount, 0)
  }

  async getUnsettledAmount() {
    const splits = await this.splits.query().fetch()
    const unsettledSplits = splits.filter((split: any) => !split.isSettled)
    return unsettledSplits.reduce((total: number, split: any) => total + split.shareAmount, 0)
  }

  async isFullySettled() {
    const splits = await this.splits.query().fetch()
    return splits.every((split: any) => split.isSettled)
  }

  async getSplitForUser(userId: string) {
    const splits = await this.splits.query().fetch()
    return splits.find((split: any) => split.userId === userId)
  }

  async getSettlementStatus() {
    const splits = await this.splits.query().fetch()
    const settledCount = splits.filter((split: any) => split.isSettled).length
    const totalCount = splits.length
    
    return {
      settled: settledCount,
      total: totalCount,
      percentage: totalCount > 0 ? (settledCount / totalCount) * 100 : 0,
      isComplete: settledCount === totalCount
    }
  }
}