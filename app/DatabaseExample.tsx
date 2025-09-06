import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { List } from '@/src/shared/components/list';
import { database } from '@/src/core/storage/database';
// Note interface is imported from the database model

interface DatabaseItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function DatabaseExample() {
  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDatabaseItems();
  }, []);

  const loadDatabaseItems = async () => {
    setLoading(true);
    try {
      const notesCollection = database.get('notes');
      const notes = await notesCollection.query().fetch();
      
      const dbItems: DatabaseItem[] = notes.map((note: any) => ({
        id: note.id,
        title: note.title,
        content: note.content || '',
        createdAt: new Date(note.createdAt).toLocaleString(),
      }));
      
      setItems(dbItems);
    } catch (error) {
      console.error('Failed to load database items:', error);
      Alert.alert('Error', 'Failed to load database items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    try {
      await database.write(async () => {
        const notesCollection = database.get('notes');
        await notesCollection.create((note: any) => {
          note.title = newTitle.trim();
          note.content = newContent.trim() || 'Sample content';
          note.priority = 'medium';
          note.completed = false;
        });
      });

      await loadDatabaseItems();
      setNewTitle('');
      setNewContent('');
      setShowAddForm(false);
      
      Alert.alert('Success', 'Item saved to database');
    } catch (error) {
      console.error('Failed to save item:', error);
      Alert.alert('Error', 'Failed to save item to database');
    }
  };

  const handleDeleteItem = async (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.write(async () => {
                const note = await database.get('notes').find(id);
                await note.destroyPermanently();
              });
              
              await loadDatabaseItems();
              Alert.alert('Success', 'Item deleted from database');
            } catch (error) {
              console.error('Failed to delete item:', error);
              Alert.alert('Error', 'Failed to delete item from database');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to delete all database items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.write(async () => {
                const notesCollection = database.get('notes');
                const allNotes = await notesCollection.query().fetch();
                
                for (const note of allNotes) {
                  await note.destroyPermanently();
                }
              });
              
              setItems([]);
              Alert.alert('Success', 'All database items cleared');
            } catch (error) {
              console.error('Failed to clear items:', error);
              Alert.alert('Error', 'Failed to clear database items');
            }
          },
        },
      ]
    );
  };

  const renderDatabaseItem = (item: DatabaseItem, index: number) => (
    <View className="px-4 py-3 border-b border-border">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text variant="primary" size="base" weight="medium" className="mb-1">
            {item.title}
          </Text>
          {item.content && (
            <Text variant="secondary" size="sm" className="mb-1">
              {item.content}
            </Text>
          )}
          <Text variant="secondary" size="xs" className="opacity-60">
            Created: {item.createdAt}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteItem(item.id)}
          className="px-3 py-1 bg-red-100 rounded-md"
        >
          <Text className="text-xs text-red-700">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text variant="primary" size="2xl" weight="bold">
              Database Example
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/HomeScreen')}
              className="bg-card border border-border rounded-lg px-3 py-2"
            >
              <Text variant="secondary" size="sm">← Home</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity
              onPress={() => setShowAddForm(!showAddForm)}
              className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
            >
              <Text className="text-white font-medium">
                {showAddForm ? 'Cancel' : 'Add Item'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={loadDatabaseItems}
              disabled={loading}
              className="bg-green-600 rounded-lg px-4 py-3 items-center"
            >
              <Text className="text-white font-medium">
                {loading ? 'Loading...' : 'Refresh'}
              </Text>
            </TouchableOpacity>

            {items.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                className="bg-red-600 rounded-lg px-4 py-3 items-center"
              >
                <Text className="text-white font-medium">Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Add Form */}
          {showAddForm && (
            <View className="mb-4 bg-card rounded-lg p-4 border border-border">
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Enter item title"
                className="border border-border rounded-lg px-3 py-2 mb-3 text-foreground bg-background"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                value={newContent}
                onChangeText={setNewContent}
                placeholder="Enter content (optional)"
                multiline
                numberOfLines={3}
                className="border border-border rounded-lg px-3 py-2 mb-3 text-foreground bg-background"
                placeholderTextColor="#9CA3AF"
                textAlignVertical="top"
              />
              <TouchableOpacity
                onPress={handleAddItem}
                className="bg-green-600 rounded-lg py-2 items-center"
              >
                <Text className="text-white font-medium">Save to Database</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Database Items List */}
          <View className="bg-card rounded-lg border border-border">
            {loading ? (
              <View className="p-8 items-center">
                <Text variant="secondary">Loading database items...</Text>
              </View>
            ) : items.length === 0 ? (
              <View className="p-8 items-center">
                <Text variant="secondary">No database items found</Text>
                <Text variant="secondary" size="sm" className="mt-1">
                  Add some items to see them here
                </Text>
              </View>
            ) : (
              <List
                variant="simple"
                data={items}
                renderItem={renderDatabaseItem}
                keyExtractor={(item) => item.id}
                showSeparator={false}
                className="flex-1"
              />
            )}
          </View>

          {/* Info */}
          <View className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <Text variant="secondary" size="sm" className="text-center">
              Uses WatermelonDB for local SQLite storage
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}