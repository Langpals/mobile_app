// app/(tabs)/metrics.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Target, Zap, BookOpen, Clock, TrendingUp, BarChart3, Brain, 
  Mic, Heart, Star, CheckCircle, Calendar, Award
} from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockProgressStats, mockChildProfile } from '@/data/mockData';
import { AdaptiveDifficultyDisplay, AdaptiveDifficultyEngine } from '@/components/adaptive/AdaptiveDifficultySystem';
import ProgressSummary from '@/components/ui/ProgressSummary';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';

const { width } = Dimensions.get('window');

export default function MetricsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [streakAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(0));
  
  // Initialize with default metrics to prevent undefined errors
  const defaultMetrics = {
    responseAccuracy: 85,
    averageResponseTime: 4.2,
    completionRate: 92,
    engagementLevel: 88,
    consecutiveCorrect: 5,
    consecutiveIncorrect: 0,
    sessionProgress: 75,
    vocabularyRetention: 82
  };
  
  const [adaptiveMetrics, setAdaptiveMetrics] = useState(defaultMetrics);
  
  const { currentUserDocument } = useAuth();
  const { progress } = useLearning();

  useEffect(() => {
    // Animate streak counter
    if (mockProgressStats.currentStreak > 0) {
      Animated.spring(streakAnimation, {
        toValue: 1,
        useNativeDriver: true,
        delay: 500
      }).start();
    }

    // Fade in animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderStreakSection = () => (
    <Animated.View style={[
      styles.streakSection,
      {
        transform: [{
          scale: streakAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1]
          })
        }]
      }
    ]}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        style={styles.streakGradient}
      >
        <View style={styles.streakContent}>
          <View style={styles.streakHeader}>
            <Zap size={32} color="#FFFFFF" />
            <Text style={styles.streakNumber}>{mockProgressStats.currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak!</Text>
          </View>
          <Text style={styles.streakMessage}>
            {mockProgressStats.currentStreak >= 7 ? "¡Increíble! You're on fire!" : "Keep it up!"}
          </Text>
          <View style={styles.streakProgress}>
            <View style={styles.streakProgressBar}>
              <View 
                style={[
                  styles.streakProgressFill,
                  { width: `${(mockProgressStats.currentStreak % 7) * 14.28}%` }
                ]}
              />
            </View>
            <Text style={styles.streakProgressText}>
              {7 - (mockProgressStats.currentStreak % 7)} days to next milestone
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderGoalsProgress = () => {
    // Calculate weekly progress from available data
    const weeklyEpisodes = mockProgressStats.completedEpisodes || 1;
    const weeklyMinutes = mockProgressStats.weeklyCompletedMinutes || 45;
    const weeklyWords = mockProgressStats.proficiency?.vocabularyMastery?.mastered || 15;

    return (
      <View style={styles.goalsSection}>
        <View style={styles.sectionHeader}>
          <Target size={20} color={Colors.light.text} />
          <Text style={styles.sectionTitle}>Weekly Goals Progress</Text>
        </View>
        
        <View style={styles.goalsGrid}>
          <View style={styles.goalItem}>
            <View style={styles.goalIconContainer}>
              <BookOpen size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.goalValue}>{weeklyEpisodes}/5</Text>
            <Text style={styles.goalLabel}>Episodes</Text>
            <View style={styles.goalProgress}>
              <View 
                style={[
                  styles.goalProgressFill,
                  { width: `${(weeklyEpisodes / 5) * 100}%` }
                ]}
              />
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalIconContainer}>
              <Clock size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.goalValue}>{weeklyMinutes}</Text>
            <Text style={styles.goalLabel}>Minutes</Text>
            <View style={styles.goalProgress}>
              <View 
                style={[
                  styles.goalProgressFill,
                  { width: `${Math.min((weeklyMinutes / mockProgressStats.weeklyGoalMinutes) * 100, 100)}%` }
                ]}
              />
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalIconContainer}>
              <Star size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.goalValue}>{weeklyWords}</Text>
            <Text style={styles.goalLabel}>New Words</Text>
            <View style={styles.goalProgress}>
              <View 
                style={[
                  styles.goalProgressFill,
                  { width: `${Math.min((weeklyWords / 50) * 100, 100)}%` }
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderLearningInsights = () => {
    // Calculate insights from available data
    const pronunciationAccuracy = mockProgressStats.proficiency?.pronunciationAccuracy || 78;
    const engagementLevel = mockProgressStats.proficiency?.engagementLevel || 88;
    const vocabularyMastered = mockProgressStats.proficiency?.vocabularyMastery?.mastered || 15;

    return (
      <View style={styles.insightsSection}>
        <View style={styles.sectionHeader}>
          <Brain size={20} color={Colors.light.text} />
          <Text style={styles.sectionTitle}>Learning Insights</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.insightCard}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.insightGradient}
            >
              <Mic size={24} color="#FFFFFF" />
              <Text style={styles.insightTitle}>Speaking Champion!</Text>
              <Text style={styles.insightValue}>{pronunciationAccuracy}%</Text>
              <Text style={styles.insightDescription}>
                Pronunciation accuracy improved by 15% this week
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.insightCard}>
            <LinearGradient
              colors={['#4ECDC4', '#6FDDD8']}
              style={styles.insightGradient}
            >
              <Heart size={24} color="#FFFFFF" />
              <Text style={styles.insightTitle}>Engagement Star</Text>
              <Text style={styles.insightValue}>{engagementLevel}%</Text>
              <Text style={styles.insightDescription}>
                Completing episodes faster with high enthusiasm
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.insightCard}>
            <LinearGradient
              colors={['#95A5F9', '#B2BCFF']}
              style={styles.insightGradient}
            >
              <TrendingUp size={24} color="#FFFFFF" />
              <Text style={styles.insightTitle}>Quick Learner</Text>
              <Text style={styles.insightValue}>+{vocabularyMastered}</Text>
              <Text style={styles.insightDescription}>
                New words mastered this week
              </Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderAdaptiveDifficulty = () => {
    // Ensure we have valid metrics
    const metrics = adaptiveMetrics || defaultMetrics;

    const currentDifficulty = mockChildProfile?.currentProficiency || 
                             mockChildProfile?.preferredDifficulty || 
                             'easy';

    return (
      <View style={styles.adaptiveSection}>
        <View style={styles.sectionHeader}>
          <Zap size={20} color={Colors.light.text} />
          <Text style={styles.sectionTitle}>Adaptive Difficulty</Text>
        </View>
        
        <AdaptiveDifficultyDisplay
          currentMetrics={metrics}
          currentLevel={currentDifficulty}
          onAdjustmentAccepted={(newDifficulty) => {
            console.log('Difficulty changed to:', newDifficulty);
          }}
        />
      </View>
    );
  };

  const renderTimeframeSelector = () => (
    <View style={styles.timeframeContainer}>
      {(['day', 'week', 'month'] as const).map((timeframe) => (
        <TouchableOpacity
          key={timeframe}
          style={[
            styles.timeframeButton,
            selectedTimeframe === timeframe && styles.timeframeButtonActive
          ]}
          onPress={() => setSelectedTimeframe(timeframe)}
        >
          <Text style={[
            styles.timeframeText,
            selectedTimeframe === timeframe && styles.timeframeTextActive
          ]}>
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDetailedMetrics = () => {
    // Ensure we have valid data
    const metrics = adaptiveMetrics || {
      responseAccuracy: 85,
      averageResponseTime: 4.2,
      completionRate: 92,
      vocabularyRetention: 82
    };

    return (
      <View style={styles.metricsSection}>
        <View style={styles.sectionHeader}>
          <BarChart3 size={20} color={Colors.light.text} />
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
        </View>

        {renderTimeframeSelector()}

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <CheckCircle size={16} color={Colors.light.success} />
              <Text style={styles.metricLabel}>Accuracy</Text>
            </View>
            <Text style={styles.metricValue}>{metrics.responseAccuracy}%</Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={12} color={Colors.light.success} />
              <Text style={styles.metricTrendText}>+5%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Clock size={16} color={Colors.light.primary} />
              <Text style={styles.metricLabel}>Response Time</Text>
            </View>
            <Text style={styles.metricValue}>{metrics.averageResponseTime}s</Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={12} color={Colors.light.success} />
              <Text style={styles.metricTrendText}>-0.5s</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <BookOpen size={16} color={Colors.light.primary} />
              <Text style={styles.metricLabel}>Retention</Text>
            </View>
            <Text style={styles.metricValue}>{metrics.vocabularyRetention}%</Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={12} color={Colors.light.success} />
              <Text style={styles.metricTrendText}>+12%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Star size={16} color={Colors.light.warning} />
              <Text style={styles.metricLabel}>Completion</Text>
            </View>
            <Text style={styles.metricValue}>{metrics.completionRate}%</Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={12} color={Colors.light.success} />
              <Text style={styles.metricTrendText}>+8%</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderAchievementPreview = () => (
    <View style={styles.achievementSection}>
      <View style={styles.sectionHeader}>
        <Award size={20} color={Colors.light.text} />
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Star size={24} color={Colors.light.warning} />
          </View>
          <Text style={styles.achievementTitle}>First Week Complete!</Text>
          <Text style={styles.achievementDate}>Earned 2 days ago</Text>
        </View>

        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Zap size={24} color={Colors.light.primary} />
          </View>
          <Text style={styles.achievementTitle}>7 Day Streak</Text>
          <Text style={styles.achievementDate}>Earned today</Text>
        </View>

        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <BookOpen size={24} color={Colors.light.success} />
          </View>
          <Text style={styles.achievementTitle}>50 Words Learned</Text>
          <Text style={styles.achievementDate}>Earned 4 days ago</Text>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnimation }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Learning Metrics</Text>
            <Text style={styles.headerSubtitle}>
              Track {currentUserDocument?.childName || 'your'} progress
            </Text>
          </View>

          {/* Progress Summary */}
          <View style={styles.summarySection}>
            <ProgressSummary stats={mockProgressStats} />
          </View>

          {/* Streak Section */}
          {renderStreakSection()}

          {/* Adaptive Difficulty System */}
          {renderAdaptiveDifficulty()}

          {/* Goals Progress */}
          {renderGoalsProgress()}

          {/* Learning Insights */}
          {renderLearningInsights()}

          {/* Detailed Metrics */}
          {renderDetailedMetrics()}

          {/* Achievement Preview */}
          {renderAchievementPreview()}
        </Animated.View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  summarySection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  streakSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  streakGradient: {
    borderRadius: 20,
    padding: 20,
  },
  streakContent: {
    alignItems: 'center',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakNumber: {
    fontFamily: 'LilitaOne',
    fontSize: 48,
    color: '#FFFFFF',
    marginHorizontal: 12,
  },
  streakLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  streakMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  streakProgress: {
    width: '100%',
    alignItems: 'center',
  },
  streakProgressBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  streakProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  streakProgressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  adaptiveSection: {
    marginHorizontal: 24,
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
  goalsSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  goalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalItem: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  goalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.light.text,
  },
  goalLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  goalProgress: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightCard: {
    width: width * 0.7,
    marginLeft: 24,
    marginRight: 12,
  },
  insightGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  insightTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  insightValue: {
    fontFamily: 'LilitaOne',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  insightDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  timeframeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.text,
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },
  metricsSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 56) / 2,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginLeft: 6,
  },
  metricValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 4,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTrendText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.light.success,
    marginLeft: 4,
  },
  achievementSection: {
    marginBottom: 24,
  },
  achievementCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginLeft: 24,
    marginRight: 12,
    alignItems: 'center',
    width: 140,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.6,
  },
});