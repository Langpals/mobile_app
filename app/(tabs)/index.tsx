import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trophy, Clock, Star, BookOpen, ChevronRight, CheckCircle, Lock, Play
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockSeasons } from '@/data/mockData';
import { router } from 'expo-router';
import { Episode } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

// Enhanced Learning Journey Map Component
interface LearningJourneyMapProps {
  seasons: any[];
  onEpisodePress: (episode: Episode) => void;
  currentProgress: {
    currentSeasonId: string;
    currentEpisodeId: string;
    completedEpisodes: string[];
  };
  dynamicStyles: any;
}

const LearningJourneyMap: React.FC<LearningJourneyMapProps> = ({ seasons, onEpisodePress, currentProgress, dynamicStyles }) => {
  const [nodeAnimations] = useState(
    seasons[0].episodes.slice(0, 6).map((): Animated.Value => new Animated.Value(0))
  );

  useEffect(() => {
    // Staggered animation for nodes
    nodeAnimations.forEach((anim: Animated.Value, index: number) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const getEpisodeStatus = (episode: Episode) => {
    if (currentProgress.completedEpisodes.includes(episode.id)) return 'completed';
    if (episode.id === currentProgress.currentEpisodeId) return 'current';
    return 'locked';
  };

  // Function to render zig-zag lines
  const renderZigZagLines = () => {
    const lines = [];
    const episodesToRender = seasons[0].episodes.slice(0, 6);

    for (let i = 0; i < episodesToRender.length - 1; i++) {
      const currentEpisode = episodesToRender[i];
      const nextEpisode = episodesToRender[i + 1];

      // Calculate nodeSize for current and next episode
      const currentNodeSize = currentEpisode.type === 'weekend_special' ? 80 : 70;
      const nextNodeSize = nextEpisode.type === 'weekend_special' ? 80 : 70;

      const currentIsLeft = i % 2 === 0;
      const currentYOffset = Math.floor(i / 2) * 120;
      const currentXOffset = currentIsLeft ? 50 : width - 120; // This is the TOP-LEFT corner of the node

      const nextIsLeft = (i + 1) % 2 === 0;
      const nextYOffset = Math.floor((i + 1) / 2) * 120;
      const nextXOffset = nextIsLeft ? 50 : width - 120; // This is the TOP-LEFT corner of the node

      // Calculate center points of the nodes
      const startX = currentXOffset + (currentNodeSize / 2);
      const startY = currentYOffset + (currentNodeSize / 2);

      const endX = nextXOffset + (nextNodeSize / 2);
      const endY = nextYOffset + (nextNodeSize / 2);

      const dx = endX - startX;
      const dy = endY - startY;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      lines.push(
        <View
          key={`line-${currentEpisode.id}-${nextEpisode.id}`}
          style={{
            position: 'absolute',
            backgroundColor: '#E0E0E0', // Light grey path color
            height: 3, // Thickness of the line
            width: length,
            left: startX,
            top: startY,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: 'left top',
          }}
        />
      );
    }
    return <>{lines}</>;
  };

  const renderEpisodeNode = (episode: Episode, index: number) => {
    const status = getEpisodeStatus(episode);
    const isSpecial = episode.type === 'weekend_special';
    const nodeSize = isSpecial ? 80 : 70;

    // Determine main icon based on status (no 'Sparkles' or 'Crown' from image)
    const IconComponent = (() => {
      if (status === 'completed') {
        return CheckCircle; // Green checkmark
      } else if (status === 'current') {
        return Play; // Red play triangle
      } else {
        return Lock; // Grey lock
      }
    })();

    // Determine colors based on status (matching provided image exactly with solid colors, adding alpha to second for type)
    const nodeColors = (() => {
      if (status === 'completed') {
        return [Colors.light.success, Colors.light.success + '20']; // Use Colors.light and append alpha
      } else if (status === 'current') {
        return [Colors.light.primary, Colors.light.primary + '20']; // Use Colors.light and append alpha
      } else {
        return [Colors.light.border, Colors.light.border + '20']; // Use Colors.light and append alpha
      }
    })();

    // Calculate position for zigzag pattern
    const row = Math.floor(index / 2);
    const isLeft = index % 2 === 0;
    const yOffset = row * 120;
    const xOffset = isLeft ? 50 : width - 120; // This is the TOP-LEFT corner of the node container

    return (
      <Animated.View
        key={episode.id}
        style={[
          dynamicStyles.episodeNodeContainer,
          {
            left: xOffset,
            top: yOffset,
            opacity: nodeAnimations[index],
            transform: [
              {
                translateY: nodeAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              },
              {
                scale: nodeAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }
            ]
          }
        ]}
      >
        {/* Episode Node */}
        <TouchableOpacity
          onPress={() => status !== 'locked' && onEpisodePress(episode)}
          disabled={status === 'locked'}
          style={[dynamicStyles.episodeNode, { width: nodeSize, height: nodeSize }]}>
          {/* Node Shadow/Glow (matching image) */}
          <View style={[
            dynamicStyles.nodeShadow,
            {
              width: nodeSize + 8,
              height: nodeSize + 8,
              backgroundColor: status === 'completed'
                ? '#58CC0220'
                : (status === 'current' ? '#FF4B4B20' : '#E5E5E520')
            }
          ]} />

          {/* Main Node */}
          <LinearGradient
            colors={nodeColors}
            style={[dynamicStyles.nodeGradient, { borderRadius: nodeSize / 2 }]}>
            {/* Node Icon */}
            <IconComponent
              size={isSpecial ? 36 : 28}
              color={status === 'locked' ? '#9E9E9E' : '#FFFFFF'}
              strokeWidth={3}
            />

            {/* Episode Number/Label - Always present in image */}
            <View style={dynamicStyles.episodeNumberBadge}>
              <Text style={dynamicStyles.episodeNumberText}>{episode.number}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Episode Info Card (matching image positioning) */}
        <View style={[
          dynamicStyles.episodeInfoCard,
          {
            // Position based on whether the node is on the left or right
            marginLeft: isLeft ? nodeSize + 10 : -150, // To the right of left node, or to the left of right node
            alignSelf: isLeft ? 'flex-start' : 'flex-end', // Aligns the card's content within its container
            opacity: status === 'locked' ? 0.6 : 1
          }
        ]}>
          <Text style={[
            dynamicStyles.episodeCardTitle,
            { color: status === 'locked' ? '#9E9E9E' : '#3C3C3C' }
          ]}>
            {episode.title}
          </Text>

          {status !== 'locked' && (
            <>
              <View style={dynamicStyles.episodeCardMeta}>
                <View style={dynamicStyles.metaItem}>
                  <Clock size={12} color="#666" />
                  <Text style={dynamicStyles.metaText}>{episode.duration}m</Text>
                </View>
                <View style={dynamicStyles.metaItem}>
                  <BookOpen size={12} color="#666" />
                  <Text style={dynamicStyles.metaText}>{episode.vocabularyFocus.length} words</Text>
                </View>
              </View>

              {status === 'current' && episode.completionRate > 0 && (
                <View style={dynamicStyles.progressContainer}>
                  <View style={dynamicStyles.progressBar}>
                    <View style={[dynamicStyles.progressFill, { width: `${episode.completionRate}%` }]} />
                  </View>
                  <Text style={[dynamicStyles.progressText, { color: '#58CC02' }]}>{episode.completionRate}% complete</Text>
                </View>
              )}
            </>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={dynamicStyles.learningJourneyContainer}>
      {/* Section Header (matching image) */}
      <View style={dynamicStyles.journeyHeader}>
        <View style={dynamicStyles.journeyTitleContainer}>
          <View style={dynamicStyles.journeyIcon}>
            <Trophy size={24} color="#58CC02" />
          </View>
          <View>
            <Text style={[dynamicStyles.journeyTitle, { color: '#1CB0F6' }]}>{seasons[0].title}</Text>
            <Text style={dynamicStyles.journeySubtitle}>Your learning adventure</Text>
          </View>
        </View>
        <View style={dynamicStyles.journeyProgress}>
          <Text style={[dynamicStyles.progressNumber, { color: '#58CC02' }]}>
            {currentProgress.completedEpisodes.length}/{seasons[0].episodes.length}
          </Text>
          <Text style={dynamicStyles.progressLabel}>Episodes</Text>
        </View>
      </View>

      {/* Journey Map */}
      <View style={dynamicStyles.journeyMapWrapper}>
        {renderZigZagLines()}{/* Render zig-zag lines first */}
        <View style={dynamicStyles.journeyMap}>
          {seasons[0].episodes.slice(0, 6).map((episode: Episode, index: number) =>
            renderEpisodeNode(episode, index)
          )}
        </View>

        {/* View All Episodes Button (matching image) */}
        <TouchableOpacity
          style={dynamicStyles.viewAllButton}
          onPress={() => router.push('/season/1')}
        >
          <Text style={[dynamicStyles.viewAllText, { color: '#58CC02' }]}>View All Episodes</Text>
          <ChevronRight size={16} color="#58CC02" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const { colors, activeTheme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));

  // Create dynamic styles based on current theme
  const dynamicStyles = createStyles(colors);

  const currentProgress = {
    currentSeasonId: 'season-1',
    currentEpisodeId: 'ep-1-2',
    completedEpisodes: ['ep-1-1'],
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handler for episode press (leaving as-is)
  const handleEpisodePress = (episode: Episode) => {
    console.log('Episode pressed:', episode.title);
    router.push(`/episode/${episode.id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={dynamicStyles.scrollView} contentContainerStyle={dynamicStyles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Enhanced Learning Journey (passing dynamicStyles) - ONLY THIS SECTION IS KEPT */}
        <Animated.View style={[dynamicStyles.learningPathSection, { opacity: fadeAnim }]}>
          <LearningJourneyMap
            seasons={mockSeasons}
            onEpisodePress={handleEpisodePress}
            currentProgress={currentProgress}
            dynamicStyles={dynamicStyles}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Dynamic styles function that uses theme colors
function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    // Removed all welcome, quick stats, league, and continue section styles
    learningPathSection: {
      marginBottom: 24,
    },
    learningJourneyContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    journeyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    journeyTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    journeyIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FFEBEE',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    journeyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#2C3E50',
      fontFamily: 'Cubano',
    },
    journeySubtitle: {
      fontSize: 14,
      color: '#546E7A',
      fontFamily: 'OpenSans',
    },
    journeyProgress: {
      alignItems: 'center',
    },
    progressNumber: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FF6B6B',
      fontFamily: 'Cubano',
    },
    progressLabel: {
      fontSize: 12,
      color: '#546E7A',
      fontFamily: 'OpenSans',
    },
    journeyMapWrapper: {
      minHeight: 400,
    },
    journeyMap: {
      position: 'relative',
      height: 380,
      marginBottom: 20,
    },
    episodeNodeContainer: {
      position: 'absolute',
      alignItems: 'center',
    },
    episodeNode: {
      position: 'relative',
      marginBottom: 12,
    },
    nodeShadow: {
      position: 'absolute',
      borderRadius: 100,
      top: -4,
      left: -4,
    },
    nodeGradient: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    episodeNumberBadge: {
      position: 'absolute',
      bottom: -8,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    episodeNumberText: {
      fontFamily: 'Cubano',
      fontSize: 12,
      color: '#2C3E50',
    },
    episodeInfoCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 12,
      maxWidth: 150,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    episodeCardTitle: {
      fontSize: 14,
      fontWeight: '700',
      fontFamily: 'Cubano',
      marginBottom: 4,
    },
    episodeCardMeta: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 8,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 11,
      color: '#666',
      fontFamily: 'OpenSans',
    },
    progressContainer: {
      marginTop: 4,
    },
    progressBar: {
      height: 6,
      backgroundColor: '#F0F0F0',
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 4,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#58CC02',
      borderRadius: 3,
    },
    progressText: {
      fontSize: 11,
      fontFamily: 'OpenSans',
      textAlign: 'center',
      color: '#58CC02',
    },
    viewAllButton: {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#E8F8E8',
      borderRadius: 25,
      marginTop: 20,
    },
    viewAllText: {
      fontFamily: 'Cubano',
      fontSize: 16,
      color: '#58CC02',
    },
  });
}