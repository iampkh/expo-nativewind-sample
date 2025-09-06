import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { themes, Theme, ThemeName, ThemeContextValue } from '../themes';

const THEME_STORAGE_KEY = '@app_theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);

  // Load saved theme on app start
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Auto-switch to system theme if no custom theme is set
  useEffect(() => {
    if (systemColorScheme && (systemColorScheme === 'light' || systemColorScheme === 'dark')) {
      const savedTheme = AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        setCurrentTheme(systemColorScheme);
      }
    }
  }, [systemColorScheme]);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme as ThemeName]) {
        setCurrentTheme(savedTheme as ThemeName);
      }
    } catch (error) {
      console.warn('Failed to load saved theme:', error);
    }
  };

  const setTheme = async (theme: ThemeName) => {
    try {
      setCurrentTheme(theme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    const themeOrder: ThemeName[] = ['light', 'dark', 'abc'];
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const contextValue: ThemeContextValue = {
    currentTheme,
    theme: themes[currentTheme],
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}