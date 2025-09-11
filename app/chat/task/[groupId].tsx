/**
 * Task Chat Screen
 * 
 * Shows project management and task coordination for a specific group ID
 * Retrieves data from collaboration database using repository pattern
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, Button } from '@/src/shared/components/themed';
import { useTheme } from '@/src/shared/hooks/useTheme';

// Mock task data structures
interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  dueDate?: Date;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export default function TaskChatScreen() {
  const { groupId } = useLocalSearchParams();
  const { currentTheme } = useTheme();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<TaskItem['status'] | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  
  // New task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  
  // Mock user data
  const mockUser = { id: 'sample_user', name: 'Sample User' };
  const mockGroupMembers = [
    { id: 'sample_user', name: 'Sample User' },
    { id: 'user_2', name: 'John Doe' },
    { id: 'user_3', name: 'Jane Smith' },
    { id: 'user_4', name: 'Bob Johnson' }
  ];

  useEffect(() => {
    loadTasksForGroup();
  }, [groupId]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === statusFilter));
    }
  }, [tasks, statusFilter]);

  const loadTasksForGroup = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual repository call
      // const taskRepository = new TaskRepository();
      // const result = await taskRepository.getTasksByGroupId(groupId as string);
      
      // Mock data for demonstration
      const mockTasks: TaskItem[] = [
        {
          id: '1',
          title: 'Design new landing page',
          description: 'Create wireframes and mockups for the updated homepage design',
          assignedTo: 'user_3',
          createdBy: 'sample_user',
          priority: 'high',
          status: 'in_progress',
          dueDate: new Date('2024-01-15'),
          groupId: groupId as string,
          createdAt: new Date('2023-12-01'),
          updatedAt: new Date('2023-12-05'),
          tags: ['design', 'frontend']
        },
        {
          id: '2',
          title: 'Setup CI/CD pipeline',
          description: 'Configure automated testing and deployment workflow',
          assignedTo: 'user_2',
          createdBy: 'user_4',
          priority: 'urgent',
          status: 'todo',
          dueDate: new Date('2024-01-10'),
          groupId: groupId as string,
          createdAt: new Date('2023-12-03'),
          updatedAt: new Date('2023-12-03'),
          tags: ['devops', 'automation']
        },
        {
          id: '3',
          title: 'Write user documentation',
          description: 'Create comprehensive guides for new users',
          assignedTo: 'sample_user',
          createdBy: 'user_2',
          priority: 'medium',
          status: 'review',
          dueDate: new Date('2024-01-20'),
          groupId: groupId as string,
          createdAt: new Date('2023-12-02'),
          updatedAt: new Date('2023-12-06'),
          tags: ['documentation', 'content']
        },
        {
          id: '4',
          title: 'Fix mobile responsiveness',
          description: 'Address layout issues on small screens',
          assignedTo: 'user_4',
          createdBy: 'user_3',
          priority: 'high',
          status: 'done',
          groupId: groupId as string,
          createdAt: new Date('2023-11-28'),
          updatedAt: new Date('2023-12-01'),
          tags: ['frontend', 'mobile', 'bug']
        }
      ];
      
      setTasks(mockTasks);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !newTaskAssignee) {
      Alert.alert('Error', 'Please enter a task title and select an assignee');
      return;
    }

    try {
      // TODO: Replace with actual repository call
      const newTask: TaskItem = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDescription,
        assignedTo: newTaskAssignee,
        createdBy: mockUser.id,
        priority: newTaskPriority,
        status: 'todo',
        groupId: groupId as string,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: []
      };

      setTasks(prev => [newTask, ...prev]);
      
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskAssignee('');
      setShowAddTask(false);
      Alert.alert('Success', 'Task created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskItem['status']) => {
    try {
      // TODO: Replace with actual repository call
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task
      );
      setTasks(updatedTasks);
      Alert.alert('Success', 'Task status updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'in_progress': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
      case 'review': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900';
      case 'todo': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getUserName = (userId: string) => {
    return mockGroupMembers.find(m => m.id === userId)?.name || 'Unknown User';
  };

  const TaskCard = ({ task }: { task: TaskItem }) => (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-start justify-between mb-2">
        <Text variant="primary" size="base" weight="semibold" className="flex-1 mr-2">
          {task.title}
        </Text>
        <View className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
          <Text size="xs" weight="medium">
            {task.priority.toUpperCase()}
          </Text>
        </View>
      </View>
      
      {task.description && (
        <Text variant="secondary" size="sm" className="mb-3">
          {task.description}
        </Text>
      )}
      
      <View className="flex-row items-center justify-between mb-3">
        <Text variant="secondary" size="sm">
          👤 {getUserName(task.assignedTo)}
        </Text>
        {task.dueDate && (
          <Text variant="secondary" size="sm">
            📅 {task.dueDate.toLocaleDateString()}
          </Text>
        )}
      </View>

      {task.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1 mb-3">
          {task.tags.map(tag => (
            <View key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              <Text variant="secondary" size="xs">#{tag}</Text>
            </View>
          ))}
        </View>
      )}
      
      <View className="flex-row items-center justify-between">
        <View className={`px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
          <Text size="sm" weight="medium">
            {task.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        
        <View className="flex-row gap-2">
          {task.status !== 'done' && (
            <>
              {task.status === 'todo' && (
                <TouchableOpacity
                  onPress={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                  className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded"
                >
                  <Text className="text-blue-700 dark:text-blue-300 text-xs">Start</Text>
                </TouchableOpacity>
              )}
              {task.status === 'in_progress' && (
                <TouchableOpacity
                  onPress={() => handleUpdateTaskStatus(task.id, 'review')}
                  className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded"
                >
                  <Text className="text-purple-700 dark:text-purple-300 text-xs">Review</Text>
                </TouchableOpacity>
              )}
              {task.status === 'review' && (
                <TouchableOpacity
                  onPress={() => handleUpdateTaskStatus(task.id, 'done')}
                  className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded"
                >
                  <Text className="text-green-700 dark:text-green-300 text-xs">Complete</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
      
      <Text variant="tertiary" size="xs" className="mt-2">
        Updated {task.updatedAt.toLocaleDateString()}
      </Text>
    </View>
  );

  const getTaskCounts = () => {
    return {
      all: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
  };

  const counts = getTaskCounts();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text variant="brand" size="2xl" weight="bold">
              ✅ Task Chat
            </Text>
            <Text variant="secondary" size="sm">
              Group ID: {groupId}
            </Text>
          </View>
          
          <View className="flex-row gap-2">
            <Button
              title="+ New Task"
              onPress={() => setShowAddTask(true)}
              variant="primary"
              size="sm"
            />
            <Button
              title="← Back"
              onPress={() => router.back()}
              variant="outline"
              size="sm"
            />
          </View>
        </View>
      </View>

      {/* Status Filter */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {[
              { key: 'all', label: 'All', count: counts.all },
              { key: 'todo', label: 'To Do', count: counts.todo },
              { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
              { key: 'review', label: 'Review', count: counts.review },
              { key: 'done', label: 'Done', count: counts.done }
            ].map(({ key, label, count }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setStatusFilter(key as any)}
                className={`px-3 py-2 rounded-full border ${
                  statusFilter === key
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Text
                  size="sm"
                  className={statusFilter === key ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}
                >
                  {label} ({count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text variant="secondary">Loading tasks...</Text>
          </View>
        ) : filteredTasks.length === 0 ? (
          <View className="items-center py-20">
            <Text size="4xl" className="mb-4">✅</Text>
            <Text variant="primary" size="lg" weight="semibold" className="mb-2">
              {statusFilter === 'all' ? 'No tasks yet' : `No ${statusFilter.replace('_', ' ')} tasks`}
            </Text>
            <Text variant="secondary" size="sm" className="text-center mb-6">
              {statusFilter === 'all' 
                ? 'Create your first task to start organizing work'
                : 'Try switching to a different status filter'
              }
            </Text>
            {statusFilter === 'all' && (
              <Button
                title="Create First Task"
                onPress={() => setShowAddTask(true)}
                variant="primary"
              />
            )}
          </View>
        ) : (
          filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </ScrollView>

      {/* Add Task Modal */}
      {showAddTask && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-50 items-center justify-center p-4">
          <View className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 max-h-[80%]">
            <ScrollView>
              <Text variant="primary" size="lg" weight="bold" className="mb-4">
                Create New Task
              </Text>
              
              <Text variant="secondary" size="sm" className="mb-2">Title:</Text>
              <TextInput
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="What needs to be done?"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
              
              <Text variant="secondary" size="sm" className="mb-2">Description (optional):</Text>
              <TextInput
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                placeholder="Additional details..."
                multiline
                numberOfLines={3}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
              
              <Text variant="secondary" size="sm" className="mb-2">Assign to:</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {mockGroupMembers.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => setNewTaskAssignee(member.id)}
                    className={`px-3 py-2 rounded-lg border ${
                      newTaskAssignee === member.id
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Text
                      size="sm"
                      className={newTaskAssignee === member.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}
                    >
                      {member.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text variant="secondary" size="sm" className="mb-2">Priority:</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {(['low', 'medium', 'high', 'urgent'] as const).map(priority => (
                  <TouchableOpacity
                    key={priority}
                    onPress={() => setNewTaskPriority(priority)}
                    className={`px-3 py-1 rounded-full border ${
                      newTaskPriority === priority
                        ? getPriorityColor(priority)
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Text
                      size="sm"
                      className={newTaskPriority === priority ? '' : 'text-gray-600 dark:text-gray-400'}
                    >
                      {priority.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View className="flex-row gap-2">
                <Button
                  title="Create Task"
                  onPress={handleAddTask}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                />
                <Button
                  title="Cancel"
                  onPress={() => setShowAddTask(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}