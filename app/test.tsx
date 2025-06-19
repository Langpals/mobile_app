import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { resetOnboardingState } from '@/utils/TextDebugHelper';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/contexts/AuthContext';

export default function TestScreen() {
  const { logout, isAuthenticated } = useAuth();

  const testOnboardingFlow = async () => {
    console.log('🧪 Testing onboarding flow...');
    
    // Reset onboarding state
    await resetOnboardingState();
    
    // Navigate to onboarding
    router.replace('/onboarding');
  };

  const checkOnboardingStatus = async () => {
    const status = await SecureStore.getItemAsync('onboarding_completed');
    console.log('📋 Onboarding status:', status);
    alert(`Onboarding completed: ${status === 'true' ? 'Yes' : 'No'}`);
  };

  const testAuthFlow = async () => {
    const authenticated = await isAuthenticated();
    console.log('🔐 Auth status:', authenticated);
    alert(`Authenticated: ${authenticated ? 'Yes' : 'No'}`);
  };

  const logoutUser = async () => {
    try {
      await logout();
      console.log('🚪 User logged out');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 Test Screen</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Onboarding Flow Tests</Text>
        
        <TouchableOpacity style={styles.button} onPress={testOnboardingFlow}>
          <Text style={styles.buttonText}>Test Onboarding Flow</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={checkOnboardingStatus}>
          <Text style={styles.buttonText}>Check Onboarding Status</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication Tests</Text>
        
        <TouchableOpacity style={styles.button} onPress={testAuthFlow}>
          <Text style={styles.buttonText}>Check Auth Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logoutUser}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation Tests</Text>
        
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/')}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => router.push('/onboarding')}>
          <Text style={styles.buttonText}>Go to Onboarding</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Cubano',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
  },
});