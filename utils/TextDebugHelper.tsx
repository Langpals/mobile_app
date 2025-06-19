// utils/TextDebugHelper.tsx - Helper to identify Text component issues
import React, { useEffect } from 'react';
import { LogBox, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

// This helper component helps debug Text component issues
export const TextDebugHelper = () => {
  useEffect(() => {
    // Ignore specific warnings related to Text components during development
    LogBox.ignoreLogs([
      'Warning: Text strings must be rendered within a <Text> component',
      'Warning: Failed prop type',
    ]);

    // Override console.warn to catch and log Text component warnings
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && args[0].includes('Text strings must be rendered within a <Text> component')) {
        console.error('🚨 TEXT COMPONENT ERROR DETECTED:');
        console.error('This usually happens when you have a string value that is not wrapped in a <Text> component.');
        console.error('Common causes:');
        console.error('1. Conditional rendering that returns a string instead of JSX');
        console.error('2. Template literals or string concatenation being rendered directly');
        console.error('3. Missing Text wrapper around dynamic content');
        console.error('Stack trace:', new Error().stack);
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return null;
};

// Helper function to safely render text content
export const SafeText: React.FC<{ children: React.ReactNode; style?: any }> = ({ 
  children, 
  style 
}) => {
  // If children is a string, number, or other primitive, wrap it safely
  if (typeof children === 'string' || typeof children === 'number') {
    return <Text style={style}>{children}</Text>;
  }
  
  // If it's already JSX, return as is
  return children;
};

// Common Text component patterns to help avoid errors
export const AppText: React.FC<{
  children: React.ReactNode;
  style?: any;
  numberOfLines?: number;
  onPress?: () => void;
}> = ({ children, style, numberOfLines, onPress, ...props }) => {
  return (
    <Text 
      style={style} 
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...props}
    >
      {children}
    </Text>
  );
};

// Helper to ensure all dynamic content is properly wrapped
export const renderSafeContent = (content: any) => {
  if (content === null || content === undefined) {
    return null;
  }
  
  if (typeof content === 'string' || typeof content === 'number') {
    return <Text>{content}</Text>;
  }
  
  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <React.Fragment key={index}>
        {renderSafeContent(item)}
      </React.Fragment>
    ));
  }
  
  return content;
};

// Utility function to reset onboarding state (for testing)
export const resetOnboardingState = async () => {
  try {
    await SecureStore.deleteItemAsync('onboarding_completed');
    console.log('✅ Onboarding state reset successfully');
    return true;
  } catch (error) {
    console.error('❌ Error resetting onboarding state:', error);
    return false;
  }
};

// Debug component to reset onboarding (only show in development)
export const OnboardingResetButton = () => {
  const handleReset = async () => {
    const success = await resetOnboardingState();
    if (success) {
      // Navigate to onboarding
      router.replace('/onboarding');
    }
  };

  return (
    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
      <Text style={styles.resetButtonText}>Reset Onboarding</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resetButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    margin: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
});

export default TextDebugHelper;