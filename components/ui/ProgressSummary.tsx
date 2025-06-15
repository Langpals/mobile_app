// components/ui/ProgressSummary.tsx - Simple Progress Summary Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Clock, Target, Star, TrendingUp } from 'lucide-react-native';
import { ProgressStats } from '@/types';
import Colors from '@/constants/Colors';

interface ProgressSummaryProps {
  stats: ProgressStats;
  onViewMore?: () => void;
}

export default function ProgressSummary({ stats, onViewMore }: ProgressSummaryProps) {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Learning Progress</Text>
        {onViewMore && (
          <TouchableOpacity onPress={onViewMore}>
            <Text style={styles.viewMoreText}>View Details</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Progress Card */}
      <View style={styles.mainCard}>
        <LinearGradient
          colors={[progressLevel.color + '10', Colors.light.cardBackground]}
          style={styles.cardGradient}
        >
          {/* Level Badge */}
          <View style={styles.levelSection}>
            <View style={[styles.levelBadge, { backgroundColor: progressLevel.color + '20' }]}>
              <IconComponent size={20} color={progressLevel.color} />
              <Text style={[styles.levelText, { color: progressLevel.color }]}>
                {progressLevel.level}
              </Text>
            </View>
            <Text style={styles.streakText}>{getStreakMessage()}</Text>
          </View>

          {/* Progress Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completedEpisodes}</Text>
              <Text style={styles.statLabel}>Episodes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.proficiency.vocabularyMastery.mastered}</Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
          </View>

          {/* Weekly Goal */}
          <View style={styles.weeklySection}>
            <View style={styles.weeklyHeader}>
              <Text style={styles.weeklyTitle}>Weekly Goal</Text>
              <Text style={styles.weeklyProgress}>
                {Math.round(weeklyProgress)}%
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${weeklyProgress}%`,
                    backgroundColor: progressLevel.color
                  }
                ]} 
              />
            </View>
            
            <Text style={styles.weeklyText}>
              {stats.weeklyCompletedMinutes} of {stats.weeklyGoalMinutes} minutes
            </Text>
          </View>
        </LinearGradient>
      </View>
    </View>
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  viewMoreText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontFamily: 'OpenSans-Bold',
  },
  mainCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardGradient: {
    padding: 20,
  },
  levelSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  streakText: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    fontFamily: 'OpenSans',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'OpenSans',
    marginTop: 2,
  },
  weeklySection: {
    gap: 8,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
  },
  weeklyProgress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  weeklyText: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'OpenSans',
  },
});