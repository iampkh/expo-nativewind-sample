import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { View, Text, Button } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { List } from '@/src/shared/components/list';
import { useTheme } from '@/src/shared/hooks/useTheme';

interface ThemeItem {
  id: string;
  title: string;
  description: string;
}

const themeData: ThemeItem[] = [
  { id: '1', title: 'Primary Theme', description: 'Main theme colors' },
  { id: '2', title: 'Secondary Theme', description: 'Secondary colors' },
  { id: '3', title: 'Success Theme', description: 'Success indicators' },
  { id: '4', title: 'Warning Theme', description: 'Warning indicators' },
  { id: '5', title: 'Error Theme', description: 'Error indicators' },
];

export default function ThemeExample() {
  const { currentTheme, setTheme } = useTheme();
  const [selectedVariant, setSelectedVariant] = useState<'primary' | 'secondary' | 'outline'>('primary');

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const renderThemeItem = (item: ThemeItem, index: number) => (
    <View className="px-4 py-3 border-b border-border">
      <Text variant="primary" size="base" weight="medium" className="mb-1">
        {item.title}
      </Text>
      <Text variant="secondary" size="sm">
        {item.description}
      </Text>
    </View>
  );

  const renderGridItem = (item: ThemeItem, index: number) => (
    <TouchableOpacity
      onPress={() => Alert.alert('Theme Item', `Selected: ${item.title}`)}
      className="bg-card rounded-lg p-3 border border-border items-center"
    >
      <Text variant="primary" size="sm" weight="medium" className="text-center">
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
              Theme Example
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/HomeScreen')}
              className="bg-card border border-border rounded-lg px-3 py-2"
            >
              <Text variant="secondary" size="sm">← Home</Text>
            </TouchableOpacity>
          </View>

          {/* Theme Toggle */}
          <View className="mb-6">
            <Text variant="primary" size="lg" weight="semibold" className="mb-3">
              Current Theme: {currentTheme}
            </Text>
            <TouchableOpacity
              onPress={toggleTheme}
              className="bg-blue-600 rounded-lg py-3 items-center"
            >
              <Text className="text-white font-medium">
                Switch to {currentTheme === 'dark' ? 'Light' : 'Dark'} Theme
              </Text>
            </TouchableOpacity>
          </View>

          {/* Themed Buttons */}
          <View className="mb-6">
            <Text variant="primary" size="lg" weight="semibold" className="mb-3">
              Themed Buttons
            </Text>
            <View className="gap-3">
              <Button
                title="Primary Button"
                variant="primary"
                size="md"
                onPress={() => Alert.alert('Button', 'Primary button pressed')}
              />
              <Button
                title="Secondary Button"
                variant="secondary"
                size="md"
                onPress={() => Alert.alert('Button', 'Secondary button pressed')}
              />
              <Button
                title="Outline Button"
                variant="outline"
                size="md"
                onPress={() => Alert.alert('Button', 'Outline button pressed')}
              />
              
              {/* Different Sizes */}
              <View className="flex-row gap-2 mt-2">
                <Button
                  title="Small"
                  variant="primary"
                  size="sm"
                  onPress={() => Alert.alert('Size', 'Small button')}
                />
                <Button
                  title="Medium"
                  variant="primary"
                  size="md"
                  onPress={() => Alert.alert('Size', 'Medium button')}
                />
                <Button
                  title="Large"
                  variant="primary"
                  size="lg"
                  onPress={() => Alert.alert('Size', 'Large button')}
                />
              </View>
            </View>
          </View>

          {/* Themed List */}
          <View className="mb-6">
            <Text variant="primary" size="lg" weight="semibold" className="mb-3">
              Themed List
            </Text>
            <View className="bg-card rounded-lg border border-border">
              <List
                variant="simple"
                data={themeData}
                renderItem={renderThemeItem}
                keyExtractor={(item) => item.id}
                showSeparator={false}
                className="flex-1"
              />
            </View>
          </View>

          {/* Themed Grid */}
          <View className="mb-6">
            <Text variant="primary" size="lg" weight="semibold" className="mb-3">
              Themed Grid
            </Text>
            <List
              variant="grid"
              data={themeData}
              columns={2}
              keyExtractor={(item) => item.id}
              renderItem={renderGridItem}
              itemSpacing="gap-3"
              rowSpacing="gap-3"
              className="flex-1"
            />
          </View>

          {/* Themed Borders & Containers */}
          <View className="mb-6">
            <Text variant="primary" size="lg" weight="semibold" className="mb-3">
              Themed Borders & Containers
            </Text>
            
            <View className="gap-3">
              {/* Card Container */}
              <View variant="card" padding="md" borderRadius="lg" className="border border-border">
                <Text variant="primary" size="base" weight="medium" className="mb-2">
                  Card Container
                </Text>
                <Text variant="secondary" size="sm">
                  This is a themed card container with proper background and borders
                </Text>
              </View>

              {/* Different Border Styles */}
              <View className="bg-card rounded-lg border-2 border-blue-200 dark:border-blue-700 p-4">
                <Text variant="primary" size="base" weight="medium" className="mb-1">
                  Blue Border
                </Text>
                <Text variant="secondary" size="sm">
                  Container with blue themed border
                </Text>
              </View>

              <View className="bg-card rounded-lg border-2 border-green-200 dark:border-green-700 p-4">
                <Text variant="primary" size="base" weight="medium" className="mb-1">
                  Green Border
                </Text>
                <Text variant="secondary" size="sm">
                  Container with green themed border
                </Text>
              </View>

              <View className="bg-card rounded-lg border-2 border-red-200 dark:border-red-700 p-4">
                <Text variant="primary" size="base" weight="medium" className="mb-1">
                  Red Border
                </Text>
                <Text variant="secondary" size="sm">
                  Container with red themed border
                </Text>
              </View>
            </View>
          </View>

          {/* Text Variants */}
          <View className="mb-6">
            <Text variant="primary" size="lg" weight="semibold" className="mb-3">
              Text Variants
            </Text>
            
            <View className="bg-card rounded-lg border border-border p-4 gap-2">
              <Text variant="primary" size="xl" weight="bold">
                Primary Text (XL, Bold)
              </Text>
              <Text variant="secondary" size="lg" weight="semibold">
                Secondary Text (LG, Semibold)
              </Text>
              <Text variant="tertiary" size="base" weight="medium">
                Tertiary Text (Base, Medium)
              </Text>
              <Text variant="brand" size="sm" weight="normal">
                Brand Text (SM, Normal)
              </Text>
              <Text variant="tertiary" size="xs" weight="light">
                Tertiary Text (XS, Light)
              </Text>
            </View>
          </View>

          {/* Theme Colors Reference */}
          <View className="mb-6">
            <Text variant="primary" size="lg" weight="semibold" className="mb-3">
              Theme Colors
            </Text>
            
            <View className="bg-card rounded-lg border border-border p-4">
              <View className="grid grid-cols-2 gap-3">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 bg-background border border-border rounded mr-3" />
                  <Text variant="secondary" size="sm">Background</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-4 h-4 bg-card border border-border rounded mr-3" />
                  <Text variant="secondary" size="sm">Card</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-4 h-4 bg-primary rounded mr-3" />
                  <Text variant="secondary" size="sm">Primary</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-4 h-4 bg-blue-600 rounded mr-3" />
                  <Text variant="secondary" size="sm">Blue</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}