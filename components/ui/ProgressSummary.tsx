// components/ui/ProgressSummary.tsx - Enhanced Version
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Clock, Target, TrendingUp, BookOpen, Star, Zap, Calendar } from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import { ProgressStats } from '@/types';
import Colors from '@/constants/Colors';

interface ProgressSummaryProps {
  stats: ProgressStats;
  showDetailed?: boolean;
  onViewMore?: () => void;
}

export default function ProgressSummary({ stats, showDetailed = false, onViewMore }: ProgressSummaryProps) {
  const [animations] = useState({
    progress: new Animated.Value(0),
    stats: new Animated.Value(0),
    proficiency: new Animated.Value(0),
  });

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      Animated.timing(animations.progress, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(animations.stats, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(animations.proficiency, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getProgressLevel = () => {
    const percentage = (stats.completedEpisodes / stats.totalEpisodes) * 100;
    if (percentage >= 80) return { level: 'Expert', color: Colors.light.success, icon: Trophy };
    if (percentage >= 60) return { level: 'Advanced', color: Colors.light.warning, icon: Star };
    if (percentage >= 40) return { level: 'Intermediate', color: Colors.light.secondary, icon: Target };
    if (percentage >= 20) return { level: 'Beginner', color: Colors.light.primary, icon: TrendingUp };
    return { level: 'Starter', color: Colors.light.accent, icon: Zap };
  };

  const getWeeklyProgress = () => {
    const percentage = (stats.weeklyCompletedMinutes / stats.weeklyGoalMinutes) * 100;
    return Math.min(percentage, 100);
  };

  const getStreakMotivation = () => {
    if (stats.currentStreak >= 7) return "¡Increíble! You're on fire! 🔥";
    if (stats.currentStreak >= 3) return "¡Excelente! Keep the streak alive! ⚡";
    if (stats.currentStreak >= 1) return "Great start! Let's keep going! 🌟";
    return "Ready to start your streak? 🚀";
  };

  const episodeProgress = (stats.completedEpisodes / stats.totalEpisodes) * 100;
  const stepProgress = (stats.completedSteps / stats.totalSteps) * 100;
  const weeklyProgress = getWeeklyProgress();
  const progressLevel = getProgressLevel();
  const ProgressIcon = progressLevel.icon;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: animations.progress,
            transform: [{
              translateY: animations.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }]
          }
        ]}
      >
        <View style={styles.headerLeft}>
          <Trophy size={24} color={Colors.light.primary} />
          <Text style={styles.title}>Learning Progress</Text>
        </View>
        
        <View style={[styles.levelBadge, { backgroundColor: progressLevel.color + '20' }]}>
          <ProgressIcon size={16} color={progressLevel.color} />
          <Text style={[styles.levelText, { color: progressLevel.color }]}>
            {progressLevel.level}
          </Text>
        </View>
      </Animated.View>

      {/* Main Progress Cards */}
      <Animated.View 
        style={[
          styles.progressCards,
          {
            opacity: animations.stats,
            transform: [{
              scale: animations.stats.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1]
              })
            }]
          }
        ]}
      >
        {/* Episodes Progress */}
        <View style={styles.progressCard}>
          <LinearGradient
            colors={[Colors.light.primary + '10', Colors.light.cardBackground]}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <BookOpen size={18} color={Colors.light.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Episodes</Text>
                <Text style={styles.cardSubtitle}>Learning Adventures</Text>
              </View>
              <Text style={[styles.cardPercentage, { color: Colors.light.primary }]}>
                {Math.round(episodeProgress)}%
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  { 
                    backgroundColor: Colors.light.primary,
                    transform: [{
                      scaleX: animations.stats.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                      })
                    }],
                    width: `${episodeProgress}%`
                  }
                ]} 
              />
            </View>
            
            <Text style={styles.progressText}>
              {stats.completedEpisodes} of {stats.totalEpisodes} completed
            </Text>
          </LinearGradient>
        </View>

        {/* Steps Progress */}
        <View style={styles.progressCard}>
          <LinearGradient
            colors={[Colors.light.secondary + '10', Colors.light.cardBackground]}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Target size={18} color={Colors.light.secondary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Steps</Text>
                <Text style={styles.cardSubtitle}>Learning Activities</Text>
              </View>
              <Text style={[styles.cardPercentage, { color: Colors.light.secondary }]}>
                {Math.round(stepProgress)}%
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  { 
                    backgroundColor: Colors.light.secondary,
                    transform: [{
                      scaleX: animations.stats.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                      })
                    }],
                    width: `${stepProgress}%`
                  }
                ]} 
              />
            </View>
            
            <Text style={styles.progressText}>
              {stats.completedSteps} of {stats.totalSteps} completed
            </Text>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Weekly Goal */}
      <Animated.View 
        style={[
          styles.weeklyGoalCard,
          {
            opacity: animations.proficiency,
            transform: [{
              translateX: animations.proficiency.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              })
            }]
          }
        ]}
      >
        <LinearGradient
          colors={[Colors.light.success + '10', Colors.light.cardBackground]}
          style={styles.weeklyGoalGradient}
        >
          <View style={styles.weeklyGoalHeader}>
            <View style={styles.goalIconContainer}>
              <Calendar size={20} color={Colors.light.success} />
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>Weekly Goal</Text>
              <Text style={styles.goalSubtitle}>Keep up the great work!</Text>
            </View>
            <Text style={[styles.goalPercentage, { color: Colors.light.success }]}>
              {Math.round(weeklyProgress)}%
            </Text>
          </View>
          
          <View style={styles.goalProgressContainer}>
            <View style={styles.goalProgressBar}>
              <Animated.View 
                style={[
                  styles.goalProgressFill,
                  { 
                    transform: [{
                      scaleX: animations.proficiency.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                      })
                    }],
                    width: `${weeklyProgress}%`
                  }
                ]} 
              />
            </View>
            <Text style={styles.goalProgressText}>
              {stats.weeklyCompletedMinutes} / {stats.weeklyGoalMinutes} minutes
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Learning Streak */}
      <Animated.View 
        style={[
          styles.streakCard,
          {
            opacity: animations.proficiency,
            transform: [{
              scale: animations.proficiency.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1]
              })
            }]
          }
        ]}
      >
        <LinearGradient
          colors={[Colors.light.warning + '15', Colors.light.cardBackground]}
          style={styles.streakGradient}
        >
          <View style={styles.streakHeader}>
            <View style={styles.streakIconContainer}>
              <Zap size={24} color={Colors.light.warning} />
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{stats.currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          
          <Text style={styles.streakMotivation}>
            {getStreakMotivation()}
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Time Stats */}
      <View style={styles.timeStatsContainer}>
        <View style={styles.timeStatItem}>
          <Clock size={16} color={Colors.light.accent} />
          <Text style={styles.timeStatLabel}>Total Time</Text>
          <Text style={styles.timeStatValue}>{stats.totalTimeSpent} mins</Text>
        </View>
        
        <View style={styles.timeStatDivider} />
        
        <View style={styles.timeStatItem}>
          <Calendar size={16} color={Colors.light.accent} />
          <Text style={styles.timeStatLabel}>Last Session</Text>
          <Text style={styles.timeStatValue}>
            {new Date(stats.lastSessionDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Proficiency Overview */}
      {showDetailed && (
        <Animated.View 
          style={[
            styles.proficiencyOverview,
            {
              opacity: animations.proficiency,
            }
          ]}
        >
          <Text style={styles.proficiencyTitle}>Skills Overview</Text>
          
          <View style={styles.proficiencyGrid}>
            <View style={styles.proficiencyItem}>
              <Text style={styles.proficiencyLabel}>Vocabulary</Text>
              <View style={styles.proficiencyBarSmall}>
                <View 
                  style={[
                    styles.proficiencyFillSmall,
                    { 
                      width: `${stats.proficiency.vocabularyMastery.mastered / stats.proficiency.vocabularyMastery.total * 100}%`,
                      backgroundColor: Colors.light.primary
                    }
                  ]}
                />
              </View>
              <Text style={styles.proficiencyValue}>
                {stats.proficiency.vocabularyMastery.mastered}/{stats.proficiency.vocabularyMastery.total}
              </Text>
            </View>
            
            <View style={styles.proficiencyItem}>
              <Text style={styles.proficiencyLabel}>Pronunciation</Text>
              <View style={styles.proficiencyBarSmall}>
                <View 
                  style={[
                    styles.proficiencyFillSmall,
                    { 
                      width: `${stats.proficiency.pronunciationAccuracy}%`,
                      backgroundColor: Colors.light.secondary
                    }
                  ]}
                />
              </View>
              <Text style={styles.proficiencyValue}>
                {stats.proficiency.pronunciationAccuracy}%
              </Text>
            </View>
            
            <View style={styles.proficiencyItem}>
              <Text style={styles.proficiencyLabel}>Engagement</Text>
              <View style={styles.proficiencyBarSmall}>
                <View 
                  style={[
                    styles.proficiencyFillSmall,
                    { 
                      width: `${stats.proficiency.engagementLevel}%`,
                      backgroundColor: Colors.light.success
                    }
                  ]}
                />
              </View>
              <Text style={styles.proficiencyValue}>
                {stats.proficiency.engagementLevel}%
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* View More Button */}
      {onViewMore && !showDetailed && (
        <TouchableOpacity style={styles.viewMoreButton} onPress={onViewMore}>
          <TrendingUp size={16} color={Colors.light.primary} />
          <Text style={styles.viewMoreText}>View Detailed Metrics</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginLeft: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  levelText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    marginLeft: 4,
  },
  progressCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  progressCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
  },
  cardSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.7,
  },
  cardPercentage: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.8,
    textAlign: 'center',
  },
  weeklyGoalCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  weeklyGoalGradient: {
    padding: 16,
  },
  weeklyGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
  },
  goalSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  goalPercentage: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
  },
  goalProgressContainer: {
    alignItems: 'center',
  },
  goalProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.success,
    borderRadius: 4,
  },
  goalProgressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
  },
  streakCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  streakGradient: {
    padding: 16,
    alignItems: 'center',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakIconContainer: {
    marginRight: 12,
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: Colors.light.warning,
  },
  streakLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
  },
  streakMotivation: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.light.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timeStatsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  timeStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  timeStatLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.7,
    marginTop: 4,
  },
  timeStatValue: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 2,
  },
  timeStatDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
    marginHorizontal: 12,
  },
  proficiencyOverview: {
    marginBottom: 12,
  },
  proficiencyTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  proficiencyGrid: {
    gap: 12,
  },
  proficiencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proficiencyLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    width: 80,
  },
  proficiencyBarSmall: {
    flex: 1,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  proficiencyFillSmall: {
    height: '100%',
    borderRadius: 2,
  },
  proficiencyValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: Colors.light.text,
    width: 40,
    textAlign: 'right',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary + '10',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
  },
  viewMoreText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.primary,
    marginLeft: 6,
  },
});