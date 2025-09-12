/**
 * TaskCard Component
 * 
 * Displays a task with status controls and action buttons.
 */

import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { TaskCardProps, TaskStatus, TaskPriority } from '../types/task.types'

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onStatusChange, 
  onAssign,
  onEdit,
  onDelete,
  className = '' 
}) => {
  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange?.(task.id, newStatus)
  }

  const handleAssign = () => {
    onAssign?.(task.id, 'new-assignee-id') // TODO: Get from user picker
  }

  const handleEdit = () => {
    onEdit?.(task.id)
  }

  const handleDelete = () => {
    onDelete?.(task.id)
  }

  // Get status color
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-100 text-gray-800'
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800'
      case TaskStatus.DONE:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'bg-green-100 text-green-800'
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800'
      case TaskPriority.HIGH:
        return 'bg-orange-100 text-orange-800'
      case TaskPriority.URGENT:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Check if task is overdue
  const isOverdue = task.hasDueDate && task.dueDate < new Date().toISOString().split('T')[0] && !task.isDone

  return (
    <View className={`bg-card p-4 rounded-lg border border-border ${className}`}>
      {/* Task Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-semibold text-foreground mb-1">
            {task.title}
          </Text>
          
          {task.description && (
            <Text className="text-sm text-muted-foreground mb-2">
              {task.description}
            </Text>
          )}
        </View>
        
        <View className="items-end space-y-1">
          {/* Priority Badge */}
          <View className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
            <Text className="text-xs font-medium">
              {task.priority.toUpperCase()}
            </Text>
          </View>
          
          {/* Status Badge */}
          <View className={`px-2 py-1 rounded ${getStatusColor(task.status)}`}>
            <Text className="text-xs font-medium">
              {task.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Task Details */}
      <View className="space-y-2 mb-3">
        {/* Assignment */}
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted-foreground">
            Assigned to:
          </Text>
          <Text className="text-sm text-foreground font-medium">
            {task.isAssigned ? task.assignedTo : 'Unassigned'}
          </Text>
        </View>

        {/* Due Date */}
        {task.hasDueDate && (
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted-foreground">
              Due date:
            </Text>
            <Text className={`text-sm font-medium ${isOverdue ? 'text-red-500' : 'text-foreground'}`}>
              {task.dueDate} {isOverdue && '(Overdue)'}
            </Text>
          </View>
        )}

        {/* Created by */}
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted-foreground">
            Created by:
          </Text>
          <Text className="text-sm text-foreground">
            {task.createdBy}
          </Text>
        </View>
      </View>

      {/* Status Actions */}
      <View className="flex-row space-x-2 mb-3">
        {task.status !== TaskStatus.TODO && (
          <Pressable
            onPress={() => handleStatusChange(TaskStatus.TODO)}
            className="bg-gray-500 px-3 py-1 rounded-md flex-1"
          >
            <Text className="text-white text-sm font-medium text-center">
              To Do
            </Text>
          </Pressable>
        )}

        {task.status !== TaskStatus.IN_PROGRESS && (
          <Pressable
            onPress={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
            className="bg-blue-500 px-3 py-1 rounded-md flex-1"
          >
            <Text className="text-white text-sm font-medium text-center">
              In Progress
            </Text>
          </Pressable>
        )}

        {task.status !== TaskStatus.DONE && (
          <Pressable
            onPress={() => handleStatusChange(TaskStatus.DONE)}
            className="bg-green-500 px-3 py-1 rounded-md flex-1"
          >
            <Text className="text-white text-sm font-medium text-center">
              Done
            </Text>
          </Pressable>
        )}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <View className="flex-row space-x-2">
          <Pressable
            onPress={handleAssign}
            className="bg-secondary px-4 py-2 rounded-md"
          >
            <Text className="text-secondary-foreground text-sm font-medium">
              {task.isAssigned ? 'Reassign' : 'Assign'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleEdit}
            className="bg-secondary px-4 py-2 rounded-md"
          >
            <Text className="text-secondary-foreground text-sm font-medium">
              Edit
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleDelete}
          className="bg-red-500 px-4 py-2 rounded-md"
        >
          <Text className="text-white text-sm font-medium">
            Delete
          </Text>
        </Pressable>
      </View>

      {/* Metadata */}
      <View className="mt-3 pt-3 border-t border-border">
        <Text className="text-xs text-muted-foreground">
          Created: {task.createdAt.toLocaleDateString()}
          {task.updatedAt && ` • Updated: ${task.updatedAt.toLocaleDateString()}`}
        </Text>
      </View>
    </View>
  )
}