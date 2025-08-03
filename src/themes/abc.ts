import { Theme } from '../types/theme';

export const abcTheme: Theme = {
  name: 'abc',
  colors: {
    background: {
      primary: 'bg-purple-50',
      secondary: 'bg-purple-100',
      tertiary: 'bg-purple-200',
      card: 'bg-purple-50',
    },
    text: {
      primary: 'text-purple-900',
      secondary: 'text-purple-700',
      tertiary: 'text-purple-500',
      accent: 'text-pink-600',
    },
    brand: {
      primary: 'text-purple-600',
      secondary: 'text-purple-500',
    },

    button: {
      primary: {
        background: 'bg-purple-600',
        text: 'text-white',
      },
      secondary: {
        background: 'bg-purple-100',
        text: 'text-purple-900',
      },
      outline: {
        border: 'border-purple-600',
        text: 'text-purple-600',
      },
    },
    status: {
      success: 'text-emerald-600',
      warning: 'text-amber-600',
      error: 'text-rose-600',
      info: 'text-cyan-600',
    },
    border: {
      primary: 'border-purple-300',
      secondary: 'border-purple-200',
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