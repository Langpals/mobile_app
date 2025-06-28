// app/season/[id].tsx - Enhanced with 3D Effects
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Animated, 
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Play, 
  Lock, 
  Star, 
  Clock, 
  Trophy, 
  Target, 
  CheckCircle,
  BookOpen,
  Globe,
  Sparkles,
  MapPin
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockSeasons } from '@/data/mockData';
import { Season, Episode } from '@/types';

const { width, height } = Dimensions.get('window');

export default function SeasonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [season, setSeason] = useState<Season | null>(null);
  const [headerAnimation] = useState(new Animated.Value(0));
  const [contentAnimation] = useState(new Animated.Value(0));
  const [episodeAnimations] = useState([]);
  const [floatingAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const foundSeason = mockSeasons.find(s => s.id === id);
    if (foundSeason) {
      setSeason(foundSeason);
    }
  }, []);

  if (!season) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.loadingGradient}
        >
          <Animated.Text style={[styles.loadingText, {
            opacity: floatingAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1]
            })
          }]}>
            Loading season...
          </Animated.Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const handleEpisodePress = (episode: Episode) => {
    if (!episode.locked) {
      router.push(`/episode/${episode.id}`);
    }
  };

  const completedEpisodes = season.episodes.filter(ep => ep.completed).length;
  const totalEpisodes = season.episodes.length;
  const progressPercentage = (completedEpisodes / totalEpisodes) * 100;

  const getSeasonGradient = () => {
    if (progressPercentage >= 80) return ['#4CAF50', '#66BB6A'];
    if (progressPercentage >= 50) return ['#FF9800', '#FFB74D'];
    return ['#667eea', '#764ba2'];
  };

  const renderEpisodeCard = (episode: Episode, index: number) => {
    const isCompleted = episode.completed;
    const isLocked = episode.locked;
    const episodeGradient = isCompleted 
      ? ['#4CAF50', '#66BB6A'] 
      : isLocked 
        ? ['#9E9E9E', '#BDBDBD']
        : ['#2196F3', '#42A5F5'];

    return (
      <View
        key={episode.id}
        style={[
          styles.episodeCard,
          {
            shadowColor: episodeGradient[0],
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => handleEpisodePress(episode)}
          disabled={isLocked}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={episodeGradient as [import('react-native').ColorValue, import('react-native').ColorValue]}
            style={styles.episodeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            
            <View style={styles.episodeHeader}>
              <View style={styles.episodeNumber}>
                <Text style={styles.episodeNumberText}>{episode.number}</Text>
              </View>
              
              <View style={styles.episodeInfo}>
                <Text style={[styles.episodeTitle, {
                  textShadowColor: 'rgba(0,0,0,0.2)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }]}>
                  {episode.title}
                </Text>
                <Text style={styles.episodeDescription}>
                  {episode.description}
                </Text>
              </View>

              <View style={styles.episodeStatus}>
                {isCompleted ? (
                  <CheckCircle size={28} color="#FFFFFF" strokeWidth={2.5} />
                ) : isLocked ? (
                  <Lock size={28} color="#FFFFFF" strokeWidth={2.5} />
                ) : (
                  <Play size={28} color="#FFFFFF" strokeWidth={2.5} />
                )}
              </View>
            </View>

            {/* Episode stats */}
            <View style={styles.episodeStats}>
              <View style={styles.episodeStat}>
                <Clock size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.episodeStatText}>
                  {episode.duration}m
                </Text>
              </View>
              
              <View style={styles.episodeStat}>
                <BookOpen size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.episodeStatText}>
                  {episode.steps?.length || 0} Steps
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced 3D Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={getSeasonGradient() as [import('react-native').ColorValue, import('react-native').ColorValue]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header highlight */}
            
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
                  Season {season.number}
                </Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {season.title}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Enhanced Season Info */}
        <View style={styles.seasonContainer}>
          <View style={[styles.seasonCard, {
            shadowColor: getSeasonGradient()[0],
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 12,
          }]}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.seasonGradient}
            >
              
              <Text style={styles.seasonTitle}>{season.title}</Text>
              <Text style={styles.seasonDescription}>{season.description}</Text>
              
              {/* Enhanced Progress */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>
                    {completedEpisodes} of {totalEpisodes} episodes completed
                  </Text>
                  <Text style={[styles.progressPercentage, { color: getSeasonGradient()[0] }]}>
                    {Math.round(progressPercentage)}%
                  </Text>
                </View>
                
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${progressPercentage}%`,
                        backgroundColor: getSeasonGradient()[0]
                      }
                    ]}
                  />
                </View>
              </View>

              {/* Setting Section */}
              <View style={styles.settingSection}>
              <Globe size={20} color={getSeasonGradient()[0]} />
                <View style={styles.settingHeader}>
                  <Text style={styles.settingLabel}>Setting</Text>
                </View>
                <Text style={styles.settingValue}>{season.setting}</Text>
              </View>

              {/* Season Stats */}
              <View style={styles.seasonStats}>
                <View style={styles.seasonStat}>
                  <Clock size={20} color={getSeasonGradient()[0]} />
                  <Text style={styles.seasonStatLabel}>Duration</Text>
                  <Text style={styles.seasonStatValue}>
                    {season.episodes.reduce((sum, ep) => sum + ep.duration, 0)}m
                  </Text>
                </View>
                
                <View style={styles.seasonStat}>
                  <Star size={20} color={getSeasonGradient()[0]} />
                  <Text style={styles.seasonStatLabel}>Goals</Text>
                  <Text style={styles.seasonStatValue}>
                    {season.learningOutcomes.filter(o => o.achieved).length}/{season.learningOutcomes.length}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Enhanced Learning Outcomes */}
        <View style={styles.outcomesSection}>
          <Text style={[styles.sectionTitle, {
            textShadowColor: 'rgba(0,0,0,0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }]}>
            Learning Goals
          </Text>
          
          <View style={styles.outcomesGrid}>
            {season.learningOutcomes.map((outcome, index) => (
              <View
                key={outcome.id}
                style={[
                  styles.outcomeCard,
                  {
                    shadowColor: outcome.achieved ? '#4CAF50' : '#E0E0E0',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 6,
                  }
                ]}
              >
                <View style={[
                  styles.outcomeStatus,
                  { backgroundColor: outcome.achieved ? '#4CAF50' : '#E0E0E0' }
                ]}>
                  {outcome.achieved && (
                    <CheckCircle size={16} color="#FFFFFF" strokeWidth={2.5} />
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
          </View>
        </View>

        {/* Enhanced Episodes List */}
        <View style={styles.episodesSection}>
          <Text style={[styles.sectionTitle, {
            textShadowColor: 'rgba(0,0,0,0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }]}>
            Episodes
          </Text>
          
          <Text style={styles.sectionSubtitle}>
            Complete episodes in order to unlock the next adventure
          </Text>

          <View style={styles.episodesList}>
            {season.episodes.map((episode, index) => 
              renderEpisodeCard(episode, index)
            )}
          </View>
        </View>
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
  loadingGradient: {
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
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 16,
    position: 'relative',
    minHeight: 100,
  },
  headerHighlight: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 0,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'Cubano',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'OpenSans',
  },
  headerStats: {
    alignItems: 'center',
  },
  headerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  headerStatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Cubano',
  },
  headerDecorative: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  headerDecorativeElement: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  },
  seasonContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  seasonCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  seasonGradient: {
    padding: 24,
    position: 'relative',
  },
  seasonHighlight: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
  },
  seasonTitle: {
    fontSize: 24,
    color: Colors.light.text,
    fontFamily: 'Cubano',
    marginBottom: 8,
    textAlign: 'center',
  },
  seasonDescription: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'OpenSans',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
    paddingHorizontal: 8, // Add padding to prevent overflow
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
  },
  progressPercentage: {
    fontSize: 16,
    fontFamily: 'Cubano',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  seasonStats: {
    flexDirection: 'column',
    gap: 16,
  },
  seasonStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  seasonStatLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'OpenSans',
    opacity: 0.7,
  },
  seasonStatValue: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
  },
  outcomesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    color: Colors.light.text,
    fontFamily: 'Cubano',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'OpenSans',
    opacity: 0.7,
    marginBottom: 16,
  },
  outcomesGrid: {
    gap: 12,
  },
  outcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  outcomeStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outcomeText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'OpenSans',
    flex: 1,
    lineHeight: 20,
  },
  outcomeCompleted: {
    opacity: 0.7,
    textDecorationLine: 'line-through',
  },
  episodesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  episodesList: {
    gap: 16,
  },
  episodeCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  episodeGradient: {
    padding: 20,
    position: 'relative',
  },
  episodeHighlight: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  episodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  episodeNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  episodeNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Cubano',
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Cubano',
    marginBottom: 4,
  },
  episodeDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'OpenSans',
    lineHeight: 20,
  },
  episodeStatus: {
    marginLeft: 16,
  },
  episodeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  episodeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  episodeStatText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
  },
  episodeParticles: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  episodeParticle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  settingSection: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    alignItems: 'center',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  settingLabel: {
    fontSize: 20,
    color: Colors.light.text,
    fontFamily: 'Cubano',
    opacity: 0.7,
  },
  settingValue: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
});