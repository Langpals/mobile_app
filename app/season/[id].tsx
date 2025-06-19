// app/season/[id].tsx - ULTRA SIMPLE Season Page
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Play, Lock, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockSeasons } from '@/data/mockData';
import { Season, Episode } from '@/types';

export default function SeasonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [season, setSeason] = useState<Season | null>(null);

  useEffect(() => {
    const foundSeason = mockSeasons.find(s => s.number === parseInt(id || '1'));
    if (foundSeason) {
      setSeason(foundSeason);
    }
  }, [id]);

  if (!season) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const handleEpisodePress = (episode: Episode) => {
    if (!episode.locked) {
      router.push(`/episode/${episode.id}`);
    }
  };

  const completedEpisodes = season.episodes.filter(ep => ep.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Season {season.number}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Season Info */}
        <View style={styles.seasonContainer}>
          <Text style={styles.seasonTitle}>{season.title}</Text>
          <Text style={styles.seasonDescription}>{season.description}</Text>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {completedEpisodes} of {season.episodes.length} episodes completed
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(completedEpisodes / season.episodes.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Episodes List */}
        <View style={styles.episodesSection}>
          <Text style={styles.sectionTitle}>Episodes</Text>
          
          {season.episodes.map((episode, index) => (
            <TouchableOpacity
              key={episode.id}
              style={[
                styles.episodeCard,
                episode.completed && styles.completedCard,
                episode.locked && styles.lockedCard,
                !episode.completed && !episode.locked && styles.unlockedCard
              ]}
              onPress={() => handleEpisodePress(episode)}
              disabled={episode.locked}
            >
              <View style={[
                styles.episodeNumber,
                !episode.completed && !episode.locked && styles.unlockedEpisodeNumber,
                episode.completed && styles.completedEpisodeNumber
              ]}>
                {episode.completed ? (
                  <Star size={16} color={'#73C44B'} />
                ) : episode.locked ? (
                  <Lock size={16} color={Colors.light.text} />
                ) : (
                  <Text style={[
                    styles.episodeNumberText,
                    !episode.completed && !episode.locked && styles.unlockedEpisodeNumberText
                  ]}>{episode.number}</Text>
                )}
              </View>
              
              <View style={styles.episodeInfo}>
                <Text style={[
                  styles.episodeTitle,
                  episode.completed && styles.completedText,
                  episode.locked && styles.lockedText,
                  !episode.completed && !episode.locked && styles.unlockedText
                ]}>
                  {episode.title}
                </Text>
                <Text style={styles.episodeDuration}>{episode.duration} min</Text>
              </View>
              
              {!episode.locked && (
                <Play size={16} color={episode.completed ? '#73C44B' : Colors.light.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 30,
    color: Colors.light.text,
    fontFamily: 'Cubano',
  },
  placeholder: {
    width: 40,
  },
  seasonContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  seasonTitle: {
    fontSize: 22,
    color: Colors.light.text,
    fontFamily: 'Cubano',
    marginBottom: 12,
    textAlign: 'center',
  },
  seasonDescription: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.8,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'OpenSans-Regular',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.light.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 3,
  },
  episodesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.light.text,
    fontFamily: 'Cubano',
    marginBottom: 16,
  },
  episodeCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  completedCard: {
    backgroundColor: '#73C44B' + '10',
    borderColor: '#73C44B',
    borderWidth: 1,
  },
  lockedCard: {
    opacity: 0.6,
  },
  unlockedCard: {
    backgroundColor: Colors.light.primary + '10',
    borderColor: Colors.light.primary,
    borderWidth: 1,
  },
  episodeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeNumberText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Cubano',
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 2,
  },
  completedText: {
    color: '#73C44B',
  },
  lockedText: {
    opacity: 0.6,
  },
  episodeDuration: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'OpenSans-Regular',
  },
  unlockedEpisodeNumber: {
    backgroundColor: Colors.light.primary + '20',
  },
  unlockedEpisodeNumberText: {
    color: Colors.light.primary,
  },
  unlockedText: {
    color: Colors.light.primary,
  },
  completedEpisodeNumber: {
    backgroundColor: '#73C44B' + '20',
  },
});