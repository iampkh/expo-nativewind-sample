import { Theme } from '../types/theme';

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
      card: 'bg-white',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      tertiary: 'text-gray-400',
      accent: 'text-blue-600',
    },
    brand: {
      primary: 'text-green-600',
      secondary: 'text-green-500',
    },

    button: {
      primary: {
        background: 'bg-green-600',
        text: 'text-white',
      },
      secondary: {
        background: 'bg-gray-50',
        text: 'text-gray-900',
      },
      outline: {
        border: 'border-green-600',
        text: 'text-green-600',
      },
    },
    status: {
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
      info: 'text-blue-600',
    },
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-100',
    },
  },
  spacing: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-12',
  },
  typography: {
    fontSizes: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    fontWeights: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    lineHeights: {
      tight: 'leading-tight',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
    },
  },
  borderRadius: {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
};