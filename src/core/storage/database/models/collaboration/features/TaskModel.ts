/**
 * TaskModel - Task/Todo management for productivity channels
 * 
 * PURPOSE:
 * Handles task management and delegation within todo-type channels.
 * Supports assignment, priority levels, due dates, and status tracking.
 * Used for project management, team coordination, and personal productivity.
 * 
 * RELATIONS:
 * - Belongs to Channel (the task board/workspace)
 * - Belongs to User (task creator)
 * - Optionally assigned to User (task assignee)
 * 
 * WORKFLOW:
 * TODO -> IN_PROGRESS -> DONE
 * 
 * PRIORITY LEVELS:
 * LOW (green) -> MEDIUM (yellow) -> HIGH (orange) -> URGENT (red)
 * 
 * FEATURES:
 * - Task assignment and delegation
 * - Due date tracking with overdue detection
 * - Priority-based sorting and filtering
 * - Status workflow management
 * - Visual indicators for urgency
 */

import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, writer, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation } from '@nozbe/watermelondb'
import { TaskStatus, TaskPriority } from '../types'
import UserModel from '../core/UserModel'
import GroupModel from '../core/GroupModel'

export default class TaskModel extends Model {
  static table = 'tasks'

  static associations: Associations = {
    groups: { type: 'belongs_to', key: 'group_id' },
    users: { type: 'belongs_to', key: 'created_by' },
    assignee: { type: 'belongs_to', key: 'assigned_to' },
  }

  @text('group_id') groupId!: string
  @text('created_by') createdBy!: string
  @text('title') title!: string
  @text('description') description!: string
  @text('status') status!: TaskStatus
  @text('priority') priority!: TaskPriority
  @text('due_date') dueDate!: string // YYYY-MM-DD format
  @text('assigned_to') assignedTo!: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Relations
  @relation('groups', 'group_id') group!: Relation<GroupModel>
  @relation('users', 'created_by') creator!: Relation<UserModel>
  @relation('users', 'assigned_to') assignee!: Relation<UserModel>

  @writer async updateTask(updates: {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    dueDate?: string
    assignedTo?: string
  }) {
    return await this.update(task => {
      if (updates.title !== undefined) task.title = updates.title
      if (updates.description !== undefined) task.description = updates.description
      if (updates.status !== undefined) task.status = updates.status
      if (updates.priority !== undefined) task.priority = updates.priority
      if (updates.dueDate !== undefined) task.dueDate = updates.dueDate
      if (updates.assignedTo !== undefined) task.assignedTo = updates.assignedTo
    })
  }

  @writer async updateStatus(newStatus: TaskStatus) {
    return await this.update(task => {
      task.status = newStatus
    })
  }

  @writer async updatePriority(newPriority: TaskPriority) {
    return await this.update(task => {
      task.priority = newPriority
    })
  }

  @writer async assignTo(userId: string) {
    return await this.update(task => {
      task.assignedTo = userId
    })
  }

  @writer async unassign() {
    return await this.update(task => {
      task.assignedTo = ''
    })
  }

  @writer async markAsTodo() {
    return await this.updateStatus(TaskStatus.TODO)
  }

  @writer async markAsInProgress() {
    return await this.updateStatus(TaskStatus.IN_PROGRESS)
  }

  @writer async markAsDone() {
    return await this.updateStatus(TaskStatus.DONE)
  }

  // Helper methods
  get isTodo() {
    return this.status === TaskStatus.TODO
  }

  get isInProgress() {
    return this.status === TaskStatus.IN_PROGRESS
  }

  get isDone() {
    return this.status === TaskStatus.DONE
  }

  get isHighPriority() {
    return this.priority === TaskPriority.HIGH || this.priority === TaskPriority.URGENT
  }

  get isUrgent() {
    return this.priority === TaskPriority.URGENT
  }

  get isAssigned() {
    return !!this.assignedTo && this.assignedTo.trim().length > 0
  }

  get hasDueDate() {
    return !!this.dueDate && this.dueDate.trim().length > 0
  }

  get parsedDueDate() {
    if (!this.hasDueDate) return null
    return new Date(this.dueDate)
  }

  get isOverdue() {
    if (!this.hasDueDate || this.isDone) return false
    const today = new Date()
    const due = this.parsedDueDate!
    return due < today
  }

  get isDueToday() {
    if (!this.hasDueDate) return false
    const today = new Date().toISOString().split('T')[0]
    return this.dueDate === today
  }

  get isDueSoon() {
    if (!this.hasDueDate || this.isDone) return false
    const today = new Date()
    const due = this.parsedDueDate!
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000))
    return due <= threeDaysFromNow && due >= today
  }

  get statusLabel() {
    switch (this.status) {
      case TaskStatus.TODO: return 'To Do'
      case TaskStatus.IN_PROGRESS: return 'In Progress'
      case TaskStatus.DONE: return 'Done'
      default: return 'Unknown'
    }
  }

  get priorityLabel() {
    switch (this.priority) {
      case TaskPriority.LOW: return 'Low'
      case TaskPriority.MEDIUM: return 'Medium'
      case TaskPriority.HIGH: return 'High'
      case TaskPriority.URGENT: return 'Urgent'
      default: return 'Medium'
    }
  }

  get priorityColor() {
    switch (this.priority) {
      case TaskPriority.LOW: return '#10b981' // green
      case TaskPriority.MEDIUM: return '#f59e0b' // yellow
      case TaskPriority.HIGH: return '#f97316' // orange
      case TaskPriority.URGENT: return '#ef4444' // red
      default: return '#f59e0b'
    }
  }

  get statusColor() {
    switch (this.status) {
      case TaskStatus.TODO: return '#6b7280' // gray
      case TaskStatus.IN_PROGRESS: return '#3b82f6' // blue
      case TaskStatus.DONE: return '#10b981' // green
      default: return '#6b7280'
    }
  }
}