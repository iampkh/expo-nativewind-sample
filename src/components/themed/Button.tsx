import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text } from './Text';
import { useThemeClasses } from '../../hooks/useThemeClasses';

export interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ThemedButtonProps) {
  const { button, background, border, spacing, borderRadius } = useThemeClasses();

  const getButtonClasses = () => {
    const baseClasses = 'items-center justify-center';
    const sizeClasses = {
      sm: `${spacing.sm} ${borderRadius.sm}`,
      md: `${spacing.md} ${borderRadius.md}`,
      lg: `${spacing.lg} ${borderRadius.lg}`,
    };

    switch (variant) {
      case 'secondary':
        return `${baseClasses} ${button.secondary.background} ${sizeClasses[size]}`;
      case 'outline':
        return `${baseClasses} ${button.outline.border} border ${sizeClasses[size]}`;
      default:
        return `${baseClasses} ${button.primary.background} ${sizeClasses[size]}`;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return button.secondary.text;
      case 'outline':
        return button.outline.text;
      default:
        return button.primary.text;
    }
  };

  return (
    <TouchableOpacity
      className={`${getButtonClasses()} ${className}`}
      {...props}
    >
      <Text
        weight="semibold"
        className={getTextColor()}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}