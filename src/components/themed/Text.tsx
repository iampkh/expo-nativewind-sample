import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useThemeClasses } from '../../hooks/useThemeClasses';

export interface ThemedTextProps extends TextProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'brand';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export function Text({
  variant = 'primary',
  size = 'base',
  weight = 'normal',
  className = '',
  children,
  ...props
}: ThemedTextProps) {
  const { text, brand, typography } = useThemeClasses();

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return text.secondary;
      case 'tertiary':
        return text.tertiary;
      case 'accent':
        return text.accent;
      case 'brand':
        return brand.primary;
      default:
        return text.primary;
    }
  };

  const combinedClassName = `${getTextColor()} ${typography.fontSizes[size]} ${typography.fontWeights[weight]} ${className}`.trim();

  return (
    <RNText className={combinedClassName} {...props}>
      {children}
    </RNText>
  );
}