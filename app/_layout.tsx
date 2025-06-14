// app/_layout.tsx - Updated with Theme Provider
import { useEffect, useState, ReactNode } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_500Medium, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text } from 'react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { TeddyProvider } from '@/contexts/TeddyContext';
import { LearningProvider } from '@/contexts/LearningContext';
import * as SecureStore from 'expo-secure-store';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// This component will check if the user is authenticated
// and redirect to the appropriate screen
function AuthenticationGuard({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated } = useAuth();
  const { colors, activeTheme } = useTheme();
  const segments = useSegments();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authenticated = await isAuthenticated();
        const hasCompletedOnboarding = await SecureStore.getItemAsync('onboarding_completed');
        
        const inAuthGroup = segments[0] === '(auth)';
        const inOnboardingGroup = segments[0] === 'onboarding';
        
        if (!authenticated && !inAuthGroup) {
          // Redirect to login if not authenticated and not in auth group
          router.replace('/(auth)/login');
        } else if (authenticated && inAuthGroup) {
          // Redirect to home if authenticated but in auth group
          if (hasCompletedOnboarding !== 'true') {
            // First login - redirect to onboarding
            router.replace('/onboarding');
          } else {
            // User has completed onboarding - redirect to home
            router.replace('/(tabs)/');
          }
        } else if (authenticated && !inOnboardingGroup && hasCompletedOnboarding !== 'true') {
          // User is authenticated but hasn't completed onboarding
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // If there's an error, default to login page
        router.replace('/(auth)/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Add a small delay to prevent immediate navigation issues
    const timer = setTimeout(() => {
      checkAuthState();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser, segments]);

  // While checking authentication state, show a loading screen with theme colors
  if (isCheckingAuth) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.background 
      }}>
        <Text style={{ 
          fontSize: 18, 
          fontFamily: 'Poppins-Regular',
          color: colors.text 
        }}>
          Loading...
        </Text>
      </View>
    );
  }

  return children;
}

// Main layout component that includes theme provider
function MainLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'LilitaOne': LilitaOne_400Regular,
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-Bold': Outfit_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts have loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If fonts aren't loaded and there isn't an error, return null to keep splash screen
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <TeddyProvider>
          <LearningProvider>
            <ThemedApp />
          </LearningProvider>
        </TeddyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Themed app component that uses theme context
function ThemedApp() {
  const { activeTheme, isLoading } = useTheme();

  if (isLoading) {
    return null; // Keep splash screen while loading theme
  }

  return (
    <AuthenticationGuard>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="episode" options={{ headerShown: false }} />
        <Stack.Screen name="step" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
    </AuthenticationGuard>
  );
}

export default MainLayout;