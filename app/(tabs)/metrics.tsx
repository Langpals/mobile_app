// app/(tabs)/metrics.tsx - Enhanced Metrics Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Target, BookOpen, Mic, Heart, Award, Calendar, Zap, Clock, Star } from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockMetricsData, mockChildProfile, mockProgressStats } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function MetricsScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const renderProficiencyMeter = (label: string, value: number, color: string, icon: any) => {
    const IconComponent = icon;
    return (
      <View style={styles.proficiencyItem}>
        <View style={styles.proficiencyHeader}>
          <View style={[styles.proficiencyIcon, { backgroundColor: color + '20' }]}>
            <IconComponent size={18} color={color} />
          </View>
          <View style={styles.proficiencyLabelContainer}>
            <Text style={styles.proficiencyLabel}>{label}</Text>
            <Text style={[styles.proficiencyValue, { color }]}>{value}%</Text>
          </View>
        </View>
        <View style={styles.proficiencyBarContainer}>
          <View 
            style={[
              styles.proficiencyBar,
              { width: `${value}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={styles.proficiencyDescription}>
          {value >= 90 ? 'Excellent!' : value >= 75 ? 'Great progress!' : value >= 60 ? 'Good work!' : 'Keep practicing!'}
        </Text>
      </View>
    );
  };

  const renderActivityBars = () => {
    const maxMinutes = Math.max(...mockMetricsData.weeklyActivity.map(day => day.minutes));
    
    return mockMetricsData.weeklyActivity.map((day, index) => {
      const barHeight = Math.max((day.minutes / maxMinutes) * 100, 4);
      const hasActivity = day.minutes > 0;
      
      return (
        <View key={index} style={styles.barContainer}>
          <Text style={styles.barValue}>{day.minutes > 0 ? day.minutes : ''}</Text>
          <View style={styles.barWrapper}>
            <View 
              style={[
                styles.bar, 
                { 
                  height: barHeight,
                  backgroundColor: hasActivity ? Colors.light.primary : Colors.light.border
                }
              ]} 
            />
          </View>
          <Text style={styles.barLabel}>{day.day}</Text>
        </View>
      );
    });
  };

  const renderVocabularyProgress = () => {
    const { vocabularyMastery } = mockProgressStats.proficiency;
    const total = vocabularyMastery.total;
    
    return (
      <View style={styles.vocabularyContainer}>
        <View style={styles.vocabularyCircle}>
          <View style={styles.vocabularyInner}>
            <Text style={styles.vocabularyNumber}>{vocabularyMastery.mastered}</Text>
            <Text style={styles.vocabularyLabel}>Words</Text>
            <Text style={styles.vocabularySubLabel}>Mastered</Text>
          </View>
        </View>
        
        <View style={styles.vocabularyBreakdown}>
          <View style={styles.vocabularyStage}>
            <View style={[styles.vocabularyDot, { backgroundColor: Colors.light.success }]} />
            <Text style={styles.vocabularyStageText}>
              {vocabularyMastery.mastered} Mastered
            </Text>
          </View>
          <View style={styles.vocabularyStage}>
            <View style={[styles.vocabularyDot, { backgroundColor: Colors.light.warning }]} />
            <Text style={styles.vocabularyStageText}>
              {vocabularyMastery.reviewing} Reviewing
            </Text>
          </View>
          <View style={styles.vocabularyStage}>
            <View style={[styles.vocabularyDot, { backgroundColor: Colors.light.secondary }]} />
            <Text style={styles.vocabularyStageText}>
              {vocabularyMastery.learning} Learning
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEnjoymentRating = () => {
    const avgRating = mockMetricsData.enjoymentRatings.reduce((a, b) => a + b, 0) / mockMetricsData.enjoymentRatings.length;
    
    return (
      <View style={styles.enjoymentContainer}>
        <View style={styles.enjoymentHeader}>
          <Heart size={20} color={Colors.light.error} />
          <Text style={styles.enjoymentTitle}>Fun Factor</Text>
        </View>
        
        <View style={styles.ratingDisplay}>
          <Text style={styles.ratingNumber}>{avgRating.toFixed(1)}</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={[
                styles.star, 
                { color: star <= avgRating ? Colors.light.warning : Colors.light.border }
              ]}>
                ⭐
              </Text>
            ))}
          </View>
        </View>
        
        <Text style={styles.enjoymentDescription}>
          {avgRating >= 4.5 ? 'Absolutely loves learning!' : 
           avgRating >= 4 ? 'Really enjoys the lessons!' :
           avgRating >= 3 ? 'Likes the activities!' : 'Working on engagement...'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.light.background, '#F0F8FF', Colors.light.background]}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Learning Metrics</Text>
            <Text style={styles.subtitle}>
              Track {mockChildProfile.name}'s amazing progress!
            </Text>
          </View>

          {/* Timeframe Selector */}
          <View style={styles.timeframeSelector}>
            {(['week', 'month', 'all'] as const).map((timeframe) => (
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
                  {timeframe === 'week' ? 'This Week' : timeframe === 'month' ? 'This Month' : 'All Time'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Learning Streak */}
          <View style={styles.streakCard}>
            <LinearGradient
              colors={[Colors.light.warning, Colors.light.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.streakGradient}
            >
              <View style={styles.streakContent}>
                <Zap size={32} color="#FFFFFF" />
                <View style={styles.streakText}>
                  <Text style={styles.streakNumber}>{mockProgressStats.currentStreak}</Text>
                  <Text style={styles.streakLabel}>Day Learning Streak!</Text>
                  <Text style={styles.streakMotivation}>¡Increíble! Keep it up!</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Weekly Activity */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Calendar size={20} color={Colors.light.primary} />
              <Text style={styles.cardTitle}>Weekly Activity</Text>
            </View>
            <Text style={styles.cardSubtitle}>Minutes spent learning each day</Text>
            
            <View style={styles.chartContainer}>
              {renderActivityBars()}
            </View>
            
            <View style={styles.activitySummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total this week</Text>
                <Text style={styles.summaryValue}>
                  {mockMetricsData.weeklyActivity.reduce((sum, day) => sum + day.minutes, 0)} mins
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Episodes completed</Text>
                <Text style={styles.summaryValue}>
                  {mockMetricsData.weeklyActivity.reduce((sum, day) => sum + day.episodes, 0)}
                </Text>
              </View>
            </View>
          </View>

          {/* Vocabulary Mastery */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <BookOpen size={20} color={Colors.light.secondary} />
              <Text style={styles.cardTitle}>Vocabulary Growth</Text>
            </View>
            <Text style={styles.cardSubtitle}>Words learned and mastered</Text>
            
            {renderVocabularyProgress()}
          </View>

          {/* Proficiency Scores */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingUp size={20} color={Colors.light.success} />
              <Text style={styles.cardTitle}>Skill Proficiency</Text>
            </View>
            <Text style={styles.cardSubtitle}>Current skill assessment scores</Text>
            
            <View style={styles.proficiencyContainer}>
              {renderProficiencyMeter('Vocabulary', mockMetricsData.proficiencyScores.vocabulary, Colors.light.primary, BookOpen)}
              {renderProficiencyMeter('Pronunciation', mockMetricsData.proficiencyScores.pronunciation, Colors.light.secondary, Mic)}
              {renderProficiencyMeter('Conversation', mockMetricsData.proficiencyScores.conversation, Colors.light.success, Target)}
              {renderProficiencyMeter('Cultural Awareness', mockMetricsData.proficiencyScores.cultural, Colors.light.accent, Award)}
            </View>
          </View>

          {/* Enjoyment Rating */}
          <View style={styles.card}>
            {renderEnjoymentRating()}
          </View>

          {/* Learning Insights */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Award size={20} color={Colors.light.warning} />
              <Text style={styles.cardTitle}>Learning Insights</Text>
            </View>
            
            <View style={styles.insightsList}>
              <View style={styles.insightItem}>
                <View style={[styles.insightIcon, { backgroundColor: Colors.light.success + '20' }]}>
                  <Text style={styles.insightEmoji}>🎯</Text>
                </View>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>Excellent Focus</Text>
                  <Text style={styles.insightDescription}>
                    {mockChildProfile.name} completes episodes with great concentration!
                  </Text>
                </View>
              </View>
              
              <View style={styles.insightItem}>
                <View style={[styles.insightIcon, { backgroundColor: Colors.light.primary + '20' }]}>
                  <Text style={styles.insightEmoji}>🗣️</Text>
                </View>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>Pronunciation Progress</Text>
                  <Text style={styles.insightDescription}>
                    Great improvement in Spanish pronunciation this week!
                  </Text>
                </View>
              </View>
              
              <View style={styles.insightItem}>
                <View style={[styles.insightIcon, { backgroundColor: Colors.light.secondary + '20' }]}>
                  <Text style={styles.insightEmoji}>📚</Text>
                </View>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>Vocabulary Star</Text>
                  <Text style={styles.insightDescription}>
                    Animal words are being mastered quickly - great job!
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Next Goals */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Target size={20} color={Colors.light.accent} />
              <Text style={styles.cardTitle}>Next Learning Goals</Text>
            </View>
            
            <View style={styles.goalsList}>
              <View style={styles.goalItem}>
                <View style={styles.goalProgress}>
                  <View style={[styles.goalProgressFill, { width: '75%' }]} />
                </View>
                <Text style={styles.goalText}>Master 10 more color words</Text>
                <Text style={styles.goalStatus}>7/10 completed</Text>
              </View>
              
              <View style={styles.goalItem}>
                <View style={styles.goalProgress}>
                  <View style={[styles.goalProgressFill, { width: '40%' }]} />
                </View>
                <Text style={styles.goalText}>Complete 5 episodes this week</Text>
                <Text style={styles.goalStatus}>2/5 completed</Text>
              </View>
              
              <View style={styles.goalItem}>
                <View style={styles.goalProgress}>
                  <View style={[styles.goalProgressFill, { width: '90%' }]} />
                </View>
                <Text style={styles.goalText}>Practice daily for 7 days</Text>
                <Text style={styles.goalStatus}>6/7 days</Text>
              </View>
            </View>
          </View>

          {/* Word Bank */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <BookOpen size={20} color={Colors.light.primary} />
              <Text style={styles.cardTitle}>Word Bank</Text>
            </View>
            <View style={styles.wordBankList}>
              {["hola", "adiós", "gracias", "perro", "gato", "rojo", "azul"].map((word, idx) => (
                <View key={idx} style={styles.wordChip}>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Topic Bank */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Award size={20} color={Colors.light.secondary} />
              <Text style={styles.cardTitle}>Topic Bank</Text>
            </View>
            <View style={styles.topicBankList}>
              {["Body", "Kitchen", "Colors", "Animals", "Greetings"].map((topic, idx) => (
                <View key={idx} style={styles.topicChip}>
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Downtime */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Clock size={20} color={Colors.light.warning} />
              <Text style={styles.cardTitle}>Total Downtime</Text>
            </View>
            <Text style={styles.downtimeText}>2 hours 15 minutes away from screen this week</Text>
          </View>

          {/* Language Badges */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Star size={20} color={Colors.light.success} />
              <Text style={styles.cardTitle}>Language Badges</Text>
            </View>
            <View style={styles.badgeList}>
              {["Starter", "Explorer", "Achiever"].map((badge, idx) => (
                <View key={idx} style={styles.badgeChip}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Parent Praise */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Heart size={20} color={Colors.light.error} />
              <Text style={styles.cardTitle}>Parent Praise</Text>
            </View>
            <TouchableOpacity style={styles.praiseButton} onPress={() => alert('Praise sent!')}>
              <Text style={styles.praiseButtonText}>Send Praise</Text>
            </TouchableOpacity>
          </View>

          {/* Report Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingUp size={20} color={Colors.light.accent} />
              <Text style={styles.cardTitle}>Report Card</Text>
            </View>
            <View style={styles.reportCardSummary}>
              <Text style={styles.reportCardScore}>Score: 87/100</Text>
              <Text style={styles.reportCardDesc}>Great progress! Keep up the good work.</Text>
              <Text style={styles.reportCardQuote}>
                "Loves learning new words and is very engaged in activities!"
              </Text>
              <Text style={styles.reportCardLevel}>Learning Level: Intermediate</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.select({
      android: StatusBar.currentHeight,
      ios: 0,
      web: 0,
    }),
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.select({
      ios: 60,
      android: 16,
      web: 60,
    }),
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  timeframeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  timeframeTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  streakCard: {
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  streakGradient: {
    borderRadius: 20,
    padding: 20,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: 16,
    flex: 1,
  },
  streakNumber: {
    fontFamily: 'LilitaOne',
    fontSize: 32,
    color: '#FFFFFF',
  },
  streakLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  streakMotivation: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginLeft: 8,
  },
  cardSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.text,
    height: 16,
    marginBottom: 4,
  },
  barWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: 16,
    borderRadius: 8,
    minHeight: 4,
  },
  barLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    marginTop: 8,
  },
  activitySummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  summaryValue: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.primary,
  },
  vocabularyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vocabularyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.light.primary + '30',
  },
  vocabularyInner: {
    alignItems: 'center',
  },
  vocabularyNumber: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.primary,
  },
  vocabularyLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
  },
  vocabularySubLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  vocabularyBreakdown: {
    flex: 1,
    marginLeft: 20,
  },
  vocabularyStage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vocabularyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  vocabularyStageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  proficiencyContainer: {
    marginTop: 8,
  },
  proficiencyItem: {
    marginBottom: 20,
  },
  proficiencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  proficiencyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  proficiencyLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proficiencyLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
  },
  proficiencyValue: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
  },
  proficiencyBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  proficiencyBar: {
    height: '100%',
    borderRadius: 4,
  },
  proficiencyDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  enjoymentContainer: {
    alignItems: 'center',
  },
  enjoymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  enjoymentTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginLeft: 8,
  },
  ratingDisplay: {
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingNumber: {
    fontFamily: 'LilitaOne',
    fontSize: 48,
    color: Colors.light.warning,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  enjoymentDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
  insightsList: {
    marginTop: 8,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightEmoji: {
    fontSize: 20,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 2,
  },
  insightDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  goalsList: {
    marginTop: 8,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalProgress: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.success,
    borderRadius: 3,
  },
  goalText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 2,
  },
  goalStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  wordBankList: {
    marginTop: 8,
  },
  wordChip: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 16,
    padding: 8,
    marginRight: 8,
  },
  wordText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  topicBankList: {
    marginTop: 8,
  },
  topicChip: {
    backgroundColor: Colors.light.secondary + '10',
    borderRadius: 16,
    padding: 8,
    marginRight: 8,
  },
  topicText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  downtimeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
  badgeList: {
    marginTop: 8,
  },
  badgeChip: {
    backgroundColor: Colors.light.success + '10',
    borderRadius: 16,
    padding: 8,
    marginRight: 8,
  },
  badgeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  praiseButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  praiseButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  reportCardSummary: {
    alignItems: 'center',
  },
  reportCardScore: {
    fontFamily: 'LilitaOne',
    fontSize: 48,
    color: Colors.light.warning,
    marginBottom: 8,
  },
  reportCardDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
  reportCardQuote: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  reportCardLevel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
});