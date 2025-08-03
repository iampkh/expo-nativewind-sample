import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from '../themed/View';
import { Text } from '../themed/Text';
import { DefaultListItemProps } from './types';

export function DefaultVariant({
  id,
  title,
  subtitle,
  description,
  className = '',
  onPress,
  onLongPress,
  ...props
}: DefaultListItemProps) {
  const handlePress = () => onPress?.(id);
  const handleLongPress = () => onLongPress?.(id);

  const CardContent = () => (
    <View 
      className={`py-4 px-0 ${className}`}
      {...(onPress ? {} : props)}
    >
      <Text
        variant="primary"
        size="lg"
        weight="medium"
        className="mb-1"
      >
        {title}
      </Text>
      
      {subtitle && (
        <Text
          variant="secondary"
          size="sm"
          className="mb-1"
        >
          {subtitle}
        </Text>
      )}
      
      {description && (
        <Text
          variant="tertiary"
          size="sm"
        >
          {description}
        </Text>
      )}
    </View>
  );

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity 
        onPress={handlePress}
        onLongPress={handleLongPress}
        className="active:bg-gray-50 dark:active:bg-gray-800"
        {...props}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
}