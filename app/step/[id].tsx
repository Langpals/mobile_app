// app/step/[id].tsx - Enhanced Step Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Mic, RotateCcw, ArrowRight, Lightbulb, Volume2 } from 'lucide-react-native';
import { mockSeasons } from '@/data/mockData';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import TeddyMascot from '@/components/ui/TeddyMascot';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import { Step, DifficultyLevel } from '@/types';

const { width, height } = Dimensions.get('window');

export default function StepScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState<Step | null>(null);
  const [episodeInfo, setEpisodeInfo] = useState<any>(null);
  const [stepNumber, setStepNumber] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'learning' | 'practice' | 'completed'>('intro');
  const [showHint, setShowHint] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [progressAnimation] = useState(new Animated.Value(0));
  const [celebrationAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Find the step from all seasons' episodes
    for (const season of mockSeasons) {
      for (const episode of season.episodes) {
        const foundStepIndex = episode.steps.findIndex(s => s.id === id);
        if (foundStepIndex !== -1) {
          const foundStep = episode.steps[foundStepIndex];
          setStep(foundStep);
          setEpisodeInfo(episode);
          setStepNumber(foundStepIndex + 1);
          setCompleted(foundStep.completed);
          setCurrentPhase(foundStep.completed ? 'completed' : 'intro');
          break;
        }
      }
    }

    // Animate entrance
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [id]);

  const handleStartStep = () => {
    setCurrentPhase('learning');
    setStartTime(Date.now());
    
    // Animate progress
    Animated.timing(progressAnimation, {
      toValue: 0.33,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  const handlePracticePhase = () => {
    setCurrentPhase('practice');
    setInteractionCount(interactionCount + 1);
    
    // Animate progress
    Animated.timing(progressAnimation, {
      toValue: 0.66,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  const handleComplete = () => {
    const endTime = Date.now();
    setResponseTime(Math.round((endTime - startTime) / 1000));
    setCompleted(true);
    setCurrentPhase('completed');
    
    // Complete progress animation
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();

    // Celebration animation
    Animated.spring(celebrationAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleNextStep = () => {
    // Find next step in episode
    if (episodeInfo && episodeInfo.steps) {
      const currentIndex = episodeInfo.steps.findIndex((s: Step) => s.id === id);
      const nextStep = episodeInfo.steps[currentIndex + 1];
      
      if (nextStep) {
        router.replace({
          pathname: "/step/[id]",
          params: { id: nextStep.id }
        });
      } else {
        // No more steps, go back to episode
        router.back();
      }
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'vocabulary': return BookOpen;
      case 'interaction': return Mic;
      case 'assessment': return CheckCircle;
      default: return Play;
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'vocabulary': return Colors.light.primary;
      case 'interaction': return Colors.light.secondary;
      case 'assessment': return Colors.light.success;
      case 'review': return Colors.light.accent;
      default: return Colors.light.primary;
    }
  };

  const getDifficultySettings = (level: DifficultyLevel) => {
    const settings = {
      veryEasy: { responseTime: 10, repetitions: 3, hints: true },
      easy: { responseTime: 8, repetitions: 2, hints: true },
      medium: { responseTime: 6, repetitions: 1, hints: true },
      hard: { responseTime: 5, repetitions: 1, hints: false },
      veryHard: { responseTime: 4, repetitions: 0, hints: false }
    };
    return settings[level];
  };

  const renderIntroPhase = () => (
    <Animated.View style={[styles.phaseContainer, { opacity: fadeAnimation }]}>
      <View style={styles.stepHeader}>
        <View style={styles.stepTypeContainer}>
          {React.createElement(getStepTypeIcon(step?.type || 'introduction'), {
            size: 24,
            color: getStepTypeColor(step?.type || 'introduction')
          })}
          <Text style={[styles.stepType, { color: getStepTypeColor(step?.type || 'introduction') }]}>
            {step?.type.toUpperCase()}
          </Text>
        </View>
        <DifficultyBadge level={step?.difficulty || 'easy'} />
      </View>

      <Text style={styles.stepTitle}>{step?.title}</Text>
      <Text style={styles.stepDescription}>{step?.description}</Text>

      {/* Vocabulary Preview */}
      {step?.vocabularyWords && step.vocabularyWords.length > 0 && (
        <View style={styles.vocabularyPreview}>
          <Text style={styles.vocabularyTitle}>New Words:</Text>
          <View style={styles.vocabularyList}>
            {step.vocabularyWords.map((word, index) => (
              <View key={index} style={styles.vocabularyChip}>
                <Text style={styles.vocabularyWord}>{word}</Text>
                <TouchableOpacity style={styles.pronunciationButton}>
                  <Volume2 size={14} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Learning Tips */}
      <View style={styles.tipsContainer}>
        <View style={styles.tipHeader}>
          <Lightbulb size={16} color={Colors.light.warning} />
          <Text style={styles.tipTitle}>Learning Tips</Text>
        </View>
        <Text style={styles.tipText}>
          {step?.difficulty === 'veryEasy' ? 
            "Take your time! I'll repeat everything and give you lots of hints." :
            step?.difficulty === 'easy' ?
            "Don't worry if you make mistakes - that's how we learn!" :
            step?.difficulty === 'medium' ?
            "Listen carefully and try your best. You're doing great!" :
            "You're ready for a challenge! Trust yourself and have fun!"
          }
        </Text>
      </View>

      <TeddyMascot 
        mood="encouraging" 
        message={`¡Hola! Ready to learn about ${step?.title.toLowerCase()}? ¡Vamos!`}
        size="medium" 
      />

      <TouchableOpacity style={styles.startButton} onPress={handleStartStep}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Play size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Start Learning</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderLearningPhase = () => (
    <View style={styles.phaseContainer}>
      <View style={styles.learningContent}>
        <Text style={styles.phaseTitle}>Learning Phase</Text>
        <Text style={styles.phaseDescription}>
          Listen to Bern and learn the new words and phrases
        </Text>

        {/* Interactive Learning Area */}
        <View style={styles.interactiveArea}>
          <TeddyMascot 
            mood="teaching" 
            message="Now I'll teach you some new Spanish words. Listen carefully!"
            size="large" 
          />
          
          {/* Mock Interactive Elements */}
          <View style={styles.learningCards}>
            {step?.vocabularyWords?.slice(0, 2).map((word, index) => (
              <View key={index} style={styles.learningCard}>
                <Text style={styles.wordSpanish}>{word}</Text>
                <Text style={styles.wordEnglish}>({getEnglishTranslation(word)})</Text>
                <TouchableOpacity style={styles.repeatButton}>
                  <RotateCcw size={16} color={Colors.light.secondary} />
                  <Text style={styles.repeatText}>Repeat</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.nextPhaseButton} onPress={handlePracticePhase}>
          <Text style={styles.nextPhaseText}>Ready to Practice</Text>
          <ArrowRight size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPracticePhase = () => (
    <View style={styles.phaseContainer}>
      <View style={styles.practiceContent}>
        <Text style={styles.phaseTitle}>Practice Time</Text>
        <Text style={styles.phaseDescription}>
          Now it's your turn! Try saying the words you just learned
        </Text>

        {/* Practice Interface */}
        <View style={styles.practiceInterface}>
          <TeddyMascot 
            mood="encouraging" 
            message="Your turn! Can you say 'Hola'? Press and hold the button while you speak."
            size="medium" 
          />

          <View style={styles.practiceCard}>
            <Text style={styles.practicePrompt}>Say: "Hola"</Text>
            <TouchableOpacity style={styles.micButton}>
              <Mic size={32} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.micInstructions}>Hold to speak</Text>
          </View>

          {showHint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>
                💡 Try saying "OH-lah" - break it into syllables!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.practiceActions}>
          <TouchableOpacity 
            style={styles.hintButton} 
            onPress={() => setShowHint(!showHint)}
          >
            <Lightbulb size={18} color={Colors.light.warning} />
            <Text style={styles.hintButtonText}>Get Hint</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>I Did It!</Text>
            <CheckCircle size={20} color={Colors.light.success} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCompletedPhase = () => (
    <Animated.View 
      style={[
        styles.phaseContainer,
        {
          transform: [{
            scale: celebrationAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1]
            })
          }]
        }
      ]}
    >
      <View style={styles.celebrationContent}>
        <Text style={styles.celebrationTitle}>¡Excelente!</Text>
        <Text style={styles.celebrationSubtitle}>You completed this step!</Text>

        <View style={styles.completionStats}>
          <View style={styles.statItem}>
            <Clock size={20} color={Colors.light.primary} />
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{responseTime}s</Text>
          </View>
          
          <View style={styles.statItem}>
            <Mic size={20} color={Colors.light.secondary} />
            <Text style={styles.statLabel}>Attempts</Text>
            <Text style={styles.statValue}>{interactionCount}</Text>
          </View>
          
          <View style={styles.statItem}>
            <CheckCircle size={20} color={Colors.light.success} />
            <Text style={styles.statLabel}>Status</Text>
            <Text style={styles.statValue}>Perfect!</Text>
          </View>
        </View>

        <TeddyMascot 
          mood="excited" 
          message="¡Fantástico! You're becoming a Spanish superstar! Ready for the next step?"
          size="large" 
        />

        <View style={styles.completionActions}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to Episode</Text>
          </TouchableOpacity>

          {episodeInfo && episodeInfo.steps && 
           episodeInfo.steps.findIndex((s: Step) => s.id === id) < episodeInfo.steps.length - 1 && (
            <TouchableOpacity style={styles.nextStepButton} onPress={handleNextStep}>
              <LinearGradient
                colors={[Colors.light.success, Colors.light.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Next Step</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );

  // Helper function for mock translations
  const getEnglishTranslation = (word: string): string => {
    const translations: { [key: string]: string } = {
      'Hola': 'Hello',
      'Adiós': 'Goodbye',
      'Gracias': 'Thank you',
      'Me llamo': 'My name is',
      'Rojo': 'Red',
      'Azul': 'Blue',
      'Verde': 'Green',
      'Amarillo': 'Yellow'
    };
    return translations[word] || 'Translation';
  };

  if (!step || !episodeInfo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <TeddyMascot mood="thinking" message="Loading your learning step..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[
          getStepTypeColor(step.type) + '10',
          Colors.light.background,
          Colors.light.secondary + '05'
        ]}
        style={styles.gradientBackground}
      >
        {/* Header with Progress */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backHeaderButton}>
              <ArrowLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{episodeInfo.title}</Text>
              <Text style={styles.headerSubtitle}>Step {stepNumber} of {episodeInfo.steps.length}</Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentPhase === 'intro' ? 'Ready to start' :
               currentPhase === 'learning' ? 'Learning...' :
               currentPhase === 'practice' ? 'Practicing...' :
               'Completed!'}
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentPhase === 'intro' && renderIntroPhase()}
          {currentPhase === 'learning' && renderLearningPhase()}
          {currentPhase === 'practice' && renderPracticePhase()}
          {currentPhase === 'completed' && renderCompletedPhase()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.light.cardBackground,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  phaseContainer: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepType: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    marginLeft: 6,
  },
  stepTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.8,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  vocabularyPreview: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  vocabularyTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  vocabularyList: {
    gap: 8,
  },
  vocabularyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
  },
  vocabularyWord: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.primary,
  },
  pronunciationButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsContainer: {
    backgroundColor: Colors.light.warning + '10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.warning,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 6,
  },
  tipText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  startButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 20,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 16,
  },
  buttonText: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  learningContent: {
    alignItems: 'center',
  },
  phaseTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 22,
    color: Colors.light.text,
    marginBottom: 8,
  },
  phaseDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
  },
  interactiveArea: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  learningCards: {
    width: '100%',
    marginTop: 20,
    gap: 12,
  },
  learningCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  wordSpanish: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  wordEnglish: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 12,
  },
  repeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  repeatText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.secondary,
    marginLeft: 4,
  },
  nextPhaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  nextPhaseText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.primary,
    marginRight: 8,
  },
  practiceContent: {
    alignItems: 'center',
  },
  practiceInterface: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  practiceCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  practicePrompt: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 20,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  micInstructions: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  hintContainer: {
    backgroundColor: Colors.light.warning + '15',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.light.warning + '30',
  },
  hintText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
  practiceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.warning + '20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  hintButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.warning,
    marginLeft: 6,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.success + '20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  completeButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.success,
    marginRight: 6,
  },
  celebrationContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  celebrationTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 32,
    color: Colors.light.primary,
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 24,
  },
  completionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginTop: 4,
  },
  statValue: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 2,
  },
  completionActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  backButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  nextStepButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});