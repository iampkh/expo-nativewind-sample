import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { List } from '@/src/components/list';
import { Button } from '@/src/components/themed';

// Sample data types
interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

// Sample data
const sampleUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', department: 'Engineering', role: 'Developer', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', department: 'Engineering', role: 'Senior Developer', status: 'active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', department: 'Design', role: 'UI Designer', status: 'inactive' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', department: 'Design', role: 'UX Designer', status: 'active' },
  { id: '5', name: 'David Brown', email: 'david@example.com', department: 'Engineering', role: 'DevOps', status: 'active' },
  { id: '6', name: 'Lisa Garcia', email: 'lisa@example.com', department: 'Marketing', role: 'Product Manager', status: 'active' },
];

const sampleProducts: Product[] = [
  { id: '1', name: 'MacBook Pro', category: 'Laptops', price: 1999, inStock: true },
  { id: '2', name: 'iPhone 15', category: 'Smartphones', price: 999, inStock: true },
  { id: '3', name: 'iPad Air', category: 'Tablets', price: 599, inStock: false },
  { id: '4', name: 'Dell XPS 13', category: 'Laptops', price: 1299, inStock: true },
  { id: '5', name: 'Samsung Galaxy S24', category: 'Smartphones', price: 899, inStock: true },
  { id: '6', name: 'Microsoft Surface', category: 'Tablets', price: 799, inStock: false },
];

export default function ListExample() {
  const [currentExample, setCurrentExample] = useState<'simple-users' | 'grouped-users' | 'simple-products' | 'grouped-products'>('simple-users');

  // Render functions for different item types
  const renderUserItem = (user: User, index: number) => (
    <View className="px-4 py-3 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900 dark:text-white">
          {user.name}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {user.email} • {user.role}
        </Text>
      </View>
      <View className={`px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
        <Text className={`text-xs ${user.status === 'active' ? 'text-green-800' : 'text-gray-800'}`}>
          {user.status}
        </Text>
      </View>
    </View>
  );

  const renderProductItem = (product: Product, index: number) => (
    <View className="px-4 py-3 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900 dark:text-white">
          {product.name}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          ${product.price.toLocaleString()}
        </Text>
      </View>
      <View className={`px-2 py-1 rounded-full ${product.inStock ? 'bg-blue-100' : 'bg-red-100'}`}>
        <Text className={`text-xs ${product.inStock ? 'text-blue-800' : 'text-red-800'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </Text>
      </View>
    </View>
  );

  // Group header render functions
  const renderDepartmentHeader = (department: string, users: User[]) => (
    <View className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        {department} ({users.length} {users.length === 1 ? 'person' : 'people'})
      </Text>
    </View>
  );

  const renderCategoryHeader = (category: string, products: Product[]) => (
    <View className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
      <Text className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
        {category} ({products.length} {products.length === 1 ? 'item' : 'items'})
      </Text>
    </View>
  );

  const renderCurrentList = () => {
    switch (currentExample) {
      case 'simple-users':
        return (
          <List
            variant="simple"
            data={sampleUsers}
            renderItem={renderUserItem}
            keyExtractor={(user) => user.id}
            showSeparator={true}
            className="flex-1"
            contentContainerClassName="bg-white dark:bg-gray-900 rounded-lg shadow-sm"
          />
        );

      case 'grouped-users':
        return (
          <List
            variant="grouped"
            data={sampleUsers}
            renderItem={renderUserItem}
            keyExtractor={(user) => user.id}
            groupBy={(user) => user.department}
            renderGroupHeader={renderDepartmentHeader}
            showSeparator={true}
            className="flex-1"
            contentContainerClassName="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden"
          />
        );

      case 'simple-products':
        return (
          <List
            variant="simple"
            data={sampleProducts}
            renderItem={renderProductItem}
            keyExtractor={(product) => product.id}
            showSeparator={true}
            className="flex-1"
            contentContainerClassName="bg-white dark:bg-gray-900 rounded-lg shadow-sm"
          />
        );

      case 'grouped-products':
        return (
          <List
            variant="grouped"
            data={sampleProducts}
            renderItem={renderProductItem}
            keyExtractor={(product) => product.id}
            groupBy={(product) => product.category}
            renderGroupHeader={renderCategoryHeader}
            showSeparator={true}
            className="flex-1"
            contentContainerClassName="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden"
          />
        );
    }
  };

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Example selector buttons */}
      <View className="p-4">
        <View className="flex-row flex-wrap gap-2 mb-4">
          <Button
            title="Simple Users"
            variant={currentExample === 'simple-users' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setCurrentExample('simple-users')}
          />
          <Button
            title="Grouped Users"
            variant={currentExample === 'grouped-users' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setCurrentExample('grouped-users')}
          />
          <Button
            title="Simple Products"
            variant={currentExample === 'simple-products' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setCurrentExample('simple-products')}
          />
          <Button
            title="Grouped Products"
            variant={currentExample === 'grouped-products' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setCurrentExample('grouped-products')}
          />
        </View>

        {/* Current example description */}
        <View className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Text className="text-sm text-blue-800 dark:text-blue-200">
            {currentExample === 'simple-users' && 'Simple list of users without grouping'}
            {currentExample === 'grouped-users' && 'Users grouped by department with custom headers'}
            {currentExample === 'simple-products' && 'Simple list of products without grouping'}
            {currentExample === 'grouped-products' && 'Products grouped by category with custom headers'}
          </Text>
        </View>

        {/* List container */}
        <View className="flex-1">
          {renderCurrentList()}
        </View>
      </View>
    </View>
  );
}