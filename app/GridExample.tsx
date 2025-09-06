import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { List } from '@/src/shared/components/list';

interface Item {
  id: string;
  title: string;
}

const sampleData: Item[] = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
  { id: '4', title: 'Item 4' },
  { id: '5', title: 'Item 5' },
  { id: '6', title: 'Item 6' },
  { id: '7', title: 'Item 7' },
  { id: '8', title: 'Item 8' },
  { id: '9', title: 'Item 9' },
  { id: '10', title: 'Item 10' },
];

export default function GridExample() {
  const [columns, setColumns] = useState(2);

  const renderGridItem = (item: Item, index: number) => (
    <TouchableOpacity
      onPress={() => Alert.alert('Pressed', `You tapped ${item.title}`)}
      className="bg-card rounded-lg p-4 border border-border items-center"
    >
      <Text variant="primary" size="lg" weight="medium">
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text variant="primary" size="2xl" weight="bold">
              Grid Example
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/HomeScreen')}
              className="bg-card border border-border rounded-lg px-3 py-2"
            >
              <Text variant="secondary" size="sm">← Home</Text>
            </TouchableOpacity>
          </View>

          {/* Column Selector */}
          <View className="mb-6">
            <Text variant="secondary" size="sm" className="mb-3">
              Columns: {columns}
            </Text>
            <View className="flex-row gap-2">
              {[2, 3, 4].map((col) => (
                <TouchableOpacity
                  key={col}
                  onPress={() => setColumns(col)}
                  className={`px-4 py-2 rounded-lg ${
                    columns === col 
                      ? 'bg-blue-600' 
                      : 'bg-card border border-border'
                  }`}
                >
                  <Text className={`font-medium ${
                    columns === col ? 'text-white' : 'text-foreground'
                  }`}>
                    {col}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Grid */}
          <List
            variant="grid"
            data={sampleData}
            columns={columns}
            keyExtractor={(item) => item.id}
            renderItem={renderGridItem}
            className="flex-1"
            itemSpacing="gap-3"
            rowSpacing="gap-3"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}