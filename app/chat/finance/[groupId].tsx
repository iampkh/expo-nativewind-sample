/**
 * Finance Chat Screen
 * 
 * Shows expense sharing and finance tracking for a specific group ID
 * Retrieves data from collaboration database using repository pattern
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, Button } from '@/src/shared/components/themed';
import { useTheme } from '@/src/shared/hooks/useTheme';

// Mock finance data structures
interface FinanceExpense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  category: 'food' | 'travel' | 'entertainment' | 'utilities' | 'other';
  groupId: string;
  createdAt: Date;
  settled: boolean;
}

interface FinanceBalance {
  userId: string;
  userName: string;
  owes: number; // positive if they owe money, negative if they are owed
}

export default function FinanceChatScreen() {
  const { groupId } = useLocalSearchParams();
  const { currentTheme } = useTheme();
  const [expenses, setExpenses] = useState<FinanceExpense[]>([]);
  const [balances, setBalances] = useState<FinanceBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  // New expense form
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<FinanceExpense['category']>('other');
  
  // Mock user data
  const mockUser = { id: 'sample_user', name: 'Sample User' };
  const mockGroupMembers = [
    { id: 'sample_user', name: 'Sample User' },
    { id: 'user_2', name: 'John Doe' },
    { id: 'user_3', name: 'Jane Smith' },
    { id: 'user_4', name: 'Bob Johnson' }
  ];

  useEffect(() => {
    loadFinanceDataForGroup();
  }, [groupId]);

  const loadFinanceDataForGroup = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual repository call
      // const financeRepository = new FinanceRepository();
      // const result = await financeRepository.getExpensesByGroupId(groupId as string);
      
      // Mock data for demonstration
      const mockExpenses: FinanceExpense[] = [
        {
          id: '1',
          description: 'Team lunch at Pizza Palace',
          amount: 85.50,
          paidBy: 'user_2',
          splitBetween: ['sample_user', 'user_2', 'user_3'],
          category: 'food',
          groupId: groupId as string,
          createdAt: new Date('2023-12-01'),
          settled: false
        },
        {
          id: '2',
          description: 'Uber ride to conference',
          amount: 32.00,
          paidBy: 'sample_user',
          splitBetween: ['sample_user', 'user_2', 'user_4'],
          category: 'travel',
          groupId: groupId as string,
          createdAt: new Date('2023-12-03'),
          settled: false
        },
        {
          id: '3',
          description: 'Coffee for morning meeting',
          amount: 18.75,
          paidBy: 'user_3',
          splitBetween: ['sample_user', 'user_3', 'user_4'],
          category: 'food',
          groupId: groupId as string,
          createdAt: new Date('2023-12-05'),
          settled: true
        }
      ];
      
      setExpenses(mockExpenses);
      calculateBalances(mockExpenses);
    } catch (error) {
      Alert.alert('Error', 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const calculateBalances = (expenseList: FinanceExpense[]) => {
    const userBalances: { [key: string]: number } = {};
    
    // Initialize balances
    mockGroupMembers.forEach(member => {
      userBalances[member.id] = 0;
    });

    // Calculate balances from expenses
    expenseList.filter(exp => !exp.settled).forEach(expense => {
      const sharePerPerson = expense.amount / expense.splitBetween.length;
      
      // Person who paid gets credit
      userBalances[expense.paidBy] -= expense.amount;
      
      // Each person in split gets debited their share
      expense.splitBetween.forEach(userId => {
        userBalances[userId] += sharePerPerson;
      });
    });

    const balanceList = mockGroupMembers.map(member => ({
      userId: member.id,
      userName: member.name,
      owes: Math.round(userBalances[member.id] * 100) / 100
    }));

    setBalances(balanceList);
  };

  const handleAddExpense = async () => {
    const amount = parseFloat(newExpenseAmount);
    if (!newExpenseDescription.trim() || isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid description and amount');
      return;
    }

    try {
      // TODO: Replace with actual repository call
      // const financeRepository = new FinanceRepository();
      // const result = await financeRepository.createExpense({...});

      // Mock creating a new expense
      const newExpense: FinanceExpense = {
        id: Date.now().toString(),
        description: newExpenseDescription,
        amount: amount,
        paidBy: mockUser.id,
        splitBetween: mockGroupMembers.map(m => m.id), // Split between all members
        category: newExpenseCategory,
        groupId: groupId as string,
        createdAt: new Date(),
        settled: false
      };

      const updatedExpenses = [newExpense, ...expenses];
      setExpenses(updatedExpenses);
      calculateBalances(updatedExpenses);
      
      setNewExpenseDescription('');
      setNewExpenseAmount('');
      setNewExpenseCategory('other');
      setShowAddExpense(false);
      Alert.alert('Success', 'Expense added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  const handleSettleExpense = async (expenseId: string) => {
    try {
      // TODO: Replace with actual repository call
      const updatedExpenses = expenses.map(exp => 
        exp.id === expenseId ? { ...exp, settled: true } : exp
      );
      setExpenses(updatedExpenses);
      calculateBalances(updatedExpenses);
      Alert.alert('Success', 'Expense marked as settled!');
    } catch (error) {
      Alert.alert('Error', 'Failed to settle expense');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return '🍽️';
      case 'travel': return '🚗';
      case 'entertainment': return '🎉';
      case 'utilities': return '💡';
      default: return '💰';
    }
  };

  const getUserName = (userId: string) => {
    return mockGroupMembers.find(m => m.id === userId)?.name || 'Unknown User';
  };

  const ExpenseCard = ({ expense }: { expense: FinanceExpense }) => (
    <View className={`rounded-lg p-4 mb-3 border ${expense.settled ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-2">{getCategoryIcon(expense.category)}</Text>
          <Text variant="primary" size="base" weight="semibold" className="flex-1">
            {expense.description}
          </Text>
        </View>
        <Text variant="primary" size="lg" weight="bold" className="text-green-600 dark:text-green-400">
          ${expense.amount.toFixed(2)}
        </Text>
      </View>
      
      <Text variant="secondary" size="sm" className="mb-1">
        Paid by {getUserName(expense.paidBy)}
      </Text>
      <Text variant="secondary" size="sm" className="mb-2">
        Split between {expense.splitBetween.length} people • ${(expense.amount / expense.splitBetween.length).toFixed(2)} each
      </Text>
      <Text variant="tertiary" size="xs" className="mb-3">
        {expense.createdAt.toLocaleDateString()}
      </Text>
      
      {!expense.settled && (
        <TouchableOpacity
          onPress={() => handleSettleExpense(expense.id)}
          className="bg-green-100 dark:bg-green-900 rounded-lg py-2 px-3 self-start"
        >
          <Text className="text-green-700 dark:text-green-300 text-sm font-medium">Mark as Settled</Text>
        </TouchableOpacity>
      )}
      {expense.settled && (
        <View className="bg-green-100 dark:bg-green-900 rounded-lg py-1 px-3 self-start">
          <Text className="text-green-700 dark:text-green-300 text-xs">✅ Settled</Text>
        </View>
      )}
    </View>
  );

  const BalanceCard = ({ balance }: { balance: FinanceBalance }) => (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-2 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between">
        <Text variant="primary" size="sm" weight="medium">
          {balance.userName}
        </Text>
        <Text
          size="sm"
          weight="semibold"
          className={balance.owes > 0 ? 'text-red-600 dark:text-red-400' : balance.owes < 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}
        >
          {balance.owes > 0 ? `owes $${balance.owes.toFixed(2)}` : 
           balance.owes < 0 ? `owed $${Math.abs(balance.owes).toFixed(2)}` : 
           'settled up'}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text variant="brand" size="2xl" weight="bold">
              💰 Finance Chat
            </Text>
            <Text variant="secondary" size="sm">
              Group ID: {groupId}
            </Text>
          </View>
          
          <View className="flex-row gap-2">
            <Button
              title="+ Add Expense"
              onPress={() => setShowAddExpense(true)}
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

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text variant="secondary">Loading expenses...</Text>
          </View>
        ) : (
          <>
            {/* Balances Section */}
            <View className="mb-6">
              <Text variant="primary" size="lg" weight="bold" className="mb-3">
                💳 Current Balances
              </Text>
              {balances.map(balance => (
                <BalanceCard key={balance.userId} balance={balance} />
              ))}
            </View>

            {/* Expenses Section */}
            <View className="mb-6">
              <Text variant="primary" size="lg" weight="bold" className="mb-3">
                📋 Expenses
              </Text>
              {expenses.length === 0 ? (
                <View className="items-center py-12">
                  <Text size="4xl" className="mb-4">💰</Text>
                  <Text variant="primary" size="lg" weight="semibold" className="mb-2">
                    No expenses yet
                  </Text>
                  <Text variant="secondary" size="sm" className="text-center mb-6">
                    Start tracking group expenses to split costs fairly
                  </Text>
                  <Button
                    title="Add First Expense"
                    onPress={() => setShowAddExpense(true)}
                    variant="primary"
                  />
                </View>
              ) : (
                expenses.map(expense => <ExpenseCard key={expense.id} expense={expense} />)
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-50 items-center justify-center p-4">
          <View className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <Text variant="primary" size="lg" weight="bold" className="mb-4">
              Add New Expense
            </Text>
            
            <Text variant="secondary" size="sm" className="mb-2">Description:</Text>
            <TextInput
              value={newExpenseDescription}
              onChangeText={setNewExpenseDescription}
              placeholder="What was this expense for?"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            
            <Text variant="secondary" size="sm" className="mb-2">Amount ($):</Text>
            <TextInput
              value={newExpenseAmount}
              onChangeText={setNewExpenseAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            
            <Text variant="secondary" size="sm" className="mb-2">Category:</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {(['food', 'travel', 'entertainment', 'utilities', 'other'] as const).map(category => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setNewExpenseCategory(category)}
                  className={`px-3 py-1 rounded-full border ${
                    newExpenseCategory === category
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Text
                    size="sm"
                    className={newExpenseCategory === category ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}
                  >
                    {getCategoryIcon(category)} {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View className="flex-row gap-2">
              <Button
                title="Add Expense"
                onPress={handleAddExpense}
                variant="primary"
                size="sm"
                className="flex-1"
              />
              <Button
                title="Cancel"
                onPress={() => setShowAddExpense(false)}
                variant="outline"
                size="sm"
                className="flex-1"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}