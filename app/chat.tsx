/**
 * Chat Screen
 * 
 * Main chat interface with conversation list and floating action button
 * for creating new chats of different types (poll, finance, post, task, etc.)
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, TouchableOpacity, Modal, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Text, View, Button } from '@/src/shared/components/themed';
import { useTheme } from '@/src/shared/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/src/store';
import { fetchConversations, createConversation } from '@/src/modules/chat/store/chatThunks';
import { ConversationType, ChatConversation } from '@/src/modules/chat/types/chat.types';

// Chat type options for new chat creation
const CHAT_TYPE_OPTIONS = [
  {
    id: 'group',
    title: 'Group Chat',
    description: 'General group conversation',
    icon: '👥',
    type: ConversationType.GROUP,
    color: '#3B82F6'
  },
  {
    id: 'poll',
    title: 'Poll Chat',
    description: 'Create polls and voting discussions',
    icon: '📊',
    type: ConversationType.GROUP,
    chatType: 'poll',
    color: '#10B981'
  },
  {
    id: 'finance',
    title: 'Finance Chat',
    description: 'Expense sharing and finance tracking',
    icon: '💰',
    type: ConversationType.GROUP,
    chatType: 'finance',
    color: '#F59E0B'
  },
  {
    id: 'task',
    title: 'Task Chat',
    description: 'Project management and task coordination',
    icon: '✅',
    type: ConversationType.GROUP,
    chatType: 'task',
    color: '#8B5CF6'
  },
  {
    id: 'post',
    title: 'Post Chat',
    description: 'Forum-style discussions with posts',
    icon: '📝',
    type: ConversationType.GROUP,
    chatType: 'post',
    color: '#EF4444'
  }
];

interface ChatTypeOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: ConversationType;
  chatType?: string;
  color: string;
}

export default function ChatScreen() {
  const { currentTheme } = useTheme();
  const dispatch = useAppDispatch();
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  
  // Redux state
  const { conversations, loading, error } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleCreateChat = async (option: ChatTypeOption) => {
    // Use mock user for sample app
    const mockUser = user || { id: 'sample_user', email: 'sample@example.com', name: 'Sample User' };

    try {
      const chatName = `${option.title} ${new Date().toLocaleDateString()}`;
      const result = await dispatch(createConversation({
        name: chatName,
        type: option.type,
        participants: [mockUser.id || mockUser.email || 'sample_user'],
        createdBy: mockUser.id || mockUser.email || 'sample_user'
      })).unwrap();

      setShowNewChatModal(false);
      
      // Navigate to the specific chat screen based on type
      const chatTypeRoute = option.chatType || 'group';
      router.push(`/chat/${chatTypeRoute}/${result.id}`);
      
    } catch (error) {
      Alert.alert('Error', typeof error === 'string' ? error : 'Failed to create chat');
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const ChatItem = ({ item }: { item: ChatConversation }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      onPress={() => {
        // TODO: Navigate to chat conversation screen
        console.log('Open chat:', item.id);
      }}
    >
      <View className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center mr-3">
        <Text size="lg">
          {item.type === 'group' ? '👥' : '💬'}
        </Text>
      </View>
      
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text variant="primary" size="base" weight="semibold" className="flex-1">
            {item.name}
          </Text>
          <Text variant="tertiary" size="xs">
            {item.updatedAt ? formatTime(item.updatedAt) : formatTime(item.createdAt)}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between">
          <Text 
            variant="secondary" 
            size="sm" 
            className="flex-1"
            numberOfLines={1}
          >
            {item.lastMessage?.content || 'No messages yet'}
          </Text>
          {item.unreadCount > 0 && (
            <View className="bg-blue-500 rounded-full min-w-[20px] h-5 items-center justify-center ml-2">
              <Text className="text-white text-xs font-semibold">
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const NewChatTypeItem = ({ item }: { item: ChatTypeOption }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700"
      onPress={() => handleCreateChat(item)}
    >
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: `${item.color}20` }}
      >
        <Text size="xl">{item.icon}</Text>
      </View>
      
      <View className="flex-1">
        <Text variant="primary" size="base" weight="semibold" className="mb-1">
          {item.title}
        </Text>
        <Text variant="secondary" size="sm">
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text variant="brand" size="2xl" weight="bold">
              Chats
            </Text>
            <Text variant="secondary" size="sm">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <View className="flex-row gap-2">
            <Button
              title="← Back"
              onPress={() => router.back()}
              variant="outline"
              size="sm"
            />
          </View>
        </View>
      </View>

      {/* Chat List */}
      <View className="flex-1">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text variant="secondary">Loading chats...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-red-500 text-center mb-4">{error}</Text>
            <Button
              title="Try Again"
              onPress={() => dispatch(fetchConversations())}
              variant="outline"
              size="sm"
            />
          </View>
        ) : conversations.length === 0 ? (
          <View className="flex-1 items-center justify-center p-8">
            <Text size="4xl" className="mb-4">💬</Text>
            <Text variant="primary" size="lg" weight="semibold" className="mb-2">
              No chats yet
            </Text>
            <Text variant="secondary" size="sm" className="text-center mb-6">
              Create your first chat to start conversations with different types of discussions
            </Text>
            <Button
              title="Create Your First Chat"
              onPress={() => setShowNewChatModal(true)}
              variant="primary"
            />
          </View>
        ) : (
          <FlatList
            data={conversations}
            renderItem={ChatItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      {conversations.length > 0 && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
          onPress={() => setShowNewChatModal(true)}
          activeOpacity={0.8}
        >
          <Text className="text-white text-2xl font-bold">+</Text>
        </TouchableOpacity>
      )}

      {/* New Chat Type Modal */}
      <Modal
        visible={showNewChatModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewChatModal(false)}
      >
        <View className="flex-1 bg-white dark:bg-gray-900">
          {/* Modal Header */}
          <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-12 pb-4 px-4">
            <View className="flex-row items-center justify-between">
              <Text variant="brand" size="xl" weight="bold">
                Create New Chat
              </Text>
              <Button
                title="Cancel"
                onPress={() => setShowNewChatModal(false)}
                variant="outline"
                size="sm"
              />
            </View>
            <Text variant="secondary" size="sm" className="mt-2">
              Choose the type of chat you want to create
            </Text>
          </View>

          {/* Chat Type Options */}
          <FlatList
            data={CHAT_TYPE_OPTIONS}
            renderItem={NewChatTypeItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>
      </Modal>
    </View>
  );
}