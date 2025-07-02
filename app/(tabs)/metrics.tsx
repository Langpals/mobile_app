// app/(tabs)/metrics.tsx - Enhanced Metrics with Transcripts Card
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  StatusBar, 
  ScrollView,
  Modal
} from 'react-native';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  MessageCircle,
  X 
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockChildProfile } from '@/data/mockData';
import { 
  ChevronRight,
  Eye,
  MoreHorizontal
} from 'lucide-react-native';
import { useRouter } from 'expo-router';


const learnedWords = [
  'Hola', 'Adiós', 'Gracias', 'Por favor', 'Sí', 'No', 'Agua', 'Casa',
  'Perro', 'Gato', 'Mamá', 'Papá', 'Hermano', 'Hermana', 'Amigo', 'Escuela',
  'Libro', 'Mesa', 'Silla', 'Ventana', 'Puerta', 'Cocina', 'Baño', 'Jardín',
  'Sol', 'Luna', 'Estrella', 'Árbol', 'Flor', 'Pájaro', 'Pez', 'Manzana',
  'Naranja', 'Plátano', 'Pan', 'Leche', 'Queso', 'Carne', 'Pollo', 'Arroz',
  'Rojo', 'Azul'
];

const masteredTopics = [
  'Family Members',
  'Basic Greetings', 
  'Common Animals'
];

// Mock transcript data
const mockTranscripts = [
  {
    id: '1',
    date: '2024-01-15',
    time: '10:30 AM',
    duration: '12 minutes',
    episodeTitle: 'Meeting Bern',
    conversationCount: 15,
    preview: 'Child: "Hola Bern!" | Bern: "¡Hola! ¿Cómo te llamas?"',
    hasMore: true,
    wordsLearned: ['Hola', 'Me llamo', 'Roja', 'Azul'],
    highlights: ['First Spanish greeting', 'Name introduction', 'Color recognition']
  },
  {
    id: '2',
    date: '2024-01-14',
    time: '4:15 PM',
    duration: '8 minutes',
    episodeTitle: 'Learning Colors',
    conversationCount: 12,
    preview: 'Child: "The apple is red!" | Bern: "¡Muy bien! La manzana es roja."',
    hasMore: true,
    wordsLearned: ['Manzana', 'Plátano', 'Amarillo', 'Morado'],
    highlights: ['Fruit vocabulary', 'Color combinations', 'Favorite colors']
  },
  {
    id: '3',
    date: '2024-01-13',
    time: '11:45 AM',
    duration: '15 minutes',
    episodeTitle: 'Family Adventures',
    conversationCount: 18,
    preview: 'Child: "This is my family!" | Bern: "¡Qué bonita familia! Tell me about them."',
    hasMore: true,
    wordsLearned: ['Familia', 'Mamá', 'Papá', 'Hermano', 'Jugar', 'Juntos'],
    highlights: ['Family members', 'Activities together', 'Personal sharing']
  }
];

export default function MetricsScreen() {
  const [showWordsModal, setShowWordsModal] = useState(false);
  const [showTopicsModal, setShowTopicsModal] = useState(false);
  const [showTranscriptsModal, setShowTranscriptsModal] = useState(false);

  const router = useRouter();

  const handleTranscriptPress = (transcriptId: string) => {
    setShowTranscriptsModal(false);
    router.push(`/transcript/${transcriptId}`);
  };

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
            <Text style={styles.modalTitle}>Mastered Topics</Text>
            <TouchableOpacity onPress={() => setShowTopicsModal(false)}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.topicsList}>
              {masteredTopics.map((topic, index) => (
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

  const renderTranscriptsModal = () => (
    <Modal visible={showTranscriptsModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Conversation Transcripts</Text>
            <TouchableOpacity onPress={() => setShowTranscriptsModal(false)}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 32 }} style={styles.modalScroll}>
            <Text style={styles.transcriptsDescription}>
              Tap any conversation to view the full transcript:
            </Text>
            <View style={styles.transcriptsList}>
              {mockTranscripts.map((transcript) => (
                <TouchableOpacity 
                  key={transcript.id} 
                  style={styles.transcriptCard}
                  onPress={() => handleTranscriptPress(transcript.id)}
                  activeOpacity={0.7}
                >
                  {/* Card Header */}
                  <View style={styles.transcriptHeader}>
                    <Text style={styles.transcriptTitle}>{transcript.episodeTitle}</Text>
                    <View style={styles.transcriptHeaderRight}>
                      <Text style={styles.transcriptDate}>{transcript.date}</Text>
                      <ChevronRight size={16} color="#9B59B6" style={styles.chevronIcon} />
                    </View>
                  </View>
  
                  {/* Meta Information */}
                  <View style={styles.transcriptMeta}>
                    <Text style={styles.transcriptTime}>{transcript.time}</Text>
                    <Text style={styles.transcriptDuration}>{transcript.duration}</Text>
                    <Text style={styles.transcriptCount}>{transcript.conversationCount} exchanges</Text>
                  </View>
  
                  {/* Preview Section */}
                  <View style={styles.previewSection}>
                    <Text style={styles.transcriptPreview}>{transcript.preview}</Text>
                    <View style={styles.moreIndicator}>
                      <MoreHorizontal size={16} color="#9B59B6" />
                      <Text style={styles.moreText}>Tap to view full conversation</Text>
                    </View>
                  </View>
  
                  {/* Words Learned Section */}
                  <View style={styles.wordsLearnedSection}>
                    <Text style={styles.wordsLearnedTitle}>New Words:</Text>
                    <View style={styles.wordsLearnedContainer}>
                      {transcript.wordsLearned.slice(0, 3).map((word, index) => (
                        <View key={index} style={styles.wordLearnedChip}>
                          <Text style={styles.wordLearnedText}>{word}</Text>
                        </View>
                      ))}
                      {transcript.wordsLearned.length > 3 && (
                        <View style={styles.moreWordsChip}>
                          <Text style={styles.moreWordsText}>+{transcript.wordsLearned.length - 3}</Text>
                        </View>
                      )}
                    </View>
                  </View>
  
                  {/* View Full Transcript Button */}
                  <View style={styles.viewFullButton}>
                    <Eye size={14} color="#9B59B6" />
                    <Text style={styles.viewFullText}>View Full Transcript</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{mockChildProfile.name}'s Progress</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.metricsContainer}>
          <TouchableOpacity style={[styles.metricCard, { backgroundColor: '#73C44B' }]} onPress={() => setShowWordsModal(true)}>
            <View style={[styles.metricIconCircle, { backgroundColor: Colors.light.background }]}>
              <BookOpen size={24} color={'#73C44B'} />
            </View>
            <Text style={styles.statValue}>{mockChildProfile.wordsLearned}</Text>
            <Text style={styles.statLabel}>Words Learned</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.metricCard, { backgroundColor: '#58B4F9' }]} onPress={() => setShowTopicsModal(true)}>
            <View style={[styles.metricIconCircle, { backgroundColor: Colors.light.background }]}>
              <Target size={24} color={'#58B4F9'} />
            </View>
            <Text style={styles.statValue}>{mockChildProfile.topicsMastered}</Text>
            <Text style={styles.statLabel}>Topics Mastered</Text>
          </TouchableOpacity>
        </View>

        {/* Learning Streak Card */}
        <TouchableOpacity style={[styles.fullWidthMetricCard, { backgroundColor: Colors.light.accent }]} onPress={() => { /* Add streak detail navigation here if needed */ }}>
          <View style={[styles.metricIconCircle, { backgroundColor: Colors.light.background, marginBottom: 0 }]}>
            <TrendingUp size={24} color={Colors.light.warning} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.statLabel}>Learning Streak</Text>
            <Text style={[styles.statValue, { fontSize: 32 }]}>{mockChildProfile.learningStreak}</Text>
            <Text style={styles.streakDays}>Days in a row</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${(mockChildProfile.learningStreak / 7) * 100}%` }]}></View>
            </View>
            <Text style={styles.streakText}>{'4 more days to level up!'}</Text>
          </View>
        </TouchableOpacity>

        {/* Total Learning Time Card */}
        <TouchableOpacity style={[styles.fullWidthMetricCard, { backgroundColor: Colors.light.accent }]} onPress={() => { /* Add time detail navigation here if needed */ }}>
          <View style={[styles.metricIconCircle, { backgroundColor: Colors.light.background, marginBottom: 0 }]}>
            <Clock size={24} color={Colors.light.accent} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.statLabel}>Total Learning Time</Text>
            <Text style={[styles.statValue, { fontSize: 32 }]}>{mockChildProfile.totalLearningTime}</Text>
            <Text style={styles.timeUnit}>Minutes</Text>
            <Text style={styles.timeDescription}>{'That\'s 1 hour and 30 minutes of Spanish practice!'}</Text>
          </View>
        </TouchableOpacity>

        {/* NEW: Conversation Transcripts Card */}
        <TouchableOpacity 
          style={[styles.fullWidthMetricCard, { backgroundColor: '#9B59B6' }]} 
          onPress={() => setShowTranscriptsModal(true)}
        >
          <View style={[styles.metricIconCircle, { backgroundColor: Colors.light.background, marginBottom: 0 }]}>
            <MessageCircle size={24} color={'#9B59B6'} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.statLabel}>Conversation Transcripts</Text>
            <Text style={[styles.statValue, { fontSize: 32 }]}>{mockTranscripts.length}</Text>
            <Text style={styles.timeUnit}>Sessions Available</Text>
            <Text style={styles.timeDescription}>{'View your child\'s conversations with Bern!'}</Text>
          </View>
        </TouchableOpacity>

        {/* Modals */}
        {renderWordsModal()}
        {renderTopicsModal()}
        {renderTranscriptsModal()}
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
  headerTitle: {
    fontSize: 24,
    color: Colors.light.text,
    fontFamily: 'Cubano',
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
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  metricCard: {
    width: '47%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 0,
    borderColor: Colors.light.border,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 22,
    color: Colors.light.text,
    fontFamily: 'Cubano',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans-Bold',
  },
  viewAllButton: {
    display: 'none',
  },
  viewAllText: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
    marginTop: 8,
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
    color: Colors.light.text,
    fontFamily: 'Cubano',
  },
  timeUnit: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 4,
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
    color: Colors.light.text,
    fontFamily: 'Cubano',
    marginBottom: 16,
    marginTop: 15,
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
    borderColor: '#73C44B',
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#73C44B',
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
    color: Colors.light.text,
    fontFamily: 'Cubano',
  },
  modalScroll: {
    padding: 20,
  },
  metricIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  fullWidthMetricCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    backgroundColor: Colors.light.cardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: Colors.light.border,
    marginBottom: 16,
  },
  streakDays: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  // New styles for transcripts modal
  transcriptsDescription: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'OpenSans',
    marginBottom: 16,
    textAlign: 'center',
  },
  transcriptsList: {
    gap: 12,
  },
  transcriptCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transcriptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Cubano',
    flex: 1,
  },
  transcriptDate: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'OpenSans',
  },
  transcriptMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  transcriptTime: {
    fontSize: 12,
    color: '#9B59B6',
    fontWeight: '600',
    fontFamily: 'OpenSans-Bold',
  },
  transcriptDuration: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'OpenSans',
  },
  transcriptCount: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'OpenSans',
  },
  transcriptPreview: {
    fontSize: 13,
    color: Colors.light.text,
    opacity: 0.8,
    fontFamily: 'OpenSans',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  transcriptHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevronIcon: {
    opacity: 0.7,
  },
  previewSection: {
    marginBottom: 16,
  },
  moreIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moreText: {
    fontSize: 12,
    color: '#9B59B6',
    fontFamily: 'OpenSans-Bold',
  },
  wordsLearnedSection: {
    marginBottom: 16,
  },
  wordsLearnedTitle: {
    fontSize: 13,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 8,
  },
  wordsLearnedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  wordLearnedChip: {
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9B59B6',
  },
  wordLearnedText: {
    fontSize: 11,
    color: '#9B59B6',
    fontFamily: 'OpenSans-Bold',
  },
  moreWordsChip: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreWordsText: {
    fontSize: 11,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
    opacity: 0.7,
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8F6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8DBFF',
  },
  viewFullText: {
    fontSize: 13,
    color: '#9B59B6',
    fontFamily: 'OpenSans-Bold',
  },
});