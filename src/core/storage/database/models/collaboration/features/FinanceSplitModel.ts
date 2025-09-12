/**
 * FinanceSplitModel - Individual user shares of expenses
 * 
 * PURPOSE:
 * Tracks each user's portion of a shared expense.
 * Manages who owes what and settlement status.
 * Core component of expense splitting functionality.
 * 
 * RELATIONS:
 * - Belongs to FinanceRecord (the expense being split)
 * - Belongs to User (person responsible for this share)
 * 
 * FEATURES:
 * - Individual share amount tracking
 * - Settlement status (paid/unpaid)
 * - Debt calculation (owed vs owing)
 * - Payment history
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, writer, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation } from '@nozbe/watermelondb'
import FinanceRecordModel from './FinanceRecordModel'
import UserModel from '../core/UserModel'

export default class FinanceSplitModel extends Model {
  static table = 'finance_splits'

  static associations: Associations = {
    finance_records: { type: 'belongs_to', key: 'record_id' },
    users: { type: 'belongs_to', key: 'user_id' },
  }

  @text('record_id') recordId!: string
  @text('user_id') userId!: string
  @field('share_amount') shareAmount!: number
  @field('is_settled') isSettled!: boolean

  // Relations
  @relation('finance_records', 'record_id') financeRecord!: Relation<FinanceRecordModel>
  @relation('users', 'user_id') user!: Relation<UserModel>

  @writer async updateShareAmount(newAmount: number) {
    return await this.update(split => {
      split.shareAmount = newAmount
    })
  }

  @writer async markAsSettled() {
    return await this.update(split => {
      split.isSettled = true
    })
  }

  @writer async markAsUnsettled() {
    return await this.update(split => {
      split.isSettled = false
    })
  }

  @writer async toggleSettlement() {
    return await this.update(split => {
      split.isSettled = !split.isSettled
    })
  }

  // Helper methods
  get isPending() {
    return !this.isSettled
  }

  get status() {
    return this.isSettled ? 'Settled' : 'Pending'
  }

  async getFormattedAmount() {
    const record = await this.financeRecord.fetch()
    return `${record.currency} ${this.shareAmount.toFixed(2)}`
  }

  async getCurrency() {
    const record = await this.financeRecord.fetch()
    return record.currency
  }

  async getRecordTitle() {
    const record = await this.financeRecord.fetch()
    return record.title
  }

  async getUserDisplayName() {
    const user = await this.user.fetch()
    return user.displayName
  }

  async isUserThePayer() {
    const record = await this.financeRecord.fetch()
    return record.paidBy === this.userId
  }

  async getPayerInfo() {
    const record = await this.financeRecord.fetch()
    const payer = await record.payer.fetch()
    return {
      id: payer.id,
      name: payer.displayName,
      isCurrentUser: payer.id === this.userId
    }
  }

  get formattedShare() {
    return this.shareAmount.toFixed(2)
  }

  async getOwedAmount() {
    // If user is the payer, they are owed money; otherwise they owe money
    const isPayer = await this.isUserThePayer()
    return isPayer ? this.shareAmount : -this.shareAmount
  }
}