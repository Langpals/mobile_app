// components/ui/JourneyMap.tsx - Duolingo-inspired Journey Map
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Lock, Play, CheckCircle, Trophy, Crown, Zap } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Season, Episode } from '@/types';

interface JourneyMapProps {
  seasons: Season[];
  onEpisodePress: (episode: Episode) => void;
  currentProgress: {
    currentSeasonId: string;
    currentEpisodeId: string;
    completedEpisodes: string[];
  };
}

const { width } = Dimensions.get('window');

export default function JourneyMap({ seasons, onEpisodePress, currentProgress }: JourneyMapProps) {
  const [animations] = useState(
    seasons.reduce((acc, season) => {
      season.episodes.forEach((episode, index) => {
        acc[episode.id] = new Animated.Value(0);
      });
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  useEffect(() => {
    // Staggered animation for all episodes
    const allEpisodes = seasons.flatMap(season => season.episodes);
    allEpisodes.forEach((episode, index) => {
      Animated.timing(animations[episode.id], {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const getEpisodeStatus = (episode: Episode) => {
    if (currentProgress.completedEpisodes.includes(episode.id)) {
      return 'completed';
    }
    if (episode.id === currentProgress.currentEpisodeId) {
      return 'current';
    }
    return 'locked';
  };

  const getEpisodeIcon = (status: string, episode: Episode) => {
    switch (status) {
      case 'completed':
        return episode.type === 'weekend_special' ? Crown : Star;
      case 'current':
        return Play;
      default:
        return Lock;
    }
  };

  const getEpisodeColors = (status: string, episode: Episode): [string, string] => {
    switch (status) {
      case 'completed':
        return episode.type === 'weekend_special' 
          ? ['#FFB347', '#FFB347CC']
          : ['#7AC74F', '#7AC74FCC'];
      case 'current':
        return ['#FF6B6B', '#FF6B6BCC'];
      default:
        return ['#E0E0E0', '#F5F5F5'];
    }
  };

  const renderEpisodeNode = (episode: Episode, index: number, seasonIndex: number) => {
    const status = getEpisodeStatus(episode);
    const IconComponent = getEpisodeIcon(status, episode);
    const colors = getEpisodeColors(status, episode);
    const isUnlocked = status !== 'locked';
    
    // Calculate position for zigzag pattern
    const isLeft = index % 2 === 0;
    const nodeSize = episode.type === 'weekend_special' ? 70 : 60;
    
    return (
      <Animated.View
        key={episode.id}
        style={[
          styles.episodeContainer,
          {
            alignSelf: isLeft ? 'flex-start' : 'flex-end',
            marginLeft: isLeft ? 20 : 0,
            marginRight: isLeft ? 0 : 20,
            opacity: animations[episode.id],
            transform: [{
              translateY: animations[episode.id].interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0]
              })
            }]
          }
        ]}
      >
        {/* Episode Node */}
        <TouchableOpacity
          onPress={() => isUnlocked && onEpisodePress(episode)}
          disabled={!isUnlocked}
          style={[styles.episodeNode, { width: nodeSize, height: nodeSize }]}
        >
          <LinearGradient
            colors={colors}
            style={[styles.episodeGradient, { borderRadius: nodeSize / 2 }]}
          >
            {/* Special episode crown/border effect */}
            {episode.type === 'weekend_special' && status === 'completed' && (
              <View style={styles.specialBorder}>
                <Zap size={12} color="#FFFFFF" />
              </View>
            )}
            
            <IconComponent 
              size={episode.type === 'weekend_special' ? 32 : 24} 
              color={status === 'locked' ? '#999' : '#FFFFFF'}
              strokeWidth={2.5}
            />
            
            {/* Progress indicator for current episode */}
            {status === 'current' && episode.completionRate > 0 && (
              <View style={styles.progressRing}>
                <View 
                  style={[
                    styles.progressSegment,
                    { 
                      transform: [{ rotate: `${(episode.completionRate / 100) * 360}deg` }],
                      borderTopColor: Colors.light.accent
                    }
                  ]}
                />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Episode Info */}
        <View style={[
          styles.episodeInfo,
          { alignItems: isLeft ? 'flex-start' : 'flex-end' }
        ]}>
          <Text style={[
            styles.episodeNumber,
            { color: status === 'locked' ? '#999' : Colors.light.text }
          ]}>
            {episode.type === 'weekend_special' ? 'Special' : `Episode ${episode.number}`}
          </Text>
          
          <Text style={[
            styles.episodeTitle,
            { 
              color: status === 'locked' ? '#999' : Colors.light.text,
              textAlign: isLeft ? 'left' : 'right'
            }
          ]}>
            {episode.title}
          </Text>
          
          {status !== 'locked' && (
            <View style={[
              styles.episodeMeta,
              { alignItems: isLeft ? 'flex-start' : 'flex-end' }
            ]}>
              <Text style={styles.episodeMetaText}>
                {episode.duration} min • {episode.vocabularyFocus.length} words
              </Text>
              
              {status === 'current' && episode.completionRate > 0 && (
                <Text style={[styles.progressText, { color: Colors.light.primary }]}>
                  {episode.completionRate}% complete
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Connection line to next episode */}
        {index < seasons[seasonIndex].episodes.length - 1 && (
          <View style={[
            styles.connectionLine,
            { 
              left: isLeft ? nodeSize - 5 : -35,
              transform: [{ rotate: isLeft ? '45deg' : '-45deg' }]
            }
          ]} />
        )}
      </Animated.View>
    );
  };

  const renderSeason = (season: Season, seasonIndex: number) => {
    const completedEpisodes = season.episodes.filter(ep => 
      currentProgress.completedEpisodes.includes(ep.id)
    ).length;
    const progressPercentage = (completedEpisodes / season.episodes.length) * 100;
    
    return (
      <View key={season.id} style={styles.seasonContainer}>
        {/* Season Header */}
        <View style={styles.seasonHeader}>
          <LinearGradient
            colors={['#FF6B6B20', Colors.light.cardBackground]}
            style={styles.seasonHeaderGradient}
          >
            <View style={styles.seasonHeaderContent}>
              <View style={styles.seasonTitleContainer}>
                <View style={styles.seasonIcon}>
                  <Trophy size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.seasonTitleInfo}>
                  <Text style={styles.seasonTitle}>{season.title}</Text>
                  <Text style={styles.seasonTheme}>{season.theme}</Text>
                </View>
              </View>
              
              <View style={styles.seasonProgress}>
                <Text style={styles.seasonProgressText}>
                  {completedEpisodes}/{season.episodes.length}
                </Text>
                <View style={styles.seasonProgressBar}>
                  <View 
                    style={[
                      styles.seasonProgressFill,
                      { width: `${progressPercentage}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Episodes Journey */}
        <View style={styles.episodesJourney}>
          {season.episodes.map((episode, index) => 
            renderEpisodeNode(episode, index, seasonIndex)
          )}
        </View>

        {/* Season Completion Celebration */}
        {completedEpisodes === season.episodes.length && (
          <View style={styles.seasonCompleteBadge}>
            <LinearGradient
              colors={['#FFB347', '#FFB347CC']}
              style={styles.completeBadgeGradient}
            >
              <Crown size={20} color="#FFFFFF" />
              <Text style={styles.completeBadgeText}>Season Complete!</Text>
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {seasons.map((season, index) => renderSeason(season, index))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  seasonContainer: {
    marginBottom: 30,
  },
  seasonHeader: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  seasonHeaderGradient: {
    padding: 20,
  },
  seasonHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seasonTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seasonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  seasonTitleInfo: {
    flex: 1,
  },
  seasonTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 4,
  },
  seasonTheme: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
  },
  seasonProgress: {
    alignItems: 'flex-end',
  },
  seasonProgressText: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  seasonProgressBar: {
    width: 60,
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  seasonProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  episodesJourney: {
    paddingVertical: 20,
    minHeight: 400,
  },
  episodeContainer: {
    marginBottom: 60,
    position: 'relative',
  },
  episodeNode: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  episodeGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  specialBorder: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 999,
  },
  progressSegment: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transformOrigin: 'bottom',
  },
  episodeInfo: {
    marginTop: 12,
    maxWidth: 150,
  },
  episodeNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  episodeTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 6,
  },
  episodeMeta: {
    gap: 2,
  },
  episodeMetaText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.6,
  },
  progressText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
  },
  connectionLine: {
    position: 'absolute',
    bottom: -30,
    width: 40,
    height: 2,
    backgroundColor: Colors.light.border,
  },
  seasonCompleteBadge: {
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  completeBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  completeBadgeText: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: '#FFFFFF',
  },
});