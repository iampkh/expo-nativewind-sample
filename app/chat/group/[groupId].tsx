/**
 * Group Chat Screen
 * 
 * Shows general group conversation for a specific group ID
 * Retrieves data from collaboration database using repository pattern
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, Button } from '@/src/shared/components/themed';
import { useTheme } from '@/src/shared/hooks/useTheme';

// Mock chat message structures
interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  groupId: string;
  timestamp: Date;
  messageType: 'text' | 'image' | 'file';
  replyTo?: string;
  reactions: { emoji: string; userIds: string[] }[];
}

interface GroupInfo {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
}

export default function GroupChatScreen() {
  const { groupId } = useLocalSearchParams();
  const { currentTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Mock user data
  const mockUser = { id: 'sample_user', name: 'Sample User' };
  const mockGroupMembers = [
    { id: 'sample_user', name: 'Sample User' },
    { id: 'user_2', name: 'John Doe' },
    { id: 'user_3', name: 'Jane Smith' },
    { id: 'user_4', name: 'Bob Johnson' },
    { id: 'user_5', name: 'Alice Brown' }
  ];

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual repository calls
      // const groupRepository = new GroupRepository();
      // const messageRepository = new MessageRepository();
      // const groupResult = await groupRepository.getGroupById(groupId as string);
      // const messagesResult = await messageRepository.getMessagesByGroupId(groupId as string);
      
      // Mock group info
      const mockGroupInfo: GroupInfo = {
        id: groupId as string,
        name: 'Project Team Chat',
        description: 'General discussion for our project team',
        members: mockGroupMembers.map(m => m.id),
        createdBy: 'sample_user',
        createdAt: new Date('2023-12-01')
      };

      // Mock messages for demonstration
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          content: 'Hey everyone! Welcome to our project team chat 👋',
          senderId: 'sample_user',
          groupId: groupId as string,
          timestamp: new Date('2023-12-01T09:00:00'),
          messageType: 'text',
          reactions: [
            { emoji: '👋', userIds: ['user_2', 'user_3'] },
            { emoji: '🎉', userIds: ['user_4'] }
          ]
        },
        {
          id: '2',
          content: 'Thanks for setting this up! This will make communication much easier.',
          senderId: 'user_2',
          groupId: groupId as string,
          timestamp: new Date('2023-12-01T09:15:00'),
          messageType: 'text',
          reactions: [
            { emoji: '👍', userIds: ['sample_user', 'user_3', 'user_5'] }
          ]
        },
        {
          id: '3',
          content: 'I agree! Should we set up some guidelines for how we use this chat?',
          senderId: 'user_3',
          groupId: groupId as string,
          timestamp: new Date('2023-12-01T09:30:00'),
          messageType: 'text',
          reactions: []
        },
        {
          id: '4',
          content: 'Good idea! Here are some suggestions:\n\n• Use threads for longer discussions\n• @mention people when needed\n• Keep it professional but friendly\n• Use other channels for specific topics',
          senderId: 'sample_user',
          groupId: groupId as string,
          timestamp: new Date('2023-12-01T10:00:00'),
          messageType: 'text',
          replyTo: '3',
          reactions: [
            { emoji: '💯', userIds: ['user_2', 'user_4', 'user_5'] }
          ]
        },
        {
          id: '5',
          content: 'Perfect! I\'ll save these guidelines. Also, don\'t forget about our meeting tomorrow at 2 PM.',
          senderId: 'user_4',
          groupId: groupId as string,
          timestamp: new Date('2023-12-01T14:30:00'),
          messageType: 'text',
          reactions: [
            { emoji: '📅', userIds: ['sample_user'] }
          ]
        }
      ];
      
      setGroupInfo(mockGroupInfo);
      setMessages(mockMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
    } catch (error) {
      Alert.alert('Error', 'Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // TODO: Replace with actual repository call
      const message: ChatMessage = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: mockUser.id,
        groupId: groupId as string,
        timestamp: new Date(),
        messageType: 'text',
        replyTo: replyingTo || undefined,
        reactions: []
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      // TODO: Replace with actual repository call
      const updatedMessages = messages.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            // Toggle user's reaction
            if (existingReaction.userIds.includes(mockUser.id)) {
              existingReaction.userIds = existingReaction.userIds.filter(id => id !== mockUser.id);
              if (existingReaction.userIds.length === 0) {
                msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
              }
            } else {
              existingReaction.userIds.push(mockUser.id);
            }
          } else {
            // Add new reaction
            msg.reactions.push({ emoji, userIds: [mockUser.id] });
          }
        }
        return msg;
      });
      
      setMessages(updatedMessages);
    } catch (error) {
      Alert.alert('Error', 'Failed to add reaction');
    }
  };

  const getUserName = (userId: string) => {
    return mockGroupMembers.find(m => m.id === userId)?.name || 'Unknown User';
  };

  const getReplyMessage = (messageId: string) => {
    return messages.find(m => m.id === messageId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const MessageCard = ({ message, isLast }: { message: ChatMessage; isLast: boolean }) => {
    const isOwnMessage = message.senderId === mockUser.id;
    const replyMessage = message.replyTo ? getReplyMessage(message.replyTo) : null;
    
    return (
      <View className={`mb-3 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {replyMessage && (
          <View className="mb-1 px-3">
            <View className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 max-w-[80%]">
              <Text variant="secondary" size="xs" className="mb-1">
                Replying to {getUserName(replyMessage.senderId)}
              </Text>
              <Text variant="secondary" size="sm" numberOfLines={2}>
                {replyMessage.content}
              </Text>
            </View>
          </View>
        )}
        
        <View className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isOwnMessage 
            ? 'bg-blue-500 dark:bg-blue-600' 
            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
        }`}>
          {!isOwnMessage && (
            <Text 
              variant="secondary" 
              size="xs" 
              className="mb-1"
              style={{ color: isOwnMessage ? 'rgba(255,255,255,0.8)' : undefined }}
            >
              {getUserName(message.senderId)}
            </Text>
          )}
          
          <Text 
            size="sm" 
            className={isOwnMessage ? 'text-white' : 'text-gray-900 dark:text-white'}
          >
            {message.content}
          </Text>
          
          <Text 
            size="xs" 
            className={`mt-2 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {formatTime(message.timestamp)}
          </Text>
        </View>
        
        {/* Reactions */}
        {message.reactions.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mt-1 px-3">
            {message.reactions.map(reaction => (
              <TouchableOpacity
                key={reaction.emoji}
                onPress={() => handleReaction(message.id, reaction.emoji)}
                className={`flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 ${
                  reaction.userIds.includes(mockUser.id) ? 'bg-blue-100 dark:bg-blue-900' : ''
                }`}
              >
                <Text className="text-sm mr-1">{reaction.emoji}</Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  {reaction.userIds.length}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Quick reactions */}
        <TouchableOpacity
          onLongPress={() => setReplyingTo(message.id)}
          className="mt-1 opacity-50"
        >
          <View className="flex-row gap-2">
            {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleReaction(message.id, emoji)}
                className="p-1"
              >
                <Text>{emoji}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setReplyingTo(message.id)}
              className="p-1"
            >
              <Text className="text-gray-500">↩️</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [date: string]: ChatMessage[] }, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text variant="brand" size="xl" weight="bold">
              👥 {groupInfo?.name || 'Group Chat'}
            </Text>
            <Text variant="secondary" size="sm">
              {groupInfo?.members.length} members • Group ID: {groupId}
            </Text>
          </View>
          
          <Button
            title="← Back"
            onPress={() => router.back()}
            variant="outline"
            size="sm"
          />
        </View>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text variant="secondary">Loading messages...</Text>
          </View>
        ) : Object.keys(groupedMessages).length === 0 ? (
          <View className="items-center py-20">
            <Text size="4xl" className="mb-4">👥</Text>
            <Text variant="primary" size="lg" weight="semibold" className="mb-2">
              No messages yet
            </Text>
            <Text variant="secondary" size="sm" className="text-center mb-6">
              Start the conversation by sending the first message
            </Text>
          </View>
        ) : (
          Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <View key={date}>
              {/* Date separator */}
              <View className="items-center my-4">
                <View className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1">
                  <Text variant="secondary" size="xs">{date}</Text>
                </View>
              </View>
              
              {/* Messages for this date */}
              {dayMessages.map((message, index) => (
                <MessageCard 
                  key={message.id} 
                  message={message} 
                  isLast={index === dayMessages.length - 1}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Reply indicator */}
      {replyingTo && (
        <View className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 border-t border-blue-200 dark:border-blue-800">
          <View className="flex-row items-center justify-between">
            <Text variant="secondary" size="sm">
              Replying to {getUserName(getReplyMessage(replyingTo)?.senderId || '')}
            </Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Text className="text-blue-600 dark:text-blue-400">✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Message input */}
      <View className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <View className="flex-row items-end gap-3">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
            maxLength={1000}
            className="flex-1 max-h-24 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
            placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            style={{ textAlignVertical: 'top' }}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`rounded-lg px-4 py-2 ${
              newMessage.trim() 
                ? 'bg-blue-500 dark:bg-blue-600' 
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <Text className={`font-medium ${
              newMessage.trim() ? 'text-white' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}