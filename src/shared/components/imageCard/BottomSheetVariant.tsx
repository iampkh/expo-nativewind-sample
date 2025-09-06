import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { View } from '../themed/View';
import { Text } from '../themed/Text';
import { BottomSheetImageCardProps } from './types';

export function BottomSheetVariant({
  imagePath,
  title,
  description,
  className = '',
  imageSize = 48,
  onPress,
  ...props
}: BottomSheetImageCardProps) {
  const CardContent = () => (
    <View 
      className={`flex-row items-center py-4 px-0 ${className}`}
      {...(onPress ? {} : props)}
    >
      {/* Icon Container - matches bottom sheet design */}
      <View className="mr-4">
        <View className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center">
          <Image
            source={typeof imagePath === 'string' && imagePath.startsWith('http') ? { uri: imagePath } : imagePath}
            style={{ width: imageSize * 0.7, height: imageSize * 0.7 }}
            className="rounded-full"
            contentFit="cover"
          />
        </View>
      </View>

      {/* Content - matches bottom sheet text layout */}
      <View className="flex-1">
        <Text
          variant="primary"
          size="lg"
          weight="medium"
          className="mb-1"
        >
          {title}
        </Text>
        
        <Text
          variant="tertiary"
          size="sm"
        >
          {description}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        className="active:bg-gray-50 dark:active:bg-gray-800"
        {...props}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
}