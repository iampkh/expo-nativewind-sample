import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from '../themed/View';
import { Text } from '../themed/Text';
import { Button } from '../themed/Button';
import { NoteListItemProps } from './types';

export function NoteVariant({
  id,
  title,
  subtitle,
  description,
  createdAt,
  updatedAt,
  completed = false,
  priority = 'medium',
  tags = [],
  className = '',
  onPress,
  onLongPress,
  onToggleComplete,
  onDelete,
  ...props
}: NoteListItemProps) {
  const handlePress = () => onPress?.(id);
  const handleLongPress = () => onLongPress?.(id);
  const handleToggleComplete = () => onToggleComplete?.(id);
  const handleDelete = () => onDelete?.(id);

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const CardContent = () => (
    <View className={`py-4 px-0 ${className}`} {...(onPress ? {} : props)}>
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text
            variant="primary"
            size="lg"
            weight="medium"
            className={`mb-1 ${completed ? 'line-through opacity-60' : ''}`}
          >
            {title}
          </Text>
          
          {subtitle && (
            <Text
              variant="secondary"
              size="sm"
              className={`mb-1 ${completed ? 'opacity-60' : ''}`}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Priority indicator */}
        <View className={`w-3 h-3 rounded-full ${getPriorityColor().replace('text-', 'bg-')}`} />
      </View>

      {description && (
        <Text
          variant="tertiary"
          size="sm"
          className={`mb-2 ${completed ? 'opacity-60' : ''}`}
        >
          {description}
        </Text>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <View key={index} className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
              <Text variant="primary" size="xs">
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer with date and actions */}
      <View className="flex-row items-center justify-between">
        <Text variant="tertiary" size="xs">
          {updatedAt ? `Updated ${formatDate(updatedAt)}` : createdAt ? `Created ${formatDate(createdAt)}` : ''}
        </Text>

        <View className="flex-row gap-2">
          {onToggleComplete && (
            <TouchableOpacity onPress={handleToggleComplete}>
              <Text variant="accent" size="sm">
                {completed ? '↶ Undo' : '✓ Complete'}
              </Text>
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <Text className="text-red-500" size="sm">
                🗑 Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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