// app/episode/[id].tsx - Enhanced Episode Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Users, MapPin, Sparkles, Play, CheckCircle, Star, Target } from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockSeasons } from '@/data/mockData';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import StepCard from '@/components/ui/StepCard';
import TeddyMascot from '@/components/ui/TeddyMascot';
import { Episode, DifficultyLevel } from '@/types';

const { width } = Dimensions.get('window');

export default function EpisodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [seasonInfo, setSeasonInfo] = useState<any>(null);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<DifficultyLevel>('easy');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [headerAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Find the episode from all seasons
    for (const season of mockSeasons) {
      const foundEpisode = season.episodes.find(ep => ep.id === id);
      if (foundEpisode) {
        setEpisode(foundEpisode);
        setSeasonInfo(season);
        setAdaptiveDifficulty(foundEpisode.difficulty);
        setEstimatedTime(foundEpisode.steps.reduce((total, step) => total + step.estimatedDuration, 0));
        break;
      }
    }

    // Animate header
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [id]);

  const getDifficultyDescription = (level: DifficultyLevel) => {
    const descriptions = {
      veryEasy: 'Perfect for beginners! Extra time to respond and lots of repetition.',
      easy: 'Great for building confidence with clear explanations.',
      medium: 'Standard pace with moderate challenge.',
      hard: 'More challenging with faster responses needed.',
      veryHard: 'Advanced level with minimal repetition.'
    };
    return descriptions[level];
  };

  const getVocabularyPreview = () => {
    if (!episode) return [];
    return episode.vocabularyFocus.slice(0, 6); // Show first 6 words
  };

  const getCompletionBadge = () => {
    if (!episode) return null;
    
    if (episode.completed) {
      return (
        <View style={styles.completionBadge}>
          <Star size={16} color="#FFFFFF" />
          <Text style={styles.completionBadgeText}>Completed!</Text>
        </View>
      );
    } else if (episode.completionRate > 0) {
      return (
        <View style={[styles.completionBadge, { backgroundColor: Colors.light.warning }]}>
          <Play size={16} color="#FFFFFF" />
          <Text style={styles.completionBadgeText}>In Progress</Text>
        </View>
      );
    }
    return null;
  };

  const handleStartEpisode = () => {
    if (episode && episode.steps.length > 0) {
      const firstIncompleteStep = episode.steps.find(step => !step.completed);
      const stepToStart = firstIncompleteStep || episode.steps[0];
      
      router.push({
        pathname: "/step/[id]",
        params: { id: stepToStart.id }
      });
    }
  };

  if (!episode || !seasonInfo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <TeddyMascot mood="thinking" message="Loading your adventure..." />
        </View>
      </SafeAreaView>
    );
  }

  const completedSteps = episode.steps.filter(step => step.completed).length;
  const totalSteps = episode.steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.light.primary + '10', Colors.light.background, Colors.light.secondary + '10']}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: headerAnimation,
                transform: [{
                  translateY: headerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0]
                  })
                }]
              }
            ]}
          >
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={Colors.light.text} />
              </TouchableOpacity>
              {getCompletionBadge()}
            </View>
            
            <View style={styles.seasonBreadcrumb}>
              <Text style={styles.seasonText}>{seasonInfo.title}</Text>
              <Text style={styles.breadcrumbSeparator}>•</Text>
              <Text style={styles.episodeNumber}>Episode {episode.number}</Text>
            </View>
          </Animated.View>
          
          <View style={styles.contentContainer}>
            {/* Episode Title and Description */}
            <View style={styles.titleSection}>
              <Text style={styles.episodeTitle}>{episode.title}</Text>
              <Text style={styles.episodeDescription}>{episode.description}</Text>
            </View>

            {/* Setting and Narrative Hook */}
            <View style={styles.storySection}>
              <View style={styles.storyCard}>
                <View style={styles.storyHeader}>
                  <MapPin size={20} color={Colors.light.secondary} />
                  <Text style={styles.storyHeaderText}>Adventure Setting</Text>
                </View>
                <Text style={styles.settingText}>{episode.setting}</Text>
                
                <View style={styles.narrativeHook}>
                  <Sparkles size={16} color={Colors.light.primary} />
                  <Text style={styles.narrativeText}>{episode.narrativeHook}</Text>
                </View>
              </View>
            </View>

            {/* Episode Metadata */}
            <View style={styles.metaSection}>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Clock size={18} color={Colors.light.text} />
                  <Text style={styles.metaText}>{episode.duration} MINUTES</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Users size={18} color={Colors.light.text} />
                  <Text style={styles.metaText}>{totalSteps} STEPS</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Target size={18} color={Colors.light.text} />
                  <Text style={styles.metaText}>{episode.vocabularyFocus.length} WORDS</Text>
                </View>
              </View>
              
              <View style={styles.difficultyRow}>
                <DifficultyBadge level={adaptiveDifficulty} />
                <Text style={styles.difficultyDescription}>
                  {getDifficultyDescription(adaptiveDifficulty)}
                </Text>
              </View>
            </View>

            {/* Progress Overview */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Your Progress</Text>
                <Text style={styles.progressStats}>
                  {completedSteps}/{totalSteps} steps completed
                </Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${progressPercentage}%` }
                  ]}
                />
              </View>
              
              <Text style={styles.progressText}>
                {progressPercentage === 100 ? '¡Excelente! Episode completed!' :
                 progressPercentage > 0 ? `${Math.round(progressPercentage)}% complete - ¡Sigue así!` :
                 'Ready to start your adventure!'}
              </Text>
            </View>

            {/* Vocabulary Preview */}
            <View style={styles.vocabularySection}>
              <Text style={styles.vocabularyTitle}>Words You'll Learn</Text>
              <View style={styles.vocabularyGrid}>
                {getVocabularyPreview().map((word, index) => (
                  <View key={index} style={styles.vocabularyChip}>
                    <Text style={styles.vocabularyWord}>{word}</Text>
                  </View>
                ))}
                {episode.vocabularyFocus.length > 6 && (
                  <View style={[styles.vocabularyChip, styles.vocabularyMore]}>
                    <Text style={styles.vocabularyMoreText}>
                      +{episode.vocabularyFocus.length - 6} more
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Learning Outcomes */}
            <View style={styles.outcomesSection}>
              <Text style={styles.outcomesTitle}>Learning Goals</Text>
              <View style={styles.outcomesList}>
                {episode.learningOutcomes.map((outcome, index) => (
                  <View key={index} style={styles.outcomeItem}>
                    <View style={styles.outcomeIcon}>
                      <CheckCircle size={16} color={Colors.light.success} />
                    </View>
                    <Text style={styles.outcomeText}>{outcome}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Bern's Encouragement */}
            <View style={styles.mascotSection}>
              <TeddyMascot 
                mood={episode.completed ? 'excited' : 'happy'}
                message={
                  episode.completed ? 
                    "¡Fantástico! You've mastered this episode! Want to play it again?" :
                    progressPercentage > 0 ?
                      "¡Hola! Ready to continue where we left off? ¡Vamos!" :
                      `¡Hola! I'm excited to explore ${episode.setting} with you!`
                }
                size="medium"
              />
            </View>

            {/* Steps List */}
            <View style={styles.stepsSection}>
              <Text style={styles.stepsTitle}>Adventure Steps</Text>
              <Text style={styles.stepsDescription}>
                Follow along with each step of your magical journey!
              </Text>
              
              {episode.steps.map((step, index) => (
                <StepCard 
                  key={step.id}
                  step={step}
                  stepNumber={index + 1}
                  onPress={() => router.push({
                    pathname: "/step/[id]",
                    params: { id: step.id }
                  })}
                />
              ))}
            </View>

            {/* Action Button */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartEpisode}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[Colors.light.primary, Colors.light.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startButtonGradient}
                >
                  <View style={styles.startButtonContent}>
                    {episode.completed ? (
                      <>
                        <Star size={24} color="#FFFFFF" />
                        <Text style={styles.startButtonText}>Play Again</Text>
                      </>
                    ) : progressPercentage > 0 ? (
                      <>
                        <Play size={24} color="#FFFFFF" />
                        <Text style={styles.startButtonText}>Continue Episode</Text>
                      </>
                    ) : (
                      <>
                        <Sparkles size={24} color="#FFFFFF" />
                        <Text style={styles.startButtonText}>Start Adventure</Text>
                      </>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <Text style={styles.estimatedTime}>
                Estimated time: {estimatedTime} minutes
              </Text>
            </View>
          </View>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completionBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  seasonBreadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seasonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
  },
  breadcrumbSeparator: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.5,
    marginHorizontal: 8,
  },
  episodeNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.primary,
  },
  contentContainer: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 20,
  },
  episodeTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 26,
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 32,
  },
  episodeDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.8,
    lineHeight: 24,
  },
  storySection: {
    marginBottom: 24,
  },
  storyCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyHeaderText: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 6,
  },
  settingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  narrativeHook: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.primary + '10',
    padding: 12,
    borderRadius: 8,
  },
  narrativeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  metaSection: {
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.text,
    marginTop: 4,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    padding: 12,
    borderRadius: 12,
  },
  difficultyDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
    marginLeft: 12,
    flex: 1,
  },
  progressSection: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
  },
  progressStats: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.success,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
  },
  vocabularySection: {
    marginBottom: 24,
  },
  vocabularyTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
  },
  vocabularyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vocabularyChip: {
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
  },
  vocabularyWord: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.primary,
  },
  vocabularyMore: {
    backgroundColor: Colors.light.secondary + '15',
    borderColor: Colors.light.secondary + '30',
  },
  vocabularyMoreText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.secondary,
  },
  outcomesSection: {
    marginBottom: 24,
  },
  outcomesTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
  },
  outcomesList: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  outcomeIcon: {
    marginRight: 8,
  },
  outcomeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  mascotSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepsSection: {
    marginBottom: 32,
  },
  stepsTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 8,
  },
  stepsDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 16,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  startButton: {
    width: '100%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 12,
  },
  startButtonGradient: {
    borderRadius: 16,
    padding: 16,
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  estimatedTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
});