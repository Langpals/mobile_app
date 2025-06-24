// components/ui/SeasonCard.tsx - Enhanced with 3D Effects
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChevronDown, 
  MapPin, 
  Clock, 
  Play, 
  Star, 
  Target, 
  BookOpen, 
  Trophy,
  CheckCircle,
  Sparkles,
  Globe
} from 'lucide-react-native';
import { Season } from '@/types';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface SeasonCardProps {
  season: Season;
  onPress?: () => void;
  showDetails?: boolean;
  index?: number;
}

export default function SeasonCard({ 
  season, 
  onPress, 
  showDetails = true, 
  index = 0 
}: SeasonCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [rotateAnimation] = useState(new Animated.Value(0));
  const [cardAnimation] = useState(new Animated.Value(0));
  const [expandAnimation] = useState(new Animated.Value(0));
  const [floatingAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Entrance animation
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 800,
      delay: index * 150,
      useNativeDriver: true,
    }).start();

    // Floating animation loop
    const floatingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnimation, {
          toValue: 1,
          duration: 3000 + (index * 500), // Staggered floating
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnimation, {
          toValue: 0,
          duration: 3000 + (index * 500),
          useNativeDriver: true,
        }),
      ])
    );

    floatingLoop.start();
  }, []);

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(rotateAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(expandAnimation, {
        toValue,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
    
    setExpanded(!expanded);
  };

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const expandHeight = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const getProgressColor = () => {
    if (season.progressPercentage >= 80) return ['#4CAF50', '#66BB6A'];
    if (season.progressPercentage >= 50) return ['#FF9800', '#FFB74D'];
    return ['#2196F3', '#42A5F5'];
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
  const progressColors = getProgressColor();

  return (
    <Animated.View style={[
      styles.container,
      {
        opacity: cardAnimation,
        transform: [
          { perspective: 1000 },
          {
            translateY: cardAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0]
            })
          },
          {
            rotateX: cardAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['8deg', '0deg']
            })
          },
          {
            scale: cardAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1]
            })
          },
          {
            translateY: floatingAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, index % 2 === 0 ? -3 : 3]
            })
          }
        ],
        shadowColor: progressColors[0],
        shadowOffset: { width: 0, height: 8 + (index * 2) },
        shadowOpacity: 0.2,
        shadowRadius: 12 + (index * 2),
        elevation: 8 + index,
      }
    ]}>
      {/* Main Card */}
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress || toggleExpand}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={((season.locked
            ? ['#F5F5F5', '#EAEAEA', '#F0F0F0']
            : [...progressColors, 'rgba(255,255,255,0.1)']) as unknown) as [import('react-native').ColorValue, import('react-native').ColorValue, ...import('react-native').ColorValue[]]}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* 3D Card Highlight */}
          <View style={styles.cardHighlight} />
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Animated.View style={[
                styles.seasonNumber,
                { 
                  backgroundColor: season.locked ? 
                    'rgba(158, 158, 158, 0.2)' : 
                    'rgba(255,255,255,0.2)',
                  borderColor: season.locked ? 
                    'rgba(158, 158, 158, 0.4)' : 
                    'rgba(255,255,255,0.3)',
                  transform: [
                    { perspective: 800 },
                    { rotateY: '10deg' },
                    { scale: 1.05 }
                  ],
                  shadowColor: '#FFFFFF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }
              ]}>
                <Text style={[
                  styles.seasonNumberText,
                  { 
                    color: season.locked ? '#9E9E9E' : '#FFFFFF',
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }
                ]}>
                  {season.number}
                </Text>
              </Animated.View>
              
              <View style={styles.headerInfo}>
                <Text style={[
                  styles.seasonTitle,
                  { 
                    color: season.locked ? '#9E9E9E' : '#FFFFFF',
                    textShadowColor: 'rgba(0,0,0,0.2)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }
                ]}>
                  {season.title}
                </Text>
                <Text style={[
                  styles.seasonSubtitle,
                  { color: season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.8)' }
                ]}>
                  {season.setting}
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              {/* Progress Circle */}
              <Animated.View style={[
                styles.progressCircle,
                {
                  transform: [
                    { perspective: 600 },
                    { rotateY: '-15deg' },
                    { scale: 1.1 }
                  ],
                  shadowColor: '#FFFFFF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }
              ]}>
                <Text style={[
                  styles.progressText,
                  { 
                    color: season.locked ? '#9E9E9E' : '#FFFFFF',
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }
                ]}>
                  {Math.round(season.progressPercentage)}%
                </Text>
              </Animated.View>

              {/* Expand Button */}
              {showDetails && (
                <TouchableOpacity 
                  onPress={toggleExpand}
                  style={[styles.expandButton, {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderColor: 'rgba(255,255,255,0.3)',
                  }]}
                  activeOpacity={0.8}
                >
                  <Animated.View style={{
                    transform: [{ rotate: rotateInterpolate }]
                  }}>
                    <ChevronDown 
                      size={20} 
                      color={season.locked ? '#BDBDBD' : '#FFFFFF'} 
                      strokeWidth={2.5}
                    />
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Enhanced Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${season.progressPercentage}%`,
                    backgroundColor: season.locked ? '#BDBDBD' : '#FFFFFF',
                    shadowColor: '#FFFFFF',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                    elevation: 4,
                  }
                ]}
              />
            </View>
            
            <Text style={[
              styles.progressLabel,
              { color: season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.9)' }
            ]}>
              {stats.completedEpisodes}/{stats.totalEpisodes} episodes completed
            </Text>
          </View>

          {/* Quick Stats with 3D effects */}
          <View style={styles.quickStats}>
            <Animated.View style={[
              styles.statItem,
              {
                transform: [
                  { perspective: 600 },
                  { rotateY: '5deg' },
                  { scale: 1.02 }
                ]
              }
            ]}>
              <Play size={14} color={season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.8)'} />
              <Text style={[
                styles.statText,
                { color: season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.9)' }
              ]}>
                {stats.totalEpisodes} EP
              </Text>
            </Animated.View>
            
            <Animated.View style={[
              styles.statItem,
              {
                transform: [
                  { perspective: 600 },
                  { rotateY: '0deg' },
                  { scale: 1.02 }
                ]
              }
            ]}>
              <Clock size={14} color={season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.8)'} />
              <Text style={[
                styles.statText,
                { color: season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.9)' }
              ]}>
                {stats.totalDuration}m
              </Text>
            </Animated.View>
            
            <Animated.View style={[
              styles.statItem,
              {
                transform: [
                  { perspective: 600 },
                  { rotateY: '-5deg' },
                  { scale: 1.02 }
                ]
              }
            ]}>
              <Target size={14} color={season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.8)'} />
              <Text style={[
                styles.statText,
                { color: season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.9)' }
              ]}>
                {stats.achievedOutcomes}/{stats.totalOutcomes} GOALS
              </Text>
            </Animated.View>
          </View>

          {/* Setting Preview with 3D icon */}
          <View style={styles.settingPreview}>
            <Animated.View style={{
              transform: [
                { perspective: 500 },
                { rotateZ: '5deg' },
                { scale: 1.1 }
              ]
            }}>
              <Globe size={16} color={season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.8)'} />
            </Animated.View>
            <Text style={[
              styles.settingText,
              { color: season.locked ? '#BDBDBD' : 'rgba(255,255,255,0.8)' }
            ]}>
              {season.setting}
            </Text>
          </View>

          {/* Floating particles for unlocked seasons */}
          {!season.locked && (
            <View style={styles.particleContainer}>
              {[...Array(4)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.particle,
                    {
                      opacity: floatingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.8]
                      }),
                      transform: [
                        {
                          translateY: floatingAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -8 - (i * 3)]
                          })
                        },
                        {
                          rotate: floatingAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg']
                          })
                        }
                      ]
                    }
                  ]}
                />
              ))}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Enhanced Expanded Details */}
      {expanded && showDetails && (
        <Animated.View style={[
          styles.expandedContent,
          {
            height: expandHeight,
            opacity: expandAnimation,
            transform: [
              { perspective: 1000 },
              {
                rotateX: expandAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['10deg', '0deg']
                })
              },
              {
                scale: expandAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }
            ]
          }
        ]}>
          <View style={[styles.expandedCard, {
            shadowColor: progressColors[0],
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 10,
          }]}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.expandedGradient}
            >
              <View style={styles.expandedHighlight} />
              
              {/* Description */}
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Adventure Description</Text>
                <Text style={styles.description}>{season.description}</Text>
              </View>

              {/* Learning Focus with 3D effects */}
              <View style={styles.learningSection}>
                <Text style={styles.sectionTitle}>What You'll Learn</Text>
                <View style={styles.learningGrid}>
                  {season.learningFocus.map((focus, index) => (
                    <Animated.View 
                      key={index} 
                      style={[
                        styles.learningItem,
                        {
                          transform: [
                            { perspective: 800 },
                            { rotateX: '2deg' },
                            { scale: 1.02 }
                          ],
                          shadowColor: progressColors[0],
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 4,
                        }
                      ]}
                    >
                      <BookOpen size={12} color={progressColors[0]} strokeWidth={2.5} />
                      <Text style={styles.learningText}>{focus}</Text>
                    </Animated.View>
                  ))}
                </View>
              </View>

              {/* Learning Outcomes Progress with enhanced 3D */}
              <View style={styles.outcomesSection}>
                <Text style={styles.sectionTitle}>Learning Goals Progress</Text>
                {season.learningOutcomes.slice(0, 3).map((outcome, index) => (
                  <Animated.View 
                    key={outcome.id} 
                    style={[
                      styles.outcomeItem,
                      {
                        transform: [
                          { perspective: 800 },
                          { rotateY: '1deg' },
                          { scale: 1.01 }
                        ],
                        shadowColor: outcome.achieved ? progressColors[0] : '#E0E0E0',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                        elevation: 3,
                      }
                    ]}
                  >
                    <Animated.View style={[
                      styles.outcomeStatus,
                      { 
                        backgroundColor: outcome.achieved ? progressColors[0] : Colors.light.border,
                        transform: [
                          { perspective: 500 },
                          { rotateY: '10deg' },
                          { scale: 1.1 }
                        ],
                        shadowColor: outcome.achieved ? progressColors[0] : '#E0E0E0',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 4,
                      }
                    ]}>
                      {outcome.achieved && (
                        <CheckCircle size={12} color="#FFFFFF" strokeWidth={2.5} />
                      )}
                    </Animated.View>
                    <Text style={[
                      styles.outcomeText,
                      outcome.achieved && styles.outcomeCompleted
                    ]}>
                      {outcome.description}
                    </Text>
                  </Animated.View>
                ))}
                
                {season.learningOutcomes.length > 3 && (
                  <Text style={styles.moreOutcomes}>
                    +{season.learningOutcomes.length - 3} more learning goals
                  </Text>
                )}
              </View>

              {/* Episode Preview Grid with enhanced 3D */}
              <View style={styles.episodePreview}>
                <Text style={styles.sectionTitle}>Episode Highlights</Text>
                <View style={styles.episodeGrid}>
                  {season.episodes.slice(0, 4).map((episode, index) => (
                    <Animated.View 
                      key={episode.id} 
                      style={[
                        styles.episodePreviewItem,
                        episode.completed && styles.episodePreviewCompleted,
                        episode.locked && styles.episodePreviewLocked,
                        {
                          transform: [
                            { perspective: 800 },
                            { rotateX: '3deg' },
                            { rotateY: index % 2 === 0 ? '2deg' : '-2deg' },
                            { scale: 1.02 }
                          ],
                          shadowColor: episode.completed ? '#4CAF50' : 
                                      episode.locked ? '#E0E0E0' : progressColors[0],
                          shadowOffset: { width: 0, height: 6 },
                          shadowOpacity: 0.15,
                          shadowRadius: 10,
                          elevation: 6,
                        }
                      ]}
                    >
                      <Text style={[
                        styles.episodePreviewNumber,
                        episode.completed && styles.episodePreviewNumberCompleted,
                        episode.locked && styles.episodePreviewNumberLocked,
                        {
                          textShadowColor: 'rgba(0,0,0,0.2)',
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 2,
                        }
                      ]}>
                        {episode.number}
                      </Text>
                      <Text style={[
                        styles.episodePreviewTitle,
                        episode.locked && styles.episodePreviewTitleLocked
                      ]}>
                        {episode.title}
                      </Text>
                    </Animated.View>
                  ))}
                </View>
                
                {season.episodes.length > 4 && (
                  <Text style={styles.moreEpisodes}>
                    +{season.episodes.length - 4} more episodes
                  </Text>
                )}
              </View>
            </LinearGradient>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'visible',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    position: 'relative',
  },
  cardHighlight: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginRight: 16,
    borderWidth: 2,
  },
  seasonNumberText: {
    fontFamily: 'Cubano',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  seasonTitle: {
    fontFamily: 'Cubano',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  seasonSubtitle: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    opacity: 0.9,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  progressText: {
    fontFamily: 'Cubano',
    fontSize: 14,
    fontWeight: 'bold',
  },
  expandButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 10,
  },
  settingPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  settingText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  particleContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  particle: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  expandedContent: {
    overflow: 'hidden',
    marginTop: 8,
  },
  expandedCard: {
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
  },
  expandedGradient: {
    padding: 20,
    flex: 1,
    position: 'relative',
  },
  expandedHighlight: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 1.5,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Cubano',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: Colors.light.text,
    lineHeight: 18,
    opacity: 0.8,
  },
  learningSection: {
    marginBottom: 16,
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
    gap: 4,
  },
  learningText: {
    fontFamily: 'OpenSans',
    fontSize: 11,
    color: Colors.light.text,
  },
  outcomesSection: {
    marginBottom: 16,
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 8,
    padding: 8,
  },
  outcomeStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  outcomeText: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: Colors.light.text,
    flex: 1,
    lineHeight: 18,
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
    textAlign: 'center',
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
    width: (width - 80) / 2,
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
    textAlign: 'center',
  },
});