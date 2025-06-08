// app/(tabs)/index.tsx - Simplified Main Learning Page
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Play, ChevronDown, ChevronUp, BookOpen, Target, Star, 
  Clock, Users, Globe, Trophy, Heart, Sparkles
} from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockSeasons, mockProgressStats } from '@/data/mockData';
import TeddyMascot from '@/components/ui/TeddyMascot';
import { router } from 'expo-router';

interface CollapsibleSectionProps {
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon: IconComponent, 
  color, 
  children, 
  defaultExpanded = false 
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

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggleExpansion}>
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.sectionIcon, { backgroundColor: color + '20' }]}>
            <IconComponent size={20} color={color} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Animated.View style={[styles.expandIcon, { transform: [{ rotate: rotateInterpolate }] }]}>
          <ChevronDown size={20} color={Colors.light.text} />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View
        style={[
          styles.sectionContent,
          {
            opacity: animation,
            maxHeight: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000],
            }),
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default function HomeScreen() {
  const [currentSeason] = useState(mockSeasons[0]);
  const [completedEpisodes] = useState(mockProgressStats.completedEpisodes);

  const currentEpisode = currentSeason.episodes[completedEpisodes] || currentSeason.episodes[0];
  const progress = (completedEpisodes / currentSeason.episodes.length) * 100;

  const handleStartEpisode = () => {
    router.push(`/episode/${currentEpisode.id}`);
  };

  const handleStartStep = (stepId: number) => {
    router.push(`/step/${stepId}`);
  };

  const getProgressMessage = () => {
    if (progress < 25) return "Just getting started! 🌱";
    if (progress < 50) return "Making great progress! 🚀";
    if (progress < 75) return "You're doing amazing! ⭐";
    return "Almost there! 🎉";
  };

  const renderCurrentProgress = () => (
    <View style={styles.progressCard}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.progressGradient}
      >
        <View style={styles.progressHeader}>
          <TeddyMascot mood="encouraging" size="small" />
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Continue Learning</Text>
            <Text style={styles.progressMessage}>{getProgressMessage()}</Text>
          </View>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        
        <Text style={styles.progressText}>
          Episode {completedEpisodes + 1} of {currentSeason.episodes.length}
        </Text>
        
        <TouchableOpacity style={styles.continueButton} onPress={handleStartEpisode}>
          <Play size={16} color="#FFFFFF" />
          <Text style={styles.continueButtonText}>Continue Episode</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderSeasonOverview = () => (
    <View style={styles.overviewContent}>
      <Text style={styles.overviewDescription}>{currentSeason.description}</Text>
      
      <View style={styles.seasonStats}>
        <View style={styles.statItem}>
          <BookOpen size={16} color={Colors.light.primary} />
          <Text style={styles.statLabel}>Episodes</Text>
          <Text style={styles.statValue}>{currentSeason.episodes.length}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Clock size={16} color={Colors.light.accent} />
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>15-20 min</Text>
        </View>
        
        <View style={styles.statItem}>
          <Target size={16} color={Colors.light.success} />
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{completedEpisodes}</Text>
        </View>
      </View>
    </View>
  );

  const renderLearningGoals = () => (
    <View style={styles.goalsContent}>
      <Text style={styles.goalsIntro}>In this season, your child will learn:</Text>
      
      <View style={styles.goalsList}>
        {currentSeason.learningOutcomes.slice(0, 4).map((outcome, index) => (
          <View key={outcome.id} style={styles.goalItem}>
            <View style={[styles.goalIcon, { backgroundColor: outcome.achieved ? Colors.light.success + '20' : Colors.light.border }]}>
              {outcome.achieved ? (
                <Star size={16} color={Colors.light.success} />
              ) : (
                <Target size={16} color={Colors.light.text} />
              )}
            </View>
            <Text style={[styles.goalText, outcome.achieved && styles.goalTextCompleted]}>
              {outcome.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.actionsContent}>
      <TouchableOpacity style={styles.actionButton} onPress={handleStartEpisode}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={styles.actionGradient}
        >
          <Play size={20} color="#FFFFFF" />
          <Text style={styles.actionText}>Start Next Episode</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.secondaryAction]}
        onPress={() => router.push('/progress')}
      >
        <Trophy size={20} color={Colors.light.primary} />
        <Text style={[styles.actionText, styles.secondaryActionText]}>View Progress</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.secondaryAction]}
        onPress={() => router.push('/metrics')}
      >
        <Sparkles size={20} color={Colors.light.primary} />
        <Text style={[styles.actionText, styles.secondaryActionText]}>See Skills</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecentSteps = () => (
    <View style={styles.stepsContent}>
      <Text style={styles.stepsIntro}>Recent learning activities:</Text>
      
      <View style={styles.stepsList}>
        {currentEpisode.steps.slice(0, 3).map((step, index) => (
          <TouchableOpacity 
            key={step.id} 
            style={styles.stepItem}
            onPress={() => handleStartStep(step.id)}
          >
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription} numberOfLines={1}>
                Learn about {step.title.toLowerCase()} with fun activities
              </Text>
            </View>
            <View style={styles.stepAction}>
              <Text style={styles.stepDuration}>{step.estimatedDuration} min</Text>
              <ChevronDown size={16} color={Colors.light.primary} style={{ transform: [{ rotate: '-90deg' }] }} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learning Journey</Text>
          <Text style={styles.headerSubtitle}>{currentSeason.title}</Text>
        </View>

        {/* Current Progress Card */}
        {renderCurrentProgress()}

        {/* Collapsible Sections */}
        <View style={styles.sectionsContainer}>
          <CollapsibleSection
            title="Season Overview"
            icon={Globe}
            color={Colors.light.primary}
            defaultExpanded={false}
          >
            {renderSeasonOverview()}
          </CollapsibleSection>

          <CollapsibleSection
            title="Learning Goals"
            icon={Target}
            color={Colors.light.success}
            defaultExpanded={false}
          >
            {renderLearningGoals()}
          </CollapsibleSection>

          <CollapsibleSection
            title="Quick Actions"
            icon={Sparkles}
            color={Colors.light.accent}
            defaultExpanded={true}
          >
            {renderQuickActions()}
          </CollapsibleSection>

          <CollapsibleSection
            title="Recent Activities"
            icon={BookOpen}
            color={Colors.light.warning}
            defaultExpanded={false}
          >
            {renderRecentSteps()}
          </CollapsibleSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  
  // Progress Card
  progressCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressGradient: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressInfo: {
    marginLeft: 12,
    flex: 1,
  },
  progressTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  progressMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },

  // Collapsible Sections
  sectionsContainer: {
    gap: 12,
  },
  collapsibleContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
  },
  expandIcon: {
    padding: 4,
  },
  sectionContent: {
    overflow: 'hidden',
  },

  // Overview Content
  overviewContent: {
    padding: 16,
    paddingTop: 0,
  },
  overviewDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  seasonStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
  },

  // Goals Content
  goalsContent: {
    padding: 16,
    paddingTop: 0,
  },
  goalsIntro: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 16,
  },
  goalsList: {
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  goalTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },

  // Actions Content
  actionsContent: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  secondaryAction: {
    backgroundColor: Colors.light.primary + '10',
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  actionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryActionText: {
    color: Colors.light.primary,
  },

  // Steps Content
  stepsContent: {
    padding: 16,
    paddingTop: 0,
  },
  stepsIntro: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 16,
  },
  stepsList: {
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary + '05',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 2,
  },
  stepDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  stepAction: {
    alignItems: 'center',
  },
  stepDuration: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.primary,
    marginBottom: 4,
  },
});