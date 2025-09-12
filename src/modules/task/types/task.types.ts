/**
 * Task Module Types
 * 
 * Defines all TypeScript interfaces and types used across the task module.
 * Includes state shapes, API responses, and component props.
 */

import { TaskModel, TaskStatus, TaskPriority } from '../../../core/storage/database/models/collaboration'

// Task State Management Types
export interface TaskState {
  tasks: TaskModel[]
  currentTask: TaskModel | null
  taskCounts: TaskCounts
  loading: boolean
  error: string | null
  updatingStatus: boolean
}

// Task Creation Types
export interface CreateTaskRequest {
  groupId: string
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: string
  assignedTo?: string
}

// Task Update Types
export interface UpdateTaskRequest {
  taskId: string
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  assignedTo?: string
}

// Task Assignment Types
export interface AssignTaskRequest {
  taskId: string
  assigneeId: string
}

// Task Status Update Types
export interface UpdateTaskStatusRequest {
  taskId: string
  status: TaskStatus
}

// Task Counts
export interface TaskCounts {
  todo: number
  inProgress: number
  done: number
  total: number
}

// Task Filters
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

// Component Props Types
export interface TaskCardProps {
  task: TaskModel
  onStatusChange?: (taskId: string, status: TaskStatus) => void
  onAssign?: (taskId: string, assigneeId: string) => void
  onEdit?: (taskId: string) => void
  onDelete?: (taskId: string) => void
  className?: string
}

export interface TaskStatusBadgeProps {
  status: TaskStatus
  className?: string
}

export interface TaskPriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

// Hook Return Types
export interface UseTaskReturn {
  tasks: TaskModel[]
  taskCounts: TaskCounts
  currentTask: TaskModel | null
  loading: boolean
  error: string | null
  updatingStatus: boolean
  createTask: (data: CreateTaskRequest) => Promise<void>
  updateTask: (data: UpdateTaskRequest) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  updateTaskStatus: (data: UpdateTaskStatusRequest) => Promise<void>
  assignTask: (data: AssignTaskRequest) => Promise<void>
  unassignTask: (taskId: string) => Promise<void>
  refreshTasks: () => Promise<void>
  refreshTaskCounts: () => Promise<void>
  bulkUpdateTasks: (data: BulkUpdateRequest) => Promise<void>
  fetchOverdue: () => Promise<TaskModel[]>
  fetchUserTasks: (userId: string, filters?: Omit<TaskFilters, 'assignedTo'>) => Promise<TaskModel[]>
  clearError: () => void
}

// Task Summary Types
export interface TaskSummary {
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  completionRate: number
  tasksByPriority: Record<TaskPriority, number>
  tasksByStatus: Record<TaskStatus, number>
  upcomingDeadlines: TaskModel[]
}

// Bulk Operations
export interface BulkUpdateRequest {
  taskIds: string[]
  updates: {
    status?: TaskStatus
    priority?: TaskPriority
    assignedTo?: string
    dueDate?: string
  }
}

// Task Statistics
export interface TaskStats {
  averageCompletionTime: number // in days
  mostActiveAssignee: string
  criticalTaskCount: number
  overdueTaskCount: number
}

// Re-export core types for convenience
export { TaskStatus, TaskPriority } from '../../../core/storage/database/models/collaboration'