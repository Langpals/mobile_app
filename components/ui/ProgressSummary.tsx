import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '@/constants/Styles';
import { ProgressStats } from '@/types';
import Colors from '@/constants/Colors';

interface ProgressSummaryProps {
  stats: ProgressStats;
}

export default function ProgressSummary({ stats }: ProgressSummaryProps) {
  const episodeCompletionPercentage = Math.round((stats.completedEpisodes / stats.totalEpisodes) * 100);
  const stepCompletionPercentage = Math.round((stats.completedSteps / stats.totalSteps) * 100);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learning Progress</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${episodeCompletionPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.statValue}>{episodeCompletionPercentage}%</Text>
          <Text style={styles.statLabel}>
            {stats.completedEpisodes}/{stats.totalEpisodes} Episodes
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${stepCompletionPercentage}%`,
                  backgroundColor: Colors.light.accent, 
                }
              ]} 
            />
          </View>
          <Text style={styles.statValue}>{stepCompletionPercentage}%</Text>
          <Text style={styles.statLabel}>
            {stats.completedSteps}/{stats.totalSteps} Steps
          </Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Total Learning Time</Text>
        <Text style={styles.timeValue}>{stats.totalTimeSpent} mins</Text>
      </View>

      <Text style={styles.lastSession}>
        Last session: {new Date(stats.lastSessionDate).toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.card,
    marginBottom: 16,
  },
  title: {
    ...globalStyles.heading3,
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statItem: {
    marginBottom: 12,
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
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  statValue: {
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    color: Colors.light.text,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  timeLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  timeValue: {
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    color: Colors.light.primary,
  },
  lastSession: {
    ...globalStyles.textSmall,
    marginTop: 8,
  },
});