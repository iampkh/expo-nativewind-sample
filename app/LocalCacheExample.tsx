import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { List } from '@/src/shared/components/list';
import { localCache } from '@/src/core/storage/cache/LocalCache';

interface CacheItem {
  key: string;
  value: string;
  timestamp: string;
}

export default function LocalCacheExample() {
  const [cacheItems, setCacheItems] = useState<CacheItem[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCacheItems();
  }, []);

  const loadCacheItems = async () => {
    setLoading(true);
    try {
      // Get all keys that start with our prefix
      const keys = await localCache.getAllKeys();
      const exampleKeys = keys.filter((key: string) => key.startsWith('example_'));
      
      const items: CacheItem[] = [];
      for (const key of exampleKeys) {
        const value = await localCache.getItem(key);
        if (value) {
          items.push({
            key: key.replace('example_', ''),
            value: typeof value === 'string' ? value : JSON.stringify(value),
            timestamp: new Date().toLocaleString(),
          });
        }
      }
      setCacheItems(items);
    } catch (error) {
      Alert.alert('Error', 'Failed to load cache items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newKey.trim() || !newValue.trim()) {
      Alert.alert('Error', 'Please enter both key and value');
      return;
    }

    try {
      await localCache.setItem(`example_${newKey.trim()}`, newValue.trim());
      
      const newItem: CacheItem = {
        key: newKey.trim(),
        value: newValue.trim(),
        timestamp: new Date().toLocaleString(),
      };

      setCacheItems([...cacheItems, newItem]);
      setNewKey('');
      setNewValue('');
      setShowAddForm(false);
      
      Alert.alert('Success', 'Item saved to cache');
    } catch (error) {
      Alert.alert('Error', 'Failed to save item to cache');
    }
  };

  const handleDeleteItem = async (key: string) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${key}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await localCache.removeItem(`example_${key}`);
              setCacheItems(cacheItems.filter(item => item.key !== key));
              Alert.alert('Success', 'Item deleted from cache');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item from cache');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all cache items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const item of cacheItems) {
                await localCache.removeItem(`example_${item.key}`);
              }
              setCacheItems([]);
              Alert.alert('Success', 'All cache items cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache items');
            }
          },
        },
      ]
    );
  };

  const renderCacheItem = (item: CacheItem, index: number) => (
    <View className="px-4 py-3 border-b border-border">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text variant="primary" size="base" weight="medium" className="mb-1">
            Key: {item.key}
          </Text>
          <Text variant="secondary" size="sm" className="mb-1">
            Value: {item.value}
          </Text>
          <Text variant="secondary" size="xs" className="opacity-60">
            {item.timestamp}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteItem(item.key)}
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
              Local Cache
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
              onPress={loadCacheItems}
              disabled={loading}
              className="bg-green-600 rounded-lg px-4 py-3 items-center"
            >
              <Text className="text-white font-medium">
                {loading ? 'Loading...' : 'Refresh'}
              </Text>
            </TouchableOpacity>

            {cacheItems.length > 0 && (
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
                value={newKey}
                onChangeText={setNewKey}
                placeholder="Enter cache key"
                className="border border-border rounded-lg px-3 py-2 mb-3 text-foreground bg-background"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                value={newValue}
                onChangeText={setNewValue}
                placeholder="Enter cache value"
                className="border border-border rounded-lg px-3 py-2 mb-3 text-foreground bg-background"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={handleAddItem}
                className="bg-green-600 rounded-lg py-2 items-center"
              >
                <Text className="text-white font-medium">Save to Cache</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cache Items List */}
          <View className="bg-card rounded-lg border border-border">
            {loading ? (
              <View className="p-8 items-center">
                <Text variant="secondary">Loading cache items...</Text>
              </View>
            ) : cacheItems.length === 0 ? (
              <View className="p-8 items-center">
                <Text variant="secondary">No cache items found</Text>
                <Text variant="secondary" size="sm" className="mt-1">
                  Add some items to see them here
                </Text>
              </View>
            ) : (
              <List
                variant="simple"
                data={cacheItems}
                renderItem={renderCacheItem}
                keyExtractor={(item) => item.key}
                showSeparator={false}
                className="flex-1"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}