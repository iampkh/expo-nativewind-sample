export interface ThemeColors {
  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string; // For card containers
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  
  // Brand colors
  brand: {
    primary: string;
    secondary: string;
  };

  // Button colors
  button: {
    primary: {
      background: string;
      text: string;
    };
    secondary: {
      background: string;
      text: string;
    };
    outline: {
      border: string;
      text: string;
    };
  };
  
  // Status colors
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Border colors
  border: {
    primary: string;
    secondary: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeTypography {
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  
  fontWeights: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  
  lineHeights: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}

export type ThemeName = 'light' | 'dark' | 'abc';

export interface ThemeContextValue {
  currentTheme: ThemeName;
  theme: Theme;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}