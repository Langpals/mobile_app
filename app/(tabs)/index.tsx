// app/(tabs)/index.tsx - Complete Layered Main Learning Page
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Play, ChevronDown, ChevronRight, BookOpen, Target, Star, 
  Clock, Users, Globe, Trophy, Heart, Sparkles, MapPin, Calendar,
  Award, Zap, Mic, Brain, TrendingUp, CheckCircle, BarChart3
} from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockSeasons, mockProgressStats, mockChildProfile } from '@/data/mockData';
import TeddyMascot from '@/components/ui/TeddyMascot';
import ProgressSummary from '@/components/ui/ProgressSummary';
import StepCard from '@/components/ui/StepCard';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import { router } from 'expo-router';

interface CollapsibleSectionProps {
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  preview?: React.ReactNode;
  badge?: string | number;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon: IconComponent, 
  color, 
  children, 
  defaultExpanded = false,
  preview,
  badge
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [animation] = useState(new Animated.Value(defaultExpanded ? 1 : 0));

  const toggleExpansion = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.timing(animation, {
      toValue,
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggleExpansion}>
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.sectionIcon, { backgroundColor: color + '20' }]}>
            <IconComponent size={18} color={color} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {badge && (
            <View style={[styles.badge, { backgroundColor: color + '20' }]}>
              <Text style={[styles.badgeText, { color: color }]}>{badge}</Text>
            </View>
          )}
        </View>
        <View style={styles.sectionHeaderRight}>
          {isExpanded ? (
            <ChevronDown size={20} color={Colors.light.text} />
          ) : (
            <ChevronRight size={20} color={Colors.light.text} />
          )}
        </View>
      </TouchableOpacity>
      
      {!isExpanded && preview && (
        <View style={styles.previewContainer}>
          {preview}
        </View>
      )}
      
      {isExpanded && (
        <Animated.View
          style={[
            styles.sectionContent,
            {
              opacity: animation,
              maxHeight: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 2000],
              }),
            },
          ]}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
};

export default function HomeScreen() {
  const [currentSeason] = useState(mockSeasons[0]);
  const [completedEpisodes] = useState(mockProgressStats.completedEpisodes);
  const [fadeAnim] = useState(new Animated.Value(0));

  const currentEpisode = currentSeason.episodes[completedEpisodes] || currentSeason.episodes[0];
  const progress = (completedEpisodes / currentSeason.episodes.length) * 100;
  const wordsLearnt = mockProgressStats.proficiency.vocabularyMastery.mastered;
  const topicsLearnt = 2;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStartEpisode = () => {
    router.push(`/episode/${currentEpisode.id}`);
  };

  const handleStartStep = (stepId: string) => {
    router.push(`/step/${stepId}`);
  };

  const handleViewSeason = () => {
    router.push(`/season/${currentSeason.number}`);
  };

  const handleViewAchievements = () => {
    router.push('/achievements');
  };

  const getProgressMessage = () => {
    if (progress < 25) return "Just getting started! 🌱";
    if (progress < 50) return "Making great progress! 🚀";
    if (progress < 75) return "You're doing amazing! ⭐";
    return "Almost finished! 🎉";
  };

  // LAYER 0: Always visible - Core info
  const renderQuickOverview = () => (
    <View style={styles.quickOverview}>
      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNumber}>{wordsLearnt}</Text>
          <Text style={styles.quickStatLabel}>Words</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNumber}>{topicsLearnt}</Text>
          <Text style={styles.quickStatLabel}>Topics</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNumber}>{mockProgressStats.currentStreak}</Text>
          <Text style={styles.quickStatLabel}>Days</Text>
        </View>
      </View>
    </View>
  );

  // LAYER 1: Current Episode Details (Full functionality)
  const renderCurrentEpisode = () => (
    <View style={styles.currentEpisodeContainer}>
      <View style={styles.episodeHeader}>
        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle}>{currentEpisode.title}</Text>
          <Text style={styles.episodeSubtitle}>Episode {currentEpisode.number}</Text>
        </View>
        <DifficultyBadge level={currentEpisode.difficulty} />
      </View>
      
      <Text style={styles.episodeDescription}>
        {currentEpisode.description}
      </Text>
      
      <View style={styles.episodeMeta}>
        <View style={styles.metaItem}>
          <Clock size={14} color={Colors.light.text} />
          <Text style={styles.metaText}>{currentEpisode.duration} min</Text>
        </View>
        <View style={styles.metaItem}>
          <MapPin size={14} color={Colors.light.text} />
          <Text style={styles.metaText}>{currentEpisode.setting}</Text>
        </View>
        <View style={styles.metaItem}>
          <BookOpen size={14} color={Colors.light.text} />
          <Text style={styles.metaText}>{currentEpisode.vocabularyFocus.length} words</Text>
        </View>
      </View>
      
      <View style={styles.vocabularyPreview}>
        <Text style={styles.vocabularyTitle}>Today's Words:</Text>
        <View style={styles.vocabularyList}>
          {currentEpisode.vocabularyFocus.slice(0, 4).map((word, index) => (
            <View key={index} style={styles.wordChip}>
              <Text style={styles.wordText}>{word}</Text>
            </View>
          ))}
          {currentEpisode.vocabularyFocus.length > 4 && (
            <Text style={styles.moreWords}>+{currentEpisode.vocabularyFocus.length - 4} more</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity style={styles.startButton} onPress={handleStartEpisode}>
        <Play size={18} color="#FFFFFF" />
        <Text style={styles.startButtonText}>Start Learning</Text>
      </TouchableOpacity>
    </View>
  );

  // LAYER 2: Season Progress (Complete functionality)
  const renderSeasonProgress = () => (
    <View style={styles.seasonProgressContainer}>
      <View style={styles.seasonHeader}>
        <View>
          <Text style={styles.seasonTitle}>{currentSeason.title}</Text>
          <Text style={styles.seasonTheme}>{currentSeason.theme}</Text>
          <Text style={styles.seasonDescription}>{currentSeason.description}</Text>
        </View>
        <TouchableOpacity onPress={handleViewSeason} style={styles.viewSeasonButton}>
          <Text style={styles.viewSeasonText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedEpisodes} of {currentSeason.episodes.length} episodes completed ({Math.round(progress)}%)
        </Text>
      </View>

      <View style={styles.learningOutcomes}>
        <Text style={styles.outcomesTitle}>Learning Outcomes:</Text>
        {currentSeason.learningOutcomes.slice(0, 3).map((outcome, index) => (
          <View key={outcome.id} style={styles.outcomeItem}>
            <CheckCircle 
              size={16} 
              color={outcome.achieved ? Colors.light.success : Colors.light.border} 
            />
            <Text style={[
              styles.outcomeText,
              outcome.achieved && styles.outcomeAchieved
            ]}>
              {outcome.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  // LAYER 3: Episode Steps (Complete step functionality)
  const renderEpisodeSteps = () => (
    <View style={styles.stepsContainer}>
      <View style={styles.stepsHeader}>
        <Text style={styles.stepsTitle}>Episode Steps</Text>
        <Text style={styles.stepsSubtitle}>
          {currentEpisode.steps.filter(s => s.completed).length}/{currentEpisode.steps.length} completed
        </Text>
      </View>
      
      {currentEpisode.steps.slice(0, 3).map((step, index) => (
        <StepCard
          key={step.id}
          step={step}
          stepNumber={index + 1}
          onPress={() => handleStartStep(step.id)}
          showPreview={true}
          isNext={index === completedEpisodes}
        />
      ))}
      
      {currentEpisode.steps.length > 3 && (
        <TouchableOpacity 
          style={styles.viewAllStepsButton}
          onPress={handleStartEpisode}
        >
          <Text style={styles.viewAllStepsText}>
            View All {currentEpisode.steps.length} Steps
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // LAYER 4: Achievements Preview
  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      <View style={styles.achievementsHeader}>
        <View style={styles.achievementsStats}>
          <View style={styles.achievementStat}>
            <Trophy size={16} color={Colors.light.warning} />
            <Text style={styles.achievementNumber}>3</Text>
            <Text style={styles.achievementLabel}>Unlocked</Text>
          </View>
          <View style={styles.achievementStat}>
            <Star size={16} color={Colors.light.primary} />
            <Text style={styles.achievementNumber}>150</Text>
            <Text style={styles.achievementLabel}>Points</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleViewAchievements} style={styles.viewAchievementsButton}>
          <Text style={styles.viewAchievementsText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.recentAchievements}>
        <View style={styles.achievementItem}>
          <View style={styles.achievementIcon}>
            <BookOpen size={16} color={Colors.light.primary} />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>First Steps</Text>
            <Text style={styles.achievementDesc}>Complete your first episode</Text>
          </View>
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementPoints}>50pts</Text>
          </View>
        </View>
        
        <View style={styles.achievementItem}>
          <View style={styles.achievementIcon}>
            <Zap size={16} color={Colors.light.warning} />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Streak Master</Text>
            <Text style={styles.achievementDesc}>3 day learning streak!</Text>
          </View>
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementPoints}>25pts</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // LAYER 5: Advanced Metrics Preview
  const renderAdvancedMetrics = () => (
    <View style={styles.metricsContainer}>
      <ProgressSummary 
        stats={mockProgressStats}
        onViewMore={() => router.push('/metrics')}
      />
      
      <View style={styles.detailedMetrics}>
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Mic size={16} color={Colors.light.secondary} />
            <Text style={styles.metricValue}>85%</Text>
            <Text style={styles.metricLabel}>Pronunciation</Text>
          </View>
          <View style={styles.metricCard}>
            <Brain size={16} color={Colors.light.success} />
            <Text style={styles.metricValue}>88%</Text>
            <Text style={styles.metricLabel}>Retention</Text>
          </View>
          <View style={styles.metricCard}>
            <TrendingUp size={16} color={Colors.light.warning} />
            <Text style={styles.metricValue}>3.2s</Text>
            <Text style={styles.metricLabel}>Response Time</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // LAYER 6: Quick Actions (Complete functionality)
  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/season/1')}>
        <Globe size={20} color={Colors.light.secondary} />
        <Text style={styles.actionText}>Explore Seasons</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/metrics')}>
        <BarChart3 size={20} color={Colors.light.accent} />
        <Text style={styles.actionText}>View Progress</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/achievements')}>
        <Award size={20} color={Colors.light.warning} />
        <Text style={styles.actionText}>Achievements</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/account')}>
        <Heart size={20} color={Colors.light.primary} />
        <Text style={styles.actionText}>Customize Teddy</Text>
      </TouchableOpacity>
    </View>
  );

  // LAYER 7: Recent Activity (Complete functionality)
  const renderRecentActivity = () => (
    <View style={styles.recentActivityContainer}>
      <View style={styles.activityItem}>
        <Calendar size={16} color={Colors.light.primary} />
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>Completed "Welcome to Magic Island"</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <View style={styles.activityBadge}>
          <Text style={styles.activityBadgeText}>+50 pts</Text>
        </View>
      </View>
      
      <View style={styles.activityItem}>
        <Star size={16} color={Colors.light.warning} />
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>Learned 5 new words</Text>
          <Text style={styles.activityTime}>Yesterday</Text>
        </View>
        <View style={styles.activityBadge}>
          <Text style={styles.activityBadgeText}>Words++</Text>
        </View>
      </View>
      
      <View style={styles.activityItem}>
        <Trophy size={16} color={Colors.light.success} />
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>Achievement: 3-day streak!</Text>
          <Text style={styles.activityTime}>Today</Text>
        </View>
        <View style={styles.activityBadge}>
          <Text style={styles.activityBadgeText}>+25 pts</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* LAYER 0: Header + Quick Overview (Always Visible) */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.headerTitle}>{mockChildProfile.name}!</Text>
          <TeddyMascot mood="excited" size="large" message={getProgressMessage()} />
          {renderQuickOverview()}
        </Animated.View>

        {/* LAYER 1: Current Episode (Expanded by Default) */}
        <CollapsibleSection
          title="Current Episode"
          icon={Play}
          color={Colors.light.primary}
          defaultExpanded={true}
          badge="Ready"
          preview={
            <View style={styles.previewRow}>
              <Text style={styles.previewText}>{currentEpisode.title}</Text>
              <Text style={styles.previewMeta}>{currentEpisode.duration} min</Text>
            </View>
          }
        >
          {renderCurrentEpisode()}
        </CollapsibleSection>

        {/* LAYER 2: Season Progress (Collapsed by Default) */}
        <CollapsibleSection
          title="Season Progress"
          icon={Globe}
          color={Colors.light.secondary}
          badge={`${Math.round(progress)}%`}
          preview={
            <View style={styles.previewRow}>
              <Text style={styles.previewText}>{currentSeason.title}</Text>
              <Text style={styles.previewMeta}>{completedEpisodes}/{currentSeason.episodes.length} episodes</Text>
            </View>
          }
        >
          {renderSeasonProgress()}
        </CollapsibleSection>

        {/* LAYER 3: Episode Steps (Collapsed) */}
        <CollapsibleSection
          title="Episode Steps"
          icon={Target}
          color={Colors.light.success}
          badge={currentEpisode.steps.length}
          preview={
            <View style={styles.previewRow}>
              <Text style={styles.previewText}>Learning steps for this episode</Text>
              <Text style={styles.previewMeta}>{currentEpisode.steps.filter(s => s.completed).length}/{currentEpisode.steps.length} done</Text>
            </View>
          }
        >
          {renderEpisodeSteps()}
        </CollapsibleSection>

        {/* LAYER 4: Achievements (Collapsed) */}
        <CollapsibleSection
          title="Achievements"
          icon={Award}
          color={Colors.light.warning}
          badge="3 unlocked"
          preview={
            <View style={styles.previewRow}>
              <Text style={styles.previewText}>Badges and progress rewards</Text>
              <Text style={styles.previewMeta}>150 points earned</Text>
            </View>
          }
        >
          {renderAchievements()}
        </CollapsibleSection>

        {/* LAYER 5: Advanced Metrics (Collapsed) */}
        <CollapsibleSection
          title="Learning Insights"
          icon={Brain}
          color={Colors.light.accent}
          preview={
            <View style={styles.previewRow}>
              <Text style={styles.previewText}>Pronunciation, retention, response time</Text>
              <Text style={styles.previewMeta}>Great progress!</Text>
            </View>
          }
        >
          {renderAdvancedMetrics()}
        </CollapsibleSection>

        {/* LAYER 6: Quick Actions (Collapsed) */}
        <CollapsibleSection
          title="Quick Actions"
          icon={Sparkles}
          color={Colors.light.primary}
          badge="4"
          preview={
            <View style={styles.previewRow}>
              <Text style={styles.previewText}>Explore, Progress, Achievements, Customize</Text>
              <Text style={styles.previewMeta}>Tap to expand</Text>
            </View>
          }
        >
          {renderQuickActions()}
        </CollapsibleSection>

        {/* LAYER 7: Recent Activity (Collapsed) */}
        <CollapsibleSection
          title="Recent Activity"
          icon={Clock}
          color={Colors.light.success}
          badge="New"
          preview={
            <View style={styles.previewRow}>
              <Text style={styles.previewText}>Latest achievements and progress</Text>
              <Text style={styles.previewMeta}>3 recent items</Text>
            </View>
          }
        >
          {renderRecentActivity()}
        </CollapsibleSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 20,
  },
  quickOverview: {
    width: '100%',
    marginTop: 16,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingVertical: 16,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    fontFamily: 'LilitaOne',
  },
  quickStatLabel: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  collapsibleContainer: {
    marginBottom: 16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.cardBackground,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionHeaderRight: {
    marginLeft: 8,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    flex: 1,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  previewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  previewMeta: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
  },
  currentEpisodeContainer: {
    gap: 16,
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  episodeSubtitle: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  episodeDescription: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  episodeMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
  },
  vocabularyPreview: {
    gap: 8,
  },
  vocabularyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Outfit-Medium',
  },
  vocabularyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  wordChip: {
    backgroundColor: Colors.light.primary + '20',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  wordText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  moreWords: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
  },
  startButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  seasonProgressContainer: {
    gap: 16,
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  seasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  seasonTheme: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  seasonDescription: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
    lineHeight: 16,
  },
  viewSeasonButton: {
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewSeasonText: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontFamily: 'Poppins-SemiBold',
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.secondary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  learningOutcomes: {
    gap: 8,
  },
  outcomesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Outfit-Medium',
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outcomeText: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  outcomeAchieved: {
    color: Colors.light.success,
  },
  stepsContainer: {
    gap: 12,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Outfit-Medium',
  },
  stepsSubtitle: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
  },
  viewAllStepsButton: {
    backgroundColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewAllStepsText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Poppins-SemiBold',
  },
  achievementsContainer: {
    gap: 16,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementsStats: {
    flexDirection: 'row',
    gap: 16,
  },
  achievementStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  achievementNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  achievementLabel: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  viewAchievementsButton: {
    backgroundColor: Colors.light.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewAchievementsText: {
    fontSize: 12,
    color: Colors.light.warning,
    fontFamily: 'Poppins-SemiBold',
  },
  recentAchievements: {
    gap: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
  },
  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Outfit-Medium',
  },
  achievementDesc: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  achievementBadge: {
    backgroundColor: Colors.light.warning + '20',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  achievementPoints: {
    fontSize: 10,
    color: Colors.light.warning,
    fontFamily: 'LilitaOne',
  },
  metricsContainer: {
    gap: 16,
  },
  detailedMetrics: {
    marginTop: 16,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  recentActivityContainer: {
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
  },
  activityTime: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
  },
  activityBadge: {
    backgroundColor: Colors.light.success + '20',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activityBadgeText: {
    fontSize: 10,
    color: Colors.light.success,
    fontFamily: 'LilitaOne',
  },
});