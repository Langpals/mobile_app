// components/ui/EnhancedJourneyMap.tsx - Modern Learning Journey Map
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Trophy, 
  Star, 
  Lock, 
  Play, 
  CheckCircle, 
  Crown, 
  Sparkles, 
  Clock,
  Target,
  Zap,
  ChevronRight
} from 'lucide-react-native';
import { Svg, Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Colors from '@/constants/Colors';
import { Season, Episode } from '@/types';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface EnhancedJourneyMapProps {
  seasons: Season[];
  onEpisodePress: (episode: Episode) => void;
  onViewAllPress: () => void;
  currentProgress: {
    currentSeasonId: string;
    currentEpisodeId: string;
    completedEpisodes: string[];
  };
}

export default function EnhancedJourneyMap({ 
  seasons, 
  onEpisodePress, 
  onViewAllPress, 
  currentProgress 
}: EnhancedJourneyMapProps) {
  // Animation states
  const [nodeAnimations] = useState(
    seasons[0].episodes.slice(0, 6).map(() => new Animated.Value(0))
  );
  const [glowAnimations] = useState(
    seasons[0].episodes.slice(0, 6).map(() => new Animated.Value(0))
  );
  const [pathAnimation] = useState(new Animated.Value(0));
  const [openInfoCardId, setOpenInfoCardId] = useState<string | null>(null);
  const [cardAnimation] = useState(new Animated.Value(0));
  const [pathRandomness] = useState(() => {
    const numSegments = seasons[0].episodes.slice(0, 6).length - 1;
    return Array.from({ length: numSegments > 0 ? numSegments : 0 }, () => ({
      cp1x: (Math.random() - 0.5) * 80,
      cp1y: (Math.random() - 0.5) * 50,
      cp2x: (Math.random() - 0.5) * 80,
      cp2y: (Math.random() - 0.5) * 50,
    }));
  });

  // Initialize animations
  useEffect(() => {
    // Path animation first
    Animated.timing(pathAnimation, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    // Staggered node animations
    nodeAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: 200 + index * 150,
        useNativeDriver: true,
      }).start();
    });

    // Continuous glow for current episode
    const currentEpisodeIndex = seasons[0].episodes.findIndex(
      ep => ep.id === currentProgress.currentEpisodeId
    );
    
    if (currentEpisodeIndex !== -1 && currentEpisodeIndex < 6) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimations[currentEpisodeIndex], {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimations[currentEpisodeIndex], {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  // Handle info card animation
  useEffect(() => {
    if (openInfoCardId) {
      Animated.spring(cardAnimation, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(cardAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [openInfoCardId]);

  const getEpisodeStatus = (episode: Episode) => {
    if (currentProgress.completedEpisodes.includes(episode.id)) return 'completed';
    if (episode.id === currentProgress.currentEpisodeId) return 'current';
    return 'locked';
  };

  const getEpisodeIcon = (status: string, episode: Episode) => {
    switch (status) {
      case 'completed':
        return episode.type === 'weekend_special' ? Crown : CheckCircle;
      case 'current':
        return Play;
      default:
        return Lock;
    }
  };

  const getEpisodeColors = (status: string, episode: Episode) => {
    switch (status) {
      case 'completed':
        return episode.type === 'weekend_special' 
          ? { primary: '#FFD700', secondary: '#FFA500', glow: '#FFFF7F' }
          : { primary: '#00D4AA', secondary: '#58CC02', glow: '#7DE383' };
      case 'current':
        return { primary: '#FF4757', secondary: '#FF3742', glow: '#FF7675' };
      default:
        return { primary: '#DDD6FE', secondary: '#C7D2FE', glow: '#E0E7FF' };
    }
  };

  const handleNodePress = (episode: Episode, index: number) => {
    const status = getEpisodeStatus(episode);
    
    if (status === 'locked') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (openInfoCardId === episode.id) {
      setOpenInfoCardId(null);
    } else {
      setOpenInfoCardId(episode.id);
    }
  };

  const renderAnimatedPath = () => {
    const episodesToRender = seasons[0].episodes.slice(0, 6);
    let pathData = '';
    const points: { x: number; y: number }[] = [];

    // Generate zigzag path points
    episodesToRender.forEach((_, index) => {
      const isLeft = index % 2 === 0;
      const y = 60 + index * 90;
      const x = isLeft ? 80 : width - 160;
      points.push({ x, y });
    });

    // Create smooth curved path
    if (points.length > 0) {
      pathData = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const rand = pathRandomness[i - 1];

        if (!rand) continue;

        const midX = prev.x + (curr.x - prev.x) * 0.5;
        
        const controlX1 = midX + rand.cp1x;
        const controlY1 = prev.y + (curr.y - prev.y) * 0.25 + rand.cp1y;
        const controlX2 = midX + rand.cp2x;
        const controlY2 = prev.y + (curr.y - prev.y) * 0.75 + rand.cp2y;
        
        pathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${curr.x} ${curr.y}`;
      }
    }

    return (
      <Svg 
        height={600} 
        width={width} 
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <SvgLinearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#58CC02" stopOpacity="0.8" />
            <Stop offset="50%" stopColor="#00D4AA" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#3742FA" stopOpacity="0.4" />
          </SvgLinearGradient>
        </Defs>
        
        {/* Animated path with gradient */}
        <Animated.View style={{ opacity: pathAnimation }}>
          <Path
            d={pathData}
            stroke="url(#pathGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="8, 12"
          />
        </Animated.View>
        
        {/* Path glow effect */}
        <Path
          d={pathData}
          stroke="#58CC02"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeOpacity="0.2"
          strokeDasharray="8, 12"
        />
      </Svg>
    );
  };

  const renderEpisodeNode = (episode: Episode, index: number) => {
    const status = getEpisodeStatus(episode);
    const IconComponent = getEpisodeIcon(status, episode);
    const colors = getEpisodeColors(status, episode);
    const isLeft = index % 2 === 0;
    const nodeSize = episode.type === 'weekend_special' ? 90 : 75;
    
    const yOffset = 60 + index * 90;
    const xOffset = isLeft ? 80 : width - 160;

    return (
      <Animated.View
        key={episode.id}
        style={[
          styles.nodeContainer,
          {
            position: 'absolute',
            left: xOffset - nodeSize / 2,
            top: yOffset - nodeSize / 2,
            opacity: nodeAnimations[index],
            transform: [
              {
                scale: nodeAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
              {
                translateY: nodeAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Outer glow ring for current episode */}
        {status === 'current' && (
          <Animated.View
            style={[
              styles.glowRing,
              {
                width: nodeSize + 20,
                height: nodeSize + 20,
                borderRadius: (nodeSize + 20) / 2,
                opacity: glowAnimations[index],
                transform: [
                  {
                    scale: glowAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        {/* Progress ring for partially completed episodes */}
        {episode.completionRate > 0 && episode.completionRate < 100 && (
          <View style={[styles.progressRing, { width: nodeSize + 8, height: nodeSize + 8 }]}>
            <Svg width={nodeSize + 8} height={nodeSize + 8}>
              <Circle
                cx={(nodeSize + 8) / 2}
                cy={(nodeSize + 8) / 2}
                r={(nodeSize + 8) / 2 - 2}
                stroke="#E5E5E5"
                strokeWidth="3"
                fill="none"
              />
              <Circle
                cx={(nodeSize + 8) / 2}
                cy={(nodeSize + 8) / 2}
                r={(nodeSize + 8) / 2 - 2}
                stroke={colors.primary}
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * ((nodeSize + 8) / 2 - 2)}`}
                strokeDashoffset={`${2 * Math.PI * ((nodeSize + 8) / 2 - 2) * (1 - episode.completionRate / 100)}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${(nodeSize + 8) / 2} ${(nodeSize + 8) / 2})`}
              />
            </Svg>
          </View>
        )}

        {/* Main node */}
        <TouchableOpacity
          onPress={() => handleNodePress(episode, index)}
          style={[styles.episodeNode, { width: nodeSize, height: nodeSize }]}
          activeOpacity={status === 'locked' ? 1 : 0.7}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={[styles.nodeGradient, { borderRadius: nodeSize / 2 }]}
          >
            {/* Special episode crown indicator */}
            {episode.type === 'weekend_special' && (
              <View style={styles.crownBadge}>
                <Sparkles size={14} color="#FFF" />
              </View>
            )}

            <IconComponent 
              size={episode.type === 'weekend_special' ? 40 : 32} 
              color={status === 'locked' ? '#999' : '#FFFFFF'}
              strokeWidth={2.5}
            />
          </LinearGradient>

          {/* Node shadow */}
          <View style={[
            styles.nodeShadow,
            { 
              width: nodeSize,
              height: nodeSize,
              borderRadius: nodeSize / 2,
              backgroundColor: colors.glow + '20',
            }
          ]} />
        </TouchableOpacity>

        {/* Episode info below node */}
        <View style={[styles.episodeInfo, { marginTop: nodeSize / 2 + 12 }]}>
          <Text style={[
            styles.episodeNumber,
            { color: status === 'locked' ? '#999' : Colors.light.text }
          ]}>
            {episode.type === 'weekend_special' ? '🎉' : episode.number}
          </Text>
          
          {status !== 'locked' && (
            <View style={[styles.statusBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.statusText, { color: colors.primary }]}>
                {status === 'completed' ? 'DONE' : 
                 status === 'current' ? 'NOW' : 'NEXT'}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderInfoCard = () => {
    if (!openInfoCardId) return null;

    const episode = seasons[0].episodes.find(ep => ep.id === openInfoCardId);
    if (!episode) return null;

    const currentNodeIndex = seasons[0].episodes.findIndex(ep => ep.id === openInfoCardId);
    const isLeft = currentNodeIndex % 2 === 0;
    const yOffset = 100 + currentNodeIndex * 90;
    const cardWidth = 280;
    const cardHeight = 160;
    
    const cardX = isLeft ? 100 : width - 160 - cardWidth;
    const cardY = Math.max(20, Math.min(yOffset - cardHeight / 2, height - cardHeight - 100));

    return (
      <Animated.View
        style={[
          styles.infoCard,
          {
            position: 'absolute',
            left: cardX,
            top: cardY,
            width: cardWidth,
            height: cardHeight,
            opacity: cardAnimation,
            transform: [
              {
                scale: cardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
              {
                translateY: cardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={95} tint="light" style={styles.cardBlur}>
            {renderCardContent(episode)}
          </BlurView>
        ) : (
          <View style={styles.cardAndroid}>
            {renderCardContent(episode)}
          </View>
        )}
      </Animated.View>
    );
  };

  const renderCardContent = (episode: Episode) => (
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {episode.title}
        </Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>
            {episode.difficulty?.toUpperCase() || 'EASY'}
          </Text>
        </View>
      </View>

      <Text style={styles.cardDescription} numberOfLines={2}>
        {episode.description}
      </Text>

      <View style={styles.cardStats}>
        <View style={styles.statItem}>
          <Clock size={14} color="#666" />
          <Text style={styles.statText}>{episode.duration}m</Text>
        </View>
        <View style={styles.statItem}>
          <Target size={14} color="#666" />
          <Text style={styles.statText}>{episode.vocabularyFocus?.length || 0} words</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          setOpenInfoCardId(null);
          onEpisodePress(episode);
        }}
      >
        <LinearGradient
          colors={['#FF4757', '#FF3742']}
          style={styles.buttonGradient}
        >
          <Play size={16} color="#FFF" />
          <Text style={styles.startButtonText}>
            {getEpisodeStatus(episode) === 'completed' ? 'REPLAY' : 'START'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.seasonIcon}>
            <Trophy size={24} color="#58CC02" />
          </View>
          <View>
            <Text style={styles.seasonTitle}>{seasons[0].title}</Text>
            <Text style={styles.seasonSubtitle}>Your learning adventure</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentProgress.completedEpisodes.length}/{seasons[0].episodes.slice(0, 6).length}
          </Text>
          <Text style={styles.progressLabel}>Episodes</Text>
        </View>
      </View>

      {/* Journey Map */}
      <View style={styles.mapContainer}>
        {renderAnimatedPath()}
        {seasons[0].episodes.slice(0, 6).map((episode, index) =>
          renderEpisodeNode(episode, index)
        )}
      </View>

      {/* View All Button */}
      <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
        <Text style={styles.viewAllText}>View All Episodes</Text>
        <ChevronRight size={16} color="#58CC02" />
      </TouchableOpacity>

      {/* Tap outside to close card */}
      {openInfoCardId && (
        <TouchableWithoutFeedback onPress={() => setOpenInfoCardId(null)}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
      )}

      {renderInfoCard()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seasonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  seasonTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
    color: '#1CB0F6',
    marginBottom: 2,
  },
  seasonSubtitle: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: '#546E7A',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    color: '#58CC02',
    marginBottom: 2,
  },
  progressLabel: {
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
    color: '#546E7A',
  },
  mapContainer: {
    height: 580,
    position: 'relative',
    marginBottom: 20,
  },
  nodeContainer: {
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: '#FF475720',
    borderWidth: 2,
    borderColor: '#FF4757',
  },
  progressRing: {
    position: 'absolute',
    top: -4,
    left: -4,
  },
  episodeNode: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  nodeGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  crownBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  nodeShadow: {
    position: 'absolute',
    top: 4,
    zIndex: -1,
  },
  episodeInfo: {
    alignItems: 'center',
    position: 'absolute',
  },
  episodeNumber: {
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
  },
  cardBlur: {
    flex: 1,
    borderRadius: 16,
  },
  cardAndroid: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardContent: {
    padding: 16,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    backgroundColor: '#E8F8E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 10,
    color: '#58CC02',
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontFamily: 'Outfit-Medium',
    fontSize: 13,
    color: '#546E7A',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
    color: '#666',
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  startButtonText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 14,
    color: '#FFF',
    letterSpacing: 0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#E8F8E8',
    borderRadius: 25,
    alignSelf: 'center',
  },
  viewAllText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 14,
    color: '#58CC02',
  },
});