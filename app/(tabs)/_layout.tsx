// app/(tabs)/_layout.tsx - Tab Layout with Theme Integration
import React from 'react';
import { Tabs } from 'expo-router';
import { BarChart3, Home, Settings, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { TouchableNativeFeedback, View, Platform } from 'react-native';

// Custom tab bar button component
const TabBarButton = ({ children, ...props }: any) => (
  <TouchableNativeFeedback
    background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.1)', true, 52.67)} // radius is the last parameter
    {...props}
  >
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
    }}>
      {children}
    </View>
  </TouchableNativeFeedback>
);

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 50,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'Cubano',
          fontSize: 12,
          marginTop: 0,
        },
        tabBarIconStyle: {
          height: 20,
          marginTop: 15,
          marginBottom: 0,
        },
        headerShown: false,
        tabBarButton: (props) => <TabBarButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="metrics"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="placeholder"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}