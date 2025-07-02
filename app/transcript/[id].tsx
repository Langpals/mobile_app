// app/transcript/[id].tsx - Transcript Detail Page
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, MessageSquare, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';

// Extended transcript data with full conversations
type Transcript = {
  id: string;
  date: string;
  time: string;
  duration: string;
  episodeTitle: string;
  conversationCount: number;
  preview: string;
  fullConversation: { speaker: string; message: string; timestamp: string }[];
};

const fullTranscriptData: { [key: string]: Transcript } = {
  '1': {
    id: '1',
    date: '2024-01-15',
    time: '10:30 AM',
    duration: '12 minutes',
    episodeTitle: 'Meeting Bern',
    conversationCount: 15,
    preview: 'Child: "Hola Bern!" | Bern: "¡Hola! ¿Cómo te llamas?"',
    fullConversation: [
      { speaker: 'Bern', message: '¡Hola! Welcome to Magic Island! I\'m so excited to meet you!', timestamp: '10:30:15' },
      { speaker: 'Child', message: 'Hi! Are you really a talking bear?', timestamp: '10:30:22' },
      { speaker: 'Bern', message: '¡Sí! I am Bern, your magical Spanish-speaking friend! Can you say "Hola" to me?', timestamp: '10:30:28' },
      { speaker: 'Child', message: 'Hola Bern!', timestamp: '10:30:35' },
      { speaker: 'Bern', message: '¡Perfecto! That means "hello" in Spanish! Now, ¿cómo te llamas? That means "what is your name?"', timestamp: '10:30:40' },
      { speaker: 'Child', message: 'My name is Emma!', timestamp: '10:30:48' },
      { speaker: 'Bern', message: '¡Hola Emma! In Spanish, you can say "Me llamo Emma." Can you try that?', timestamp: '10:30:52' },
      { speaker: 'Child', message: 'Me llamo Emma!', timestamp: '10:31:02' },
      { speaker: 'Bern', message: '¡Excelente! You\'re already speaking Spanish! Let\'s explore this magical island together. Do you see those colorful flowers?', timestamp: '10:31:08' },
      { speaker: 'Child', message: 'Yes! They\'re so pretty! What colors are they?', timestamp: '10:31:18' },
      { speaker: 'Bern', message: 'Great question! This red flower is "roja" in Spanish. Can you say "roja"?', timestamp: '10:31:25' },
      { speaker: 'Child', message: 'Roja! Red is roja!', timestamp: '10:31:32' },
      { speaker: 'Bern', message: '¡Muy bien! And this blue flower is "azul." Try saying "azul"!', timestamp: '10:31:38' },
      { speaker: 'Child', message: 'Azul! Blue is azul!', timestamp: '10:31:45' },
      { speaker: 'Bern', message: 'You\'re doing amazing, Emma! Should we continue exploring and learn more Spanish words together?', timestamp: '10:31:52' },
      { speaker: 'Child', message: 'Yes! This is fun! I want to learn more!', timestamp: '10:32:00' }
    ]
  },
  '2': {
    id: '2',
    date: '2024-01-14',
    time: '4:15 PM',
    duration: '8 minutes',
    episodeTitle: 'Learning Colors',
    conversationCount: 12,
    preview: 'Child: "The apple is red!" | Bern: "¡Muy bien! La manzana es roja."',
    fullConversation: [
      { speaker: 'Bern', message: 'Welcome back to Magic Island, Emma! Today we\'re going to learn about colors in Spanish!', timestamp: '4:15:05' },
      { speaker: 'Child', message: 'I remember red is roja and blue is azul!', timestamp: '4:15:12' },
      { speaker: 'Bern', message: '¡Increíble! You remember! Look, I found this basket of fruits. What color is this apple?', timestamp: '4:15:18' },
      { speaker: 'Child', message: 'The apple is red!', timestamp: '4:15:25' },
      { speaker: 'Bern', message: '¡Muy bien! In Spanish we say "La manzana es roja." Can you repeat that?', timestamp: '4:15:30' },
      { speaker: 'Child', message: 'La manzana es roja!', timestamp: '4:15:38' },
      { speaker: 'Bern', message: 'Perfect! "Manzana" means apple. Now, what about this banana? What color is it?', timestamp: '4:15:43' },
      { speaker: 'Child', message: 'It\'s yellow!', timestamp: '4:15:50' },
      { speaker: 'Bern', message: 'Yes! Yellow in Spanish is "amarillo." Say "El plátano es amarillo" - the banana is yellow!', timestamp: '4:15:55' },
      { speaker: 'Child', message: 'El plátano es amarillo!', timestamp: '4:16:05' },
      { speaker: 'Bern', message: 'Wonderful! You\'re learning colors and fruits! What\'s your favorite color, Emma?', timestamp: '4:16:12' },
      { speaker: 'Child', message: 'I like purple! What\'s purple in Spanish?', timestamp: '4:16:20' },
      { speaker: 'Bern', message: 'Purple is "morado"! Mi color favorito es morado - my favorite color is purple!', timestamp: '4:16:28' }
    ]
  },
  '3': {
    id: '3',
    date: '2024-01-13',
    time: '11:45 AM',
    duration: '15 minutes',
    episodeTitle: 'Family Adventures',
    conversationCount: 18,
    preview: 'Child: "This is my family!" | Bern: "¡Qué bonita familia! Tell me about them."',
    fullConversation: [
      { speaker: 'Bern', message: 'Hola Emma! I love learning about families. Can you tell me about your family?', timestamp: '11:45:08' },
      { speaker: 'Child', message: 'This is my family! I have a mommy and daddy and a little brother!', timestamp: '11:45:16' },
      { speaker: 'Bern', message: '¡Qué bonita familia! That means "what a beautiful family!" In Spanish, family is "familia."', timestamp: '11:45:25' },
      { speaker: 'Child', message: 'Familia! My familia!', timestamp: '11:45:33' },
      { speaker: 'Bern', message: 'Perfect! Your mommy is "mamá" and your daddy is "papá" in Spanish. Can you say those?', timestamp: '11:45:38' },
      { speaker: 'Child', message: 'Mamá and papá! That sounds funny!', timestamp: '11:45:47' },
      { speaker: 'Bern', message: 'It does sound different! And your little brother is "hermano pequeño." Try saying "hermano"!', timestamp: '11:45:53' },
      { speaker: 'Child', message: 'Her-ma-no! Hermano!', timestamp: '11:46:02' },
      { speaker: 'Bern', message: '¡Excelente! What does your hermano like to do?', timestamp: '11:46:08' },
      { speaker: 'Child', message: 'He likes to play with toys and run around!', timestamp: '11:46:16' },
      { speaker: 'Bern', message: 'That sounds fun! "Jugar" means "to play" in Spanish. Your hermano likes to jugar!', timestamp: '11:46:23' },
      { speaker: 'Child', message: 'Jugar! My hermano likes to jugar!', timestamp: '11:46:32' },
      { speaker: 'Bern', message: 'What about you, Emma? Do you like to jugar with your hermano?', timestamp: '11:46:38' },
      { speaker: 'Child', message: 'Yes! We play together every day!', timestamp: '11:46:46' },
      { speaker: 'Bern', message: 'That\'s wonderful! "Juntos" means "together." You jugar juntos!', timestamp: '11:46:52' },
      { speaker: 'Child', message: 'Juntos! We jugar juntos!', timestamp: '11:47:00' },
      { speaker: 'Bern', message: 'You\'re doing so well! Do you want to teach your familia some Spanish words?', timestamp: '11:47:07' },
      { speaker: 'Child', message: 'Yes! I\'ll teach them mamá, papá, and hermano!', timestamp: '11:47:15' },
      { speaker: 'Bern', message: '¡Perfecto! Your familia will be so proud of you for learning Spanish!', timestamp: '11:47:22' }
    ]
  }
};

export default function TranscriptDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  type TranscriptId = keyof typeof fullTranscriptData;
  const transcript = fullTranscriptData[id as TranscriptId];
  
  if (!transcript) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transcript not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    // Simple timestamp formatting
    return timestamp;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonHeader}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{transcript.episodeTitle}</Text>
          <Text style={styles.headerSubtitle}>Conversation Transcript</Text>
        </View>
      </View>

      {/* Session Info */}
      <View style={styles.sessionInfo}>
        <View style={styles.sessionInfoItem}>
          <Calendar size={16} color="#9B59B6" />
          <Text style={styles.sessionInfoText}>{transcript.date}</Text>
        </View>
        <View style={styles.sessionInfoItem}>
          <Clock size={16} color="#9B59B6" />
          <Text style={styles.sessionInfoText}>{transcript.duration}</Text>
        </View>
        <View style={styles.sessionInfoItem}>
          <MessageSquare size={16} color="#9B59B6" />
          <Text style={styles.sessionInfoText}>{transcript.conversationCount} exchanges</Text>
        </View>
      </View>

      {/* Conversation */}
      <ScrollView style={styles.conversationContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.conversationTitle}>Full Conversation</Text>
        
        {transcript.fullConversation.map((exchange: { speaker: string; message: string; timestamp: string }, index: number) => (
          <View key={index} style={[
            styles.messageContainer,
            exchange.speaker === 'Bern' ? styles.bernMessage : styles.childMessage
          ]}>
            <View style={styles.messageHeader}>
              <Text style={[
                styles.speakerName,
                exchange.speaker === 'Bern' ? styles.bernSpeaker : styles.childSpeaker
              ]}>
                {exchange.speaker === 'Bern' ? '🧸 Bern' : '👶 Emma'}
              </Text>
              <Text style={styles.timestamp}>{formatTimestamp(exchange.timestamp)}</Text>
            </View>
            <Text style={[
              styles.messageText,
              exchange.speaker === 'Bern' ? styles.bernMessageText : styles.childMessageText
            ]}>
              {exchange.message}
            </Text>
          </View>
        ))}
        
        <View style={styles.conversationEnd}>
          <Text style={styles.conversationEndText}>End of conversation</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  backButtonHeader: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Cubano',
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'OpenSans',
    color: Colors.light.text,
    opacity: 0.7,
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
  },
  sessionInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionInfoText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    color: Colors.light.text,
  },
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationTitle: {
    fontSize: 18,
    fontFamily: 'Cubano',
    color: Colors.light.text,
    marginVertical: 20,
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bernMessage: {
    backgroundColor: '#F0E6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
    marginRight: 40,
  },
  childMessage: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#58CC02',
    marginLeft: 40,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
  },
  bernSpeaker: {
    color: '#9B59B6',
  },
  childSpeaker: {
    color: '#58CC02',
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'OpenSans',
    color: Colors.light.text,
    opacity: 0.5,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'OpenSans',
    lineHeight: 22,
  },
  bernMessageText: {
    color: '#4A2C5A',
  },
  childMessageText: {
    color: '#2D4A2D',
  },
  conversationEnd: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  conversationEndText: {
    fontSize: 14,
    fontFamily: 'OpenSans',
    color: Colors.light.text,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: Colors.light.text,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.light.background,
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
});