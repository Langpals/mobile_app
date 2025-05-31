// app/season/[id].tsx - Season Overview Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MapPin, Clock, BookOpen, Star, Trophy, Target, Play, Lock, CheckCircle } from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockSeasons } from '@/data/mockData';
import TeddyMascot from '@/components/ui/TeddyMascot';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import { Season, Episode, LearningOutcome } from '@/types';

const { width } = Dimensions.get('window');

export default function SeasonOverviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [season, setSeason] = useState<Season | null>(null);
  const [selectedTab, setSelectedTab] = useState<'episodes' | 'outcomes' | 'overview'>('overview');
  const [headerAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Find the season
    const foundSeason = mockSeasons.find(s => s.number === parseInt(id || '1'));
    if (foundSeason) {
      setSeason(foundSeason);
    }

    // Animate header entrance
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [id]);

  const handleEpisodePress = (episode: Episode) => {
    if (!episode.locked) {
      router.push({
        pathname: "/episode/[id]",
        params: { id: episode.id }
      });
    }
  };

  const getSeasonProgress = () => {
    if (!season) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = season.episodes.filter(ep => ep.completed).length;
    const total = season.episodes.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
  };

  const getTotalDuration = () => {
    if (!season) return 0;
    return season.episodes.reduce((total, ep) => total + ep.duration, 0);
  };

  const getCompletedOutcomes = () => {
    if (!season) return { completed: 0, total: 0 };
    
    const completed = season.learningOutcomes.filter(outcome => outcome.achieved).length;
    const total = season.learningOutcomes.length;
    
    return { completed, total };
  };

  const renderOverviewTab = () => {
    const progress = getSeasonProgress();
    const outcomes = getCompletedOutcomes();
    
    return (
      <View style={styles.tabContent}>
        {/* Season Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Play size={20} color={Colors.light.primary} />
              <Text style={styles.statTitle}>Episodes</Text>
            </View>
            <Text style={styles.statNumber}>{progress.completed}/{progress.total}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Clock size={20} color={Colors.light.secondary} />
              <Text style={styles.statTitle}>Duration</Text>
            </View>
            <Text style={styles.statNumber}>{getTotalDuration()}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Target size={20} color={Colors.light.success} />
              <Text style={styles.statTitle}>Goals</Text>
            </View>
            <Text style={styles.statNumber}>{outcomes.completed}/{outcomes.total}</Text>
            <Text style={styles.statLabel}>Achieved</Text>
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressOverview}>
          <Text style={styles.progressTitle}>Season Progress</Text>
          <View style={styles.progressBarLarge}>
            <View 
              style={[
                styles.progressFillLarge,
                { width: `${progress.percentage}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress.percentage === 100 ? 
              '¡Felicidades! Season completed!' :
              `${Math.round(progress.percentage)}% complete - Keep going!`
            }
          </Text>
        </View>

        {/* Bern's Message */}
        <View style={styles.mascotMessage}>
          <TeddyMascot 
            mood={progress.percentage > 50 ? 'excited' : 'encouraging'}
            message={
              progress.percentage === 100 ?
                `¡Increíble! You've mastered ${season?.title}! Ready for the next adventure?` :
                progress.percentage > 50 ?
                  `¡Excelente! You're doing amazing in ${season?.title}! Keep it up!` :
                  `Welcome to ${season?.title}! I'm excited to explore ${season?.setting} with you!`
            }
            size="medium"
          />
        </View>

        {/* Recent Episodes */}
        <View style={styles.recentEpisodes}>
          <Text style={styles.sectionTitle}>Continue Your Adventure</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.episodesScroll}>
            {season?.episodes.slice(0, 3).map((episode, index) => (
              <TouchableOpacity
                key={episode.id}
                style={[
                  styles.episodeCard,
                  episode.locked && styles.episodeCardLocked
                ]}
                onPress={() => handleEpisodePress(episode)}
                activeOpacity={episode.locked ? 1 : 0.7}
              >
                <View style={styles.episodeHeader}>
                  <Text style={styles.episodeNumber}>EP {episode.number}</Text>
                  {episode.completed ? (
                    <Star size={16} color={Colors.light.warning} />
                  ) : episode.locked ? (
                    <Lock size={16} color={Colors.light.text} opacity={0.5} />
                  ) : (
                    <Play size={16} color={Colors.light.primary} />
                  )}
                </View>
                <Text style={styles.episodeTitle}>{episode.title}</Text>
                <Text style={styles.episodeDuration}>{episode.duration} min</Text>
                <DifficultyBadge level={episode.difficulty} size="small" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderEpisodesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>All Episodes</Text>
      <Text style={styles.sectionDescription}>
        Follow the story through {season?.title}
      </Text>
      
      {season?.episodes.map((episode, index) => (
        <TouchableOpacity
          key={episode.id}
          style={[
            styles.episodeListItem,
            episode.locked && styles.episodeListItemLocked,
            episode.completed && styles.episodeListItemCompleted
          ]}
          onPress={() => handleEpisodePress(episode)}
          activeOpacity={episode.locked ? 1 : 0.7}
        >
          <View style={styles.episodeListLeft}>
            <View style={[
              styles.episodeListNumber,
              episode.completed && styles.episodeListNumberCompleted,
              episode.locked && styles.episodeListNumberLocked
            ]}>
              {episode.completed ? (
                <CheckCircle size={20} color="#FFFFFF" />
              ) : episode.locked ? (
                <Lock size={20} color={Colors.light.text} />
              ) : (
                <Text style={styles.episodeListNumberText}>{episode.number}</Text>
              )}
            </View>
            
            <View style={styles.episodeListInfo}>
              <Text style={[
                styles.episodeListTitle,
                episode.locked && styles.episodeListTitleLocked
              ]}>
                {episode.title}
              </Text>
              <Text style={[
                styles.episodeListDescription,
                episode.locked && styles.episodeListDescriptionLocked
              ]}>
                {episode.description}
              </Text>
              <View style={styles.episodeListMeta}>
                <Text style={styles.episodeListDuration}>{episode.duration} min</Text>
                <Text style={styles.episodeListSeparator}>•</Text>
                <Text style={styles.episodeListSteps}>{episode.steps.length} steps</Text>
                {episode.completionRate > 0 && episode.completionRate < 100 && (
                  <>
                    <Text style={styles.episodeListSeparator}>•</Text>
                    <Text style={styles.episodeListProgress}>{episode.completionRate}% done</Text>
                  </>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.episodeListRight}>
            <DifficultyBadge level={episode.difficulty} size="small" />
            {!episode.locked && (
              <View style={styles.episodeListAction}>
                {episode.completed ? (
                  <Star size={16} color={Colors.light.warning} />
                ) : (
                  <Play size={16} color={Colors.light.primary} />
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOutcomesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Learning Outcomes</Text>
      <Text style={styles.sectionDescription}>
        Track your progress towards mastering Spanish skills
      </Text>
      
      {/* Outcomes by Category */}
      {['vocabulary', 'conversation', 'grammar', 'cultural', 'pronunciation'].map(category => {
        const categoryOutcomes = season?.learningOutcomes.filter(outcome => outcome.category === category) || [];
        
        if (categoryOutcomes.length === 0) return null;
        
        const completed = categoryOutcomes.filter(outcome => outcome.achieved).length;
        const total = categoryOutcomes.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        
        return (
          <View key={category} style={styles.outcomeCategory}>
            <View style={styles.outcomeCategoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category) + '20' }]}>
                {React.createElement(getCategoryIcon(category), {
                  size: 20,
                  color: getCategoryColor(category)
                })}
              </View>
              <View style={styles.outcomeCategoryInfo}>
                <Text style={styles.outcomeCategoryTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <Text style={styles.outcomeCategoryProgress}>
                  {completed}/{total} completed
                </Text>
              </View>
              <Text style={[styles.outcomePercentage, { color: getCategoryColor(category) }]}>
                {Math.round(percentage)}%
              </Text>
            </View>
            
            <View style={styles.outcomeProgressBar}>
              <View 
                style={[
                  styles.outcomeProgressFill,
                  { 
                    width: `${percentage}%`,
                    backgroundColor: getCategoryColor(category)
                  }
                ]}
              />
            </View>
            
            <View style={styles.outcomesList}>
              {categoryOutcomes.map((outcome, index) => (
                <View key={outcome.id} style={styles.outcomeItem}>
                  <View style={[
                    styles.outcomeStatus,
                    { backgroundColor: outcome.achieved ? Colors.light.success : Colors.light.border }
                  ]}>
                    {outcome.achieved && <CheckCircle size={12} color="#FFFFFF" />}
                  </View>
                  <Text style={[
                    styles.outcomeText,
                    outcome.achieved && styles.outcomeTextCompleted
                  ]}>
                    {outcome.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      vocabulary: Colors.light.primary,
      conversation: Colors.light.secondary,
      grammar: Colors.light.success,
      cultural: Colors.light.accent,
      pronunciation: Colors.light.warning
    };
    return colors[category] || Colors.light.primary;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      vocabulary: BookOpen,
      conversation: Target,
      grammar: Trophy,
      cultural: Star,
      pronunciation: MapPin
    };
    return icons[category] || BookOpen;
  };

  if (!season) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <TeddyMascot mood="thinking" message="Loading season information..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.light.primary + '10', Colors.light.background, Colors.light.secondary + '05']}
        style={styles.gradientBackground}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: headerAnimation,
              transform: [{
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0]
                })
              }]
            }
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.seasonNumber}>SEASON {season.number}</Text>
            <Text style={styles.seasonTitle}>{season.title}</Text>
            <Text style={styles.seasonTheme}>{season.theme}</Text>
            
            <View style={styles.headerMeta}>
              <View style={styles.headerMetaItem}>
                <MapPin size={16} color={Colors.light.secondary} />
                <Text style={styles.headerMetaText}>{season.setting}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['overview', 'episodes', 'outcomes'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.tabActive
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === 'overview' && renderOverviewTab()}
          {selectedTab === 'episodes' && renderEpisodesTab()}
          {selectedTab === 'outcomes' && renderOutcomesTab()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: Colors.light.cardBackground,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    alignItems: 'center',
  },
  seasonNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  seasonTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  seasonTheme: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 12,
  },
  headerMeta: {
    alignItems: 'center',
  },
  headerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMetaText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.cardBackground,
    marginHorizontal: 16,
    marginTop: -10,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.light.primary,
  },
  tabText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContent: {
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    marginLeft: 4,
  },
  statNumber: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.7,
  },
  progressOverview: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBarLarge: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 6,
  },
  progressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
  mascotMessage: {
    alignItems: 'center',
    marginBottom: 24,
  },
  recentEpisodes: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 16,
  },
  episodesScroll: {
    paddingHorizontal: 8,
  },
  episodeCard: {
    width: 160,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  episodeCardLocked: {
    opacity: 0.6,
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  episodeNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.primary,
  },
  episodeTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  episodeDuration: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  episodeListItem: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  episodeListItemLocked: {
    opacity: 0.6,
  },
  episodeListItemCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.success,
  },
  episodeListLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeListNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  episodeListNumberCompleted: {
    backgroundColor: Colors.light.success,
  },
  episodeListNumberLocked: {
    backgroundColor: Colors.light.border,
  },
  episodeListNumberText: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: '#FFFFFF',
  },
  episodeListInfo: {
    flex: 1,
  },
  episodeListTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  episodeListTitleLocked: {
    opacity: 0.6,
  },
  episodeListDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 4,
  },
  episodeListDescriptionLocked: {
    opacity: 0.4,
  },
  episodeListMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeListDuration: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
  },
  episodeListSeparator: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.4,
    marginHorizontal: 4,
  },
  episodeListSteps: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
  },
  episodeListProgress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.primary,
  },
  episodeListRight: {
    alignItems: 'center',
  },
  episodeListAction: {
    marginTop: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outcomeCategory: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  outcomeCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  outcomeCategoryInfo: {
    flex: 1,
  },
  outcomeCategoryTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
  },
  outcomeCategoryProgress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  outcomePercentage: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
  },
  outcomeProgressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  outcomeProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  outcomesList: {
    gap: 8,
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  outcomeTextCompleted: {
    opacity: 0.8,
    textDecorationLine: 'line-through',
  },
});