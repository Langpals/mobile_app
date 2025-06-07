// Enhanced Learning Dashboard incorporating Google Doc requirements
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Sparkles, MapPin, Trophy, Target, Zap, BookOpen, Clock, TrendingUp, 
  BarChart3, Award, Calendar, Brain, Mic, Heart, Star, Play, CheckCircle
} from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockSeasons, mockProgressStats, mockChildProfile } from '@/data/mockData';
import TeddyMascot from '@/components/ui/TeddyMascot';
import ProgressPath from '@/components/ui/ProgressPath';
import SeasonCard from '@/components/ui/SeasonCard';
import ProgressSummary from '@/components/ui/ProgressSummary';
import { AdaptiveDifficultyDisplay, AdaptiveDifficultyEngine } from '@/components/adaptive/AdaptiveDifficultySystem';
import { Episode } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTeddy } from '@/contexts/TeddyContext';
import { useLearning } from '@/contexts/LearningContext';

const { width } = Dimensions.get('window');

export default function EnhancedLearningDashboard() {
  const [currentSeason] = useState(mockSeasons[0]);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const [streakAnimation] = useState(new Animated.Value(0));
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [adaptiveMetrics, setAdaptiveMetrics] = useState({
    responseAccuracy: 85,
    averageResponseTime: 4.2,
    completionRate: 92,
    engagementLevel: 88,
    consecutiveCorrect: 5,
    consecutiveIncorrect: 0,
    sessionProgress: 75,
    vocabularyRetention: 82
  });
  
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

  const handleAchievementsPress = () => {
    router.push('/achievements');
  };

  const getBernMessage = () => {
    if (!isConnected) {
      return "¡Hola! Let's connect so we can start our magical adventure!";
    }
    
    const { responseAccuracy, engagementLevel } = adaptiveMetrics;
    
    if (responseAccuracy >= 90 && engagementLevel >= 85) {
      return "¡Increíble! You're doing amazing! Ready for a new challenge?";
    } else if (responseAccuracy >= 75) {
      return `Ready for "${nextEpisode?.title}"? ¡Vamos a aprender!`;
    } else {
      return "Don't worry, we'll take it step by step. ¡Tú puedes!";
    }
  };

  const getTeddyMood = () => {
    if (!isConnected) return 'thinking';
    if (adaptiveMetrics.responseAccuracy >= 90) return 'excited';
    if (mockProgressStats.currentStreak >= 3) return 'encouraging';
    return 'happy';
  };

  const renderWeeklyActivity = () => {
    const weekData = [
      { day: 'Mon', episodes: 1, accuracy: 85, time: 18 },
      { day: 'Tue', episodes: 0, accuracy: 0, time: 0 },
      { day: 'Wed', episodes: 1, accuracy: 92, time: 15 },
      { day: 'Thu', episodes: 1, accuracy: 78, time: 22 },
      { day: 'Fri', episodes: 0, accuracy: 0, time: 0 },
      { day: 'Sat', episodes: 2, accuracy: 94, time: 35 },
      { day: 'Sun', episodes: 1, accuracy: 88, time: 20 },
    ];

    const maxTime = Math.max(...weekData.map(d => d.time));

    return (
      <View style={styles.weeklyActivityCard}>
        <View style={styles.weeklyActivityHeader}>
          <Calendar size={20} color={Colors.light.secondary} />
          <Text style={styles.weeklyActivityTitle}>This Week's Progress</Text>
        </View>
        
        <View style={styles.activityChart}>
          {weekData.map((day, index) => {
            const barHeight = day.time > 0 ? Math.max((day.time / maxTime) * 80, 8) : 4;
            const hasActivity = day.time > 0;
            
            return (
              <View key={index} style={styles.activityBar}>
                <Text style={styles.activityValue}>
                  {day.time > 0 ? day.time : ''}
                </Text>
                <View style={styles.activityBarContainer}>
                  <View 
                    style={[
                      styles.activityBarFill,
                      { 
                        height: barHeight,
                        backgroundColor: hasActivity ? 
                          (day.accuracy >= 90 ? Colors.light.success :
                           day.accuracy >= 75 ? Colors.light.warning :
                           Colors.light.primary) : Colors.light.border
                      }
                    ]}
                  />
                </View>
                <Text style={styles.activityDay}>{day.day}</Text>
              </View>
            );
          })}
        </View>
        
        <View style={styles.activityLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.light.success }]} />
            <Text style={styles.legendText}>Excellent (90%+)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.light.warning }]} />
            <Text style={styles.legendText}>Good (75-89%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.light.primary }]} />
            <Text style={styles.legendText}>Practicing (&lt;75%)</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProficiencyMetrics = () => {
    const metrics = [
      { 
        label: 'Vocabulary', 
        score: 85, 
        icon: BookOpen, 
        color: Colors.light.primary,
        trend: '+5%'
      },
      { 
        label: 'Pronunciation', 
        score: 78, 
        icon: Mic, 
        color: Colors.light.secondary,
        trend: '+12%'
      },
      { 
        label: 'Comprehension', 
        score: 92, 
        icon: Brain, 
        color: Colors.light.success,
        trend: '+3%'
      },
      { 
        label: 'Engagement', 
        score: 88, 
        icon: Heart, 
        color: Colors.light.error,
        trend: '-2%'
      },
    ];

    return (
      <View style={styles.proficiencyCard}>
        <View style={styles.proficiencyHeader}>
          <TrendingUp size={20} color={Colors.light.success} />
          <Text style={styles.proficiencyTitle}>Proficiency Metrics</Text>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => router.push('/(tabs)/metrics')}
          >
            <Text style={styles.viewDetailsText}>Details</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <View key={index} style={styles.metricItem}>
                <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                  <IconComponent size={16} color={metric.color} />
                </View>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={[styles.metricScore, { color: metric.color }]}>
                  {metric.score}%
                </Text>
                <Text style={[
                  styles.metricTrend,
                  { color: metric.trend.startsWith('+') ? Colors.light.success : Colors.light.error }
                ]}>
                  {metric.trend}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderLearningInsights = () => {
    const insights = [
      {
        icon: '🎯',
        title: 'Excellent Focus',
        description: 'You complete episodes with great concentration!',
        color: Colors.light.success
      },
      {
        icon: '🗣️',
        title: 'Pronunciation Progress',
        description: 'Great improvement in Spanish pronunciation this week!',
        color: Colors.light.primary
      },
      {
        icon: '📚',
        title: 'Vocabulary Star',
        description: 'Color words are being mastered quickly!',
        color: Colors.light.secondary
      }
    ];

    return (
      <View style={styles.insightsCard}>
        <View style={styles.insightsHeader}>
          <Sparkles size={20} color={Colors.light.warning} />
          <Text style={styles.insightsTitle}>Learning Insights</Text>
        </View>
        
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <Text style={styles.insightEmoji}>{insight.icon}</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightItemTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
            <View style={[styles.insightIndicator, { backgroundColor: insight.color }]} />
          </View>
        ))}
      </View>
    );
  };

  const renderAdaptiveDifficulty = () => (
    <View style={styles.adaptiveSection}>
      <Text style={styles.sectionTitle}>Adaptive Learning System</Text>
      <AdaptiveDifficultyDisplay
        currentMetrics={adaptiveMetrics}
        currentLevel={mockChildProfile.preferredDifficulty}
        onAdjustmentAccepted={(newLevel) => {
          console.log('Difficulty adjusted to:', newLevel);
          // Handle difficulty adjustment
        }}
        showDetailedAnalysis={true}
      />
    </View>
  );

  const renderGoalsProgress = () => {
    const goals = [
      {
        title: 'Daily Learning Goal',
        current: 18,
        target: 15,
        unit: 'minutes',
        color: Colors.light.success,
        percentage: Math.min((18 / 15) * 100, 100)
      },
      {
        title: 'Weekly Episodes',
        current: 3,
        target: 5,
        unit: 'episodes',
        color: Colors.light.primary,
        percentage: (3 / 5) * 100
      },
      {
        title: 'Vocabulary Words',
        current: 15,
        target: 20,
        unit: 'words',
        color: Colors.light.secondary,
        percentage: (15 / 20) * 100
      }
    ];

    return (
      <View style={styles.goalsCard}>
        <View style={styles.goalsHeader}>
          <Target size={20} color={Colors.light.accent} />
          <Text style={styles.goalsTitle}>Learning Goals</Text>
        </View>
        
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={[styles.goalProgress, { color: goal.color }]}>
                {goal.current}/{goal.target} {goal.unit}
              </Text>
            </View>
            <View style={styles.goalProgressBar}>
              <View 
                style={[
                  styles.goalProgressFill,
                  { 
                    width: `${goal.percentage}%`,
                    backgroundColor: goal.color
                  }
                ]}
              />
            </View>
            <Text style={styles.goalPercentage}>
              {Math.round(goal.percentage)}% complete
            </Text>
          </View>
        ))}
      </View>
    );
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

          {/* Enhanced Progress Summary */}
          <ProgressSummary stats={mockProgressStats} showDetailed={true} />

          {/* Weekly Activity Chart */}
          {renderWeeklyActivity()}

          {/* Proficiency Metrics */}
          {renderProficiencyMetrics()}

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

          {/* Adaptive Difficulty System */}
          {renderAdaptiveDifficulty()}

          {/* Learning Goals */}
          {renderGoalsProgress()}

          {/* Learning Insights */}
          {renderLearningInsights()}

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
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={Colors.light.text} />
              <Text style={styles.sectionTitle}>Episode Adventures</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Follow the magical path through {currentSeason.title}
            </Text>
            
            <View style={styles.pathContainer}>
              <ProgressPath 
                episodes={currentSeason.episodes} 
                onEpisodePress={handleEpisodePress}
                showPreview={true}
              />
            </View>
          </View>

          {/* Quick Actions Enhanced */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/(tabs)/metrics')}
              >
                <BarChart3 size={24} color={Colors.light.primary} />
                <Text style={styles.actionText}>Detailed Metrics</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleAchievementsPress}
              >
                <Trophy size={24} color={Colors.light.warning} />
                <Text style={styles.actionText}>Achievements</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/(tabs)/account')}
              >
                <Target size={24} color={Colors.light.secondary} />
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Award size={24} color={Colors.light.success} />
                <Text style={styles.actionText}>Leaderboard</Text>
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
  weeklyActivityCard: {
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
  weeklyActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weeklyActivityTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginLeft: 8,
  },
  activityChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 16,
  },
  activityBar: {
    alignItems: 'center',
    flex: 1,
  },
  activityValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: Colors.light.text,
    height: 16,
    marginBottom: 4,
  },
  activityBarContainer: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  activityBarFill: {
    width: 12,
    borderRadius: 6,
    minHeight: 4,
  },
  activityDay: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    marginTop: 8,
  },
  activityLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: Colors.light.text,
  },
  proficiencyCard: {
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
  proficiencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  proficiencyTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginLeft: 8,
    flex: 1,
  },
  viewDetailsButton: {
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewDetailsText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricScore: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    marginBottom: 2,
  },
  metricTrend: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
  },
  insightsCard: {
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
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightsTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginLeft: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    position: 'relative',
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightItemTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 2,
  },
  insightDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  insightIndicator: {
    width: 4,
    height: 30,
    borderRadius: 2,
    position: 'absolute',
    right: 0,
  },
  adaptiveSection: {
    marginBottom: 24,
  },
  goalsCard: {
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
  goalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalsTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginLeft: 8,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
  },
  goalProgress: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalPercentage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.7,
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
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  pathContainer: {
    marginTop: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    paddingVertical: 8,
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
  actionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 8,
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