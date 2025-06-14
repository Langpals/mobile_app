import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Flame, Trophy, Zap, Clock, Star, BookOpen, Target, 
  Calendar, ChevronRight, Heart, Award, User, Crown, Play, CheckCircle, Lock
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockSeasons, mockProgressStats, mockChildProfile } from '@/data/mockData';
import { router } from 'expo-router';
import { Episode } from '@/types';

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
}

const LearningJourneyMap: React.FC<LearningJourneyMapProps> = ({ seasons, onEpisodePress, currentProgress }) => {
  const [nodeAnimations] = useState(
    seasons[0].episodes.slice(0, 6).map((): Animated.Value => new Animated.Value(0))
  );

  useEffect(() => {
    // Staggered animation for nodes
    nodeAnimations.forEach((anim: Animated.Value, index: number) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
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

  const renderPathLine = (index: number, isVertical: boolean = false) => {
    if (index === 0) return null;
    
    return (
      <View style={[
        styles.pathLine,
        isVertical ? styles.pathLineVertical : styles.pathLineHorizontal,
        { opacity: index <= currentProgress.completedEpisodes.length ? 1 : 0.3 }
      ]} />
    );
  };

  const renderEpisodeNode = (episode: Episode, index: number) => {
    const status = getEpisodeStatus(episode);
    const isSpecial = episode.type === 'weekend_special';
    const nodeSize = isSpecial ? 80 : 70;
    
    // Calculate position for zigzag pattern
    const row = Math.floor(index / 2);
    const isLeft = index % 2 === 0;
    const yOffset = row * 120;
    const xOffset = isLeft ? 50 : width - 120;

    return (
      <Animated.View
        key={episode.id}
        style={[
          styles.episodeNodeContainer,
          {
            left: xOffset,
            top: yOffset,
            opacity: nodeAnimations[index],
            transform: [{
              scale: nodeAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1]
              })
            }]
          }
        ]}
      >
        {/* Path line to previous episode */}
        {renderPathLine(index)}
        
        {/* Episode Node */}
        <TouchableOpacity
          onPress={() => status !== 'locked' && onEpisodePress(episode)}
          disabled={status === 'locked'}
          style={[styles.episodeNode, { width: nodeSize, height: nodeSize }]}
        >
          {/* Node Shadow/Glow */}
          <View style={[
            styles.nodeShadow,
            { 
              width: nodeSize + 8, 
              height: nodeSize + 8,
              backgroundColor: status === 'completed' ? '#4CAF5020' : 
                              status === 'current' ? '#FF6B6B20' : '#E0E0E020'
            }
          ]} />
          
          {/* Main Node */}
          <LinearGradient
            colors={
              status === 'completed' 
                ? ['#4CAF50', '#45A049']
                : status === 'current'
                ? ['#FF6B6B', '#FF5252']
                : ['#E0E0E0', '#BDBDBD']
            }
            style={[styles.nodeGradient, { borderRadius: nodeSize / 2 }]}
          >
            {/* Special episode crown */}
            {isSpecial && status !== 'locked' && (
              <View style={styles.crownIndicator}>
                <Crown size={16} color="#FFD700" />
              </View>
            )}
            
            {/* Node Icon */}
            {status === 'completed' ? (
              <CheckCircle size={isSpecial ? 36 : 28} color="#FFFFFF" strokeWidth={3} />
            ) : status === 'current' ? (
              <Play size={isSpecial ? 36 : 28} color="#FFFFFF" strokeWidth={3} />
            ) : (
              <Lock size={isSpecial ? 36 : 28} color="#9E9E9E" strokeWidth={3} />
            )}
            
            {/* Episode Number */}
            <View style={styles.episodeNumberBadge}>
              <Text style={styles.episodeNumberText}>{episode.number}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Episode Info Card */}
        <View style={[
          styles.episodeInfoCard,
          { 
            alignSelf: isLeft ? 'flex-start' : 'flex-end',
            marginLeft: isLeft ? -10 : -140,
            opacity: status === 'locked' ? 0.6 : 1
          }
        ]}>
          <Text style={[
            styles.episodeCardTitle,
            { color: status === 'locked' ? '#9E9E9E' : '#2C3E50' }
          ]}>
            {episode.title}
          </Text>
          
          {status !== 'locked' && (
            <>
              <View style={styles.episodeCardMeta}>
                <View style={styles.metaItem}>
                  <Clock size={12} color="#666" />
                  <Text style={styles.metaText}>{episode.duration}m</Text>
                </View>
                <View style={styles.metaItem}>
                  <BookOpen size={12} color="#666" />
                  <Text style={styles.metaText}>{episode.vocabularyFocus.length} words</Text>
                </View>
              </View>
              
              {status === 'current' && episode.completionRate > 0 && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${episode.completionRate}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{episode.completionRate}% complete</Text>
                </View>
              )}
            </>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.learningJourneyContainer}>
      {/* Section Header */}
      <View style={styles.journeyHeader}>
        <View style={styles.journeyTitleContainer}>
          <View style={styles.journeyIcon}>
            <Trophy size={24} color="#FF6B6B" />
          </View>
          <View>
            <Text style={styles.journeyTitle}>{seasons[0].title}</Text>
            <Text style={styles.journeySubtitle}>Your learning adventure</Text>
          </View>
        </View>
        <View style={styles.journeyProgress}>
          <Text style={styles.progressNumber}>
            {currentProgress.completedEpisodes.length}/{seasons[0].episodes.length}
          </Text>
          <Text style={styles.progressLabel}>Episodes</Text>
        </View>
      </View>

      {/* Journey Map */}
      <View style={styles.journeyMapWrapper}>
        <View style={styles.journeyMap}>
          {seasons[0].episodes.slice(0, 6).map((episode: Episode, index: number) => 
            renderEpisodeNode(episode, index)
          )}
        </View>
        
        {/* View All Episodes Button */}
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/season/1')}
        >
          <Text style={styles.viewAllText}>View All Episodes</Text>
          <ChevronRight size={16} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  
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

  const handleEpisodePress = (episode: Episode) => {
    router.push(`/episode/${episode.id}`);
  };

  const getWeeklyGoalProgress = () => {
    return (mockProgressStats.weeklyCompletedMinutes / mockProgressStats.weeklyGoalMinutes) * 100;
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <Animated.View style={[styles.welcomeSection, { opacity: fadeAnim }]}>
          <View style={styles.welcomeCard}>
            <LinearGradient
              colors={['#FF6B6B15', '#FFFFFF']}
              style={styles.welcomeGradient}
            >
              <View style={styles.welcomeContent}>
                <View style={styles.welcomeText}>
                  <Text style={styles.welcomeTitle}>¡Hola, {mockChildProfile.name}!</Text>
                  <Text style={styles.welcomeSubtitle}>Ready for today's Spanish adventure with Bern?</Text>
                </View>
                <View style={styles.welcomeEmoji}>
                  <Text style={styles.teddyEmoji}>🧸</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Weekly Goal Progress */}
        <Animated.View style={[styles.weeklyGoalSection, { opacity: fadeAnim }]}>
          <View style={styles.weeklyGoalCard}>
            <View style={styles.weeklyGoalHeader}>
              <View style={styles.weeklyGoalTitleContainer}>
                <Target size={20} color="#4CAF50" />
                <Text style={styles.weeklyGoalTitle}>Weekly Goal</Text>
              </View>
              <Text style={styles.weeklyGoalProgress}>
                {Math.round(getWeeklyGoalProgress())}%
              </Text>
            </View>
            
            <View style={styles.weeklyGoalBar}>
              <View 
                style={[
                  styles.weeklyGoalFill,
                  { width: `${getWeeklyGoalProgress()}%` }
                ]}
              />
            </View>
            
            <Text style={styles.weeklyGoalText}>
              {mockProgressStats.weeklyCompletedMinutes} of {mockProgressStats.weeklyGoalMinutes} minutes completed
            </Text>
          </View>
        </Animated.View>

        {/* Enhanced Learning Journey */}
        <Animated.View style={[styles.learningPathSection, { opacity: fadeAnim }]}>
          <LearningJourneyMap 
            seasons={mockSeasons}
            onEpisodePress={handleEpisodePress}
            currentProgress={currentProgress}
          />
        </Animated.View>

        {/* Continue Button */}
        <Animated.View style={[styles.continueSection, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/episode/ep-1-2')}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF5252']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueButtonText}>Continue Learning</Text>
              <ChevronRight size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeGradient: {
    padding: 20,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Nunito-ExtraBold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#546E7A',
    fontFamily: 'Inter_400Regular',
  },
  welcomeEmoji: {
    marginLeft: 16,
  },
  teddyEmoji: {
    fontSize: 48,
  },
  leagueSection: {
    marginBottom: 20,
  },
  leagueCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  leagueGradient: {
    padding: 16,
  },
  leagueContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leagueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  leagueInfo: {
    flex: 1,
  },
  leagueTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Cubano',
  },
  leagueXP: {
    fontSize: 14,
    color: '#546E7A',
    fontFamily: 'OpenSans',
  },
  weeklyGoalSection: {
    marginBottom: 24,
  },
  weeklyGoalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  weeklyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyGoalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weeklyGoalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Cubano',
  },
  weeklyGoalProgress: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    fontFamily: 'Cubano',
  },
  weeklyGoalBar: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  weeklyGoalFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  weeklyGoalText: {
    fontSize: 12,
    color: '#546E7A',
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
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
  pathLine: {
    backgroundColor: '#E0E0E0',
    position: 'absolute',
  },
  pathLineHorizontal: {
    height: 3,
    width: 60,
    top: 35,
    left: -60,
  },
  pathLineVertical: {
    width: 3,
    height: 40,
    left: 35,
    top: -40,
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
  crownIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    fontSize: 12,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Cubano',
  },
  episodeInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  episodeCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Cubano',
    marginBottom: 6,
    lineHeight: 18,
  },
  episodeCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'OpenSans',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#FF6B6B',
    fontFamily: 'OpenSans',
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    fontFamily: 'OpenSans',
  },
  quickStatsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Cubano',
    marginVertical: 8,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#546E7A',
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  continueSection: {
    marginBottom: 20,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Cubano',
  },
});