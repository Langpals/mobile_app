// app/step/[id].tsx - Enhanced with 3D Effects
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Dimensions 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Mic, 
  RotateCcw, 
  ArrowRight, 
  Lightbulb, 
  Volume2,
  Heart,
  Star,
  Trophy,
  Zap
} from 'lucide-react-native';
import { mockSeasons } from '@/data/mockData';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import TeddyMascot from '@/components/ui/TeddyMascot';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import { Step, DifficultyLevel } from '@/types';

const { width, height } = Dimensions.get('window');

export default function StepScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState<Step | null>(null);
  const [episodeInfo, setEpisodeInfo] = useState<any>(null);
  const [stepNumber, setStepNumber] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'learning' | 'practice' | 'completed'>('intro');
  const [showHint, setShowHint] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  
  // Enhanced animations
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [progressAnimation] = useState(new Animated.Value(0));
  const [celebrationAnimation] = useState(new Animated.Value(0));
  const [headerAnimation] = useState(new Animated.Value(0));
  const [contentAnimation] = useState(new Animated.Value(0));
  const [floatingAnimation] = useState(new Animated.Value(0));
  const [heartAnimations] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]);

  useEffect(() => {
    // Find the step from all seasons' episodes
    for (const season of mockSeasons) {
      for (const episode of season.episodes) {
        const foundStepIndex = episode.steps.findIndex(s => s.id === id);
        if (foundStepIndex !== -1) {
          const foundStep = episode.steps[foundStepIndex];
          setStep(foundStep);
          setEpisodeInfo(episode);
          setStepNumber(foundStepIndex + 1);
          setCompleted(foundStep.completed);
          setCurrentPhase(foundStep.completed ? 'completed' : 'intro');
          break;
        }
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

    const fadeAnim = Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    // Floating animation loop
    const floatingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnimation, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnimation, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel([headerAnim, contentAnim, fadeAnim]).start();
    floatingLoop.start();
  }, []);

  const handleNextPhase = () => {
    const phases: Array<'intro' | 'learning' | 'practice' | 'completed'> = ['intro', 'learning', 'practice', 'completed'];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1]);
      
      // Animate progress
      Animated.timing(progressAnimation, {
        toValue: (currentIndex + 2) / phases.length,
        duration: 500,
        useNativeDriver: false,
      }).start();

      // Update score
      setScore(score + 100);
    } else {
      // Step completed - celebrate!
      Animated.timing(celebrationAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
      
      setCompleted(true);
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  };

  const loseHeart = () => {
    if (hearts > 0) {
      const heartIndex = hearts - 1;
      
      // Animate heart loss
      Animated.sequence([
        Animated.timing(heartAnimations[heartIndex], {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnimations[heartIndex], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      setHearts(hearts - 1);
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'intro': return ['#667eea', '#764ba2'];
      case 'learning': return ['#4ECDC4', '#44A08D'];
      case 'practice': return ['#FFE66D', '#FF9F43'];
      case 'completed': return ['#4CAF50', '#66BB6A'];
      default: return ['#667eea', '#764ba2'];
    }
  };

  const renderIntroPhase = () => (
    <Animated.View style={[
      styles.phaseContainer,
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
              outputRange: ['5deg', '0deg']
            })
          }
        ]
      }
    ]}>
      <View style={[styles.phaseCard, {
        shadowColor: getPhaseColor()[0],
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
      }]}>
        <LinearGradient
          colors={getPhaseColor() as [import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.phaseGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.phaseHighlight} />
          
          <Text style={[styles.phaseTitle, {
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }]}>
            {step?.title}
          </Text>
          
          <Text style={styles.phaseDescription}>
            Get ready to learn! Teddy will guide you through this step.
          </Text>

          {/* Animated Teddy */}
          <Animated.View style={[
            styles.teddyContainer,
            {
              transform: [
                {
                  translateY: floatingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10]
                  })
                },
                {
                  scale: floatingAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.05, 1]
                  })
                }
              ]
            }
          ]}>
            <TeddyMascot mood="excited" size="large" />
          </Animated.View>

          <TouchableOpacity
            onPress={handleNextPhase}
            style={[styles.phaseButton, {
              shadowColor: '#FFFFFF',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 8,
            }]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F5F5F5']}
              style={styles.phaseButtonGradient}
            >
              <Play size={24} color={getPhaseColor()[0]} strokeWidth={2.5} />
              <Text style={[styles.phaseButtonText, { color: getPhaseColor()[0] }]}>
                Let's Start!
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderLearningPhase = () => (
    <Animated.View style={[
      styles.phaseContainer,
      {
        opacity: contentAnimation,
        transform: [
          { perspective: 1000 },
          {
            rotateX: contentAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['3deg', '0deg']
            })
          }
        ]
      }
    ]}>
      <View style={[styles.phaseCard, {
        shadowColor: getPhaseColor()[0],
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
      }]}>
        <LinearGradient
          colors={getPhaseColor() as [import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.phaseGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.phaseHighlight} />
          
          <Text style={[styles.phaseTitle, {
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }]}>
            Learning: "Hola"
          </Text>
          
          <Text style={styles.phaseDescription}>
            Listen and repeat after Teddy!
          </Text>

          {/* Word Practice Card */}
          <View style={[styles.wordCard, {
            shadowColor: '#FFFFFF',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 10,
          }]}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.wordGradient}
            >
              <Text style={styles.wordText}>Hola</Text>
              <Text style={styles.wordTranslation}>Hello</Text>
              
              <TouchableOpacity style={styles.playButton}>
                <Volume2 size={32} color={getPhaseColor()[0]} strokeWidth={2.5} />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Mic size={24} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.actionButtonText}>Record</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleNextPhase}
              style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.3)' }]}
            >
              <ArrowRight size={24} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.actionButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderPracticePhase = () => (
    <Animated.View style={[
      styles.phaseContainer,
      {
        opacity: contentAnimation,
        transform: [
          { perspective: 1000 },
          {
            rotateX: contentAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['3deg', '0deg']
            })
          }
        ]
      }
    ]}>
      <View style={[styles.phaseCard, {
        shadowColor: getPhaseColor()[0],
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
      }]}>
        <LinearGradient
          colors={getPhaseColor() as [import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.phaseGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.phaseHighlight} />
          
          <Text style={[styles.phaseTitle, {
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }]}>
            Practice Time!
          </Text>
          
          <Text style={styles.phaseDescription}>
            Choose the correct translation for "Hello"
          </Text>

          {/* Practice Options */}
          <View style={styles.practiceOptions}>
            {['Hola', 'Adiós', 'Gracias'].map((option, index) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  if (option === 'Hola') {
                    handleNextPhase();
                  } else {
                    loseHeart();
                  }
                }}
                style={[styles.practiceOption, {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                  elevation: 6,
                }]}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F5F5F5']}
                  style={styles.practiceOptionGradient}
                >
                  <Text style={styles.practiceOptionText}>{option}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Hint Button */}
          <TouchableOpacity
            onPress={() => setShowHint(!showHint)}
            style={[styles.hintButton, {
              backgroundColor: showHint ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            }]}
          >
            <Lightbulb size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.hintButtonText}>
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Text>
          </TouchableOpacity>

          {showHint && (
            <Animated.View style={[
              styles.hintCard,
              {
                opacity: fadeAnimation,
                transform: [
                  { perspective: 800 },
                  { rotateX: '-5deg' },
                  { scale: 1.02 }
                ]
              }
            ]}>
              <Text style={styles.hintText}>
                💡 "Hola" is the Spanish word for "Hello"
              </Text>
            </Animated.View>
          )}
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderCompletedPhase = () => (
    <Animated.View style={[
      styles.phaseContainer,
      {
        opacity: celebrationAnimation,
        transform: [
          { perspective: 1000 },
          {
            scale: celebrationAnimation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.8, 1.1, 1]
            })
          },
          {
            rotateY: celebrationAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            })
          }
        ]
      }
    ]}>
      <View style={[styles.phaseCard, {
        shadowColor: getPhaseColor()[0],
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 20,
      }]}>
        <LinearGradient
          colors={getPhaseColor() as [import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.phaseGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.phaseHighlight} />
          
          <Trophy size={64} color="#FFFFFF" strokeWidth={2.5} />
          
          <Text style={[styles.phaseTitle, {
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }]}>
            Well Done!
          </Text>
          
          <Text style={styles.phaseDescription}>
            You've completed this step! 🎉
          </Text>

          {/* Score Display */}
          <View style={[styles.scoreCard, {
            shadowColor: '#FFFFFF',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 10,
          }]}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.scoreGradient}
            >
              <View style={styles.scoreItem}>
                <Star size={24} color="#FFD700" />
                <Text style={styles.scoreText}>+{score} XP</Text>
              </View>
              
              <View style={styles.scoreItem}>
                <Zap size={24} color="#FF6B6B" />
                <Text style={styles.scoreText}>Perfect!</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Floating celebration particles */}
          <View style={styles.celebrationParticles}>
            {[...Array(8)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.celebrationParticle,
                  {
                    opacity: celebrationAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1, 0]
                    }),
                    transform: [
                      {
                        translateY: celebrationAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -100 - (i * 20)]
                        })
                      },
                      {
                        rotate: celebrationAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '720deg']
                        })
                      }
                    ]
                  }
                ]}
              />
            ))}
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  if (!step) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradientBackground}
        >
          <View style={styles.loadingContainer}>
            <Animated.Text style={[styles.loadingText, {
              opacity: floatingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1]
              })
            }]}>
              Loading step...
            </Animated.Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={getPhaseColor() as [import('react-native').ColorValue, import('react-native').ColorValue]}
        style={styles.gradientBackground}
      >
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
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backHeaderButton}
            >
              <ArrowLeft size={24} color={getPhaseColor()[0]} strokeWidth={2.5} />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>
                Step {stepNumber} - {step.title}
              </Text>
              <Text style={styles.headerSubtitle}>
                {currentPhase === 'intro' ? 'Ready to start' :
                 currentPhase === 'learning' ? 'Learning...' :
                 currentPhase === 'practice' ? 'Practicing...' :
                 'Completed!'}
              </Text>
            </View>

            {/* Hearts Display */}
            <View style={styles.heartsContainer}>
              {[...Array(3)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.heartWrapper,
                    {
                      opacity: heartAnimations[index],
                      transform: [
                        { scale: heartAnimations[index] }
                      ]
                    }
                  ]}
                >
                  <Heart 
                    size={24} 
                    color={index < hearts ? "#FF6B6B" : "#CCCCCC"}
                    fill={index < hearts ? "#FF6B6B" : "transparent"}
                    strokeWidth={2}
                  />
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Enhanced Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(((currentPhase === 'intro' ? 0 : 
                           currentPhase === 'learning' ? 33 : 
                           currentPhase === 'practice' ? 66 : 100)))}% Complete
            </Text>
          </View>
        </Animated.View>

        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentPhase === 'intro' && renderIntroPhase()}
          {currentPhase === 'learning' && renderLearningPhase()}
          {currentPhase === 'practice' && renderPracticePhase()}
          {currentPhase === 'completed' && renderCompletedPhase()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
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
    color: '#FFFFFF',
    fontFamily: 'Cubano',
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Cubano',
    fontSize: 18,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
  },
  heartsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  heartWrapper: {
    padding: 4,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.success,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  phaseContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: height * 0.7,
  },
  phaseCard: {
    borderRadius: 24,
    overflow: 'hidden',
    margin: 8,
  },
  phaseGradient: {
    padding: 32,
    alignItems: 'center',
    position: 'relative',
    minHeight: 400,
    justifyContent: 'center',
  },
  phaseHighlight: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  phaseTitle: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'Cubano',
    textAlign: 'center',
    marginBottom: 16,
  },
  phaseDescription: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'OpenSans',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  teddyContainer: {
    marginBottom: 32,
  },
  phaseButton: {
    borderRadius: 20,
    overflow: 'hidden',
    minWidth: 200,
  },
  phaseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    gap: 12,
  },
  phaseButtonText: {
    fontSize: 20,
    fontFamily: 'Cubano',
  },
  wordCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    minWidth: width * 0.7,
  },
  wordGradient: {
    padding: 32,
    alignItems: 'center',
  },
  wordText: {
    fontSize: 48,
    color: Colors.light.text,
    fontFamily: 'Cubano',
    marginBottom: 8,
  },
  wordTranslation: {
    fontSize: 20,
    color: Colors.light.text,
    fontFamily: 'OpenSans',
    opacity: 0.7,
    marginBottom: 20,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  actionButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
  },
  practiceOptions: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  practiceOption: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  practiceOptionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  practiceOptionText: {
    fontSize: 18,
    color: Colors.light.text,
    fontFamily: 'Cubano',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  hintButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
  },
  hintCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  scoreCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
    minWidth: width * 0.6,
  },
  scoreGradient: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
  },
  scoreItem: {
    alignItems: 'center',
    gap: 8,
  },
  scoreText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Cubano',
  },
  celebrationParticles: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 200,
    pointerEvents: 'none',
  },
  celebrationParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    left: '50%',
    top: '50%',
  },
});