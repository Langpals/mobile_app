import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Clock, StepBack as Steps } from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockSeasons } from '@/data/mockData';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import StepCard from '@/components/ui/StepCard';
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={globalStyles.text}>Loading episode...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Episode {episode.number}</Text>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.episodeTitle}>{episode.title}</Text>
          <Text style={styles.description}>{episode.description}</Text>
          
          <View style={styles.metaContainer}>
            <DifficultyBadge level={episode.difficulty} />
            
            <View style={styles.metaStats}>
              <View style={styles.metaStat}>
                <Clock size={16} color={Colors.light.text} style={styles.metaIcon} />
                <Text style={styles.metaText}>{episode.duration} MINS</Text>
              </View>
              
              <View style={styles.metaStat}>
                <Steps size={16} color={Colors.light.text} style={styles.metaIcon} />
                <Text style={styles.metaText}>{episode.steps.length} STEPS</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${(episode.steps.filter(s => s.completed).length / episode.steps.length) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {episode.steps.filter(s => s.completed).length}/{episode.steps.length} completed
            </Text>
          </View>
          
          <Text style={styles.sectionTitle}>Steps</Text>
          
          {episode.steps.map((step, index) => (
            <StepCard 
              key={step.id}
              step={step}
              stepNumber={index + 1}
              onPress={() => router.push({
                pathname: "/step/[id]",
                params: { id: step.id }
              })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
    color: Colors.light.text,
  },
  contentContainer: {
    padding: 16,
  },
  episodeTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
    lineHeight: 24,
    marginBottom: 20,
  },
  metaContainer: {
    marginBottom: 24,
  },
  metaStats: {
    flexDirection: 'row',
    marginTop: 16,
  },
  metaStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: Colors.light.text,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.success,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  sectionTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 16,
  },
});