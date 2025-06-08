// app/(tabs)/metrics.tsx - Simplified Metrics Page
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  BarChart3, TrendingUp, Clock, Star, Heart, Brain, 
  ChevronDown, Mic, CheckCircle, Target, BookOpen, Trophy,
  Calendar, Volume, Zap, Globe
} from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockProgressStats } from '@/data/mockData';
import TeddyMascot from '@/components/ui/TeddyMascot';

interface CollapsibleMetricsSectionProps {
  title: string;
  icon: any;
  color: string;
  summary: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const CollapsibleMetricsSection: React.FC<CollapsibleMetricsSectionProps> = ({ 
  title, 
  icon: IconComponent, 
  color, 
  summary,
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
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionSummary}>{summary}</Text>
          </View>
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

export default function MetricsScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Mock adaptive metrics based on timeframe
  const getAdaptiveMetrics = () => ({
    responseAccuracy: selectedTimeframe === 'week' ? 85 : selectedTimeframe === 'month' ? 82 : 78,
    averageResponseTime: selectedTimeframe === 'week' ? 4.2 : selectedTimeframe === 'month' ? 4.5 : 4.8,
    completionRate: selectedTimeframe === 'week' ? 92 : selectedTimeframe === 'month' ? 89 : 85,
    vocabularyRetention: selectedTimeframe === 'week' ? 82 : selectedTimeframe === 'month' ? 80 : 76,
    pronunciationAccuracy: selectedTimeframe === 'week' ? 78 : selectedTimeframe === 'month' ? 75 : 72,
    engagementLevel: selectedTimeframe === 'week' ? 88 : selectedTimeframe === 'month' ? 85 : 82,
    weeklyMinutes: selectedTimeframe === 'week' ? 85 : selectedTimeframe === 'month' ? 320 : 1200,
    weeklyWords: selectedTimeframe === 'week' ? 24 : selectedTimeframe === 'month' ? 95 : 380,
  });

  const metrics = getAdaptiveMetrics();

  const renderOverallProgress = () => (
    <View style={styles.progressCard}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.progressGradient}
      >
        <View style={styles.progressHeader}>
          <TeddyMascot mood="proud" size="small" />
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Amazing Progress!</Text>
            <Text style={styles.progressMessage}>Your child is doing great this {selectedTimeframe}</Text>
          </View>
        </View>
        
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{metrics.responseAccuracy}%</Text>
            <Text style={styles.quickStatLabel}>Accuracy</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{Math.round(metrics.weeklyMinutes / (selectedTimeframe === 'week' ? 1 : selectedTimeframe === 'month' ? 4 : 52))}min</Text>
            <Text style={styles.quickStatLabel}>Daily Avg</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{metrics.weeklyWords}</Text>
            <Text style={styles.quickStatLabel}>New Words</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderTimeframeSelector = () => (
    <View style={styles.timeframeSelector}>
      {['week', 'month', 'all'].map(timeframe => (
        <TouchableOpacity
          key={timeframe}
          style={[
            styles.timeframeButton,
            selectedTimeframe === timeframe && styles.timeframeButtonActive
          ]}
          onPress={() => setSelectedTimeframe(timeframe)}
        >
          <Text style={[
            styles.timeframeText,
            selectedTimeframe === timeframe && styles.timeframeTextActive
          ]}>
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPerformanceMetrics = () => (
    <View style={styles.metricsContent}>
      {renderTimeframeSelector()}
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <CheckCircle size={16} color={Colors.light.success} />
            <Text style={styles.metricLabel}>Response Accuracy</Text>
          </View>
          <Text style={styles.metricValue}>{metrics.responseAccuracy}%</Text>
          <View style={styles.metricTrend}>
            <TrendingUp size={12} color={Colors.light.success} />
            <Text style={styles.metricTrendText}>+5% improvement</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Clock size={16} color={Colors.light.primary} />
            <Text style={styles.metricLabel}>Response Time</Text>
          </View>
          <Text style={styles.metricValue}>{metrics.averageResponseTime}s</Text>
          <View style={styles.metricTrend}>
            <TrendingUp size={12} color={Colors.light.success} />
            <Text style={styles.metricTrendText}>0.5s faster</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <BookOpen size={16} color={Colors.light.accent} />
            <Text style={styles.metricLabel}>Vocabulary Retention</Text>
          </View>
          <Text style={styles.metricValue}>{metrics.vocabularyRetention}%</Text>
          <View style={styles.metricTrend}>
            <TrendingUp size={12} color={Colors.light.success} />
            <Text style={styles.metricTrendText}>+3% better</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Target size={16} color={Colors.light.warning} />
            <Text style={styles.metricLabel}>Completion Rate</Text>
          </View>
          <Text style={styles.metricValue}>{metrics.completionRate}%</Text>
          <View style={styles.metricTrend}>
            <TrendingUp size={12} color={Colors.light.success} />
            <Text style={styles.metricTrendText}>+2% higher</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderLearningInsights = () => (
    <View style={styles.insightsContent}>
      <View style={styles.insightCards}>
        <View style={styles.insightCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.insightGradient}
          >
            <Mic size={24} color="#FFFFFF" />
            <Text style={styles.insightTitle}>Speaking Star!</Text>
            <Text style={styles.insightValue}>{metrics.pronunciationAccuracy}%</Text>
            <Text style={styles.insightDescription}>
              Pronunciation accuracy improved by 15% this {selectedTimeframe}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.insightCard}>
          <LinearGradient
            colors={['#4ECDC4', '#6FDDD8']}
            style={styles.insightGradient}
          >
            <Heart size={24} color="#FFFFFF" />
            <Text style={styles.insightTitle}>Super Engaged!</Text>
            <Text style={styles.insightValue}>{metrics.engagementLevel}%</Text>
            <Text style={styles.insightDescription}>
              High enthusiasm and participation in lessons
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );

  const renderWeeklyGoals = () => (
    <View style={styles.goalsContent}>
      <View style={styles.goalsList}>
        <View style={styles.goalItem}>
          <View style={styles.goalIconContainer}>
            <Clock size={20} color={Colors.light.primary} />
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalValue}>{metrics.weeklyMinutes} min</Text>
            <Text style={styles.goalLabel}>Learning Time</Text>
            <View style={styles.goalProgress}>
              <View 
                style={[
                  styles.goalProgressFill,
                  { width: `${Math.min((metrics.weeklyMinutes / 100) * 100, 100)}%` }
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.goalItem}>
          <View style={styles.goalIconContainer}>
            <Star size={20} color={Colors.light.warning} />
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalValue}>{metrics.weeklyWords}</Text>
            <Text style={styles.goalLabel}>New Words Learned</Text>
            <View style={styles.goalProgress}>
              <View 
                style={[
                  styles.goalProgressFill,
                  { width: `${Math.min((metrics.weeklyWords / 50) * 100, 100)}%` }
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSkillBreakdown = () => (
    <View style={styles.skillsContent}>
      <View style={styles.skillsList}>
        <View style={styles.skillItem}>
          <View style={styles.skillInfo}>
            <Volume size={16} color={Colors.light.primary} />
            <Text style={styles.skillLabel}>Pronunciation</Text>
          </View>
          <View style={styles.skillProgressBar}>
            <View 
              style={[
                styles.skillProgressFill,
                { 
                  width: `${metrics.pronunciationAccuracy}%`,
                  backgroundColor: Colors.light.primary
                }
              ]}
            />
          </View>
          <Text style={styles.skillValue}>{metrics.pronunciationAccuracy}%</Text>
        </View>

        <View style={styles.skillItem}>
          <View style={styles.skillInfo}>
            <BookOpen size={16} color={Colors.light.success} />
            <Text style={styles.skillLabel}>Vocabulary</Text>
          </View>
          <View style={styles.skillProgressBar}>
            <View 
              style={[
                styles.skillProgressFill,
                { 
                  width: `${metrics.vocabularyRetention}%`,
                  backgroundColor: Colors.light.success
                }
              ]}
            />
          </View>
          <Text style={styles.skillValue}>{metrics.vocabularyRetention}%</Text>
        </View>

        <View style={styles.skillItem}>
          <View style={styles.skillInfo}>
            <Zap size={16} color={Colors.light.warning} />
            <Text style={styles.skillLabel}>Response Speed</Text>
          </View>
          <View style={styles.skillProgressBar}>
            <View 
              style={[
                styles.skillProgressFill,
                { 
                  width: `${100 - (metrics.averageResponseTime * 10)}%`,
                  backgroundColor: Colors.light.warning
                }
              ]}
            />
          </View>
          <Text style={styles.skillValue}>{metrics.averageResponseTime}s avg</Text>
        </View>

        <View style={styles.skillItem}>
          <View style={styles.skillInfo}>
            <Heart size={16} color={Colors.light.accent} />
            <Text style={styles.skillLabel}>Engagement</Text>
          </View>
          <View style={styles.skillProgressBar}>
            <View 
              style={[
                styles.skillProgressFill,
                { 
                  width: `${metrics.engagementLevel}%`,
                  backgroundColor: Colors.light.accent
                }
              ]}
            />
          </View>
          <Text style={styles.skillValue}>{metrics.engagementLevel}%</Text>
        </View>
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
          <Text style={styles.headerTitle}>Learning Metrics</Text>
          <Text style={styles.headerSubtitle}>Track your child's amazing progress</Text>
        </View>

        {/* Overall Progress Card */}
        {renderOverallProgress()}

        {/* Collapsible Metrics Sections */}
        <View style={styles.sectionsContainer}>
          <CollapsibleMetricsSection
            title="Performance Metrics"
            icon={BarChart3}
            color={Colors.light.primary}
            summary={`${metrics.responseAccuracy}% accuracy this ${selectedTimeframe}`}
            defaultExpanded={true}
          >
            {renderPerformanceMetrics()}
          </CollapsibleMetricsSection>

          <CollapsibleMetricsSection
            title="Learning Insights"
            icon={Brain}
            color={Colors.light.accent}
            summary="Pronunciation and engagement highlights"
            defaultExpanded={false}
          >
            {renderLearningInsights()}
          </CollapsibleMetricsSection>

          <CollapsibleMetricsSection
            title="Weekly Goals"
            icon={Trophy}
            color={Colors.light.success}
            summary={`${metrics.weeklyMinutes} minutes of learning time`}
            defaultExpanded={false}
          >
            {renderWeeklyGoals()}
          </CollapsibleMetricsSection>

          <CollapsibleMetricsSection
            title="Skill Breakdown"
            icon={Target}
            color={Colors.light.warning}
            summary="Detailed skill progress analysis"
            defaultExpanded={false}
          >
            {renderSkillBreakdown()}
          </CollapsibleMetricsSection>
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
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  quickStatLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
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
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 2,
  },
  sectionSummary: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  expandIcon: {
    padding: 4,
  },
  sectionContent: {
    overflow: 'hidden',
  },

  // Timeframe Selector
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.light.border + '30',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  timeframeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.light.text,
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },

  // Metrics Content
  metricsContent: {
    padding: 16,
    paddingTop: 0,
  },
  metricsGrid: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: Colors.light.primary + '05',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 8,
  },
  metricValue: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 4,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTrendText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.success,
    marginLeft: 4,
  },

  // Insights Content
  insightsContent: {
    padding: 16,
    paddingTop: 0,
  },
  insightCards: {
    gap: 12,
  },
  insightCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 16,
    alignItems: 'center',
  },
  insightTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  insightValue: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  insightDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },

  // Goals Content
  goalsContent: {
    padding: 16,
    paddingTop: 0,
  },
  goalsList: {
    gap: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalValue: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 2,
  },
  goalLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  goalProgress: {
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },

  // Skills Content
  skillsContent: {
    padding: 16,
    paddingTop: 0,
  },
  skillsList: {
    gap: 16,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  skillLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    marginLeft: 8,
  },
  skillProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  skillProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  skillValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.text,
    width: 50,
    textAlign: 'right',
  },
});