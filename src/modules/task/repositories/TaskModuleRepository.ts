/**
 * Task Module Repository
 * 
 * Module-specific repository that extends core TaskRepository
 * with additional functionality specific to the task module.
 */

import { TaskRepository } from '../../../core/repositories/collaboration/task/TaskRepository'
import { DatabaseResult } from '../../../shared/types/database.types'
import { TaskModel, TaskStatus, TaskPriority } from '../../../core/storage/database/models/collaboration'
import { TaskSummary, TaskStats } from '../types/task.types'

export class TaskModuleRepository {
  private taskRepository: TaskRepository
  
  constructor() {
    this.taskRepository = TaskRepository.getInstance()
  }

  /**
   * Get tasks with enhanced UI formatting and user status
   */
  async getTasksForUI(groupId: string, userId: string): Promise<DatabaseResult<Array<{
    task: TaskModel
    isUserAssigned: boolean
    isUserCreator: boolean
    daysSinceCreated: number
    daysUntilDue: number | null
    isOverdueByDays: number | null
  }>>> {
    try {
      const tasksResult = await this.taskRepository.getTasksByGroup(groupId)
      
      if (!tasksResult.success || !tasksResult.data) {
        return tasksResult as any
      }

      const enhancedTasks = tasksResult.data.map(task => {
        const now = new Date()
        const createdDate = new Date(task.createdAt)
        const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
        
        let daysUntilDue: number | null = null
        let isOverdueByDays: number | null = null
        
        if (task.hasDueDate) {
          const dueDate = new Date(task.dueDate)
          const diffTime = dueDate.getTime() - now.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays >= 0) {
            daysUntilDue = diffDays
          } else {
            isOverdueByDays = Math.abs(diffDays)
          }
        }

        return {
          task,
          isUserAssigned: task.assignedTo === userId,
          isUserCreator: task.createdBy === userId,
          daysSinceCreated,
          daysUntilDue,
          isOverdueByDays
        }
      })

      return {
        success: true,
        data: enhancedTasks
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get tasks for UI'
      }
    }
  }

  /**
   * Get comprehensive task summary for dashboard
   */
  async getTaskSummary(groupId: string): Promise<DatabaseResult<TaskSummary>> {
    try {
      const [tasksResult, countsResult] = await Promise.all([
        this.taskRepository.getTasksByGroup(groupId),
        this.taskRepository.getTaskCountsByStatus(groupId)
      ])
      
      if (!tasksResult.success || !countsResult.success) {
        return {
          success: false,
          error: 'Failed to fetch task data for summary'
        }
      }

      const tasks = tasksResult.data || []
      const counts = countsResult.data!
      
      // Calculate overdue tasks
      const today = new Date().toISOString().split('T')[0]
      const overdueTasks = tasks.filter(task => 
        task.hasDueDate && task.dueDate < today && !task.isDone
      ).length
      
      // Tasks by priority
      const tasksByPriority = {
        [TaskPriority.LOW]: tasks.filter(t => t.priority === TaskPriority.LOW).length,
        [TaskPriority.MEDIUM]: tasks.filter(t => t.priority === TaskPriority.MEDIUM).length,
        [TaskPriority.HIGH]: tasks.filter(t => t.priority === TaskPriority.HIGH).length,
        [TaskPriority.URGENT]: tasks.filter(t => t.priority === TaskPriority.URGENT).length,
      }
      
      // Tasks by status
      const tasksByStatus = {
        [TaskStatus.TODO]: counts.todo,
        [TaskStatus.IN_PROGRESS]: counts.inProgress,
        [TaskStatus.DONE]: counts.done,
      }
      
      // Upcoming deadlines (next 7 days)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      const upcomingDeadlines = tasks.filter(task => {
        if (!task.hasDueDate || task.isDone) return false
        const dueDate = new Date(task.dueDate)
        return dueDate >= new Date() && dueDate <= nextWeek
      }).slice(0, 5) // Limit to 5 most urgent
      
      const summary: TaskSummary = {
        totalTasks: counts.total,
        completedTasks: counts.done,
        overdueTasks,
        completionRate: counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0,
        tasksByPriority,
        tasksByStatus,
        upcomingDeadlines
      }

      return {
        success: true,
        data: summary
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get task summary'
      }
    }
  }

  /**
   * Get task statistics for analytics
   */
  async getTaskStats(groupId: string): Promise<DatabaseResult<TaskStats>> {
    try {
      const tasksResult = await this.taskRepository.getTasksByGroup(groupId)
      
      if (!tasksResult.success || !tasksResult.data) {
        return tasksResult as any
      }

      const tasks = tasksResult.data
      const completedTasks = tasks.filter(task => task.isDone)
      
      // Calculate average completion time
      let totalCompletionDays = 0
      let completedWithDates = 0
      
      completedTasks.forEach(task => {
        if (task.updatedAt) {
          const createdDate = new Date(task.createdAt)
          const completedDate = new Date(task.updatedAt)
          const diffDays = Math.floor((completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
          totalCompletionDays += diffDays
          completedWithDates++
        }
      })
      
      const averageCompletionTime = completedWithDates > 0 ? totalCompletionDays / completedWithDates : 0
      
      // Find most active assignee
      const assigneeCounts: Record<string, number> = {}
      tasks.forEach(task => {
        if (task.isAssigned) {
          assigneeCounts[task.assignedTo] = (assigneeCounts[task.assignedTo] || 0) + 1
        }
      })
      
      const mostActiveAssignee = Object.entries(assigneeCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
      
      // Count critical tasks (urgent + overdue)
      const today = new Date().toISOString().split('T')[0]
      const criticalTaskCount = tasks.filter(task => 
        task.priority === TaskPriority.URGENT || 
        (task.hasDueDate && task.dueDate < today && !task.isDone)
      ).length
      
      const overdueTaskCount = tasks.filter(task => 
        task.hasDueDate && task.dueDate < today && !task.isDone
      ).length

      const stats: TaskStats = {
        averageCompletionTime,
        mostActiveAssignee,
        criticalTaskCount,
        overdueTaskCount
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get task stats'
      }
    }
  }

  /**
   * Delegate to core repository methods
   */
  async createTask(taskData: any) {
    return this.taskRepository.createTask(taskData)
  }

  async getTask(taskId: string) {
    return this.taskRepository.getTask(taskId)
  }

  async updateTask(taskId: string, updates: any) {
    return this.taskRepository.updateTask(taskId, updates)
  }

  async deleteTask(taskId: string) {
    return this.taskRepository.deleteTask(taskId)
  }

  async getTasksByGroup(groupId: string, filters?: any) {
    return this.taskRepository.getTasksByGroup(groupId, filters)
  }

  async getTasksByAssignee(userId: string, filters?: any) {
    return this.taskRepository.getTasksByAssignee(userId, filters)
  }

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    return this.taskRepository.updateTaskStatus(taskId, status)
  }

  async assignTask(taskId: string, assigneeId: string) {
    return this.taskRepository.assignTask(taskId, assigneeId)
  }

  async unassignTask(taskId: string) {
    return this.taskRepository.unassignTask(taskId)
  }

  async updateTaskPriority(taskId: string, priority: TaskPriority) {
    return this.taskRepository.updateTaskPriority(taskId, priority)
  }

  async setTaskDueDate(taskId: string, dueDate: string) {
    return this.taskRepository.setTaskDueDate(taskId, dueDate)
  }

  async getTaskCountsByStatus(groupId: string) {
    return this.taskRepository.getTaskCountsByStatus(groupId)
  }

  async getOverdueTasks(groupId: string) {
    return this.taskRepository.getOverdueTasks(groupId)
  }

  async bulkUpdateTasks(taskIds: string[], updates: any) {
    return this.taskRepository.bulkUpdateTasks(taskIds, updates)
  }
}