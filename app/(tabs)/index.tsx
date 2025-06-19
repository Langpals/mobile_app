import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Line } from 'react-native-svg';
import {
  Trophy, Clock, Star, BookOpen, ChevronRight, CheckCircle, Lock, Play
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockChildProfile, mockSeasons } from '@/data/mockData';
import { router } from 'expo-router';
import { Episode } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { OnboardingResetButton } from '@/utils/TextDebugHelper';

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
  const [bounceAnimations] = useState(
    seasons[0].episodes.slice(0, 6).map((): Animated.Value => new Animated.Value(1))
  );
  const [openInfoCardId, setOpenInfoCardId] = useState<string | null>(null);

  // Get current episode data when info card is open
  const currentEpisode = openInfoCardId 
    ? seasons[0].episodes.find((ep: Episode) => ep.id === openInfoCardId)
    : null;
  
  // Get current node index for positioning
  const currentNodeIndex = currentEpisode 
    ? seasons[0].episodes.findIndex((ep: Episode) => ep.id === openInfoCardId)
    : -1;
  
  const isLeft = currentNodeIndex % 2 === 0;
  const nodeSize = currentEpisode?.type === 'weekend_special' ? 80 : 70;

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
    // Bounce animation for unlocked (current) node
    bounceAnimations.forEach((bounceAnim: Animated.Value, index: number) => {
      const episode = seasons[0].episodes[index];
      const isCurrent = episode.id === currentProgress.currentEpisodeId;
      if (isCurrent) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1.15,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
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

    const maxNodeY = episodesToRender.length > 0 ? (episodesToRender.length - 1) * 80 + 80 : 0;

    for (let i = 0; i < episodesToRender.length - 1; i++) {
      const currentEpisode = episodesToRender[i];
      const nextEpisode = episodesToRender[i + 1];

      const currentNodeSize = currentEpisode.type === 'weekend_special' ? 80 : 70;
      const nextNodeSize = nextEpisode.type === 'weekend_special' ? 80 : 70;

      const currentIsLeft = i % 2 === 0;
      const currentYOffset = i * 80;
      const currentXOffset = currentIsLeft ? 60 : width - 200; // Adjusted xOffset for left shift and better containment

      const nextIsLeft = (i + 1) % 2 === 0;
      const nextYOffset = (i + 1) * 80;
      const nextXOffset = nextIsLeft ? 60 : width - 200; // Adjusted xOffset for left shift and better containment

      const startX = currentXOffset + (currentNodeSize / 2);
      const startY = currentYOffset + (currentNodeSize / 2);

      const endX = nextXOffset + (nextNodeSize / 2);
      const endY = nextYOffset + (nextNodeSize / 2);

      lines.push(
        <Line
          key={`line-${currentEpisode.id}-${nextEpisode.id}`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#E0E0E0" // Reverted to original color
          strokeWidth="3" // Reverted to original thickness
        />
      );
    }
    return (
      <Svg
        height={550} // Fixed Svg height for better control
        width={width}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        {lines}
      </Svg>
    );
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
        return ['#73C44B', '#73C44B20'] as const;
      } else if (status === 'current') {
        return ['#FF6B6B', '#FF6B6B20'] as const;
      } else {
        return ['#E0E0E0', '#E0E0E020'] as const;
      }
    })();

    // Calculate position for zigzag pattern
    const isLeft = index % 2 === 0;
    const yOffset = index * 80;
    const xOffset = isLeft ? 60 : width - 200;

    const handleNodeTap = (episodeId: string) => {
      setOpenInfoCardId(prevId => (prevId === episodeId ? null : episodeId));
    };

    // Press animation
    const [pressed, setPressed] = useState(false);
    const pressAnim = useState(new Animated.Value(1))[0];
    const shadowAnim = useState(new Animated.Value(2))[0];
    const onPressIn = () => {
      setPressed(true);
      Animated.parallel([
        Animated.spring(pressAnim, {
          toValue: 1.12,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 8,
          duration: 120,
          useNativeDriver: false,
        }),
      ]).start();
    };
    const onPressOut = () => {
      setPressed(false);
      Animated.parallel([
        Animated.spring(pressAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 2,
          duration: 120,
          useNativeDriver: false,
        }),
      ]).start();
    };
    // Use bounce animation for current (unlocked) node
    const animatedStyle = status === 'current'
      ? { transform: [
          { translateY: nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
          { scale: Animated.multiply(bounceAnimations[index], pressAnim) },
        ] }
      : { transform: [
          { translateY: nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
          { scale: Animated.multiply(nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }), pressAnim) },
        ] };

    return (
      <Animated.View
        key={episode.id}
        style={[
          dynamicStyles.episodeNodeContainer,
          {
            left: xOffset,
            top: yOffset,
            opacity: nodeAnimations[index],
            ...animatedStyle,
            zIndex: 1,
          }
        ]}
      >
        {/* Episode Node */}
        <TouchableOpacity
          onPress={() => handleNodeTap(episode.id)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={status === 'locked'}
          activeOpacity={0.85}
          style={[dynamicStyles.episodeNode, { width: nodeSize, height: nodeSize }]}
        >
          {/* Shadow */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 6,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.22,
              shadowRadius: shadowAnim,
              elevation: shadowAnim,
              borderRadius: nodeSize / 2,
            }}
          />
          {/* Main Node with Gradient */}
          <View
            style={[
              dynamicStyles.nodeGradient,
              {
                borderRadius: nodeSize / 2,
                backgroundColor: nodeColors[0],
                alignItems: 'center',
                justifyContent: 'center',
                width: nodeSize,
                height: nodeSize,
              },
            ]}
          >
            <IconComponent
              size={isSpecial ? 36 : 28}
              color={status === 'locked' ? '#9E9E9E' : '#FFFFFF'}
              strokeWidth={3}
            />
            <View style={dynamicStyles.episodeNumberBadge}>
              <Text style={dynamicStyles.episodeNumberText}>{episode.number}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={dynamicStyles.learningJourneyContainer}>
      {/* Section Header (matching image) */}
      <View style={dynamicStyles.journeyHeader}>
        <View style={dynamicStyles.journeyTitleContainer}>
          <View style={dynamicStyles.journeyIcon}>
            <Trophy size={24} color="#73C44B" />
          </View>
          <View>
            <Text style={[dynamicStyles.journeyTitle, { color: '#1CB0F6' }]}>{seasons[0].title}</Text>
            <Text style={dynamicStyles.journeySubtitle}>Your learning adventure</Text>
          </View>
        </View>
        <View style={dynamicStyles.journeyProgress}>
          <Text style={[dynamicStyles.progressNumber, { color: '#73C44B' }]}>
            {currentProgress.completedEpisodes.length}/{seasons[0].episodes.length}
          </Text>
          <Text style={dynamicStyles.progressLabel}>Episodes</Text>
        </View>
      </View>

      {/* Journey Map */}
      <View style={[dynamicStyles.journeyMap, { position: 'relative' }]}>
        {renderZigZagLines()}
        
        {/* Render all nodes first */}
        <View style={{ position: 'relative', zIndex: 1 }}>
          {seasons[0].episodes.slice(0, 6).map((episode: Episode, index: number) =>
            renderEpisodeNode(episode, index)
          )}
        </View>

        {/* Render all info cards on top */}
        <TouchableWithoutFeedback onPress={() => setOpenInfoCardId(null)}>
          <View style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 9999,
            pointerEvents: 'box-none'
          }}>
            {seasons[0].episodes.slice(0, 6).map((episode: Episode, index: number) => {
              const isLeft = index % 2 === 0;
              const yOffset = index * 80;
              const xOffset = isLeft ? 60 : width - 200;
              const nodeSize = episode.type === 'weekend_special' ? 80 : 70;

              return openInfoCardId === episode.id && (
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View
                    key={`info-${episode.id}`}
                    style={[
                      dynamicStyles.episodeInfoCard,
                      {
                        position: 'absolute',
                        top: yOffset + nodeSize + 10,
                        left: xOffset - 40,
                        width: 150,
                      }
                    ]}
                  >
                    <Text style={[
                      dynamicStyles.episodeCardTitle,
                      { color: getEpisodeStatus(episode) === 'locked' ? '#9E9E9E' : '#3C3C3C' }
                    ]}>
                      {episode.title}
                    </Text>

                    {getEpisodeStatus(episode) !== 'locked' && (
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

                        {getEpisodeStatus(episode) === 'current' && episode.completionRate > 0 && (
                          <View style={dynamicStyles.progressContainer}>
                            <View style={dynamicStyles.progressBar}>
                              <View style={[dynamicStyles.progressFill, { width: `${episode.completionRate}%` }]} />
                            </View>
                            <Text style={[dynamicStyles.progressText, { color: '#58CC02' }]}>{episode.completionRate}% complete</Text>
                          </View>
                        )}

                        <TouchableOpacity
                          style={dynamicStyles.startEpisodeButton}
                          onPress={() => onEpisodePress(episode)}
                        >
                          <Text style={dynamicStyles.startEpisodeButtonText}>Start Episode</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </TouchableWithoutFeedback>

        {/* View All Episodes Button */}
        <TouchableOpacity
          style={dynamicStyles.viewAllButton}
          onPress={() => router.push('/season/1')}
        >
          <Text style={[dynamicStyles.viewAllText, { color: '#73C44B' }]}>View All Episodes</Text>
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
    router.push(`/episode/${episode.id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Development Reset Button - Remove in production */}
      <OnboardingResetButton />
      
      <ScrollView style={dynamicStyles.scrollView} contentContainerStyle={dynamicStyles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Animated.View style={[dynamicStyles.welcomeSection, { opacity: fadeAnim }]}>
          <View style={dynamicStyles.welcomeHeader}>
            <View>
              <Text style={dynamicStyles.welcomeTitle}>¡Hola, {mockChildProfile.name}!</Text>
              <Text style={dynamicStyles.welcomeSubtitle}>Ready to continue your Spanish journey?</Text>
            </View>
            <View style={dynamicStyles.welcomeIcon}>
              <Trophy size={24} color={Colors.light.primary} />
            </View>
          </View>
        </Animated.View>
        
        {/* Enhanced Learning Journey (passing dynamicStyles) */}
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
      backgroundColor: '#FFFFFF',
    },
    scrollContent: {
      padding: 20,
      paddingTop: 50,
      paddingBottom: 40,
    },
    // Removed all welcome, quick stats, league, and continue section styles
    learningPathSection: {
      marginBottom: 24,
    },
    learningJourneyContainer: {
      backgroundColor: Colors.light.background,
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
      marginBottom: 20,
    },
    journeyTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    journeyIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#E8F8E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    journeyTitle: {
      fontSize: 18,
      color: '#2C3E50',
      fontFamily: 'Cubano',
    },
    journeySubtitle: {
      fontSize: 14,
      color: '#546E7A',
      fontFamily: 'OpenSans-Bold',
    },
    journeyProgress: {
      alignItems: 'center',
    },
    progressNumber: {
      fontSize: 20,
      color: '#FF6B6B',
      fontFamily: 'Cubano',
    },
    progressLabel: {
      fontSize: 12,
      color: '#546E7A',
      fontFamily: 'OpenSans-Bold',
    },
    journeyMapWrapper: {
      minHeight: 0, // Set to 0 as it is now irrelevant
    },
    journeyMap: {
      position: 'relative',
      height: 550, // Fixed height for better control and button clearance
      marginBottom: 20,
      backgroundColor: 'transparent', // Changed to transparent
      borderRadius: 0, // Removed border radius
      padding: 0, // Removed padding
      shadowColor: 'transparent', // Removed shadow
      shadowOffset: { width: 0, height: 0 }, // Removed shadow
      shadowOpacity: 0, // Removed shadow
      shadowRadius: 0, // Removed shadow
      elevation: 0, // Removed shadow
      overflow: 'hidden',
      // Removed debugging border
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
      shadowColor: 'transparent', // Removed default shadow from gradient
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
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
      fontFamily: 'OpenSans-Regular',
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
      marginTop: 510,
    },
    viewAllText: {
      fontFamily: 'Cubano',
      fontSize: 16,
      color: '#58CC02',
    },
    welcomeSection: {
      marginBottom: 24,
    },
    welcomeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.light.background,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    welcomeTitle: {
      fontSize: 24,
      color: '#2C3E50',
      fontFamily: 'Cubano',
      marginBottom: 4,
    },
    welcomeSubtitle: {
      fontSize: 14,
      color: '#546E7A',
      fontFamily: 'OpenSans-Bold',
    },
    welcomeIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#E3F2FD',
      alignItems: 'center',
      justifyContent: 'center',
    },
    // New styles for the Start Episode Button
    startEpisodeButton: {
      backgroundColor: '#FEF5D7', // Hardcoded original color
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginTop: 10,
      alignSelf: 'center',
    },
    startEpisodeButtonText: {
      color: Colors.light.accent,
      fontSize: 14,
      fontFamily: 'OpenSans-Bold',
    },
  });
}