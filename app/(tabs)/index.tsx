// app/(tabs)/index.tsx - Updated Duolingo-Inspired Dashboard
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Flame, Trophy, Zap, Clock, Star, BookOpen, Target, 
  Calendar, ChevronRight, Heart, Award, User, Crown
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockSeasons, mockProgressStats, mockChildProfile } from '@/data/mockData';
import { router } from 'expo-router';
import { Episode } from '@/types';

// Simple Journey Map Component (inline for now)
interface SimpleJourneyMapProps {
  seasons: any[];
  onEpisodePress: (episode: Episode) => void;
  currentProgress: {
    currentSeasonId: string;
    currentEpisodeId: string;
    completedEpisodes: string[];
  };
}

const SimpleJourneyMap: React.FC<SimpleJourneyMapProps> = ({ seasons, onEpisodePress, currentProgress }) => {
  const renderEpisodeNode = (episode: Episode, index: number) => {
    const isCompleted = currentProgress.completedEpisodes.includes(episode.id);
    const isCurrent = episode.id === currentProgress.currentEpisodeId;
    const isLocked = !isCompleted && !isCurrent;
    
    const isLeft = index % 2 === 0;
    const nodeSize = episode.type === 'weekend_special' ? 70 : 60;
    
    return (
      <View
        key={episode.id}
        style={[
          styles.episodeContainer,
          { alignSelf: isLeft ? 'flex-start' : 'flex-end' }
        ]}
      >
        <TouchableOpacity
          onPress={() => !isLocked && onEpisodePress(episode)}
          disabled={isLocked}
          style={[styles.episodeNode, { width: nodeSize, height: nodeSize }]}
        >
          <LinearGradient
            colors={
              isCompleted 
                ? ['#7AC74F', '#7AC74FCC']
                : isCurrent
                ? ['#FF6B6B', '#FF6B6BCC']
                : ['#E0E0E0', '#F5F5F5']
            }
            style={[styles.episodeGradient, { borderRadius: nodeSize / 2 }]}
          >
            {isCompleted ? (
              <Star size={24} color="#FFFFFF" />
            ) : isCurrent ? (
              <Star size={24} color="#FFFFFF" />
            ) : (
              <Text style={styles.episodeNumber}>{episode.number}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={[
          styles.episodeInfo,
          { alignItems: isLeft ? 'flex-start' : 'flex-end' }
        ]}>
          <Text style={[
            styles.episodeTitle,
            { 
              color: isLocked ? '#999' : Colors.light.text,
              textAlign: isLeft ? 'left' : 'right'
            }
          ]}>
            {episode.title}
          </Text>
          
          {!isLocked && (
            <Text style={styles.episodeMetaText}>
              {episode.duration} min • {episode.vocabularyFocus.length} words
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.journeyMapContainer}>
      <View style={styles.seasonHeader}>
        <Text style={styles.seasonTitle}>{seasons[0].title}</Text>
        <Text style={styles.seasonProgress}>
          {currentProgress.completedEpisodes.length}/{seasons[0].episodes.length}
        </Text>
      </View>
      
      <View style={styles.episodesJourney}>
        {seasons[0].episodes.slice(0, 5).map((episode, index) => 
          renderEpisodeNode(episode, index)
        )}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  
  const currentProgress = {
    currentSeasonId: 'season-1',
    currentEpisodeId: 'ep-1-2',
    completedEpisodes: ['ep-1-1'],
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEpisodePress = (episode: Episode) => {
    router.push(`/episode/${episode.id}`);
  };

  const getStreakDays = () => mockProgressStats.currentStreak;
  const getTotalXP = () => mockProgressStats.proficiency.vocabularyMastery.mastered * 10;
  const getCurrentLeague = () => {
    const xp = getTotalXP();
    if (xp >= 1000) return { name: 'Diamond', color: Colors.light.primary, icon: Crown };
    if (xp >= 500) return { name: 'Ruby', color: Colors.light.error, icon: Trophy };
    if (xp >= 200) return { name: 'Gold', color: Colors.light.warning, icon: Award };
    return { name: 'Silver', color: '#C0C0C0', icon: Star };
  };

  const getWeeklyGoalProgress = () => {
    return (mockProgressStats.weeklyCompletedMinutes / mockProgressStats.weeklyGoalMinutes) * 100;
  };

  const currentLeague = getCurrentLeague();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      {/* Header Stats */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerStats}>
          {/* Streak */}
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FFB34720' }]}>
              <Flame size={20} color={Colors.light.warning} />
            </View>
            <Text style={styles.statNumber}>{getStreakDays()}</Text>
          </View>

          {/* XP/Points */}
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FF6B6B20' }]}>
              <Zap size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.statNumber}>{getTotalXP()}</Text>
          </View>

          {/* Hearts/Lives */}
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FF808020' }]}>
              <Heart size={20} color={Colors.light.error} />
            </View>
            <Text style={styles.statNumber}>5</Text>
          </View>

          {/* Profile */}
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/account')}
          >
            <View style={[styles.profileIcon, { backgroundColor: currentLeague.color === '#C0C0C0' ? '#C0C0C020' : `${currentLeague.color}20` }]}>
              <User size={20} color={currentLeague.color} />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      