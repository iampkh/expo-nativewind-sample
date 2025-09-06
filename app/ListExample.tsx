import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { List } from '@/src/shared/components/list';

interface Item {
  id: string;
  title: string;
  description?: string;
}

const initialData: Item[] = [
  { id: '1', title: 'First Item', description: 'This is the first item' },
  { id: '2', title: 'Second Item', description: 'This is the second item' },
  { id: '3', title: 'Third Item', description: 'This is the third item' },
];

export default function ListExample() {
  const [items, setItems] = useState<Item[]>(initialData);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddItem = () => {
    if (!newItemTitle.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const newItem: Item = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      description: 'New item description',
    };

    setItems([...items, newItem]);
    setNewItemTitle('');
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setItems(items.filter(item => item.id !== id));
          },
        },
      ]
    );
  };

  const renderListItem = (item: Item, index: number) => (
    <View className="px-4 py-3 border-b border-border">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text variant="primary" size="base" weight="medium">
            {item.title}
          </Text>
          {item.description && (
            <Text variant="secondary" size="sm" className="mt-1">
              {item.description}
            </Text>
          )}
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
              List Example
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/HomeScreen')}
              className="bg-card border border-border rounded-lg px-3 py-2"
            >
              <Text variant="secondary" size="sm">← Home</Text>
            </TouchableOpacity>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            onPress={() => setShowAddForm(!showAddForm)}
            className="mb-4 bg-blue-600 rounded-lg py-3 items-center"
          >
            <Text className="text-white font-medium">
              {showAddForm ? 'Cancel' : 'Add Item'}
            </Text>
          </TouchableOpacity>

          {/* Add Form */}
          {showAddForm && (
            <View className="mb-4 bg-card rounded-lg p-4 border border-border">
              <TextInput
                value={newItemTitle}
                onChangeText={setNewItemTitle}
                placeholder="Enter item title"
                className="border border-border rounded-lg px-3 py-2 mb-3 text-foreground bg-background"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={handleAddItem}
                className="bg-green-600 rounded-lg py-2 items-center"
              >
                <Text className="text-white font-medium">Add Item</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* List */}
          <View className="bg-card rounded-lg border border-border">
            <List
              variant="simple"
              data={items}
              renderItem={renderListItem}
              keyExtractor={(item) => item.id}
              showSeparator={false}
              className="flex-1"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}