// app/onboarding/index.tsx - Simple fixes only
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Dimensions,
  Platform,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Heart, 
  Play, 
  Star, 
  Globe, 
  Trophy, 
  BookOpen, 
  MessageCircle,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';
import TeddyMascot from '@/components/ui/TeddyMascot';
import { useTeddy } from '@/contexts/TeddyContext';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  gradient: [string, string];
  features?: Array<{
    icon: any;
    title: string;
    description: string;
    color: string;
  }>;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "¡Hola! Welcome to",
    subtitle: "Bern Learning",
    description: "Meet your child's magical learning companion! Teddy will guide them through an amazing Spanish adventure.",
    icon: Heart,
    gradient: ['#FF6B6B', '#FF8E8E'],
    features: [
      {
        icon: Play,
        title: "Interactive Adventures",
        description: "Learn through magical stories and games",
        color: '#FF6B6B'
      },
      {
        icon: Star,
        title: "Personalized Learning",
        description: "Adapts to your child's learning pace",
        color: '#FFB74D'
      },
      {
        icon: Trophy,
        title: "Progress Tracking",
        description: "Watch your child's Spanish skills grow",
        color: '#4CAF50'
      }
    ]
  },
  {
    id: 2,
    title: "How Learning",
    subtitle: "Really Works",
    description: "Teddy connects to your device and creates immersive learning experiences that feel like play.",
    icon: Globe,
    gradient: ['#4ECDC4', '#44A08D'],
    features: [
      {
        icon: MessageCircle,
        title: "Natural Conversations",
        description: "Real Spanish conversations with Teddy",
        color: '#4ECDC4'
      },
      {
        icon: Clock,
        title: "Daily Adventures",
        description: "Short, engaging 10-15 minute sessions",
        color: '#FFB347'
      },
      {
        icon: Target,
        title: "Smart Progress",
        description: "AI tracks learning and adjusts difficulty",
        color: '#9B59B6'
      }
    ]
  },
  {
    id: 3,
    title: "Meet Your",
    subtitle: "Learning Buddy",
    description: "Give your Teddy bear a special name and get ready for an incredible Spanish learning journey!",
    icon: Sparkles,
    gradient: ['#66BB6A', '#4CAF50'] // More green as requested
  }
];

export default function EnhancedOnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [teddyName, setTeddyName] = useState('Teddy');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { updateTeddy } = useTeddy();
  const { isAuthenticated } = useAuth();

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [progressAnim] = useState(new Animated.Value(0));
  const [featureAnims] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    animateStepEntrance();
  }, [currentStep]);

  // Simple keyboard handling for step 3
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const animateStepEntrance = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    featureAnims.forEach(anim => anim.setValue(0));

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: currentStep / onboardingSteps.length,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Animate main content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    // Staggered feature animations
    if (currentStep !== 3) {
      featureAnims.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: 300 + index * 150,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    
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
      
      // Check authentication and redirect
      const authenticated = await isAuthenticated();
      
      if (authenticated) {
        router.replace('/(tabs)/');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Complete anyway
      await SecureStore.setItemAsync('onboarding_completed', 'true');
      
      const authenticated = await isAuthenticated();
      if (authenticated) {
        router.replace('/(tabs)/');
      } else {
        router.replace('/(auth)/login');
      }
    }
    
    setIsLoading(false);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <Animated.View 
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {currentStep} of {onboardingSteps.length}
      </Text>
    </View>
  );

  const renderFeature = (feature: any, index: number) => (
    <Animated.View
      key={index}
      style={[
        styles.featureCard,
        {
          opacity: featureAnims[index],
          transform: [
            {
              translateY: featureAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      {Platform.OS === 'ios' && (
        <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
      )}
      <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
        <feature.icon size={24} color={feature.color} strokeWidth={2} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </Animated.View>
  );

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep - 1];
    const IconComponent = step.icon;

    if (currentStep === 3) {
      // Special teddy naming step
      return (
        <View style={styles.teddyStepContainer}>
          <Animated.View 
            style={[
              styles.stepContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <LinearGradient colors={step.gradient} style={styles.iconGradient}>
                <IconComponent size={48} color="#FFF" strokeWidth={2} />
              </LinearGradient>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.stepTitle}>
                {step.title}
              </Text>
              <Text style={styles.stepSubtitle}>
                {step.subtitle}
              </Text>
              <Text style={styles.stepDescription}>
                {step.description}
              </Text>
            </View>

            <View style={styles.teddyContainer}>
              <TeddyMascot 
                mood="excited" 
                size="large"
                message={`I'm ${teddyName}!`}
              />
            </View>

            <View style={styles.nameInputContainer}>
              <Text style={styles.nameInputLabel}>What should we call your Teddy?</Text>
              <TextInput
                style={styles.nameInput}
                value={teddyName}
                onChangeText={setTeddyName}
                placeholder="Enter Teddy's name"
                placeholderTextColor="#999"
                maxLength={20}
                autoCapitalize="words"
              />
            </View>
          </Animated.View>
        </View>
      );
    }

    return (
      <Animated.View 
        style={[
          styles.stepContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <LinearGradient colors={step.gradient} style={styles.iconGradient}>
            <IconComponent size={48} color="#FFF" strokeWidth={2} />
          </LinearGradient>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.stepTitle}>
            {step.title}
          </Text>
          <Text style={styles.stepSubtitle}>
            {step.subtitle}
          </Text>
          <Text style={styles.stepDescription}>
            {step.description}
          </Text>
        </View>

        {step.features && (
          <View style={styles.featuresContainer}>
            {step.features.map((feature, index) => renderFeature(feature, index))}
          </View>
        )}
      </Animated.View>
    );
  };

  const currentStepData = onboardingSteps[currentStep - 1];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={currentStepData.gradient[0]} />
      
      <LinearGradient colors={currentStepData.gradient} style={styles.background}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFillObject} />
        ) : null}
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderProgressBar()}
          {renderStepContent()}
        </ScrollView>

        {/* Fixed navigation - hide back button when keyboard is visible on step 3 */}
        <View style={styles.navigationContainer}>
          {currentStep > 1 && !(keyboardVisible && currentStep === 3) && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={20} color="#FFF" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.nextButton, currentStep === 1 && styles.nextButtonCentered]}
            onPress={handleNext}
            disabled={isLoading}
          >
            <LinearGradient 
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.nextButtonGradient}
            >
              {isLoading ? (
                <Text style={styles.nextButtonText}>Setting up...</Text>
              ) : (
                <>
                  <Text style={styles.nextButtonText}>
                    {currentStep === onboardingSteps.length ? "Let's Start!" : 'Continue'}
                  </Text>
                  <ChevronRight size={20} color="#FFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 40 : 60,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  progressTrack: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
  },
  // Special container for step 3 to ensure no scrolling
  teddyStepContainer: {
    flex: 1,
    minHeight: height - 200, // Ensure content fits without scrolling
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stepTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 32,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  stepSubtitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 36,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  stepDescription: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    width: '100%',
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    color: '#FFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  teddyContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  // Simple greeting box
  greetingBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  greetingText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  nameInputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  nameInputLabel: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  nameInput: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#FFF',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  backButtonText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  nextButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 0,
  },
  nextButtonCentered: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -80 }],
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  nextButtonText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    color: '#FFF',
  },
});