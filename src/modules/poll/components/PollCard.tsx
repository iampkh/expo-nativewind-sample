/**
 * PollCard Component
 * 
 * Displays a poll with voting options and results.
 */

import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { PollCardProps } from '../types/poll.types'

export const PollCard: React.FC<PollCardProps> = ({ 
  poll, 
  onVote, 
  onViewResults,
  className = '' 
}) => {
  const handleVote = (optionId: string) => {
    onVote?.(poll.id, optionId)
  }

  const handleViewResults = () => {
    onViewResults?.(poll.id)
  }

  return (
    <View className={`bg-card p-4 rounded-lg border border-border ${className}`}>
      {/* Poll Question */}
      <Text className="text-lg font-semibold text-foreground mb-3">
        {poll.question}
      </Text>

      {/* Poll Info */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm text-muted-foreground">
          {poll.isMultipleChoice ? 'Multiple Choice' : 'Single Choice'}
        </Text>
        
        {poll.hasExpiry && (
          <Text className={`text-xs ${poll.isExpired ? 'text-red-500' : 'text-muted-foreground'}`}>
            {poll.isExpired ? 'Expired' : `Expires: ${poll.expiresAt?.toLocaleDateString()}`}
          </Text>
        )}
      </View>

      {/* Poll Options - Placeholder for now */}
      <View className="space-y-2 mb-3">
        <Text className="text-sm text-muted-foreground">
          Options will be displayed here
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row justify-between">
        <Pressable
          onPress={handleViewResults}
          className="bg-secondary px-4 py-2 rounded-md"
        >
          <Text className="text-secondary-foreground text-sm font-medium">
            View Results
          </Text>
        </Pressable>

        {!poll.isExpired && (
          <Text className="text-xs text-muted-foreground self-center">
            Voting enabled
          </Text>
        )}
      </View>

      {/* Metadata */}
      <View className="mt-3 pt-3 border-t border-border">
        <Text className="text-xs text-muted-foreground">
          Created: {poll.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </View>
  )
}