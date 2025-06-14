// app/episode/[id].tsx - ULTRA SIMPLE Episode Page
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Play, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockSeasons } from '@/data/mockData';
import { Episode } from '@/types';

export default function EpisodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    // Find the episode from all seasons
    for (const season of mockSeasons) {
      const foundEpisode = season.episodes.find(ep => ep.id === id);
      if (foundEpisode) {
        setEpisode(foundEpisode);
        break;
      }
    }
  }, [id]);

  if (!episode) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const handleStartEpisode = () => {
    // Start the episode (would connect to teddy bear)
    console.log('Starting episode:', episode.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Episode {episode.number}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Episode Info */}
        <View style={styles.episodeContainer}>
          <Text style={styles.episodeTitle}>{episode.title}</Text>
          <Text style={styles.episodeDescription}>{episode.description}</Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Clock size={16} color={Colors.light.text} />
              <Text style={styles.metaText}>{episode.duration} minutes</Text>
            </View>
          </View>
        </View>

        {/* Vocabulary Preview */}
        <View style={styles.vocabularySection}>
          <Text style={styles.sectionTitle}>Words You'll Learn</Text>
          <View style={styles.wordsGrid}>
            {episode.vocabularyFocus.map((word, index) => (
              <View key={index} style={styles.wordChip}>
                <Text style={styles.wordText}>{word}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <View style={styles.startSection}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartEpisode}>
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Episode</Text>
          </TouchableOpacity>
          <Text style={styles.startNote}>Make sure Bern is nearby and connected!</Text>
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
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  placeholder: {
    width: 40,
  },
  episodeContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  episodeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 12,
    textAlign: 'center',
  },
  episodeDescription: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.8,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  metaInfo: {
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  vocabularySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 16,
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
    paddingVertical: 8,
  },
  wordText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  startSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  startNote: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});