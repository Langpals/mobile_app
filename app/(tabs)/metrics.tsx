// app/(tabs)/metrics.tsx - ULTRA SIMPLE Metrics Page
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView } from 'react-native';
import { BookOpen, Target } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockProgressStats, mockChildProfile } from '@/data/mockData';

export default function MetricsScreen() {
  const wordsLearnt = mockProgressStats.proficiency.vocabularyMastery.mastered;
  const topicsLearnt = 2; // Based on completed topics
  
  // Simple topic list based on episodes completed
  const completedTopics = [
    'Greetings',
    'Numbers'
  ];

  // Simple word bank based on completed episodes
  const learnedWords = [
    'Hola', 'Buenos días', 'Adiós', 'Gracias', 'Por favor',
    'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco',
    'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja'
  ];

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{mockChildProfile.name}'s Progress</Text>
        </View>

        {/* Main Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <BookOpen size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.metricNumber}>{wordsLearnt}</Text>
            <Text style={styles.metricLabel}>Words Learnt</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Target size={24} color={Colors.light.secondary} />
            </View>
            <Text style={styles.metricNumber}>{topicsLearnt}</Text>
            <Text style={styles.metricLabel}>Topics Learnt</Text>
          </View>
        </View>

        {/* Topics Completed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topics Completed</Text>
          <View style={styles.topicsList}>
            {completedTopics.map((topic, index) => (
              <View key={index} style={styles.topicItem}>
                <Text style={styles.topicText}>✓ {topic}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Words Learned */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Words in Word Bank</Text>
          <View style={styles.wordsGrid}>
            {learnedWords.map((word, index) => (
              <View key={index} style={styles.wordChip}>
                <Text style={styles.wordText}>{word}</Text>
              </View>
            ))}
          </View>
        </View>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 16,
  },
  topicsList: {
    gap: 8,
  },
  topicItem: {
    backgroundColor: Colors.light.success + '20',
    borderRadius: 8,
    padding: 12,
  },
  topicText: {
    fontSize: 16,
    color: Colors.light.success,
    fontFamily: 'Poppins-SemiBold',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    backgroundColor: Colors.light.primary + '20',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  wordText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontFamily: 'Poppins-SemiBold',
  },
});