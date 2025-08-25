import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { View } from '../themed/View';
import { Text } from '../themed/Text';
import { ContactListItemProps } from './types';

export function ContactVariant({
  id,
  title,
  subtitle,
  description,
  avatar,
  email,
  phone,
  status = 'offline',
  className = '',
  onPress,
  onLongPress,
  ...props
}: ContactListItemProps) {
  const handlePress = () => onPress?.(id);
  const handleLongPress = () => onLongPress?.(id);

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
      default:
        return 'bg-gray-400';
    }
  };

  const CardContent = () => (
    <View 
      className={`flex-row items-center py-4 px-0 ${className}`}
      {...(onPress ? {} : props)}
    >
      {/* Avatar */}
      <View className="mr-4 relative">
        <View className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center overflow-hidden">
          {avatar ? (
            <Image
              source={typeof avatar === 'string' && avatar.startsWith('http') ? { uri: avatar } : avatar}
              style={{ width: 48, height: 48 }}
              className="rounded-full"
              contentFit="cover"
            />
          ) : (
            <Text variant="secondary" size="lg">
              {title.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        
        {/* Status indicator */}
        <View className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${getStatusColor()} border-2 border-white dark:border-gray-800`} />
      </View>

      {/* Content */}
      <View className="flex-1">
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

        {email && (
          <Text
            variant="tertiary"
            size="sm"
            className="mb-0.5"
          >
            📧 {email}
          </Text>
        )}

        {phone && (
          <Text
            variant="tertiary"
            size="sm"
          >
            📞 {phone}
          </Text>
        )}

        {description && (
          <Text
            variant="tertiary"
            size="sm"
            className="mt-1"
          >
            {description}
          </Text>
        )}
      </View>

      {/* Status text */}
      <View className="ml-2">
        <Text 
          variant="tertiary" 
          size="xs"
          className={`capitalize ${status === 'online' ? 'text-green-600' : status === 'away' ? 'text-yellow-600' : 'text-gray-500'}`}
        >
          {status}
        </Text>
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