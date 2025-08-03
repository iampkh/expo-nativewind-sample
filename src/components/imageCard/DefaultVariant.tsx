import React from 'react';
import { Image } from 'expo-image';
import { View } from '../themed/View';
import { Text } from '../themed/Text';
import { DefaultImageCardProps } from './types';

export function DefaultVariant({
  imagePath,
  title,
  description,
  className = '',
  ...props
}: DefaultImageCardProps) {
  return (
    <View 
      variant="primary"
      padding="md"
      borderRadius="lg"
      className={`border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      <Image
        source={typeof imagePath === 'string' && imagePath.startsWith('http') ? { uri: imagePath } : imagePath}
        style={{ width: '100%', height: 200 }}
        className="rounded-lg mb-3"
        contentFit="cover"
      />
      
      <Text
        variant="primary"
        size="lg"
        weight="bold"
        className="mb-2"
      >
        {title}
      </Text>
      
      <Text
        variant="secondary"
        size="base"
      >
        {description}
      </Text>
    </View>
  );
}