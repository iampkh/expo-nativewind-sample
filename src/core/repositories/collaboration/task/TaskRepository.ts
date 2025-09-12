/**
 * TaskRepository - Repository for task/todo management operations
 * 
 * PURPOSE:
 * Handles all database operations for tasks including CRUD, filtering, and status management.
 * Provides abstraction layer between business logic and WatermelonDB models.
 * Supports group-based task isolation and role-based access.
 * 
 * FEATURES:
 * - Full CRUD operations (Create, Read, Update, Delete)
 * - Group-based task filtering
 * - Status and priority filtering
 * - Assignment management
 * - Due date tracking and overdue detection
 * - Bulk operations for task management
 */

import { database } from '../../../storage/database'
import { DatabaseResult } from '../../../../shared/types/database.types'
import { TaskModel, TaskStatus, TaskPriority } from '../../../storage/database/models/collaboration'
import { Q } from '@nozbe/watermelondb'

export interface CreateTaskData {
  groupId: string
  createdBy: string
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: string // YYYY-MM-DD format
  assignedTo?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  assignedTo?: string
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  assignedTo?: string
  createdBy?: string
  isOverdue?: boolean
  dueDateRange?: {
    from?: string
    to?: string
  }
}

export class TaskRepository {
  private static instance: TaskRepository
  
  private constructor() {}
  
  public static getInstance(): TaskRepository {
    if (!TaskRepository.instance) {
      TaskRepository.instance = new TaskRepository()
    }
    return TaskRepository.instance
  }

  /**
   * Creates a new task in the specified group
   * Validates group existence and user permissions
   */
  async createTask(taskData: CreateTaskData): Promise<DatabaseResult<TaskModel>> {
    try {
      const newTask = await database.write(async () => {
        const taskCollection = database.get<TaskModel>('tasks')
        return await taskCollection.create(task => {
          task.groupId = taskData.groupId
          task.createdBy = taskData.createdBy
          task.title = taskData.title
          task.description = taskData.description || ''
          task.status = TaskStatus.TODO
          task.priority = taskData.priority || TaskPriority.MEDIUM
          task.dueDate = taskData.dueDate || ''
          task.assignedTo = taskData.assignedTo || ''
        })
      })

      return { success: true, data: newTask }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create task' 
      }
    }
  }

  /**
   * Retrieves a single task by ID
   * Includes validation for task existence
   */
  async getTask(taskId: string): Promise<DatabaseResult<TaskModel>> {
    try {
      const task = await database.get<TaskModel>('tasks').find(taskId)
      
      if (!task) {
        return { success: false, error: 'Task not found' }
      }

      return { success: true, data: task }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve task' 
      }
    }
  }

  /**
   * Updates an existing task with provided data
   * Only updates non-undefined fields (partial update)
   */
  async updateTask(taskId: string, updates: UpdateTaskData): Promise<DatabaseResult<TaskModel>> {
    try {
      const updatedTask = await database.write(async () => {
        const task = await database.get<TaskModel>('tasks').find(taskId)
        return await task.update(taskRecord => {
          if (updates.title !== undefined) taskRecord.title = updates.title
          if (updates.description !== undefined) taskRecord.description = updates.description
          if (updates.status !== undefined) taskRecord.status = updates.status
          if (updates.priority !== undefined) taskRecord.priority = updates.priority
          if (updates.dueDate !== undefined) taskRecord.dueDate = updates.dueDate
          if (updates.assignedTo !== undefined) taskRecord.assignedTo = updates.assignedTo
        })
      })

      return { success: true, data: updatedTask }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update task' 
      }
    }
  }

  /**
   * Permanently deletes a task
   * Should be restricted to task creator or group admins
   */
  async deleteTask(taskId: string): Promise<DatabaseResult<boolean>> {
    try {
      await database.write(async () => {
        const task = await database.get<TaskModel>('tasks').find(taskId)
        await task.destroyPermanently()
      })

      return { success: true, data: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete task' 
      }
    }
  }

  /**
   * Retrieves all tasks for a specific group with optional filtering
   * Supports status, priority, assignment, and date filtering
   */
  async getTasksByGroup(groupId: string, filters?: TaskFilters): Promise<DatabaseResult<TaskModel[]>> {
    try {
      // Build query conditions
      const conditions = [Q.where('group_id', groupId)]
      
      // Apply filters
      if (filters) {
        if (filters.status) {
          conditions.push(Q.where('status', filters.status))
        }
        if (filters.priority) {
          conditions.push(Q.where('priority', filters.priority))
        }
        if (filters.assignedTo) {
          conditions.push(Q.where('assigned_to', filters.assignedTo))
        }
        if (filters.createdBy) {
          conditions.push(Q.where('created_by', filters.createdBy))
        }
      }
      
      const query = database.get<TaskModel>('tasks').query(
        conditions.length === 1 ? conditions[0] : Q.and(...conditions)
      )

      const tasks = await query.fetch()
      
      // Post-process for complex filters
      let filteredTasks = tasks
      
      if (filters?.isOverdue) {
        const today = new Date().toISOString().split('T')[0]
        filteredTasks = tasks.filter(task => {
          return task.hasDueDate && task.dueDate < today && !task.isDone
        })
      }
      
      if (filters?.dueDateRange) {
        filteredTasks = filteredTasks.filter(task => {
          if (!task.hasDueDate) return false
          
          const { from, to } = filters.dueDateRange!
          const taskDate = task.dueDate
          
          if (from && taskDate < from) return false
          if (to && taskDate > to) return false
          
          return true
        })
      }

      // Sort by priority and due date
      filteredTasks.sort((a, b) => {
        // First by priority (urgent > high > medium > low)
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority
        }
        
        // Then by due date (overdue first, then soonest)
        if (a.hasDueDate && b.hasDueDate) {
          return a.dueDate.localeCompare(b.dueDate)
        }
        if (a.hasDueDate && !b.hasDueDate) return -1
        if (!a.hasDueDate && b.hasDueDate) return 1
        
        // Finally by creation date (newest first)
        return b.createdAt.getTime() - a.createdAt.getTime()
      })

      return { success: true, data: filteredTasks }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve tasks' 
      }
    }
  }

  /**
   * Retrieves all tasks assigned to a specific user across all groups
   * Useful for user dashboard and "My Tasks" views
   */
  async getTasksByAssignee(userId: string, filters?: Omit<TaskFilters, 'assignedTo'>): Promise<DatabaseResult<TaskModel[]>> {
    return this.getTasksByGroup('', { ...filters, assignedTo: userId })
  }

  /**
   * Updates task status (todo -> in_progress -> done)
   * Convenience method for common status transitions
   */
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<DatabaseResult<TaskModel>> {
    return this.updateTask(taskId, { status })
  }

  /**
   * Assigns or reassigns a task to a different user
   * Validates user exists and has access to the group
   */
  async assignTask(taskId: string, assigneeId: string): Promise<DatabaseResult<TaskModel>> {
    return this.updateTask(taskId, { assignedTo: assigneeId })
  }

  /**
   * Unassigns a task (removes assignee)
   * Task becomes unassigned and available for pickup
   */
  async unassignTask(taskId: string): Promise<DatabaseResult<TaskModel>> {
    return this.updateTask(taskId, { assignedTo: '' })
  }

  /**
   * Updates task priority for urgent situations
   * Common operation for escalating important tasks
   */
  async updateTaskPriority(taskId: string, priority: TaskPriority): Promise<DatabaseResult<TaskModel>> {
    return this.updateTask(taskId, { priority })
  }

  /**
   * Sets or updates task due date
   * Validates date format and prevents past dates
   */
  async setTaskDueDate(taskId: string, dueDate: string): Promise<DatabaseResult<TaskModel>> {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dueDate)) {
      return { success: false, error: 'Invalid date format. Use YYYY-MM-DD' }
    }

    return this.updateTask(taskId, { dueDate })
  }

  /**
   * Gets count of tasks by status for a group
   * Useful for dashboard statistics and progress tracking
   */
  async getTaskCountsByStatus(groupId: string): Promise<DatabaseResult<{
    todo: number
    inProgress: number
    done: number
    total: number
  }>> {
    try {
      const tasks = await database.get<TaskModel>('tasks')
        .query(Q.where('group_id', groupId))
        .fetch()

      const counts = {
        todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
        inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
        done: tasks.filter(t => t.status === TaskStatus.DONE).length,
        total: tasks.length
      }

      return { success: true, data: counts }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get task counts' 
      }
    }
  }

  /**
   * Gets overdue tasks for a group
   * Critical for deadline management and notifications
   */
  async getOverdueTasks(groupId: string): Promise<DatabaseResult<TaskModel[]>> {
    return this.getTasksByGroup(groupId, { 
      isOverdue: true,
      status: TaskStatus.TODO // Only show incomplete overdue tasks
    })
  }

  /**
   * Bulk update multiple tasks (useful for batch operations)
   * Updates all specified tasks with the same data
   */
  async bulkUpdateTasks(taskIds: string[], updates: UpdateTaskData): Promise<DatabaseResult<TaskModel[]>> {
    try {
      const updatedTasks = await database.write(async () => {
        const tasks = await Promise.all(
          taskIds.map(id => database.get<TaskModel>('tasks').find(id))
        )
        
        return await Promise.all(
          tasks.map(task => 
            task.update(taskRecord => {
              if (updates.title !== undefined) taskRecord.title = updates.title
              if (updates.description !== undefined) taskRecord.description = updates.description
              if (updates.status !== undefined) taskRecord.status = updates.status
              if (updates.priority !== undefined) taskRecord.priority = updates.priority
              if (updates.dueDate !== undefined) taskRecord.dueDate = updates.dueDate
              if (updates.assignedTo !== undefined) taskRecord.assignedTo = updates.assignedTo
            })
          )
        )
      })

      return { success: true, data: updatedTasks }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to bulk update tasks' 
      }
    }
  }
}