import { useTheme } from './useTheme';

interface UseThemeClassesOptions {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export function useThemeClasses(options: UseThemeClassesOptions = {}) {
  const { theme } = useTheme();
  const { variant = 'primary' } = options;

  return {
    // Background classes
    background: {
      primary: theme.colors.background.primary,
      secondary: theme.colors.background.secondary,
      tertiary: theme.colors.background.tertiary,
      card: theme.colors.background.card,
    },
    
    // Text classes
    text: {
      primary: theme.colors.text.primary,
      secondary: theme.colors.text.secondary,
      tertiary: theme.colors.text.tertiary,
      accent: theme.colors.text.accent,
    },
    
    // Brand classes
    brand: {
      primary: theme.colors.brand.primary,
      secondary: theme.colors.brand.secondary,
    },

    // Button classes
    button: theme.colors.button,
    
    // Status classes
    status: theme.colors.status,
    
    // Border classes
    border: theme.colors.border,
    
    // Typography classes
    typography: theme.typography,
    
    // Spacing classes
    spacing: theme.spacing,
    
    // Border radius classes
    borderRadius: theme.borderRadius,
    
    // Helper functions
    getVariantText: () => {
      switch (variant) {
        case 'secondary':
          return theme.colors.text.secondary;
        case 'tertiary':
          return theme.colors.text.tertiary;
        default:
          return theme.colors.text.primary;
      }
    },
    
    getVariantBackground: () => {
      switch (variant) {
        case 'secondary':
          return theme.colors.background.secondary;
        case 'tertiary':
          return theme.colors.background.tertiary;
        default:
          return theme.colors.background.primary;
      }
    },
  };
}