import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { View, Text, Button } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { List } from '@/src/shared/components/list';

// Sample data for different grid examples
interface DashboardCard {
  id: string;
  title: string;
  value: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
  description: string;
}

const dashboardData: DashboardCard[] = [
  { id: '1', title: 'Total Users', value: '1,234', icon: '👥', trend: 'up', color: 'bg-blue-500' },
  { id: '2', title: 'Revenue', value: '$45,678', icon: '💰', trend: 'up', color: 'bg-green-500' },
  { id: '3', title: 'Orders', value: '856', icon: '📦', trend: 'down', color: 'bg-orange-500' },
  { id: '4', title: 'Growth', value: '12.5%', icon: '📈', trend: 'up', color: 'bg-purple-500' },
  { id: '5', title: 'Support', value: '45', icon: '🎧', trend: 'neutral', color: 'bg-pink-500' },
  { id: '6', title: 'Reviews', value: '4.8', icon: '⭐', trend: 'up', color: 'bg-yellow-500' },
];

const products: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 199, category: 'Electronics', rating: 4.5, inStock: true },
  { id: '2', name: 'Smart Watch', price: 299, category: 'Electronics', rating: 4.8, inStock: true },
  { id: '3', name: 'Coffee Maker', price: 89, category: 'Appliances', rating: 4.2, inStock: false },
  { id: '4', name: 'Running Shoes', price: 129, category: 'Sports', rating: 4.6, inStock: true },
  { id: '5', name: 'Book Set', price: 45, category: 'Books', rating: 4.9, inStock: true },
  { id: '6', name: 'Yoga Mat', price: 35, category: 'Sports', rating: 4.3, inStock: true },
  { id: '7', name: 'Bluetooth Speaker', price: 79, category: 'Electronics', rating: 4.4, inStock: true },
  { id: '8', name: 'Desk Lamp', price: 65, category: 'Home', rating: 4.1, inStock: false },
];

const categories: Category[] = [
  { id: '1', name: 'Electronics', count: 245, color: 'bg-blue-500', description: 'Latest gadgets & devices' },
  { id: '2', name: 'Fashion', count: 189, color: 'bg-purple-500', description: 'Trendy clothing & accessories' },
  { id: '3', name: 'Books', count: 156, color: 'bg-green-500', description: 'Educational & entertainment' },
  { id: '4', name: 'Sports', count: 98, color: 'bg-orange-500', description: 'Fitness & outdoor gear' },
  { id: '5', name: 'Home', count: 134, color: 'bg-pink-500', description: 'Furniture & home decor' },
  { id: '6', name: 'Health', count: 67, color: 'bg-teal-500', description: 'Wellness & healthcare' },
];

type GridType = 'dashboard' | 'products' | 'categories';

export default function GridExample() {
  const [currentGrid, setCurrentGrid] = useState<GridType>('dashboard');
  const [columns, setColumns] = useState(2);

  const renderDashboardCard = (card: DashboardCard, index: number) => (
    <TouchableOpacity
      onPress={() => Alert.alert('Card Pressed', `You tapped on ${card.title}`)}
      className="bg-card rounded-2xl p-4 border border-border shadow-sm"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className={`w-10 h-10 ${card.color} rounded-xl items-center justify-center`}>
          <Text className="text-white text-lg">{card.icon}</Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${
          card.trend === 'up' ? 'bg-green-100' : 
          card.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-medium ${
            card.trend === 'up' ? 'text-green-700' : 
            card.trend === 'down' ? 'text-red-700' : 'text-gray-700'
          }`}>
            {card.trend === 'up' ? '↗' : card.trend === 'down' ? '↘' : '→'}
          </Text>
        </View>
      </View>
      <Text variant="secondary" size="sm" className="mb-1">
        {card.title}
      </Text>
      <Text variant="primary" size="xl" weight="bold">
        {card.value}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = (product: Product, index: number) => (
    <TouchableOpacity
      onPress={() => Alert.alert('Product', `${product.name} - $${product.price}`)}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      <View className="aspect-square bg-gray-100 dark:bg-gray-700 items-center justify-center">
        <Text className="text-4xl">📱</Text>
      </View>
      <View className="p-3">
        <View className="flex-row items-start justify-between mb-2">
          <Text variant="primary" size="sm" weight="medium" className="flex-1 mr-2" numberOfLines={2}>
            {product.name}
          </Text>
          <View className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
        </View>
        <Text variant="secondary" size="xs" className="mb-2">
          {product.category}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text variant="primary" size="lg" weight="bold" className="text-blue-600">
            ${product.price}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-yellow-500 mr-1">⭐</Text>
            <Text variant="secondary" size="xs">
              {product.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryCard = (category: Category, index: number) => (
    <TouchableOpacity
      onPress={() => Alert.alert('Category', `${category.name} - ${category.count} items`)}
      className="bg-card rounded-2xl p-4 border border-border shadow-sm"
    >
      <View className={`w-12 h-12 ${category.color} rounded-xl mb-3 items-center justify-center`}>
        <Text className="text-white text-xl">📁</Text>
      </View>
      <Text variant="primary" size="lg" weight="bold" className="mb-1">
        {category.name}
      </Text>
      <Text variant="secondary" size="sm" className="mb-2">
        {category.description}
      </Text>
      <Text variant="secondary" size="xs" className="text-blue-600 font-medium">
        {category.count} items
      </Text>
    </TouchableOpacity>
  );

  const getCurrentData = () => {
    switch (currentGrid) {
      case 'dashboard':
        return { data: dashboardData, renderItem: renderDashboardCard, title: 'Dashboard Cards' };
      case 'products':
        return { data: products, renderItem: renderProductCard, title: 'Product Grid' };
      case 'categories':
        return { data: categories, renderItem: renderCategoryCard, title: 'Category Grid' };
      default:
        return { data: dashboardData, renderItem: renderDashboardCard, title: 'Dashboard Cards' };
    }
  };

  const { data, renderItem, title } = getCurrentData();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-6 border-b border-border">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text variant="primary" size="2xl" weight="bold">
                Grid Examples
              </Text>
              <Text variant="secondary" size="sm">
                Showcase of different grid layouts
              </Text>
            </View>
            <Button
              title="Back"
              variant="outline"
              size="sm"
              onPress={() => router.back()}
            />
          </View>

          {/* Grid Type Selector */}
          <Text variant="secondary" size="sm" className="mb-3">
            Grid Type:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-2">
              {[
                { key: 'dashboard' as GridType, label: 'Dashboard', icon: '📊' },
                { key: 'products' as GridType, label: 'Products', icon: '🛍️' },
                { key: 'categories' as GridType, label: 'Categories', icon: '📂' },
              ].map((type) => (
                <TouchableOpacity
                  key={type.key}
                  onPress={() => setCurrentGrid(type.key)}
                  className={`flex-row items-center px-4 py-2 rounded-xl ${
                    currentGrid === type.key 
                      ? 'bg-blue-600' 
                      : 'bg-card border border-border'
                  }`}
                >
                  <Text className="mr-2">{type.icon}</Text>
                  <Text className={`font-medium ${
                    currentGrid === type.key 
                      ? 'text-white' 
                      : 'text-foreground'
                  }`}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Column Selector */}
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

        {/* Grid Content */}
        <View className="p-4">
          <Text variant="primary" size="lg" weight="semibold" className="mb-4">
            {title} ({data.length} items)
          </Text>

          <List
            variant="grid"
            data={data}
            columns={columns}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            className="flex-1"
            itemSpacing="gap-3"
            rowSpacing="gap-4"
          />
        </View>

        {/* Info Section */}
        <View className="mx-4 mb-6 p-4 bg-card rounded-2xl border border-border">
          <Text variant="primary" size="base" weight="semibold" className="mb-2">
            💡 Grid Features
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Text className="text-green-600 mr-2">✓</Text>
              <Text variant="secondary" size="sm" className="flex-1">
                Customizable column count (2, 3, 4+)
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-green-600 mr-2">✓</Text>
              <Text variant="secondary" size="sm" className="flex-1">
                Theme-aware styling with dark/light mode
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-green-600 mr-2">✓</Text>
              <Text variant="secondary" size="sm" className="flex-1">
                Flexible spacing and responsive layout
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-green-600 mr-2">✓</Text>
              <Text variant="secondary" size="sm" className="flex-1">
                Consistent with other list variants
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}