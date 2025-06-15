// components/ui/SeasonCard.tsx - Enhanced Version
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown, MapPin, Clock, Play, Star, Target, BookOpen } from 'lucide-react-native';
import { Season } from '@/types';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

interface SeasonCardProps {
  season: Season;
  onPress?: () => void;
  showDetails?: boolean;
}

export default function SeasonCard({ season, onPress, showDetails = true }: SeasonCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [rotateAnimation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    Animated.timing(rotateAnimation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const getProgressColor = () => {
    if (season.progressPercentage >= 80) return Colors.light.success;
    if (season.progressPercentage >= 50) return Colors.light.warning;
    return Colors.light.primary;
  };

  const getSeasonStats = () => {
    const completedEpisodes = season.episodes.filter(ep => ep.completed).length;
    const totalEpisodes = season.episodes.length;
    const totalDuration = season.episodes.reduce((sum, ep) => sum + ep.duration, 0);
    const achievedOutcomes = season.learningOutcomes.filter(outcome => outcome.achieved).length;
    
    return {
      completedEpisodes,
      totalEpisodes,
      totalDuration,
      achievedOutcomes,
      totalOutcomes: season.learningOutcomes.length
    };
  };

  const stats = getSeasonStats();

  return (
    <View style={styles.container}>
      {/* Main Card */}
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress || toggleExpand}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[
            season.locked ? '#F5F5F5' : Colors.light.cardBackground,
            season.locked ? '#EAEAEA' : Colors.light.cardBackground,
            season.locked ? '#F0F0F0' : Colors.light.primary + '05'
          ]}
          style={styles.cardGradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[
                styles.seasonNumber,
                { 
                  backgroundColor: season.locked ? Colors.light.border : Colors.light.primary + '20',
                  borderColor: season.locked ? Colors.light.border : Colors.light.primary + '40'
                }
              ]}>
                <Text style={[
                  styles.seasonNumberText,
                  { color: season.locked ? Colors.light.text : Colors.light.primary }
                ]}>
                  {season.number}
                </Text>
              </View>
              
              <View style={styles.headerInfo}>
                <Text style={styles.seasonTitle}>{season.title}</Text>
                <Text style={styles.seasonTheme}>{season.theme}</Text>
              </View>
            </View>
            
            <View style={styles.headerRight}>
              {season.completed && (
                <View style={styles.completedBadge}>
                  <Star size={16} color="#FFFFFF" />
                </View>
              )}
              
              {showDetails && (
                <TouchableOpacity 
                  onPress={toggleExpand}
                  style={styles.expandButton}
                >
                  <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    <ChevronDown size={20} color={Colors.light.text} />
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={[styles.progressValue, { color: getProgressColor() }]}>
                {Math.round(season.progressPercentage)}%
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { 
                    width: `${season.progressPercentage}%`,
                    backgroundColor: getProgressColor()
                  }
                ]}
              />
            </View>
            
            <Text style={styles.progressText}>
              {stats.completedEpisodes}/{stats.totalEpisodes} episodes completed
            </Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Play size={14} color={Colors.light.secondary} />
              <Text style={styles.statText}>{stats.totalEpisodes} EP</Text>
            </View>
            
            <View style={styles.statItem}>
              <Clock size={14} color={Colors.light.accent} />
              <Text style={styles.statText}>{stats.totalDuration} MIN</Text>
            </View>
            
            <View style={styles.statItem}>
              <Target size={14} color={Colors.light.success} />
              <Text style={styles.statText}>{stats.achievedOutcomes}/{stats.totalOutcomes} GOALS</Text>
            </View>
          </View>

          {/* Setting Preview */}
          <View style={styles.settingPreview}>
            <MapPin size={16} color={Colors.light.secondary} />
            <Text style={styles.settingText}>{season.setting}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Expanded Details */}
      {expanded && showDetails && (
        <View style={styles.expandedContent}>
          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Adventure Description</Text>
            <Text style={styles.description}>{season.description}</Text>
          </View>

          {/* Narrative Hook */}
          <View style={styles.narrativeSection}>
            <Text style={styles.sectionTitle}>Story Hook</Text>
            <View style={styles.narrativeCard}>
              <Text style={styles.characterRole}>
                <Text style={styles.characterLabel}>Bern's Role:</Text> {season.characterRole}
              </Text>
              <Text style={styles.narrativeHook}>{season.narrativeHook}</Text>
            </View>
          </View>
          
          {/* Learning Focus */}
          <View style={styles.learningSection}>
            <Text style={styles.sectionTitle}>What You'll Learn</Text>
            <View style={styles.learningGrid}>
              {season.learningFocus.map((focus, index) => (
                <View key={index} style={styles.learningItem}>
                  <BookOpen size={12} color={Colors.light.primary} />
                  <Text style={styles.learningText}>{focus}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Learning Outcomes Progress */}
          <View style={styles.outcomesSection}>
            <Text style={styles.sectionTitle}>Learning Goals Progress</Text>
            {season.learningOutcomes.slice(0, 3).map((outcome, index) => (
              <View key={outcome.id} style={styles.outcomeItem}>
                <View style={[
                  styles.outcomeStatus,
                  { backgroundColor: outcome.achieved ? Colors.light.success : Colors.light.border }
                ]}>
                  {outcome.achieved && (
                    <Text style={styles.outcomeCheckmark}>✓</Text>
                  )}
                </View>
                <Text style={[
                  styles.outcomeText,
                  outcome.achieved && styles.outcomeCompleted
                ]}>
                  {outcome.description}
                </Text>
              </View>
            ))}
            
            {season.learningOutcomes.length > 3 && (
              <Text style={styles.moreOutcomes}>
                +{season.learningOutcomes.length - 3} more learning goals
              </Text>
            )}
          </View>

          {/* Episode Preview */}
          <View style={styles.episodePreview}>
            <Text style={styles.sectionTitle}>Episode Highlights</Text>
            <View style={styles.episodeGrid}>
              {season.episodes.slice(0, 4).map((episode, index) => (
                <View key={episode.id} style={[
                  styles.episodePreviewItem,
                  episode.completed && styles.episodePreviewCompleted,
                  episode.locked && styles.episodePreviewLocked
                ]}>
                  <Text style={[
                    styles.episodePreviewNumber,
                    episode.completed && styles.episodePreviewNumberCompleted,
                    episode.locked && styles.episodePreviewNumberLocked
                  ]}>
                    {episode.number}
                  </Text>
                  <Text style={[
                    styles.episodePreviewTitle,
                    episode.locked && styles.episodePreviewTitleLocked
                  ]}>
                    {episode.title}
                  </Text>
                </View>
              ))}
            </View>
            
            {season.episodes.length > 4 && (
              <Text style={styles.moreEpisodes}>
                +{season.episodes.length - 4} more episodes
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seasonNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  seasonNumberText: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  seasonTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 2,
  },
  seasonTheme: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
  },
  progressValue: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'OpenSans',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.7,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 11,
    color: Colors.light.text,
    marginLeft: 4,
  },
  settingPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  settingText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: Colors.light.text,
    marginLeft: 6,
    flex: 1,
  },
  expandedContent: {
    backgroundColor: Colors.light.cardBackground,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Cubano',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  narrativeSection: {
    marginBottom: 20,
  },
  narrativeCard: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  characterRole: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 6,
  },
  characterLabel: {
    fontFamily: 'OpenSans-Bold',
  },
  narrativeHook: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: Colors.light.text,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  learningSection: {
    marginBottom: 20,
  },
  learningGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  learningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  learningText: {
    fontFamily: 'OpenSans',
    fontSize: 11,
    color: Colors.light.text,
    marginLeft: 4,
  },
  outcomesSection: {
    marginBottom: 20,
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  outcomeStatus: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  outcomeCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  outcomeText: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: Colors.light.text,
    flex: 1,
  },
  outcomeCompleted: {
    opacity: 0.7,
    textDecorationLine: 'line-through',
  },
  moreOutcomes: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    marginTop: 4,
  },
  episodePreview: {
    marginBottom: 8,
  },
  episodeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  episodePreviewItem: {
    width: (Dimensions.get('window').width - 80) / 2,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  episodePreviewCompleted: {
    borderColor: Colors.light.success,
    backgroundColor: Colors.light.success + '10',
  },
  episodePreviewLocked: {
    opacity: 0.5,
  },
  episodePreviewNumber: {
    fontFamily: 'Cubano',
    fontSize: 12,
    color: Colors.light.primary,
    marginBottom: 2,
  },
  episodePreviewNumberCompleted: {
    color: Colors.light.success,
  },
  episodePreviewNumberLocked: {
    color: Colors.light.text,
  },
  episodePreviewTitle: {
    fontFamily: 'OpenSans',
    fontSize: 11,
    color: Colors.light.text,
    lineHeight: 14,
  },
  episodePreviewTitleLocked: {
    opacity: 0.6,
  },
  moreEpisodes: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    marginTop: 8,
  },
});