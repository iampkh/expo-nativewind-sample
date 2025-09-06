import { Theme } from '../types/theme';

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-800',
      tertiary: 'bg-gray-700',
      card: 'bg-gray-800',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      tertiary: 'text-gray-400',
      accent: 'text-blue-400',
    },
    brand: {
      primary: 'text-green-400',
      secondary: 'text-green-300',
    },

    button: {
      primary: {
        background: 'bg-green-500',
        text: 'text-white',
      },
      secondary: {
        background: 'bg-gray-700',
        text: 'text-gray-100',
      },
      outline: {
        border: 'border-green-400',
        text: 'text-green-400',
      },
    },
    status: {
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
      info: 'text-blue-400',
    },
    border: {
      primary: 'border-gray-600',
      secondary: 'border-gray-700',
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