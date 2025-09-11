/**
 * Task Redux Thunks
 * 
 * Async actions for task operations using Redux Toolkit.
 * Coordinates between repositories and state management.
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import { TaskRepository } from '../../../core/repositories/collaboration/task/TaskRepository'
import { CreateTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest, AssignTaskRequest, TaskFilters, BulkUpdateRequest } from '../types/task.types'
import { 
  setLoading, 
  setUpdatingStatus, 
  setError, 
  setTasks, 
  addTask, 
  updateTask, 
  removeTask,
  setCurrentTask,
  setTaskCounts,
  bulkUpdateTasks
} from './taskSlice'

const taskRepository = TaskRepository.getInstance()

// Fetch Tasks for Group
export const fetchTasksByGroup = createAsyncThunk(
  'task/fetchTasksByGroup',
  async ({ groupId, filters }: { groupId: string; filters?: TaskFilters }, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.getTasksByGroup(groupId, filters)
      
      if (result.success && result.data) {
        dispatch(setTasks(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch tasks'))
        throw new Error(result.error || 'Failed to fetch tasks')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Create New Task
export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData: CreateTaskRequest, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const createData = {
        groupId: taskData.groupId,
        createdBy: 'current-user-id', // TODO: Get from auth state
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        assignedTo: taskData.assignedTo
      }
      
      const result = await taskRepository.createTask(createData)
      
      if (result.success && result.data) {
        dispatch(addTask(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to create task'))
        throw new Error(result.error || 'Failed to create task')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Update Task
export const updateTaskThunk = createAsyncThunk(
  'task/updateTask',
  async ({ taskId, ...updates }: UpdateTaskRequest, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.updateTask(taskId, updates)
      
      if (result.success && result.data) {
        dispatch(updateTask(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to update task'))
        throw new Error(result.error || 'Failed to update task')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Update Task Status
export const updateTaskStatus = createAsyncThunk(
  'task/updateTaskStatus',
  async ({ taskId, status }: UpdateTaskStatusRequest, { dispatch }) => {
    dispatch(setUpdatingStatus(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.updateTaskStatus(taskId, status)
      
      if (result.success && result.data) {
        dispatch(updateTask(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to update task status'))
        throw new Error(result.error || 'Failed to update task status')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task status'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setUpdatingStatus(false))
    }
  }
)

// Assign Task
export const assignTask = createAsyncThunk(
  'task/assignTask',
  async ({ taskId, assigneeId }: AssignTaskRequest, { dispatch }) => {
    dispatch(setUpdatingStatus(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.assignTask(taskId, assigneeId)
      
      if (result.success && result.data) {
        dispatch(updateTask(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to assign task'))
        throw new Error(result.error || 'Failed to assign task')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to assign task'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setUpdatingStatus(false))
    }
  }
)

// Unassign Task
export const unassignTask = createAsyncThunk(
  'task/unassignTask',
  async (taskId: string, { dispatch }) => {
    dispatch(setUpdatingStatus(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.unassignTask(taskId)
      
      if (result.success && result.data) {
        dispatch(updateTask(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to unassign task'))
        throw new Error(result.error || 'Failed to unassign task')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to unassign task'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setUpdatingStatus(false))
    }
  }
)

// Fetch Task by ID
export const fetchTask = createAsyncThunk(
  'task/fetchTask',
  async (taskId: string, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.getTask(taskId)
      
      if (result.success && result.data) {
        dispatch(setCurrentTask(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch task'))
        throw new Error(result.error || 'Failed to fetch task')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch task'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Delete Task
export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (taskId: string, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.deleteTask(taskId)
      
      if (result.success) {
        dispatch(removeTask(taskId))
        return taskId
      } else {
        dispatch(setError(result.error || 'Failed to delete task'))
        throw new Error(result.error || 'Failed to delete task')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Fetch Task Counts
export const fetchTaskCounts = createAsyncThunk(
  'task/fetchTaskCounts',
  async (groupId: string, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.getTaskCountsByStatus(groupId)
      
      if (result.success && result.data) {
        dispatch(setTaskCounts(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch task counts'))
        throw new Error(result.error || 'Failed to fetch task counts')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch task counts'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Fetch Overdue Tasks
export const fetchOverdueTasks = createAsyncThunk(
  'task/fetchOverdueTasks',
  async (groupId: string, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.getOverdueTasks(groupId)
      
      if (result.success && result.data) {
        // Could set these in a separate state slice for overdue tasks
        // For now, just return the data
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch overdue tasks'))
        throw new Error(result.error || 'Failed to fetch overdue tasks')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch overdue tasks'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Bulk Update Tasks
export const bulkUpdateTasksThunk = createAsyncThunk(
  'task/bulkUpdateTasks',
  async ({ taskIds, updates }: BulkUpdateRequest, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.bulkUpdateTasks(taskIds, updates)
      
      if (result.success && result.data) {
        dispatch(bulkUpdateTasks(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to bulk update tasks'))
        throw new Error(result.error || 'Failed to bulk update tasks')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to bulk update tasks'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Fetch Tasks by Assignee
export const fetchTasksByAssignee = createAsyncThunk(
  'task/fetchTasksByAssignee',
  async ({ userId, filters }: { userId: string; filters?: Omit<TaskFilters, 'assignedTo'> }, { dispatch }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const result = await taskRepository.getTasksByAssignee(userId, filters)
      
      if (result.success && result.data) {
        dispatch(setTasks(result.data))
        return result.data
      } else {
        dispatch(setError(result.error || 'Failed to fetch assigned tasks'))
        throw new Error(result.error || 'Failed to fetch assigned tasks')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch assigned tasks'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)