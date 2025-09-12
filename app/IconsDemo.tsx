import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon, IconName, ICON_SIZES } from '@/src/shared/components/icons';

// All available icons from Icon.tsx
const allIcons: IconName[] = [
  // Navigation & General
  "home", "back", "forward", "close", "menu", "more-vertical", "more-horizontal",
  "search", "filter", "refresh", "external-link",
  
  // User & Account  
  "user", "users", "user-plus", "user-minus", "profile", "avatar",
  
  // Communication & Chat
  "message", "messages", "chat", "send", "phone", "video", "mail", 
  "notification", "bell",
  
  // Actions
  "add", "plus", "minus", "edit", "delete", "trash", "save", "copy", 
  "share", "download", "upload", "like", "heart", "star", "bookmark",
  
  // Status & Feedback
  "check", "checkmark", "close-circle", "alert", "warning", "info", 
  "help", "success", "error",
  
  // Media & Files
  "image", "camera", "video-camera", "file", "folder", "attachment", 
  "mic", "speaker", "volume-up", "volume-down", "mute",
  
  // Settings & Configuration
  "settings", "gear", "options", "preferences", "admin", "security", 
  "privacy", "lock", "unlock", "key",
  
  // Navigation & Direction
  "arrow-up", "arrow-down", "arrow-left", "arrow-right", "chevron-up", 
  "chevron-down", "chevron-left", "chevron-right",
  
  // Business & Finance
  "dollar", "credit-card", "bank", "receipt", "calculator", "chart", 
  "trending-up", "trending-down",
  
  // Time & Calendar
  "calendar", "clock", "time", "schedule", "timer", "stopwatch",
  
  // Tasks & Productivity
  "task", "todo", "checklist", "clipboard", "document", "note", "tag", "flag",
  
  // Social & Community
  "community", "group", "team", "collaboration", "handshake", 
  "thumbs-up", "thumbs-down",
  
  // Technology & Code
  "code", "terminal", "database", "server", "cloud", "wifi", 
  "bluetooth", "battery",
  
  // Location & Maps
  "location", "map", "pin", "compass", "globe",
  
  // Theme & Display
  "sun", "moon", "eye", "eye-off", "color-palette", "brightness",
  
  // Shopping & E-commerce
  "cart", "bag", "price-tag", "gift", "coupon",
  
  // Health & Fitness
  "heart-pulse", "activity", "fitness", "health",
  
  // Custom App Icons
  "logo", "app-icon"
];

export default function IconsDemo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<keyof typeof ICON_SIZES>('md');

  const filteredIcons = allIcons.filter(icon =>
    icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sizeOptions: (keyof typeof ICON_SIZES)[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

  const renderIconCard = (iconName: IconName) => (
    <View 
      key={iconName} 
      className="bg-card rounded-lg p-4 border border-border items-center justify-center min-h-[100px] m-1"
      style={{ width: '30%' }}
    >
      <Icon 
        name={iconName} 
        size={ICON_SIZES[selectedSize]} 
        color="#666" 
      />
      <Text className="text-xs text-center mt-2 text-muted-foreground">
        {iconName}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-card border border-border rounded-lg items-center justify-center"
          >
            <Icon name="back" size={20} color="#666" />
          </TouchableOpacity>
          <Text variant="primary" size="xl" weight="bold">
            Icons Demo
          </Text>
          <View className="w-10" />
        </View>

        {/* Search */}
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search icons..."
          className="bg-card border border-border rounded-lg px-4 py-3 text-foreground"
          placeholderTextColor="#999"
        />

        {/* Size Selector */}
        <View className="mt-4">
          <Text className="text-sm font-medium mb-2 text-foreground">Size:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {sizeOptions.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedSize === size
                      ? 'bg-primary border-primary'
                      : 'bg-card border-border'
                  }`}
                >
                  <Text 
                    className={`text-sm font-medium ${
                      selectedSize === size
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {size.toUpperCase()} ({ICON_SIZES[size]}px)
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 py-2 bg-muted">
        <Text className="text-sm text-muted-foreground text-center">
          Showing {filteredIcons.length} of {allIcons.length} icons
        </Text>
      </View>

      {/* Icons Grid */}
      <ScrollView className="flex-1 px-2 py-4">
        <View className="flex-row flex-wrap justify-between">
          {filteredIcons.map(renderIconCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}