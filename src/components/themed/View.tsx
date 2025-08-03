import React from 'react';
import { View as RNView, ViewProps } from 'react-native';
import { useThemeClasses } from '../../hooks/useThemeClasses';

export interface ThemedViewProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'card';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function View({
  variant = 'primary',
  padding,
  borderRadius,
  className = '',
  children,
  ...props
}: ThemedViewProps) {
  const { background, spacing, borderRadius: br } = useThemeClasses();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return background.secondary;
      case 'tertiary':
        return background.tertiary;
      case 'card':
        return background.card;
      default:
        return background.primary;
    }
  };

  const paddingClass = padding ? spacing[padding] : '';
  const borderRadiusClass = borderRadius ? br[borderRadius] : '';

  const combinedClassName = `${getBackgroundColor()} ${paddingClass} ${borderRadiusClass} ${className}`.trim();

  return (
    <RNView className={combinedClassName} {...props}>
      {children}
    </RNView>
  );
}