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
      color: '#FF6B6B',
    },
    {
      id: '2',
      title: 'Word Explorer',
      description: 'Learn 10 new words',
      points: 25,
      unlocked: true,
      color: '#4CAF50',
    },
    {
      id: '3',
      title: 'Streak Master',
      description: 'Maintain a 3-day learning streak',
      points: 75,
      unlocked: true,
      color: '#FF9800',
    },
    {
      id: '4',
      title: 'Perfect Score',
      description: 'Complete an episode with 100% accuracy',
      points: 100,
      unlocked: false,
      color: '#9C27B0',
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
              <X size={24} color="#2C3E50" />
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
              <X size={24} color="#2C3E50" />
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
          <Trophy size={24} color="#FFB74D" />
          <Text style={styles.achievementNumber}>{unlockedAchievements.length}</Text>
          <Text style={styles.achievementLabel}>Unlocked</Text>
        </View>
        <View style={styles.achievementStat}>
          <Target size={24} color="#FF6B6B" />
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
                  [achievement.color + '20', '#FFFFFF'] : 
                  ['#F5F5F5', '#FFFFFF']
                }
                style={styles.achievementGradient}
              >
                <View style={styles.achievementContent}>
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.unlocked ? achievement.color + '20' : '#E0E0E0' }
                  ]}>
                    <Trophy size={20} color={achievement.unlocked ? achievement.color : '#9E9E9E'} />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={[
                      styles.achievementTitle,
                      { color: achievement.unlocked ? '#2C3E50' : '#9E9E9E' }
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      { color: achievement.unlocked ? '#546E7A' : '#BDBDBD' }
                    ]}>
                      {achievement.description}
                    </Text>
                  </View>
                  <View style={styles.achievementPoints}>
                    <Text style={[
                      styles.pointsText,
                      { color: achievement.unlocked ? achievement.color : '#9E9E9E' }
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
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{mockChildProfile.name}'s Progress</Text>
          <Text style={styles.subtitle}>Track your Spanish learning journey</Text>
        </View>

        {/* Main Metrics Cards */}
        <View style={styles.metricsContainer}>
          <TouchableOpacity 
            style={[styles.metricCard, { backgroundColor: '#FFEBEE' }]}
            onPress={() => setShowWordsModal(true)}
          >
            <View style={[styles.metricIcon, { backgroundColor: '#FF6B6B20' }]}>
              <BookOpen size={28} color="#FF6B6B" />
            </View>
            <Text style={styles.metricNumber}>{wordsLearnt}</Text>
            <Text style={styles.metricLabel}>Words Learned</Text>
            <Text style={styles.metricSubtext}>Tap to view all words</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.metricCard, { backgroundColor: '#E8F5E8' }]}
            onPress={() => setShowTopicsModal(true)}
          >
            <View style={[styles.metricIcon, { backgroundColor: '#4CAF5020' }]}>
              <Target size={28} color="#4CAF50" />
            </View>
            <Text style={styles.metricNumber}>{topicsLearnt}</Text>
            <Text style={styles.metricLabel}>Topics Mastered</Text>
            <Text style={styles.metricSubtext}>Tap to view topics</Text>
          </TouchableOpacity>
        </View>

        {/* Learning Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={styles.streakIcon}>
              <TrendingUp size={24} color="#FF9800" />
            </View>
            <View>
              <Text style={styles.streakTitle}>Learning Streak</Text>
              <Text style={styles.streakSubtitle}>Days in a row</Text>
            </View>
            <Text style={styles.streakNumber}>{mockProgressStats.currentStreak}</Text>
          </View>
          <View style={styles.streakProgress}>
            <View style={styles.streakBar}>
              <View style={[styles.streakFill, { width: `${(mockProgressStats.currentStreak / 7) * 100}%` }]} />
            </View>
            <Text style={styles.streakText}>
              {7 - mockProgressStats.currentStreak} more days to reach weekly goal!
            </Text>
          </View>
        </View>

        {/* Time Spent */}
        <View style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Clock size={24} color="#9C27B0" />
            <Text style={styles.timeTitle}>Total Learning Time</Text>
          </View>
          <Text style={styles.timeNumber}>{mockProgressStats.totalTimeSpent}</Text>
          <Text style={styles.timeLabel}>Minutes</Text>
          <Text style={styles.timeSubtext}>That's {Math.round(mockProgressStats.totalTimeSpent / 60)} hours of Spanish!</Text>
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
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Cubano',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#546E7A',
    fontFamily: 'OpenSans',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  metricNumber: {
    fontSize: 42,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Cubano',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'OpenSans',
    textAlign: 'center',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 12,
    color: '#546E7A',
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  streakCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF980020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Cubano',
  },
  streakSubtitle: {
    fontSize: 14,
    color: '#546E7A',
    fontFamily: 'OpenSans',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF9800',
    fontFamily: 'Cubano',
    marginLeft: 'auto',
  },
  streakProgress: {
    gap: 8,
  },
  streakBar: {
    height: 8,
    backgroundColor: '#FFE0B2',
    borderRadius: 4,
  },
  streakFill: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 4,
  },
  streakText: {
    fontSize: 12,
    color: '#546E7A',
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  timeCard: {
    marginHorizontal: 20,
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'OpenSans',
  },
  timeNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#9C27B0',
    fontFamily: 'Cubano',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'OpenSans',
    marginBottom: 8,
  },
  timeSubtext: {
    fontSize: 14,
    color: '#546E7A',
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Cubano',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#546E7A',
    fontFamily: 'OpenSans',
    marginBottom: 16,
  },
  topicsList: {
    gap: 12,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  topicIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  topicText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'OpenSans',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    backgroundColor: '#FFEBEE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B30',
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    fontFamily: 'Inter_600SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'Nunito-ExtraBold',
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
    backgroundColor: '#FF6B6B20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
    fontFamily: 'Inter_600SemiBold',
  },
  achievementsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF8E1',
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
    color: '#2C3E50',
    fontFamily: 'Nunito-ExtraBold',
  },
  achievementLabel: {
    fontSize: 12,
    color: '#546E7A',
    fontFamily: 'Inter_400Regular',
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
    fontFamily: 'Nunito-ExtraBold',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  achievementPoints: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Nunito-ExtraBold',
  },
  pointsLabel: {
    fontSize: 10,
    color: '#546E7A',
    fontFamily: 'Inter_400Regular',
  },
});