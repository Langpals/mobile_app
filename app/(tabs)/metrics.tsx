// app/(tabs)/metrics.tsx - Updated with achievements and clickable metrics
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { BookOpen, Target, TrendingUp, Clock, Trophy, X, Flame } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { mockProgressStats, mockChildProfile } from '@/data/mockData';

export default function MetricsScreen() {
  const [showWordsModal, setShowWordsModal] = useState(false);
  const [showTopicsModal, setShowTopicsModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  
  const wordsLearnt = mockProgressStats.proficiency.vocabularyMastery.mastered;
  const topicsLearnt = 2; // Based on completed topics
  
  // Simple topic list based on episodes completed
  const completedTopics = [
    'Greetings & Introductions',
    'Numbers & Counting'
  ];

  // Simple word bank based on completed episodes
  const learnedWords = [
    'Hola', 'Buenos días', 'Adiós', 'Gracias', 'Por favor',
    'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco',
    'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja'
  ];

  // Mock achievements data
  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first episode',
      points: 50,
      unlocked: true,
      color: Colors.light.primary,
    },
    {
      id: '2',
      title: 'Word Explorer',
      description: 'Learn 10 new words',
      points: 25,
      unlocked: true,
      color: Colors.light.success,
    },
    {
      id: '3',
      title: 'Streak Master',
      description: 'Maintain a 3-day learning streak',
      points: 75,
      unlocked: true,
      color: Colors.light.warning,
    },
    {
      id: '4',
      title: 'Perfect Score',
      description: 'Complete an episode with 100% accuracy',
      points: 100,
      unlocked: false,
      color: Colors.light.secondary,
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  const renderWordsModal = () => (
    <Modal visible={showWordsModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Word Bank</Text>
            <TouchableOpacity onPress={() => setShowWordsModal(false)}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.wordsGrid}>
              {learnedWords.map((word, index) => (
                <View key={index} style={styles.wordChip}>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderTopicsModal = () => (
    <Modal visible={showTopicsModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Completed Topics</Text>
            <TouchableOpacity onPress={() => setShowTopicsModal(false)}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.topicsList}>
              {completedTopics.map((topic, index) => (
                <View key={index} style={styles.topicItem}>
                  <View style={styles.topicIcon}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderAchievementsSection = () => (
    <View style={styles.achievementsSection}>
      <View style={styles.achievementsHeader}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowAchievements(!showAchievements)}
        >
          <Text style={styles.toggleButtonText}>
            {showAchievements ? 'Hide' : 'Show All'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.achievementsSummary}>
        <View style={styles.achievementStat}>
          <Trophy size={24} color={Colors.light.accent} />
          <Text style={styles.achievementNumber}>{unlockedAchievements.length}</Text>
          <Text style={styles.achievementLabel}>Unlocked</Text>
        </View>
        <View style={styles.achievementStat}>
          <Target size={24} color={Colors.light.primary} />
          <Text style={styles.achievementNumber}>{totalPoints}</Text>
          <Text style={styles.achievementLabel}>Points</Text>
        </View>
      </View>

      {showAchievements && (
        <View style={styles.achievementsList}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={[
              styles.achievementCard,
              { opacity: achievement.unlocked ? 1 : 0.6 }
            ]}>
              <LinearGradient
                colors={achievement.unlocked ? 
                  [achievement.color + '20', Colors.light.background] : 
                  [Colors.light.cardBackground, Colors.light.background]
                }
                style={styles.achievementGradient}
              >
                <View style={styles.achievementContent}>
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.unlocked ? achievement.color + '20' : Colors.light.border }
                  ]}>
                    <Trophy size={20} color={achievement.unlocked ? achievement.color : Colors.light.tabIconDefault} />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={[
                      styles.achievementTitle,
                      { color: achievement.unlocked ? Colors.light.text : Colors.light.tabIconDefault }
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      { color: achievement.unlocked ? Colors.light.text : Colors.light.border }
                    ]}>
                      {achievement.description}
                    </Text>
                  </View>
                  <View style={styles.achievementPoints}>
                    <Text style={[
                      styles.pointsText,
                      { color: achievement.unlocked ? achievement.color : Colors.light.tabIconDefault }
                    ]}>
                      {achievement.points}
                    </Text>
                    <Text style={styles.pointsLabel}>pts</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{mockChildProfile.name}'s Progress</Text>
          <Text style={styles.headerSubtitle}>Track your Spanish learning journey</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.statValue}>{mockChildProfile.wordsLearned}</Text>
            <Text style={styles.statLabel}>Words Learned</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Tap to view all words</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.statValue}>{mockChildProfile.topicsMastered}</Text>
            <Text style={styles.statLabel}>Topics Mastered</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Tap to view topics</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.statValue}>{mockChildProfile.learningStreak}</Text>
            <Text style={styles.statLabel}>Learning Streak</Text>
            <Text style={styles.streakText}>{'4 more days to level up!'}</Text>
          </View>
        </View>

        {/* Learning Time */}
        <View style={styles.timeCard}>
          <Text style={styles.timeValue}>{mockChildProfile.totalLearningTime}</Text>
          <Text style={styles.timeUnit}>minutes</Text>
          <Text style={styles.timeDescription}>{'That\'s 1 hour and 30 minutes of Spanish practice!'}</Text>
        </View>

        {/* Achievements Section */}
        {renderAchievementsSection()}

        {/* Modals */}
        {renderWordsModal()}
        {renderTopicsModal()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans-Bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    flexShrink: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 0,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans-Bold',
  },
  viewAllButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontFamily: 'OpenSans-Bold',
  },
  streakText: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans-Regular',
  },
  timeCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  timeValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  timeUnit: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'LilitaOne',
  },
  timeDescription: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans-Bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'OpenSans',
    marginBottom: 16,
  },
  topicsList: {
    gap: 12,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  topicIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: Colors.light.background,
    fontWeight: '700',
  },
  topicText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'OpenSans',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'OpenSans-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  modalScroll: {
    padding: 20,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'OpenSans-Bold',
  },
  achievementsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  achievementStat: {
    alignItems: 'center',
    gap: 8,
  },
  achievementNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  achievementLabel: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: 'OpenSans',
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementGradient: {
    padding: 16,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'LilitaOne',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    color: Colors.light.text,
  },
  achievementPoints: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  pointsLabel: {
    fontSize: 10,
    color: Colors.light.text,
    fontFamily: 'OpenSans',
  },
});