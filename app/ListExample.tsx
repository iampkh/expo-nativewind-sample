import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { List } from '@/src/components/list';
import { Button } from '@/src/components/themed';
import { useAppDispatch, useAppSelector, store } from '@/src/store';
import { selectFilteredTodos, selectLoading, selectError, selectFilter } from '@/src/redux/store/simpleTodoSlice';
import { Todo, TodoStatus } from '@/src/storage/TodoStorage';
import { todoRegistry } from '@/src/redux/registry/todoRegistry';
import { TodoScreenUseCase } from '@/src/useCases/TodoScreenUseCase';

export default function TodoScreen() {
  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectFilteredTodos);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const currentFilter = useAppSelector(selectFilter);
  
  // Todo form state
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Use case instance
  const todoScreenUseCaseRef = useRef<TodoScreenUseCase | null>(null);
  
  // Initialize use case
  useEffect(() => {
    const useCase = todoRegistry.getTodoScreenUseCase(dispatch, store.getState);
    todoScreenUseCaseRef.current = useCase;
    
    // Initialize screen
    useCase.initialize();
    
    return () => {
      useCase.cleanup();
    };
  }, [dispatch]);

  // Handle creating a new todo
  const handleCreateTodo = async () => {
    if (!newTodoTitle.trim()) {
      Alert.alert('Error', 'Please enter a todo title');
      return;
    }

    const todoData = {
      title: newTodoTitle.trim(),
      description: newTodoDescription.trim(),
      date: new Date().toISOString().split('T')[0], // Current date
      status: TodoStatus.open,
    };

    try {
      const result = await todoScreenUseCaseRef.current?.execute('createTodo', todoData);
      if (result?.success) {
        setNewTodoTitle('');
        setNewTodoDescription('');
        setShowAddForm(false);
        Alert.alert('Success', 'Todo created successfully!');
      } else {
        Alert.alert('Error', result?.error || 'Failed to create todo');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create todo');
    }
  };

  // Handle status change
  const handleStatusChange = async (todoId: string, newStatus: TodoStatus) => {
    try {
      const result = await todoScreenUseCaseRef.current?.execute('updateStatus', todoId, newStatus);
      if (!result?.success) {
        Alert.alert('Error', result?.error || 'Failed to update todo status');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo status');
    }
  };

  // Handle delete todo
  const handleDeleteTodo = async (todoId: string) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await todoScreenUseCaseRef.current?.execute('deleteTodo', todoId);
              if (result?.success) {
                Alert.alert('Success', 'Todo deleted successfully!');
              } else {
                Alert.alert('Error', result?.error || 'Failed to delete todo');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete todo');
            }
          },
        },
      ]
    );
  };

  // Handle filter change
  const handleFilterChange = (filter: 'all' | 'open' | 'started' | 'completed') => {
    todoScreenUseCaseRef.current?.execute('setFilter', filter);
  };

  // Handle refresh
  const handleRefresh = () => {
    todoScreenUseCaseRef.current?.execute('loadTodos', { refresh: true });
  };

  // Get todo stats
  const stats = todoScreenUseCaseRef.current?.getTodosStats() || {
    total: 0,
    open: 0,
    started: 0,
    completed: 0,
  };

  // Render todo item
  const renderTodoItem = (todo: Todo, index: number) => (
    <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 pr-3">
          <Text className="text-base font-medium text-gray-900 dark:text-white">
            {todo.title}
          </Text>
          {todo.description && (
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {todo.description}
            </Text>
          )}
          <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {new Date(todo.date).toLocaleDateString()}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => handleDeleteTodo(todo.id)}
          className="px-2 py-1 bg-red-100 rounded-md"
        >
          <Text className="text-xs text-red-700">Delete</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => handleStatusChange(todo.id, TodoStatus.open)}
          className={`px-3 py-1 rounded-full ${
            todo.status === TodoStatus.open ? 'bg-gray-200' : 'bg-gray-100'
          }`}
        >
          <Text className={`text-xs ${
            todo.status === TodoStatus.open ? 'text-gray-800 font-medium' : 'text-gray-600'
          }`}>
            Open
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleStatusChange(todo.id, TodoStatus.started)}
          className={`px-3 py-1 rounded-full ${
            todo.status === TodoStatus.started ? 'bg-blue-200' : 'bg-gray-100'
          }`}
        >
          <Text className={`text-xs ${
            todo.status === TodoStatus.started ? 'text-blue-800 font-medium' : 'text-gray-600'
          }`}>
            Started
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleStatusChange(todo.id, TodoStatus.completed)}
          className={`px-3 py-1 rounded-full ${
            todo.status === TodoStatus.completed ? 'bg-green-200' : 'bg-gray-100'
          }`}
        >
          <Text className={`text-xs ${
            todo.status === TodoStatus.completed ? 'text-green-800 font-medium' : 'text-gray-600'
          }`}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Todo Manager
          </Text>
          
          {/* Stats */}
          <View className="flex-row gap-4 mb-4">
            <View className="items-center">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">Total</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-gray-600 dark:text-gray-300">{stats.open}</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">Open</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.started}</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">Started</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-green-600 dark:text-green-400">{stats.completed}</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">Completed</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity
              onPress={() => setShowAddForm(!showAddForm)}
              className="flex-1 bg-green-600 rounded-lg px-4 py-2 flex-row items-center justify-center"
            >
              <Text className="text-white font-medium mr-2">
                {showAddForm ? 'Hide Form' : 'Add Todo'}
              </Text>
              <Text className="text-white text-lg">{showAddForm ? '−' : '+'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleRefresh}
              className="bg-blue-600 rounded-lg px-4 py-2"
            >
              <Text className="text-white font-medium">Refresh</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Buttons */}
          <View className="flex-row gap-2">
            {(['all', 'open', 'started', 'completed'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => handleFilterChange(filter)}
                className={`px-3 py-1 rounded-full ${
                  currentFilter === filter 
                    ? 'bg-blue-600' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <Text className={`text-sm capitalize ${
                  currentFilter === filter 
                    ? 'text-white font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Todo Form */}
        {showAddForm && (
          <View className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Add New Todo
            </Text>
            
            <TextInput
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
              placeholder="Todo title *"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              placeholderTextColor="#9CA3AF"
            />
            
            <TextInput
              value={newTodoDescription}
              onChangeText={setNewTodoDescription}
              placeholder="Description (optional)"
              multiline
              numberOfLines={3}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
            
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleCreateTodo}
                disabled={loading}
                className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-medium">
                  {loading ? 'Creating...' : 'Create Todo'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  setShowAddForm(false);
                  setNewTodoTitle('');
                  setNewTodoDescription('');
                }}
                className="px-4 bg-gray-200 dark:bg-gray-600 rounded-lg py-3 items-center"
              >
                <Text className="text-gray-700 dark:text-gray-300 font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Todo List */}
        <View className="flex-1 bg-white dark:bg-gray-900">
          {loading && todos.length === 0 ? (
            <View className="flex-1 items-center justify-center p-8">
              <Text className="text-gray-600 dark:text-gray-400">Loading todos...</Text>
            </View>
          ) : todos.length === 0 ? (
            <View className="flex-1 items-center justify-center p-8">
              <Text className="text-gray-600 dark:text-gray-400 mb-4">No todos yet</Text>
              <TouchableOpacity
                onPress={() => setShowAddForm(true)}
                className="bg-blue-600 rounded-lg px-4 py-2"
              >
                <Text className="text-white font-medium">Add First Todo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <List
              variant="simple"
              data={todos}
              renderItem={renderTodoItem}
              keyExtractor={(todo) => todo.id}
              showSeparator={false}
              className="flex-1"
              contentContainerClassName="bg-white dark:bg-gray-900"
            />
          )}

          {error && (
            <View className="p-4 bg-red-50 dark:bg-red-900/20">
              <Text className="text-red-700 dark:text-red-300">{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}