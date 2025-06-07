// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Sparkles, MapPin, Trophy, Award, Play
} from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockSeasons, mockProgressStats, mockChildProfile } from '@/data/mockData';
import TeddyMascot from '@/components/ui/TeddyMascot';
import ProgressPath from '@/components/ui/ProgressPath';
import SeasonCard from '@/components/ui/SeasonCard';
import { Episode } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTeddy } from '@/contexts/TeddyContext';
import { useLearning } from '@/contexts/LearningContext';

const { width } = Dimensions.get('window');

export default function LearningDashboard() {
  const [currentSeason] = useState(mockSeasons[0]);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const [fadeAnimation] = useState(new Animated.Value(0));
  
  const { currentUser, currentUserDocument } = useAuth();
  const { teddy, isConnected } = useTeddy();
  const { progress } = useLearning();

  useEffect(() => {
    // Find the next episode to play
    const nextEp = currentSeason.episodes.find(ep => !ep.completed && !ep.locked);
    setNextEpisode(nextEp || null);

    // Fade in animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEpisodePress = (episode: Episode) => {
    router.push({
      pathname: "/episode/[id]",
      params: { id: episode.id }
    });
  };

  const handleSeasonPress = (seasonNumber: number) => {
    router.push({
      pathname: "/season/[id]",
      params: { id: seasonNumber.toString() }
    });
  };

  const handleAchievementsPress = () => {
    router.push('/achievements');
  };

  const handleLeaderboardPress = () => {
    router.push('/leaderboard');
  };

  const getBernMessage = () => {
    if (!isConnected) {
      return "¡Hola! Let's connect so we can start our magical adventure!";
    }
    if (nextEpisode) {
      return `¡Vamos! Ready for Episode ${nextEpisode.number}? Let's explore ${nextEpisode.setting}!`;
    }
    return "¡Excelente! You've completed all available episodes!";
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnimation }}>
          {/* Header with Mascot */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>
                Hi {currentUserDocument?.childName || 'Explorer'}! 👋
              </Text>
              <View style={styles.mascotContainer}>
                <TeddyMascot 
                  expression="happy" 
                  size={100}
                  message={getBernMessage()}
                  isConnected={isConnected}
                />
              </View>
            </View>
          </View>

          {/* Continue Learning Button */}
          {nextEpisode && (
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => handleEpisodePress(nextEpisode)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueGradient}
              >
                <View style={styles.continueContent}>
                  <View style={styles.continueIcon}>
                    <Sparkles size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.continueText}>
                    <Text style={styles.continueTitle}>Continue Learning</Text>
                    <Text style={styles.continueEpisode}>
                      Episode {nextEpisode.number}: {nextEpisode.title}
                    </Text>
                    <Text style={styles.continueDuration}>
                      {nextEpisode.duration} minutes • {nextEpisode.setting}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Current Adventure (Season) */}
          <View style={styles.seasonSection}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={Colors.light.text} />
              <Text style={styles.sectionTitle}>Current Adventure</Text>
            </View>
            
            <SeasonCard season={currentSeason} />
          </View>

          {/* Episode Adventures Path */}
          <View style={styles.episodeSection}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={Colors.light.text} />
              <Text style={styles.sectionTitle}>Episode Adventures</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Follow the magical path through {currentSeason.title}
            </Text>
            
            <View style={styles.pathContainer}>
              <ProgressPath episodes={currentSeason.episodes} onEpisodePress={handleEpisodePress} />
            </View>
          </View>

          {/* Action Buttons (without title) */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAchievementsPress}
            >
              <Award size={24} color={Colors.light.primary} />
              <Text style={styles.actionText}>Achievements</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLeaderboardPress}
            >
              <Trophy size={24} color={Colors.light.primary} />
              <Text style={styles.actionText}>Leaderboard</Text>
            </TouchableOpacity>
          </View>

          {/* Connection Status */}
          <View style={styles.connectionStatus}>
            <View style={[
              styles.connectionDot, 
              { backgroundColor: isConnected ? Colors.light.success : Colors.light.error }
            ]} />
            <Text style={styles.connectionText}>
              {isConnected ? 'Bern is connected' : 'Bern is offline'}
            </Text>
          </View>
        </Animated.View>
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
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: Colors.light.cardBackground,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 16,
  },
  mascotContainer: {
    alignItems: 'center',
  },
  continueButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueGradient: {
    borderRadius: 20,
    padding: 20,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  continueText: {
    flex: 1,
  },
  continueTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  continueEpisode: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  continueDuration: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  seasonSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginLeft: 8,
  },
  sectionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 16,
  },
  episodeSection: {
    marginBottom: 32,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  pathContainer: {
    marginTop: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    paddingVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 8,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
  },
});