/**
 * GeoMapCard Component
 * 
 * Displays a map location with navigation and action controls.
 */

import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { GeoMapCardProps, LocationCategory } from '../types/geomap.types'

export const GeoMapCard: React.FC<GeoMapCardProps> = ({ 
  location, 
  onEdit,
  onDelete,
  onNavigate,
  className = '' 
}) => {
  const handleEdit = () => {
    onEdit?.(location.id)
  }

  const handleDelete = () => {
    onDelete?.(location.id)
  }

  const handleNavigate = () => {
    onNavigate?.(location)
  }

  const getCategoryColor = (category: LocationCategory) => {
    switch (category) {
      case LocationCategory.POINT_OF_INTEREST:
        return 'bg-blue-100 text-blue-800'
      case LocationCategory.OFFICE:
        return 'bg-gray-100 text-gray-800'
      case LocationCategory.HOME:
        return 'bg-green-100 text-green-800'
      case LocationCategory.RESTAURANT:
        return 'bg-orange-100 text-orange-800'
      case LocationCategory.STORE:
        return 'bg-purple-100 text-purple-800'
      case LocationCategory.LANDMARK:
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <View className={`bg-card p-4 rounded-lg border border-border ${className}`}>
      {/* Location Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-semibold text-foreground mb-1">
            {location.name}
          </Text>
          
          {location.description && (
            <Text className="text-sm text-muted-foreground mb-2">
              {location.description}
            </Text>
          )}
        </View>
        
        <View className={`px-2 py-1 rounded ${getCategoryColor(location.category)}`}>
          <Text className="text-xs font-medium">
            {location.category.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Location Details */}
      <View className="space-y-2 mb-3">
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted-foreground">Coordinates:</Text>
          <Text className="text-sm text-foreground font-mono">
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        </View>

        {location.address && (
          <View>
            <Text className="text-sm text-muted-foreground mb-1">Address:</Text>
            <Text className="text-sm text-foreground">
              {location.address}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <View className="flex-row space-x-2">
          <Pressable
            onPress={handleNavigate}
            className="bg-blue-500 px-4 py-2 rounded-md"
          >
            <Text className="text-white text-sm font-medium">
              Navigate
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
          Added by {location.createdBy} • {location.createdAt.toLocaleDateString()}
          {location.updatedAt && ` • Updated: ${location.updatedAt.toLocaleDateString()}`}
        </Text>
      </View>
    </View>
  )
}