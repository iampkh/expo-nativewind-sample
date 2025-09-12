/**
 * FinanceCard Component
 * 
 * Displays an expense record with settlement status and actions.
 */

import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { FinanceCardProps } from '../types/finance.types'

export const FinanceCard: React.FC<FinanceCardProps> = ({ 
  expense, 
  onSettle, 
  onEdit,
  onDelete,
  className = '' 
}) => {
  const handleSettle = () => {
    onSettle?.(expense.id, 'current-user-id') // TODO: Get actual user ID
  }

  const handleEdit = () => {
    onEdit?.(expense.id)
  }

  const handleDelete = () => {
    onDelete?.(expense.id)
  }

  // Format currency display
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  return (
    <View className={`bg-card p-4 rounded-lg border border-border ${className}`}>
      {/* Expense Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-semibold text-foreground mb-1">
            {expense.title}
          </Text>
          <Text className="text-2xl font-bold text-primary">
            {formatAmount(expense.amount, expense.currency)}
          </Text>
        </View>
        
        <View className="items-end">
          <Text className="text-sm text-muted-foreground mb-1">
            {expense.date}
          </Text>
          {/* TODO: Add settlement status indicator */}
          <View className="bg-yellow-100 px-2 py-1 rounded">
            <Text className="text-xs text-yellow-800">
              Pending
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Info */}
      <View className="mb-3">
        <Text className="text-sm text-muted-foreground">
          Paid by: <Text className="text-foreground font-medium">{expense.paidBy}</Text>
        </Text>
      </View>

      {/* Notes */}
      {expense.notes && (
        <View className="mb-3">
          <Text className="text-sm text-muted-foreground">
            {expense.notes}
          </Text>
        </View>
      )}

      {/* Split Information Placeholder */}
      <View className="bg-secondary/20 p-3 rounded-md mb-3">
        <Text className="text-sm text-muted-foreground mb-2">
          Split details will be shown here
        </Text>
        <Text className="text-xs text-muted-foreground">
          Group ID: {expense.groupId}
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row justify-between">
        <View className="flex-row space-x-2">
          <Pressable
            onPress={handleSettle}
            className="bg-green-500 px-4 py-2 rounded-md"
          >
            <Text className="text-white text-sm font-medium">
              Settle
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
          Created by {expense.createdBy} • {expense.createdAt?.toLocaleDateString()}
        </Text>
      </View>
    </View>
  )
}