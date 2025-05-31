// app/(tabs)/index.tsx - Enhanced Learning Dashboard
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, MapPin, Trophy, Target, Zap } from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockSeasons, mockProgressStats, mockChildProfile } from '@/data/mockData';
import TeddyMascot from '@/components/ui/TeddyMascot';
import ProgressPath from '@/components/ui/ProgressPath';
import SeasonCard from '@/components/ui/SeasonCard';
import ProgressSummary from '@/components/ui/ProgressSummary';
import { Episode } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTeddy } from '@/contexts/TeddyContext';
import { useLearning } from '@/contexts/LearningContext';

const { width } = Dimensions.get('window');

export default function LearningDashboard() {
  const [currentSeason] = useState(mockSeasons[0]);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const [streakAnimation] = useState(new Animated.Value(0));
  const { currentUser, currentUserDocument } = useAuth();
  const { teddy, isConnected } = useTeddy();
  const { progress } = useLearning();

  useEffect(() => {
    // Find the next episode to play
    const nextEp = currentSeason.episodes.find(ep => !ep.completed && !ep.locked);
    setNextEpisode(nextEp || null);

    // Animate streak counter
    if (mockProgressStats.currentStreak > 0) {
      Animated.spring(streakAnimation, {
        toValue: 1,
        useNativeDriver: true,
        delay: 500
      }).start();
    }
  }, []);

  const handleEpisodePress = (episode: Episode) => {
    router.push({
      pathname: "/episode/[id]",
      params: { id: episode.id }
    });
  };

  const handleSeasonPress = (seasonNumber: number) => {
    router.push({
      pathname: "/season/[id]",
      params: { id: seasonNumber.toString() }
    });
  };

  const getBernMessage = () => {
    if (!isConnected) {
      return "¡Hola! Let's connect so we can start our magical adventure!";
    }
    if (nextEpisode) {
      return `Ready for "${nextEpisode.title}"? ¡Vamos a aprender!`;
    }
    return "¡Excelente! You're doing amazing with your Spanish learning!";
  };

  const getTeddyMood = () => {
    if (!isConnected) return 'thinking';
    if (mockProgressStats.currentStreak >= 3) return 'excited';
    return 'happy';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.light.background, '#FFE4E1', Colors.light.background]}
        style={styles.gradientBackground}
      >
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Personalized Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.welcomeText}>
                  ¡Hola, {mockChildProfile.name}! 👋
                </Text>
                <Text style={styles.subtitle}>Ready for more Spanish adventures?</Text>
              </View>
              
              {/* Streak Counter */}
              {mockProgressStats.currentStreak > 0 && (
                <Animated.View 
                  style={[
                    styles.streakContainer,
                    {
                      transform: [{
                        scale: streakAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1]
                        })
                      }]
                    }
                  ]}
                >
                  <Zap size={20} color={Colors.light.warning} />
                  <Text style={styles.streakText}>{mockProgressStats.currentStreak}</Text>
                  <Text style={styles.streakLabel}>day streak!</Text>
                </Animated.View>
              )}
            </View>
            
            {/* Bern's Message */}
            <View style={styles.mascotContainer}>
              <TeddyMascot 
                message={getBernMessage()}
                mood={getTeddyMood()}
                size="medium"
              />
            </View>
          </View>

          {/* Progress Summary - Enhanced */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Trophy size={24} color={Colors.light.primary} />
              <Text style={styles.progressTitle}>Your Learning Journey</Text>
            </View>
            
            <View style={styles.progressGrid}>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>{mockProgressStats.completedEpisodes}</Text>
                <Text style={styles.progressLabel}>Episodes</Text>
                <Text style={styles.progressSubLabel}>Completed</Text>
              </View>
              
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>{mockProgressStats.proficiency.vocabularyMastery.mastered}</Text>
                <Text style={styles.progressLabel}>Words</Text>
                <Text style={styles.progressSubLabel}>Mastered</Text>
              </View>
              
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>{Math.round(mockProgressStats.totalTimeSpent)}</Text>
                <Text style={styles.progressLabel}>Minutes</Text>
                <Text style={styles.progressSubLabel}>Learning</Text>
              </View>
            </View>

            {/* Weekly Goal Progress */}
            <View style={styles.weeklyGoal}>
              <View style={styles.goalHeader}>
                <Target size={16} color={Colors.light.secondary} />
                <Text style={styles.goalTitle}>Weekly Goal</Text>
              </View>
              <View style={styles.goalProgressBar}>
                <View 
                  style={[
                    styles.goalProgress, 
                    { width: `${(mockProgressStats.weeklyCompletedMinutes / mockProgressStats.weeklyGoalMinutes) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.goalText}>
                {mockProgressStats.weeklyCompletedMinutes} / {mockProgressStats.weeklyGoalMinutes} minutes
              </Text>
            </View>
          </View>

          {/* Continue Learning Card */}
          {nextEpisode && (
            <TouchableOpacity
              style={styles.continueCard}
              onPress={() => handleEpisodePress(nextEpisode)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueGradient}
              >
                <View style={styles.continueContent}>
                  <View style={styles.continueIcon}>
                    <Sparkles size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.continueText}>
                    <Text style={styles.continueTitle}>Continue Learning</Text>
                    <Text style={styles.continueEpisode}>
                      Episode {nextEpisode.number}: {nextEpisode.title}
                    </Text>
                    <Text style={styles.continueDuration}>
                      {nextEpisode.duration} minutes • {nextEpisode.setting}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Season Overview */}
          <View style={styles.seasonSection}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={Colors.light.text} />
              <Text style={styles.sectionTitle}>Current Adventure</Text>
            </View>
            
            <SeasonCard season={currentSeason} />
          </View>

          {/* Episode Progress Path */}
          <View style={styles.episodeSection}>
            <Text style={styles.sectionTitle}>Episode Adventures</Text>
            <Text style={styles.sectionDescription}>
              Follow the magical path through {currentSeason.title}
            </Text>
            
            <View style={styles.pathContainer}>
              <ProgressPath 
                episodes={currentSeason.episodes} 
                onEpisodePress={handleEpisodePress}
              />
            </View>
          </View>

          {/* All Seasons Preview */}
          <View style={styles.allSeasonsSection}>
            <Text style={styles.sectionTitle}>All Adventures</Text>
            <Text style={styles.sectionDescription}>
              Discover all the amazing places you'll explore with Bern!
            </Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.seasonsScroll}
            >
              {mockSeasons.map((season, index) => (
                <TouchableOpacity
                  key={season.id}
                  style={[
                    styles.seasonPreview,
                    season.locked && styles.seasonLocked,
                    index === 0 && styles.seasonActive
                  ]}
                  onPress={() => !season.locked && handleSeasonPress(season.number)}
                  activeOpacity={season.locked ? 1 : 0.7}
                >
                  <View style={styles.seasonNumber}>
                    <Text style={styles.seasonNumberText}>{season.number}</Text>
                  </View>
                  <Text style={styles.seasonPreviewTitle}>{season.title}</Text>
                  <Text style={styles.seasonPreviewTheme}>{season.theme}</Text>
                  {season.locked && (
                    <View style={styles.lockedOverlay}>
                      <Text style={styles.lockedText}>Coming Soon!</Text>
                    </View>
                  )}
                  {index === 0 && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/(tabs)/metrics')}
              >
                <Text style={styles.actionEmoji}>📊</Text>
                <Text style={styles.actionText}>View Progress</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/(tabs)/account')}
              >
                <Text style={styles.actionEmoji}>🎯</Text>
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionEmoji}>🎵</Text>
                <Text style={styles.actionText}>Practice Songs</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionEmoji}>🏆</Text>
                <Text style={styles.actionText}>Achievements</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Connection Status */}
          <View style={styles.connectionStatus}>
            <View style={[styles.connectionDot, { backgroundColor: isConnected ? Colors.light.success : Colors.light.error }]} />
            <Text style={styles.connectionText}>
              Bern is {isConnected ? 'connected and ready!' : 'waiting to connect'}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.select({
      android: StatusBar.currentHeight,
      ios: 0,
      web: 0,
    }),
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.select({
      ios: 60,
      android: 16,
      web: 60,
    }),
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeText: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.warning,
  },
  streakText: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.warning,
    marginHorizontal: 4,
  },
  streakLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
  },
  mascotContainer: {
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginLeft: 8,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.primary,
  },
  progressLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
  },
  progressSubLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  weeklyGoal: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 6,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  goalProgress: {
    height: '100%',
    backgroundColor: Colors.light.secondary,
    borderRadius: 4,
  },
  goalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
  },
  continueCard: {
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  continueGradient: {
    borderRadius: 20,
    padding: 20,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  continueText: {
    flex: 1,
  },
  continueTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  continueEpisode: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  continueDuration: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  seasonSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginLeft: 8,
  },
  sectionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 16,
  },
  episodeSection: {
    marginBottom: 32,
  },
  pathContainer: {
    marginTop: 8,
  },
  allSeasonsSection: {
    marginBottom: 32,
  },
  seasonsScroll: {
    paddingHorizontal: 8,
  },
  seasonPreview: {
    width: 140,
    height: 160,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  seasonLocked: {
    opacity: 0.6,
  },
  seasonActive: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  seasonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seasonNumberText: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.primary,
  },
  seasonPreviewTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
  seasonPreviewTheme: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.text,
  },
  currentBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.light.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 48) / 2,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    marginTop: 8,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
  },
});