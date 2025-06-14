// contexts/ThemeContext.tsx - Theme Context Provider
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';

interface ThemeColors {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  cardBackground: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
}

interface ThemeContextType {
  themeMode: ThemeMode;
  activeTheme: ActiveTheme;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isLoading: boolean;
}

const lightColors: ThemeColors = {
  text: '#2C3E50',
  background: '#FFFFFF',
  tint: '#FF6B6B',
  tabIconDefault: '#A0AEC0',
  tabIconSelected: '#FF6B6B',
  cardBackground: '#FFFFFF',
  primary: '#FF6B6B',
  secondary: '#4CAF50',
  accent: '#FFB74D',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  border: '#E0E0E0',
};

const darkColors: ThemeColors = {
  text: '#F7FAFC',
  background: '#1A202C',
  tint: '#FF9B9B',
  tabIconDefault: '#718096',
  tabIconSelected: '#FF9B9B',
  cardBackground: '#2D3748',
  primary: '#FF9B9B',
  secondary: '#68D391',
  accent: '#FFD080',
  success: '#68D391',
  warning: '#FBB040',
  error: '#FC8181',
  border: '#4A5568',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);
  const systemTheme = useColorScheme();

  // Determine active theme based on mode and system preference
  const activeTheme: ActiveTheme = themeMode === 'system' 
    ? (systemTheme === 'dark' ? 'dark' : 'light')
    : themeMode as ActiveTheme;

  const colors = activeTheme === 'dark' ? darkColors : lightColors;

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync('theme_mode');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await SecureStore.setItemAsync('theme_mode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        themeMode, 
        activeTheme, 
        colors, 
        setThemeMode, 
        isLoading 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// HOC for easier theme access in class components
export function withTheme<P extends object>(Component: React.ComponentType<P & { theme: ThemeContextType }>) {
  return (props: P) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
}