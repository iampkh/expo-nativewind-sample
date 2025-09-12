/**
 * SampleCard Component
 * 
 * Displays a sample item with status and action controls.
 */

import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { SampleCardProps, SampleStatus, SampleCategory } from '../types/sample.types'

export const SampleCard: React.FC<SampleCardProps> = ({ 
  sample, 
  onEdit,
  onDelete,
  onStatusChange,
  className = '' 
}) => {
  const handleEdit = () => {
    onEdit?.(sample.id)
  }

  const handleDelete = () => {
    onDelete?.(sample.id)
  }

  const handleStatusChange = (newStatus: SampleStatus) => {
    onStatusChange?.(sample.id, newStatus)
  }

  // Get status color
  const getStatusColor = (status: SampleStatus) => {
    switch (status) {
      case SampleStatus.DRAFT:
        return 'bg-gray-100 text-gray-800'
      case SampleStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case SampleStatus.INACTIVE:
        return 'bg-yellow-100 text-yellow-800'
      case SampleStatus.ARCHIVED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get category color
  const getCategoryColor = (category: SampleCategory) => {
    switch (category) {
      case SampleCategory.DEMO:
        return 'bg-blue-100 text-blue-800'
      case SampleCategory.TEST:
        return 'bg-orange-100 text-orange-800'
      case SampleCategory.PROTOTYPE:
        return 'bg-purple-100 text-purple-800'
      case SampleCategory.TEMPLATE:
        return 'bg-green-100 text-green-800'
      case SampleCategory.EXAMPLE:
        return 'bg-cyan-100 text-cyan-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <View className={`bg-card p-4 rounded-lg border border-border ${className}`}>
      {/* Sample Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-semibold text-foreground mb-1">
            {sample.name}
          </Text>
          
          <Text className="text-sm text-muted-foreground mb-2">
            {sample.description}
          </Text>
        </View>
        
        <View className="items-end space-y-1">
          {/* Category Badge */}
          <View className={`px-2 py-1 rounded ${getCategoryColor(sample.category)}`}>
            <Text className="text-xs font-medium">
              {sample.category.toUpperCase()}
            </Text>
          </View>
          
          {/* Status Badge */}
          <View className={`px-2 py-1 rounded ${getStatusColor(sample.status)}`}>
            <Text className="text-xs font-medium">
              {sample.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Sample Data Preview */}
      <View className="bg-secondary/20 p-3 rounded-md mb-3">
        <Text className="text-sm text-muted-foreground mb-1">
          Data Properties: {Object.keys(sample.data).length}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {Object.keys(sample.data).slice(0, 3).join(', ')}
          {Object.keys(sample.data).length > 3 && '...'}
        </Text>
      </View>

      {/* Status Actions */}
      <View className="flex-row space-x-2 mb-3">
        <Pressable
          onPress={() => handleStatusChange(SampleStatus.ACTIVE)}
          className="bg-green-500 px-3 py-1 rounded-md flex-1"
        >
          <Text className="text-white text-sm font-medium text-center">
            Activate
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleStatusChange(SampleStatus.INACTIVE)}
          className="bg-yellow-500 px-3 py-1 rounded-md flex-1"
        >
          <Text className="text-white text-sm font-medium text-center">
            Deactivate
          </Text>
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <Pressable
          onPress={handleEdit}
          className="bg-secondary px-4 py-2 rounded-md"
        >
          <Text className="text-secondary-foreground text-sm font-medium">
            Edit
          </Text>
        </Pressable>

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
          Created by {sample.createdBy} • {sample.createdAt.toLocaleDateString()}
          {sample.updatedAt && ` • Updated: ${sample.updatedAt.toLocaleDateString()}`}
        </Text>
      </View>
    </View>
  )
}