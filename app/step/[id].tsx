import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react-native';
import { mockSeasons } from '@/data/mockData';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import TeddyMascot from '@/components/ui/TeddyMascot';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import { Step } from '@/types';

export default function StepScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState<Step | null>(null);
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [stepNumber, setStepNumber] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Find the step from all seasons' episodes
    for (const season of mockSeasons) {
      for (const episode of season.episodes) {
        const foundStepIndex = episode.steps.findIndex(s => s.id === id);
        if (foundStepIndex !== -1) {
          const foundStep = episode.steps[foundStepIndex];
          setStep(foundStep);
          setEpisodeTitle(episode.title);
          setStepNumber(foundStepIndex + 1);
          setCompleted(foundStep.completed);
          break;
        }
      }
    }
  }, [id]);

  const handleComplete = () => {
    setCompleted(true);
  };

  if (!step) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={globalStyles.text}>Loading step...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{episodeTitle}</Text>
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.stepNumber}>STEP {stepNumber}</Text>
          <Text style={styles.title}>{step.title}</Text>
          
          <View style={styles.badgeContainer}>
            <DifficultyBadge level={step.difficulty} />
          </View>
          
          <TeddyMascot 
            mood="happy" 
            message="Are you ready to learn something new?" 
            size="medium" 
          />
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>What We'll Learn</Text>
            <Text style={styles.description}>{step.description}</Text>
            
            <Text style={styles.instructionTitle}>Instructions</Text>
            <Text style={styles.instructionText}>
              1. Find a quiet place to sit with your child.
            </Text>
            <Text style={styles.instructionText}>
              2. Make sure the teddy bear is nearby and turned on.
            </Text>
            <Text style={styles.instructionText}>
              3. Press the play button to begin the activity.
            </Text>
            <Text style={styles.instructionText}>
              4. Follow along with Bernie's instructions.
            </Text>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          {!completed ? (
            <TouchableOpacity style={styles.playButton} onPress={handleComplete}>
              <Play size={24} color="#FFFFFF" />
              <Text style={styles.playButtonText}>Start Activity</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedContainer}>
              <CheckCircle size={24} color={Colors.light.success} />
              <Text style={styles.completedText}>Completed!</Text>
              
              <TouchableOpacity 
                style={styles.nextButton}
                onPress={() => router.back()}
              >
                <Text style={styles.nextButtonText}>Back to Episode</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  stepNumber: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 12,
  },
  badgeContainer: {
    marginBottom: 24,
  },
  descriptionContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  instructionTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
  },
  instructionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.light.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  playButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  playButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  completedContainer: {
    alignItems: 'center',
  },
  completedText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    color: Colors.light.success,
    marginTop: 8,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});