// app/episode/[id].tsx - Enhanced with 3D Effects
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Animated, 
  Dimensions 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Star, 
  Target, 
  BookOpen, 
  Trophy,
  Zap,
  Users,
  Volume2,
  Lightbulb
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockSeasons } from '@/data/mockData';
import { Episode, Step } from '@/types';

const { width, height } = Dimensions.get('window');

export default function EpisodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [seasonInfo, setSeasonInfo] = useState<any>(null);
  const [headerAnimation] = useState(new Animated.Value(0));
  const [contentAnimation] = useState(new Animated.Value(0));
  const [floatingAnimation] = useState(new Animated.Value(0));
  const [stepAnimations] = useState([]);

  useEffect(() => {
    // Find the episode from all seasons
    for (const season of mockSeasons) {
      const foundEpisode = season.episodes.find(ep => ep.id === id);
      if (foundEpisode) {
        setEpisode(foundEpisode);
        setSeasonInfo(season);
        break;
      }
    }

    // Start animations
    const headerAnim = Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    const contentAnim = Animated.timing(contentAnimation, {
      toValue: 1,
      duration: 1000,
      delay: 200,
      useNativeDriver: true,
    });

    // Floating animation loop
    const floatingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel([headerAnim, contentAnim]).start();
    floatingLoop.start();
  }, []);

  if (!episode) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.Text style={[styles.loadingText, {
            opacity: floatingAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1]
            })
          }]}>
            Loading amazing content...
          </Animated.Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartEpisode = () => {
    // Start the episode (would connect to teddy bear)
    console.log('Starting episode:', episode.id);
    if (episode.steps && episode.steps.length > 0) {
      router.push(`/step/${episode.steps[0].id}`);
    }
  };

  const getDifficultyColor = () => {
    switch (episode.difficulty) {
      case 'easy': return ['#4CAF50', '#66BB6A'];
      case 'medium': return ['#FF9800', '#FFB74D'];
      case 'hard': return ['#F44336', '#EF5350'];
      default: return ['#2196F3', '#42A5F5'];
    }
  };

  const getStatusColor = () => {
    if (episode.completed) return ['#4CAF50', '#66BB6A'];
    if (episode.locked) return ['#9E9E9E', '#BDBDBD'];
    return ['#FF4081', '#FF80AB'];
  };

  const renderStepPreview = (step: Step, index: number) => {
    const stepDelay = index * 100;
    
    return (
      <Animated.View
        key={step.id}
        style={[
          styles.stepCard,
          {
            opacity: contentAnimation,
            transform: [
              { perspective: 1000 },
              {
                translateY: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                })
              },
              {
                rotateX: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['8deg', '0deg']
                })
              },
              {
                scale: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              },
              {
                translateY: floatingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, index % 2 === 0 ? -2 : 2]
                })
              }
            ],
            shadowColor: step.completed ? '#4CAF50' : '#2196F3',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => router.push(`/step/${step.id}`)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={step.completed ? ['#4CAF50', '#66BB6A'] : ['#2196F3', '#42A5F5']}
            style={styles.stepGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* 3D Highlight */}
            <View style={styles.stepHighlight} />
            
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepType}>{step.type}</Text>
              </View>

              <View style={styles.stepStatus}>
                {step.completed ? (
                  <Target size={20} color="#FFFFFF" />
                ) : (
                  <Play size={20} color="#FFFFFF" />
                )}
              </View>
            </View>

            {/* Floating particles */}
            <View style={styles.stepParticles}>
              {[...Array(3)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.stepParticle,
                    {
                      opacity: floatingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.8]
                      }),
                      transform: [
                        {
                          translateX: floatingAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, i * 4]
                          })
                        }
                      ]
                    }
                  ]}
                />
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Enhanced 3D Header */}
        <Animated.View style={[
          styles.header,
          {
            opacity: headerAnimation,
            transform: [
              { perspective: 1000 },
              {
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0]
                })
              },
              {
                rotateX: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['10deg', '0deg']
                })
              }
            ]
          }
        ]}>
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header highlight */}
            <View style={styles.headerHighlight} />
            
            <View style={styles.headerContent}>
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={styles.backButton}
              >
                <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
              
              <View style={styles.headerInfo}>
                <Text style={[styles.headerTitle, {
                  textShadowColor: 'rgba(0,0,0,0.3)',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 4,
                }]}>
                  Episode {episode.number}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {seasonInfo?.title || 'Learning Adventure'}
                </Text>
              </View>

              <View style={styles.headerStats}>
                <View style={styles.headerStat}>
                  <Clock size={16} color="#FFFFFF" />
                  <Text style={styles.headerStatText}>{episode.duration}m</Text>
                </View>
              </View>
            </View>

            {/* Floating decorative elements */}
            <View style={styles.headerDecorative}>
              {[...Array(4)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.headerDecorativeElement,
                    {
                      opacity: floatingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 0.6]
                      }),
                      transform: [
                        {
                          rotate: floatingAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg']
                          })
                        },
                        {
                          translateY: floatingAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -8 - (i * 2)]
                          })
                        }
                      ]
                    }
                  ]}
                />
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Enhanced 3D Episode Info */}
        <Animated.View style={[
          styles.episodeContainer,
          {
            opacity: contentAnimation,
            transform: [
              { perspective: 1000 },
              {
                translateY: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0]
                })
              },
              {
                rotateX: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['5deg', '0deg']
                })
              }
            ]
          }
        ]}>
          <View style={[styles.episodeCard, {
            shadowColor: getDifficultyColor()[0],
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 12,
          }]}>
            <LinearGradient
              colors={([...getDifficultyColor(), 'rgba(255,255,255,0.1)'] as unknown) as [import('react-native').ColorValue, import('react-native').ColorValue, ...import('react-native').ColorValue[]]}
              style={styles.episodeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Card highlight */}
              <View style={styles.episodeHighlight} />
              
              <Text style={[styles.episodeTitle, {
                textShadowColor: 'rgba(0,0,0,0.3)',
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }]}>
                {episode.title}
              </Text>
              
              <Text style={styles.episodeDescription}>
                {episode.description}
              </Text>

              {/* Episode stats */}
              <View style={styles.episodeStats}>
                <View style={styles.episodeStat}>
                  <BookOpen size={18} color="#FFFFFF" />
                  <Text style={styles.episodeStatText}>
                    {episode.steps?.length || 0} Steps
                  </Text>
                </View>
                
                <View style={styles.episodeStat}>
                  <Star size={18} color="#FFFFFF" />
                  <Text style={styles.episodeStatText}>
                    {episode.difficulty.charAt(0).toUpperCase() + episode.difficulty.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.episodeStat}>
                  <Trophy size={18} color="#FFFFFF" />
                  <Text style={styles.episodeStatText}>
                    {/* XP property not available on Episode type */}
                  </Text>
                </View>
              </View>

              {/* Enhanced Start Button */}
              <TouchableOpacity
                onPress={handleStartEpisode}
                style={[styles.startButton, {
                  shadowColor: '#FFFFFF',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 8,
                }]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F5F5F5']}
                  style={styles.startButtonGradient}
                >
                  <Play size={24} color={getDifficultyColor()[0]} strokeWidth={2.5} />
                  <Text style={[styles.startButtonText, { color: getDifficultyColor()[0] }]}>
                    {episode.completed ? 'REVIEW EPISODE' : 'START EPISODE'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Enhanced 3D Steps Preview */}
        {episode.steps && episode.steps.length > 0 && (
          <Animated.View style={[
            styles.stepsSection,
            {
              opacity: contentAnimation,
              transform: [
                { perspective: 1000 },
                {
                  translateY: contentAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                },
                {
                  rotateX: contentAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['3deg', '0deg']
                  })
                }
              ]
            }
          ]}>
            <Text style={[styles.sectionTitle, {
              textShadowColor: 'rgba(0,0,0,0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }]}>
              Learning Steps
            </Text>
            
            <Text style={styles.sectionSubtitle}>
              Complete each step to master this episode
            </Text>

            <View style={styles.stepsContainer}>
              {episode.steps.slice(0, 5).map((step, index) => 
                renderStepPreview(step, index)
              )}
              
              {episode.steps.length > 5 && (
                <View style={styles.moreSteps}>
                  <Text style={styles.moreStepsText}>
                    +{episode.steps.length - 5} more steps
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Learning Objectives with 3D effects */}
        <Animated.View style={[
          styles.objectivesSection,
          {
            opacity: contentAnimation,
            transform: [
              { perspective: 1000 },
              {
                translateY: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0]
                })
              },
              {
                rotateX: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['2deg', '0deg']
                })
              }
            ]
          }
        ]}>
          <View style={[styles.objectivesCard, {
            shadowColor: '#4CAF50',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 10,
          }]}>
            <LinearGradient
              colors={['#4CAF50', '#66BB6A', 'rgba(255,255,255,0.1)']}
              style={styles.objectivesGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.objectivesHighlight} />
              
              <View style={styles.objectivesHeader}>
                <Lightbulb size={24} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={[styles.objectivesTitle, {
                  textShadowColor: 'rgba(0,0,0,0.3)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }]}>
                  What You'll Learn
                </Text>
              </View>
              
              <Text style={styles.objectivesText}>
                • Greet people in Spanish with confidence{'\n'}
                • Use basic courtesy expressions{'\n'}
                • Practice pronunciation with Teddy{'\n'}
                • Build vocabulary through interactive games
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.light.text,
    fontFamily: 'Cubano',
    textAlign: 'center',
  },
  header: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
    position: 'relative',
    minHeight: 120,
  },
  headerHighlight: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Cubano',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'OpenSans',
  },
  headerStats: {
    alignItems: 'center',
  },
  headerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  headerStatText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
  },
  headerDecorative: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  headerDecorativeElement: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  },
  episodeContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  episodeCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  episodeGradient: {
    padding: 24,
    position: 'relative',
  },
  episodeHighlight: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2.5,
  },
  episodeTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'Cubano',
    marginBottom: 12,
    textAlign: 'center',
  },
  episodeDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'OpenSans',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  episodeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  episodeStat: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    minWidth: 80,
  },
  episodeStatText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    width: '80%',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Cubano',
  },
  stepsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    color: Colors.light.text,
    fontFamily: 'Cubano',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans',
    marginBottom: 20,
  },
  stepsContainer: {
    gap: 12,
  },
  stepCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  stepGradient: {
    padding: 16,
    position: 'relative',
  },
  stepHighlight: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Cubano',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Cubano',
    marginBottom: 2,
  },
  stepType: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'OpenSans',
  },
  stepStatus: {
    marginLeft: 16,
  },
  stepParticles: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  stepParticle: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginBottom: 3,
  },
  moreSteps: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  moreStepsText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
    opacity: 0.7,
  },
  objectivesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  objectivesCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  objectivesGradient: {
    padding: 20,
    position: 'relative',
  },
  objectivesHighlight: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  objectivesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  objectivesTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Cubano',
  },
  objectivesText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'OpenSans',
    lineHeight: 24,
  },
});