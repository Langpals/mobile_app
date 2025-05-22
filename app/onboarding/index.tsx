import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Colors from '@/constants/Colors';
import { globalStyles } from '@/constants/Styles';
import TeddyMascot from '@/components/ui/TeddyMascot';
import { useTeddy } from '@/contexts/TeddyContext';

const OnboardingScreen = () => {
  const [step, setStep] = useState(1);
  const [teddyName, setTeddyName] = useState('Bernie');
  const { updateTeddy, loading } = useTeddy();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeTeddySetup();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const completeTeddySetup = async () => {
    try {
      // Save teddy data
      await updateTeddy({
        name: teddyName,
        appearance: {
          color: 'brown',
          accessories: [],
          outfit: 'default'
        }
      });
      
      // Mark onboarding as completed
      await SecureStore.setItemAsync('onboarding_completed', 'true');
      
      // Navigate to the main app
      router.replace('/(tabs)/');
    } catch (error) {
      console.error('Error setting up teddy:', error);
      // Mark onboarding as completed anyway and navigate
      await SecureStore.setItemAsync('onboarding_completed', 'true');
      router.replace('/(tabs)/');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Welcome to Bernie!</Text>
            <Text style={styles.stepDescription}>
              Meet your child's new learning companion! Bernie the teddy bear helps your child learn languages through play and exploration.
            </Text>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/2767814/pexels-photo-2767814.jpeg' }}
              style={styles.teddyImage}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>How It Works</Text>
            <Text style={styles.stepDescription}>
              Bernie connects to your device and guides your child through interactive learning episodes. You'll track progress and see real-time metrics of your child's language development.
            </Text>
            <View style={styles.features}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.primary + '30' }]} />
                <Text style={styles.featureText}>Interactive Learning Episodes</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.secondary + '30' }]} />
                <Text style={styles.featureText}>Progress Tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.accent + '30' }]} />
                <Text style={styles.featureText}>Real-time Metrics</Text>
              </View>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Get Started!</Text>
            <Text style={styles.stepDescription}>
              You're all set to begin the learning journey with Bernie. Connect your teddy bear and start the first episode.
            </Text>
            <TeddyMascot 
              mood="excited" 
              message="I can't wait to meet you!" 
              size="large" 
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={styles.progress}>
          {[1, 2, 3].map((dot) => (
            <View 
              key={dot} 
              style={[
                styles.progressDot,
                step === dot && styles.progressDotActive
              ]} 
            />
          ))}
        </View>
        
        {renderStepContent()}
        
        <View style={styles.navigation}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
            disabled={loading}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.border,
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: Colors.light.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 40,
  },
  stepTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  stepDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  teddyImage: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 5,
    borderColor: Colors.light.primary,
  },
  features: {
    width: '100%',
    marginTop: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  featureText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  nextButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextButtonText: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default OnboardingScreen;