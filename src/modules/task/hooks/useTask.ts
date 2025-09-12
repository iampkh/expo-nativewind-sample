/**
 * useTask Hook
 * 
 * React hook for managing task state and operations.
 * Provides a clean interface for components to interact with tasks.
 */

import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { 
  fetchTasksByGroup, 
  createTask as createTaskThunk, 
  updateTaskThunk,
  deleteTask as deleteTaskThunk,
  updateTaskStatus as updateTaskStatusThunk,
  assignTask as assignTaskThunk,
  unassignTask as unassignTaskThunk,
  fetchTaskCounts,
  fetchOverdueTasks,
  bulkUpdateTasksThunk,
  fetchTasksByAssignee
} from '../store/taskThunks'
import { clearError } from '../store/taskSlice'
import { CreateTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest, AssignTaskRequest, TaskFilters, BulkUpdateRequest, UseTaskReturn } from '../types/task.types'

export const useTask = (groupId: string): UseTaskReturn => {
  const dispatch = useDispatch<AppDispatch>()
  
  const { 
    tasks, 
    taskCounts,
    currentTask,
    loading, 
    error, 
    updatingStatus 
  } = useSelector((state: RootState) => state.task)

  // Fetch tasks for group
  const refreshTasks = useCallback(async (filters?: TaskFilters) => {
    if (!groupId) return
    
    try {
      await dispatch(fetchTasksByGroup({ groupId, filters })).unwrap()
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }, [dispatch, groupId])

  // Fetch task counts
  const refreshTaskCounts = useCallback(async () => {
    if (!groupId) return
    
    try {
      await dispatch(fetchTaskCounts(groupId)).unwrap()
    } catch (error) {
      console.error('Failed to fetch task counts:', error)
    }
  }, [dispatch, groupId])

  // Create new task
  const createTask = useCallback(async (data: CreateTaskRequest) => {
    try {
      await dispatch(createTaskThunk(data)).unwrap()
      // Tasks are automatically added to state by the thunk
      await refreshTaskCounts()
    } catch (error) {
      console.error('Failed to create task:', error)
      throw error
    }
  }, [dispatch, refreshTaskCounts])

  // Update task
  const updateTask = useCallback(async (data: UpdateTaskRequest) => {
    try {
      await dispatch(updateTaskThunk(data)).unwrap()
    } catch (error) {
      console.error('Failed to update task:', error)
      throw error
    }
  }, [dispatch])

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await dispatch(deleteTaskThunk(taskId)).unwrap()
      await refreshTaskCounts()
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw error
    }
  }, [dispatch, refreshTaskCounts])

  // Update task status
  const updateTaskStatus = useCallback(async (data: UpdateTaskStatusRequest) => {
    try {
      await dispatch(updateTaskStatusThunk(data)).unwrap()
      await refreshTaskCounts()
    } catch (error) {
      console.error('Failed to update task status:', error)
      throw error
    }
  }, [dispatch, refreshTaskCounts])

  // Assign task
  const assignTask = useCallback(async (data: AssignTaskRequest) => {
    try {
      await dispatch(assignTaskThunk(data)).unwrap()
    } catch (error) {
      console.error('Failed to assign task:', error)
      throw error
    }
  }, [dispatch])

  // Unassign task
  const unassignTask = useCallback(async (taskId: string) => {
    try {
      await dispatch(unassignTaskThunk(taskId)).unwrap()
    } catch (error) {
      console.error('Failed to unassign task:', error)
      throw error
    }
  }, [dispatch])

  // Bulk update tasks
  const bulkUpdateTasks = useCallback(async (data: BulkUpdateRequest) => {
    try {
      await dispatch(bulkUpdateTasksThunk(data)).unwrap()
      await refreshTaskCounts()
    } catch (error) {
      console.error('Failed to bulk update tasks:', error)
      throw error
    }
  }, [dispatch, refreshTaskCounts])

  // Fetch overdue tasks
  const fetchOverdue = useCallback(async () => {
    if (!groupId) return []
    
    try {
      const overdueTasks = await dispatch(fetchOverdueTasks(groupId)).unwrap()
      return overdueTasks
    } catch (error) {
      console.error('Failed to fetch overdue tasks:', error)
      return []
    }
  }, [dispatch, groupId])

  // Fetch tasks by assignee
  const fetchUserTasks = useCallback(async (userId: string, filters?: Omit<TaskFilters, 'assignedTo'>) => {
    try {
      const userTasks = await dispatch(fetchTasksByAssignee({ userId, filters })).unwrap()
      return userTasks
    } catch (error) {
      console.error('Failed to fetch user tasks:', error)
      return []
    }
  }, [dispatch])

  // Clear error
  const clearTaskError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Load tasks and counts on mount and when groupId changes
  useEffect(() => {
    if (groupId) {
      refreshTasks()
      refreshTaskCounts()
    }
  }, [refreshTasks, refreshTaskCounts, groupId])

  return {
    tasks,
    taskCounts,
    currentTask,
    loading,
    error,
    updatingStatus,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    assignTask,
    unassignTask,
    bulkUpdateTasks,
    refreshTasks,
    refreshTaskCounts,
    fetchOverdue,
    fetchUserTasks,
    clearError: clearTaskError,
  }
}