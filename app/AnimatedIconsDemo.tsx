import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon, AnimatedIcon, IconName, ICON_SIZES, IconAnimationType } from '@/src/shared/components/icons';

// Sample icons for animation demo
const demoIcons: IconName[] = [
  "home", "heart", "star", "settings", "user", "message", "search", "add",
  "edit", "delete", "save", "share", "like", "notification", "camera", "mic",
  "video", "image", "phone", "mail", "calendar", "clock", "location", "cart",
  "gift", "sun", "moon", "wifi", "battery", "refresh", "download", "upload"
];

const animationTypes: IconAnimationType[] = [
  "rotate", "bounce", "pulse", "fade", "scale", "shake"
];

export default function AnimatedIconsDemo() {
  const [selectedAnimation, setSelectedAnimation] = useState<IconAnimationType>('rotate');
  const [selectedSize, setSelectedSize] = useState<keyof typeof ICON_SIZES>('lg');
  const [selectedDuration, setSelectedDuration] = useState(1000);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = demoIcons.filter(icon =>
    icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sizeOptions: (keyof typeof ICON_SIZES)[] = ['sm', 'md', 'lg', 'xl'];
  const durationOptions = [500, 1000, 1500, 2000];

  const renderAnimatedIconCard = (iconName: IconName) => (
    <View 
      key={iconName} 
      className="bg-card rounded-lg p-4 border border-border items-center justify-center min-h-[120px] m-1"
      style={{ width: '30%' }}
    >
      <AnimatedIcon
        name={iconName}
        size={ICON_SIZES[selectedSize]}
        color="#666"
        animation={selectedAnimation}
        duration={selectedDuration}
        loop={true}
      />
      <Text className="text-xs text-center mt-2 text-muted-foreground">
        {iconName}
      </Text>
    </View>
  );

  const renderControlSection = () => (
    <View className="px-4 py-4 bg-muted border-b border-border">
      {/* Animation Type */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2 text-foreground">Animation:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {animationTypes.map((animation) => (
              <TouchableOpacity
                key={animation}
                onPress={() => setSelectedAnimation(animation)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedAnimation === animation
                    ? 'bg-primary border-primary'
                    : 'bg-card border-border'
                }`}
              >
                <Text 
                  className={`text-sm font-medium ${
                    selectedAnimation === animation
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {animation}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Size */}
      <View className="mb-4">
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
                  {size.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Duration */}
      <View>
        <Text className="text-sm font-medium mb-2 text-foreground">Duration:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {durationOptions.map((duration) => (
              <TouchableOpacity
                key={duration}
                onPress={() => setSelectedDuration(duration)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedDuration === duration
                    ? 'bg-primary border-primary'
                    : 'bg-card border-border'
                }`}
              >
                <Text 
                  className={`text-sm font-medium ${
                    selectedDuration === duration
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {duration}ms
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
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
            Animated Icons
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
      </View>

      {/* Controls */}
      {renderControlSection()}

      {/* Featured Animation Example */}
      <View className="px-4 py-6 bg-card border-b border-border">
        <Text className="text-center text-lg font-bold mb-4 text-foreground">
          Live Preview
        </Text>
        <View className="items-center justify-center">
          <AnimatedIcon
            name="heart"
            size={ICON_SIZES.xxl}
            color="#e11d48"
            animation={selectedAnimation}
            duration={selectedDuration}
            loop={true}
          />
          <Text className="text-sm text-muted-foreground mt-2">
            {selectedAnimation} • {selectedDuration}ms • Loop
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 py-2 bg-muted">
        <Text className="text-sm text-muted-foreground text-center">
          {filteredIcons.length} icons • {animationTypes.length} animations
        </Text>
      </View>

      {/* Animated Icons Grid */}
      <ScrollView className="flex-1 px-2 py-4">
        <View className="flex-row flex-wrap justify-between">
          {filteredIcons.map(renderAnimatedIconCard)}
        </View>

        {/* Animation Types Demo */}
        <View className="mt-8 px-2">
          <Text className="text-lg font-bold mb-4 text-center text-foreground">
            All Animation Types
          </Text>
          <View className="flex-row flex-wrap justify-center gap-4">
            {animationTypes.map((animation) => (
              <View key={animation} className="items-center bg-card rounded-lg p-4 border border-border">
                <AnimatedIcon
                  name="star"
                  size={ICON_SIZES.lg}
                  color="#f59e0b"
                  animation={animation}
                  duration={1000}
                  loop={true}
                />
                <Text className="text-xs mt-2 text-muted-foreground">{animation}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}