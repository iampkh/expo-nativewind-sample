import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from '../themed/View';
import { Text } from '../themed/Text';
import { TodoListItemProps } from './types';

export function TodoVariant({
  id,
  title,
  subtitle,
  description,
  completed,
  dueDate,
  priority = 'medium',
  className = '',
  onPress,
  onLongPress,
  onToggleComplete,
  onDelete,
  ...props
}: TodoListItemProps) {
  const handlePress = () => onPress?.(id);
  const handleLongPress = () => onLongPress?.(id);
  const handleToggleComplete = () => onToggleComplete?.(id);
  const handleDelete = () => onDelete?.(id);

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  const CardContent = () => (
    <View className={`py-4 px-0 ${className}`} {...(onPress ? {} : props)}>
      <View className="flex-row items-start">
        {/* Checkbox */}
        <TouchableOpacity 
          onPress={handleToggleComplete}
          className="mr-3 mt-1"
        >
          <View className={`w-5 h-5 rounded border-2 ${getPriorityColor()} ${completed ? 'bg-blue-500 border-blue-500' : ''} items-center justify-center`}>
            {completed && (
              <Text className="text-white text-xs">✓</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View className="flex-1">
          <Text
            variant="primary"
            size="base"
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

          {description && (
            <Text
              variant="tertiary"
              size="sm"
              className={`mb-2 ${completed ? 'opacity-60' : ''}`}
            >
              {description}
            </Text>
          )}

          {/* Due date */}
          {dueDate && (
            <Text 
              variant="tertiary" 
              size="xs"
              className={`${completed ? 'opacity-60' : ''}`}
            >
              Due: {formatDueDate(dueDate)}
            </Text>
          )}
        </View>

        {/* Delete button */}
        {onDelete && (
          <TouchableOpacity onPress={handleDelete} className="ml-2">
            <Text className="text-red-500" size="sm">🗑</Text>
          </TouchableOpacity>
        )}
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