// components/ui/ProgressPath.tsx - Enhanced Version
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, Lock, Star, Clock, Users, Sparkles, Target } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Episode, DifficultyLevel } from '@/types';
import DifficultyBadge from './DifficultyBadge';

interface ProgressPathProps {
  episodes: Episode[];
  onEpisodePress: (episode: Episode) => void;
  showPreview?: boolean;
}

const { width } = Dimensions.get('window');

export default function ProgressPath({ episodes, onEpisodePress, showPreview = false }: ProgressPathProps) {
  const [animations] = useState(
    episodes.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Staggered animation entrance
    const animateEpisodes = () => {
      animations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          delay: index * 150,
          useNativeDriver: true,
        }).start();
      });
    };

    animateEpisodes();
  }, [episodes]);

  const getEpisodeIcon = (episode: Episode) => {
    if (episode.completed) return CheckCircle;
    if (episode.locked) return Lock;
    if (episode.completionRate > 0) return Play;
    return Sparkles;
  };

  const getEpisodeColor = (episode: Episode) => {
    if (episode.completed) return Colors.light.success;
    if (episode.locked) return Colors.light.border;
    if (episode.completionRate > 0) return Colors.light.warning;
    return Colors.light.primary;
  };

  const getEpisodeLabel = (episode: Episode) => {
    if (episode.completed) return 'COMPLETED!';
    if (episode.locked) return 'LOCKED';
    if (episode.completionRate > 0) return 'CONTINUE';
    return 'START';
  };

  const getPathDirection = (index: number) => {
    // Alternating left and right pattern
    return index % 2 === 0 ? 'left' : 'right';
  };

  const renderEpisodeNode = (episode: Episode, index: number) => {
    const direction = getPathDirection(index);
    const IconComponent = getEpisodeIcon(episode);
    const color = getEpisodeColor(episode);
    const label = getEpisodeLabel(episode);
    
    return (
      <Animated.View
        key={episode.id}
        style={[
          styles.episodeContainer,
          {
            marginLeft: direction === 'right' ? width * 0.4 : 0,
            opacity: animations[index],
            transform: [{
              translateY: animations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }]
          }
        ]}
      >
        {/* Connection Line */}
        {index > 0 && (
          <View style={[
            styles.connectionLine,
            {
              left: direction === 'left' ? width * 0.25 : -width * 0.25,
              backgroundColor: episode.completed || episodes[index - 1].completed ? 
                Colors.light.success : Colors.light.border,
            }
          ]} />
        )}

        {/* Episode Button */}
        <TouchableOpacity
          disabled={episode.locked}
          style={[
            styles.episodeButton,
            { borderColor: color }
          ]}
          onPress={() => onEpisodePress(episode)}
          activeOpacity={episode.locked ? 1 : 0.8}
        >
          <LinearGradient
            colors={episode.locked ? 
              ['#F5F5F5', '#E0E0E0'] :
              episode.completed ?
                [Colors.light.success, Colors.light.success + 'CC'] :
                episode.completionRate > 0 ?
                  [Colors.light.warning, Colors.light.warning + 'CC'] :
                  [color, color + 'CC']
            }
            style={styles.episodeButtonGradient}
          >
            <IconComponent 
              size={28} 
              color={episode.locked ? Colors.light.text : '#FFFFFF'} 
              strokeWidth={2.5}
            />
            
            {/* Progress Ring for Incomplete Episodes */}
            {!episode.completed && !episode.locked && episode.completionRate > 0 && (
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

        {/* Episode Info Card */}
        <View style={[
          styles.episodeInfo,
          direction === 'right' ? styles.episodeInfoRight : styles.episodeInfoLeft
        ]}>
          <View style={styles.episodeInfoHeader}>
            <Text style={[styles.episodeLabel, { color }]}>{label}</Text>
            {episode.type === 'weekend_special' && (
              <View style={styles.specialBadge}>
                <Star size={12} color={Colors.light.warning} />
                <Text style={styles.specialBadgeText}>SPECIAL</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.episodeNumber}>Episode {episode.number}</Text>
          <Text style={styles.episodeTitle}>{episode.title}</Text>
          
          {showPreview && (
            <Text style={styles.episodeDescription} numberOfLines={2}>
              {episode.description}
            </Text>
          )}
          
          <View style={styles.episodeMeta}>
            <View style={styles.metaItem}>
              <Clock size={12} color={Colors.light.text} />
              <Text style={styles.metaText}>{episode.duration}min</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Users size={12} color={Colors.light.text} />
              <Text style={styles.metaText}>{episode.steps.length} steps</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Target size={12} color={Colors.light.text} />
              <Text style={styles.metaText}>{episode.vocabularyFocus.length} words</Text>
            </View>
          </View>
          
          <DifficultyBadge level={episode.difficulty} size="small" />
          
          {/* Progress Bar for Incomplete Episodes */}
          {episode.completionRate > 0 && episode.completionRate < 100 && (
            <View style={styles.episodeProgress}>
              <View style={styles.episodeProgressBar}>
                <View 
                  style={[
                    styles.episodeProgressFill,
                    { width: `${episode.completionRate}%` }
                  ]}
                />
              </View>
              <Text style={styles.episodeProgressText}>
                {episode.completionRate}% complete
              </Text>
            </View>
          )}
          
          {/* Vocabulary Preview */}
          {showPreview && episode.vocabularyFocus.length > 0 && (
            <View style={styles.vocabularyPreview}>
              <Text style={styles.vocabularyTitle}>New Words:</Text>
              <View style={styles.vocabularyChips}>
                {episode.vocabularyFocus.slice(0, 3).map((word, wordIndex) => (
                  <View key={wordIndex} style={styles.vocabularyChip}>
                    <Text style={styles.vocabularyWord}>{word}</Text>
                  </View>
                ))}
                {episode.vocabularyFocus.length > 3 && (
                  <Text style={styles.vocabularyMore}>
                    +{episode.vocabularyFocus.length - 3}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Setting Badge */}
        <View style={[
          styles.settingBadge,
          direction === 'right' ? styles.settingBadgeRight : styles.settingBadgeLeft
        ]}>
          <Text style={styles.settingText}>{episode.setting}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.pathContainer}>
        {episodes.map((episode, index) => renderEpisodeNode(episode, index))}
      </View>
      
      {/* Path Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <CheckCircle size={16} color={Colors.light.success} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        
        <View style={styles.legendItem}>
          <Play size={16} color={Colors.light.warning} />
          <Text style={styles.legendText}>In Progress</Text>
        </View>
        
        <View style={styles.legendItem}>
          <Sparkles size={16} color={Colors.light.primary} />
          <Text style={styles.legendText}>Ready to Start</Text>
        </View>
        
        <View style={styles.legendItem}>
          <Lock size={16} color={Colors.light.border} />
          <Text style={styles.legendText}>Locked</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  pathContainer: {
    paddingHorizontal: 20,
    minHeight: 400,
  },
  episodeContainer: {
    position: 'relative',
    marginVertical: 30,
    width: width * 0.5,
  },
  connectionLine: {
    position: 'absolute',
    top: -30,
    width: width * 0.2,
    height: 4,
    borderRadius: 2,
    zIndex: 1,
  },
  episodeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 3,
    alignSelf: 'center',
  },
  episodeButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  progressSegment: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 46,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transformOrigin: 'bottom',
  },
  episodeInfo: {
    position: 'absolute',
    top: -20,
    width: width * 0.4,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 2,
  },
  episodeInfoLeft: {
    right: width * 0.15,
  },
  episodeInfoRight: {
    left: width * 0.15,
  },
  episodeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  episodeLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.warning + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  specialBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    color: Colors.light.warning,
    marginLeft: 2,
  },
  episodeNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.primary,
    marginBottom: 2,
  },
  episodeTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 6,
    lineHeight: 16,
  },
  episodeDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.8,
    lineHeight: 14,
    marginBottom: 8,
  },
  episodeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.7,
    marginLeft: 3,
  },
  episodeProgress: {
    marginTop: 8,
  },
  episodeProgressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  episodeProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.warning,
    borderRadius: 2,
  },
  episodeProgressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  vocabularyPreview: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  vocabularyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: Colors.light.text,
    marginBottom: 4,
  },
  vocabularyChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  vocabularyChip: {
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vocabularyWord: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: Colors.light.primary,
  },
  vocabularyMore: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: Colors.light.text,
    opacity: 0.6,
    alignSelf: 'center',
  },
  settingBadge: {
    position: 'absolute',
    top: 90,
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.secondary + '40',
  },
  settingBadgeLeft: {
    right: width * 0.05,
  },
  settingBadgeRight: {
    left: width * 0.05,
  },
  settingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: Colors.light.text,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.cardBackground,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  legendItem: {
    alignItems: 'center',
  },
  legendText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    marginTop: 4,
  },
});