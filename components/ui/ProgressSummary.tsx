// components/ui/ProgressSummary.tsx - Enhanced 3D Progress Summary Component
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Clock, Target, Star, TrendingUp, Flame, BookOpen, Zap } from 'lucide-react-native';
import { ProgressStats } from '@/types';
import Colors from '@/constants/Colors';
import { enhanced3DStyles } from '@/constants/Enhanced3DStyles';

interface ProgressSummaryProps {
  stats: ProgressStats;
  onViewMore?: () => void;
}

export default function ProgressSummary({ stats, onViewMore }: ProgressSummaryProps) {
  // Animation references
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const badgeAnimation = useRef(new Animated.Value(0)).current;
  const statsAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Badge entrance animation
    Animated.timing(badgeAnimation, {
      toValue: 1,
      duration: 800,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    const weeklyProgress = getWeeklyProgress();
    Animated.timing(progressAnimation, {
      toValue: weeklyProgress / 100,
      duration: 1000,
      delay: 400,
      useNativeDriver: false,
    }).start();

    // Staggered stats animations
    Animated.stagger(150, 
      statsAnimations.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          delay: 600,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [stats]);

  const getProgressLevel = () => {
    const percentage = (stats.completedEpisodes / stats.totalEpisodes) * 100;
    if (percentage >= 80) return { level: 'Expert', color: Colors.light.success, icon: Trophy };
    if (percentage >= 60) return { level: 'Advanced', color: Colors.light.warning, icon: Star };
    if (percentage >= 40) return { level: 'Intermediate', color: Colors.light.secondary, icon: Target };
    if (percentage >= 20) return { level: 'Beginner', color: Colors.light.primary, icon: TrendingUp };
    return { level: 'Starter', color: Colors.light.accent, icon: TrendingUp };
  };

  const getWeeklyProgress = () => {
    const percentage = (stats.weeklyCompletedMinutes / stats.weeklyGoalMinutes) * 100;
    return Math.min(percentage, 100);
  };

  const getStreakMessage = () => {
    if (stats.currentStreak >= 7) return "Amazing streak! 🔥";
    if (stats.currentStreak >= 3) return "Great momentum! ⚡";
    if (stats.currentStreak >= 1) return "Keep it up! 🌟";
    return "Start your streak today!";
  };

  const progressLevel = getProgressLevel();
  const IconComponent = progressLevel.icon;
  const weeklyProgress = getWeeklyProgress();

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnimation,
          transform: [{ scale: scaleAnimation }],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Learning Progress</Text>
        {onViewMore && (
          <TouchableOpacity 
            onPress={onViewMore}
            style={[styles.viewMoreButton, enhanced3DStyles.secondaryButton3D]}
          >
            <Text style={styles.viewMoreText}>View Details</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Progress Card */}
      <View style={[styles.mainCard, enhanced3DStyles.progressCard3D]}>
        <LinearGradient
          colors={[progressLevel.color + '08', Colors.light.cardBackground]}
          style={styles.cardGradient}
        >
          {/* Level Badge with 3D Effect */}
          <Animated.View 
            style={[
              styles.levelSection,
              {
                opacity: badgeAnimation,
                transform: [
                  {
                    translateY: badgeAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                  { scale: badgeAnimation },
                ],
              },
            ]}
          >
            <View style={[
              styles.levelBadge, 
              enhanced3DStyles.levelBadge3D,
              { backgroundColor: progressLevel.color + '15' }
            ]}>
              <LinearGradient
                colors={[progressLevel.color + '20', progressLevel.color + '10']}
                style={styles.badgeGradient}
              >
                <IconComponent size={22} color={progressLevel.color} />
                <Text style={[styles.levelText, { color: progressLevel.color }]}>
                  {progressLevel.level}
                </Text>
              </LinearGradient>
            </View>
            <Text style={styles.streakText}>{getStreakMessage()}</Text>
          </Animated.View>

          {/* Enhanced Progress Stats Grid */}
          <View style={[styles.statsGrid, enhanced3DStyles.statsGrid3D]}>
            {[
              { value: stats.completedEpisodes, label: 'Episodes', icon: BookOpen },
              { value: stats.currentStreak, label: 'Day Streak', icon: Flame },
              { value: stats.proficiency.vocabularyMastery.mastered, label: 'Words', icon: Zap },
            ].map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <Animated.View
                  key={stat.label}
                  style={[
                    styles.statItem,
                    {
                      opacity: statsAnimations[index],
                      transform: [
                        {
                          translateY: statsAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                        { scale: statsAnimations[index] },
                      ],
                    },
                  ]}
                >
                  <View style={[styles.statIconContainer, enhanced3DStyles.preferenceIconContainer3D]}>
                    <StatIcon size={16} color={progressLevel.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </Animated.View>
              );
            })}
          </View>

          {/* Enhanced Weekly Goal Section */}
          <View style={styles.weeklySection}>
            <View style={styles.weeklyHeader}>
              <View style={styles.weeklyTitleRow}>
                <Target size={18} color={progressLevel.color} />
                <Text style={styles.weeklyTitle}>Weekly Goal</Text>
              </View>
              <Text style={[styles.weeklyProgress, { color: progressLevel.color }]}>
                {Math.round(weeklyProgress)}%
              </Text>
            </View>
            
            {/* Enhanced 3D Progress Bar */}
            <View style={[styles.progressBar, enhanced3DStyles.progressBarContainer3D]}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  enhanced3DStyles.progressBarFill3D,
                  { 
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: progressLevel.color,
                  }
                ]} 
              />
              
              {/* Glow effect for progress */}
              <Animated.View 
                style={[
                  styles.progressGlow,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    shadowColor: progressLevel.color,
                  }
                ]} 
              />
            </View>
            
            <View style={styles.weeklyDetails}>
              <Text style={styles.weeklyText}>
                {stats.weeklyCompletedMinutes} of {stats.weeklyGoalMinutes} minutes
              </Text>
              <View style={styles.weeklyBadge}>
                <Clock size={12} color={Colors.light.text} />
                <Text style={styles.weeklyBadgeText}>This week</Text>
              </View>
            </View>
          </View>

          {/* Achievement Preview */}
          <View style={[styles.achievementPreview, enhanced3DStyles.backgroundLayer]}>
            <LinearGradient
              colors={['#FFD70008', 'transparent']}
              style={styles.achievementGradient}
            >
              <View style={styles.achievementContent}>
                <View style={[styles.achievementIcon, enhanced3DStyles.preferenceIconContainer3D]}>
                  <Trophy size={16} color="#FFD700" />
                </View>
                <Text style={styles.achievementText}>
                  {stats.currentStreak >= 7 ? 'Week Warrior achieved!' : 
                   stats.currentStreak >= 3 ? 'Almost there - keep going!' :
                   'Build a streak to unlock achievements'}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  viewMoreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '10',
  },
  viewMoreText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontFamily: 'OpenSans-Bold',
  },
  mainCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardGradient: {
    padding: 24,
  },
  levelSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  levelBadge: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 12,
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  streakText: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  weeklySection: {
    gap: 12,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
  },
  weeklyProgress: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressGlow: {
    height: '100%',
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  weeklyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyText: {
    fontSize: 13,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans',
  },
  weeklyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.border + '40',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  weeklyBadgeText: {
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.8,
    fontFamily: 'OpenSans-Bold',
  },
  achievementPreview: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  achievementGradient: {
    padding: 12,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700' + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementText: {
    fontSize: 13,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
    flex: 1,
  },
});