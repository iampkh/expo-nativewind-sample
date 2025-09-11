/**
 * Create Task Use Case
 * 
 * Business logic for creating new tasks with validation and error handling.
 */

import { BaseUseCase } from '../../../core/useCases/BaseUseCase'
import { TaskModuleRepository } from '../repositories/TaskModuleRepository'
import { DatabaseResult } from '../../../shared/types/database.types'
import { TaskModel, TaskPriority } from '../../../core/storage/database/models/collaboration'
import { CreateTaskRequest } from '../types/task.types'

export interface CreateTaskData extends CreateTaskRequest {
  createdBy: string
}

export class CreateTaskUseCase extends BaseUseCase<CreateTaskData, DatabaseResult<TaskModel>> {
  private taskRepository: TaskModuleRepository

  constructor() {
    super()
    this.taskRepository = new TaskModuleRepository()
  }

  async execute(data: CreateTaskData): Promise<DatabaseResult<TaskModel>> {
    try {
      // Validate input
      const validationResult = this.validateInput(data)
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error
        }
      }

      // Create task
      const result = await this.taskRepository.createTask({
        groupId: data.groupId,
        createdBy: data.createdBy,
        title: data.title.trim(),
        description: data.description?.trim() || '',
        priority: data.priority || TaskPriority.MEDIUM,
        dueDate: data.dueDate || '',
        assignedTo: data.assignedTo || ''
      })

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create task'
      }
    }
  }

  private validateInput(data: CreateTaskData): { isValid: boolean; error?: string } {
    // Required fields
    if (!data.groupId?.trim()) {
      return { isValid: false, error: 'Group ID is required' }
    }

    if (!data.createdBy?.trim()) {
      return { isValid: false, error: 'Creator ID is required' }
    }

    if (!data.title?.trim()) {
      return { isValid: false, error: 'Task title is required' }
    }

    // Title validation
    if (data.title.trim().length < 3) {
      return { isValid: false, error: 'Task title must be at least 3 characters long' }
    }

    if (data.title.trim().length > 200) {
      return { isValid: false, error: 'Task title cannot exceed 200 characters' }
    }

    // Description validation (optional)
    if (data.description && data.description.length > 1000) {
      return { isValid: false, error: 'Task description cannot exceed 1000 characters' }
    }

    // Priority validation
    if (data.priority && !Object.values(TaskPriority).includes(data.priority)) {
      return { isValid: false, error: 'Invalid task priority' }
    }

    // Due date validation (optional)
    if (data.dueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(data.dueDate)) {
        return { isValid: false, error: 'Invalid due date format. Use YYYY-MM-DD' }
      }

      const dueDate = new Date(data.dueDate)
      if (isNaN(dueDate.getTime())) {
        return { isValid: false, error: 'Invalid due date' }
      }

      // Don't allow dates in the past (except today)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dueDateOnly = new Date(dueDate)
      dueDateOnly.setHours(0, 0, 0, 0)

      if (dueDateOnly < today) {
        return { isValid: false, error: 'Due date cannot be in the past' }
      }

      // Don't allow dates more than 2 years in the future
      const maxDate = new Date()
      maxDate.setFullYear(maxDate.getFullYear() + 2)

      if (dueDate > maxDate) {
        return { isValid: false, error: 'Due date cannot be more than 2 years in the future' }
      }
    }

    // Assignee validation (optional)
    if (data.assignedTo && !data.assignedTo.trim()) {
      return { isValid: false, error: 'Assigned user ID cannot be empty' }
    }

    return { isValid: true }
  }
}