/**
 * AnalyticsCard Component
 * 
 * Displays an analytics report with summary and action controls.
 */

import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { AnalyticsCardProps, ReportType, ReportStatus } from '../types/analytics.types'

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  report, 
  onView,
  onDelete,
  onRefresh,
  className = '' 
}) => {
  const handleView = () => {
    onView?.(report.id)
  }

  const handleDelete = () => {
    onDelete?.(report.id)
  }

  const handleRefresh = () => {
    onRefresh?.(report.id)
  }

  const getTypeColor = (type: ReportType) => {
    switch (type) {
      case ReportType.USER_ENGAGEMENT:
        return 'bg-blue-100 text-blue-800'
      case ReportType.FEATURE_USAGE:
        return 'bg-green-100 text-green-800'
      case ReportType.PERFORMANCE:
        return 'bg-orange-100 text-orange-800'
      case ReportType.RETENTION:
        return 'bg-purple-100 text-purple-800'
      case ReportType.CONVERSION:
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.READY:
        return 'bg-green-100 text-green-800'
      case ReportStatus.GENERATING:
        return 'bg-yellow-100 text-yellow-800'
      case ReportStatus.ERROR:
        return 'bg-red-100 text-red-800'
      case ReportStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = changePercent >= 0
    const color = isPositive ? 'text-green-600' : 'text-red-600'
    const arrow = isPositive ? '↗' : '↘'
    
    return (
      <Text className={`text-sm font-medium ${color}`}>
        {arrow} {changePercent.toFixed(1)}%
      </Text>
    )
  }

  return (
    <View className={`bg-card p-4 rounded-lg border border-border ${className}`}>
      {/* Report Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-semibold text-foreground mb-1">
            {report.name}
          </Text>
          
          {report.description && (
            <Text className="text-sm text-muted-foreground mb-2">
              {report.description}
            </Text>
          )}
        </View>
        
        <View className="items-end space-y-1">
          <View className={`px-2 py-1 rounded ${getTypeColor(report.type)}`}>
            <Text className="text-xs font-medium">
              {report.type.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          
          <View className={`px-2 py-1 rounded ${getStatusColor(report.status)}`}>
            <Text className="text-xs font-medium">
              {report.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Report Summary */}
      {report.status === ReportStatus.READY && (
        <View className="bg-secondary/20 p-3 rounded-md mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-muted-foreground">
              {report.data.summary.period} Summary
            </Text>
            {formatChange(report.data.summary.change, report.data.summary.changePercent)}
          </View>
          
          <Text className="text-2xl font-bold text-foreground">
            {report.data.summary.totalValue.toLocaleString()}
          </Text>
          
          {report.data.insights.length > 0 && (
            <Text className="text-sm text-muted-foreground mt-2">
              {report.data.insights[0]}
            </Text>
          )}
        </View>
      )}

      {/* Date Range */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm text-muted-foreground">
          Period:
        </Text>
        <Text className="text-sm text-foreground">
          {report.dateRange.startDate} - {report.dateRange.endDate}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <View className="flex-row space-x-2">
          <Pressable
            onPress={handleView}
            className="bg-blue-500 px-4 py-2 rounded-md"
            disabled={report.status !== ReportStatus.READY}
          >
            <Text className="text-white text-sm font-medium">
              View Report
            </Text>
          </Pressable>

          <Pressable
            onPress={handleRefresh}
            className="bg-secondary px-4 py-2 rounded-md"
          >
            <Text className="text-secondary-foreground text-sm font-medium">
              Refresh
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
          Created by {report.createdBy} • {report.createdAt.toLocaleDateString()}
          {report.updatedAt && ` • Updated: ${report.updatedAt.toLocaleDateString()}`}
        </Text>
      </View>
    </View>
  )
}