import React, { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../../store';
import { ThemeProvider } from './ThemeProvider';
import { UseCaseProvider } from './UseCaseProvider';

interface AppProvidersProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark' | 'abc';
  apiBaseURL?: string;
}

export function AppProviders({ 
  children, 
  defaultTheme = 'light',
  apiBaseURL = 'https://api.example.com'
}: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme={defaultTheme}>
        <UseCaseProvider baseURL={apiBaseURL}>
          {children}
        </UseCaseProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}