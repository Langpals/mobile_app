// app/_layout.tsx - Fixed with proper Text component usage
import { useEffect, useState, ReactNode, useCallback } from 'react';
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
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

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
    'Cubano': require('../assets/fonts/Cubano.ttf'),
    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <TeddyProvider>
          <LearningProvider>
            <AuthenticationGuard>
              <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="episode/[id]" />
                </Stack>
                <StatusBar style="auto" />
              </View>
            </AuthenticationGuard>
          </LearningProvider>
        </TeddyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MainLayout;