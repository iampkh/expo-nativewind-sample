import React from 'react';
import { ScrollView, TouchableOpacity, Text as RNText } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/src/shared/hooks/useTheme';
import { List } from '@/src/shared/components/list';

interface ExampleCard {
  id: string;
  title: string;
  icon: string;
  route: string;
}

const exampleCards: ExampleCard[] = [
  {
    id: '1',
    title: 'Chat',
    icon: '💬',
    route: '/chat',
  },
  {
    id: '2',
    title: 'List Example',
    icon: '📝',
    route: '/ListExample',
  },
  {
    id: '3',
    title: 'Grid Example',
    icon: '🔲',
    route: '/GridExample',
  },
  {
    id: '4',
    title: 'Todo Notes',
    icon: '📋',
    route: '/(app)',
  },
  {
    id: '5',
    title: 'Login Screen',
    icon: '🔐',
    route: '/login',
  },
  {
    id: '6',
    title: 'Auth Screen',
    icon: '🧪',
    route: '/auth',
  },
  {
    id: '7',
    title: 'Local Cache',
    icon: '💾',
    route: '/LocalCacheExample',
  },
  {
    id: '8',
    title: 'Database',
    icon: '🗄️',
    route: '/DatabaseExample',
  },
  {
    id: '9',
    title: 'Theme Example',
    icon: '🎨',
    route: '/ThemeExample',
  },
];

export default function HomeScreen() {
  const { currentTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const navigateToScreen = (route: string) => {
    router.push(route as any);
  };

  const renderExampleCard = (card: ExampleCard, index: number) => (
    <TouchableOpacity
      onPress={() => navigateToScreen(card.route)}
      className="bg-card rounded-lg p-3 border border-border items-center min-h-[80px] justify-center"
    >
      <RNText className="text-2xl mb-2">{card.icon}</RNText>
      <RNText className="text-center text-sm font-medium text-gray-900 dark:text-gray-100">
        {card.title}
      </RNText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text variant="primary" size="2xl" weight="bold">
            Sample App
          </Text>
          <TouchableOpacity
            onPress={toggleTheme}
            className="w-10 h-10 bg-card border border-border rounded-lg items-center justify-center"
          >
            <Text className="text-lg">
              {currentTheme === 'dark' ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Debug info */}
        <RNText className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
          {exampleCards.length} examples available - Tap to explore
        </RNText>
        
        {/* Manual grid as fallback */}
        <View className="flex-1">
          <View className="flex-row flex-wrap gap-3">
            {exampleCards.map((card, index) => (
              <View key={card.id} className="w-[48%]">
                {renderExampleCard(card, index)}
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}