/**
 * ChatCard Component
 * 
 * Displays a chat conversation with last message and unread count.
 */

import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { ChatCardProps, ConversationType } from '../types/chat.types'

export const ChatCard: React.FC<ChatCardProps> = ({ 
  conversation, 
  onSelect,
  className = '' 
}) => {
  const handleSelect = () => {
    onSelect?.(conversation.id)
  }

  const getTypeColor = (type: ConversationType) => {
    switch (type) {
      case ConversationType.DIRECT:
        return 'bg-blue-100 text-blue-800'
      case ConversationType.GROUP:
        return 'bg-green-100 text-green-800'
      case ConversationType.CHANNEL:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Pressable
      onPress={handleSelect}
      className={`bg-card p-4 rounded-lg border border-border ${className}`}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-foreground flex-1">
          {conversation.name || `${conversation.type} chat`}
        </Text>
        
        <View className="items-end">
          <View className={`px-2 py-1 rounded ${getTypeColor(conversation.type)}`}>
            <Text className="text-xs font-medium">
              {conversation.type.toUpperCase()}
            </Text>
          </View>
          
          {conversation.unreadCount > 0 && (
            <View className="bg-red-500 px-2 py-1 rounded-full mt-1">
              <Text className="text-white text-xs font-bold">
                {conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {conversation.lastMessage && (
        <Text className="text-sm text-muted-foreground mb-2" numberOfLines={2}>
          {conversation.lastMessage.content}
        </Text>
      )}

      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-muted-foreground">
          {conversation.participants.length} participants
        </Text>
        
        <Text className="text-xs text-muted-foreground">
          {conversation.updatedAt?.toLocaleDateString() || conversation.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  )
}