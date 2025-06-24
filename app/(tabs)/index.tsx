// app/(tabs)/index.tsx - Updated Home Screen with Enhanced Journey Map
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Animated,
  Platform,
  StatusBar 
} from 'react-native';
import { Trophy } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockChildProfile, mockSeasons } from '@/data/mockData';
import { router } from 'expo-router';
import { Episode } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { OnboardingResetButton } from '@/utils/TextDebugHelper';
import EnhancedJourneyMap from '@/components/ui/EnhancedJourneyMap';

export default function HomeScreen() {
  const { colors, activeTheme } = useTheme();
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

  const handleViewAllPress = () => {
    router.push(`/season/${currentProgress.currentSeasonId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor={colors.background} 
        barStyle={activeTheme === 'dark' ? 'light-content' : 'dark-content'} 
      />
      
      {/* Development Reset Button - Remove in production */}
      <OnboardingResetButton />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <Animated.View style={[styles.welcomeSection, { opacity: fadeAnim }]}>
          <View style={[styles.welcomeHeader, { backgroundColor: Colors.light.background }]}>
            <View>
              <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                ¡Hola, {mockChildProfile.name}!
              </Text>
              <Text style={[styles.welcomeSubtitle, { color: colors.text }]}>
                Ready to continue your Spanish journey?
              </Text>
            </View>
            <View style={styles.welcomeIcon}>
              <Trophy size={24} color={Colors.light.primary} />
            </View>
          </View>
        </Animated.View>
        
        {/* Enhanced Learning Journey Map */}
        <Animated.View style={[styles.journeySection, { opacity: fadeAnim }]}>
          <EnhancedJourneyMap
            seasons={mockSeasons}
            onEpisodePress={handleEpisodePress}
            onViewAllPress={handleViewAllPress}
            currentProgress={currentProgress}
          />
        </Animated.View>

        {/* Quick Stats Section */}
        {/* <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
          <View style={[styles.statsContainer, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.light.secondary }]}>
                {mockChildProfile.learningStreak}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Day Streak</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.light.accent }]}>
                {mockChildProfile.wordsLearned}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Words Learned</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.light.primary }]}>
                {mockChildProfile.totalLearningTime}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Minutes</Text>
            </View>
          </View>
        </Animated.View> */}

        {/* Bottom Padding for better scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 20 : 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 26,
    fontFamily: 'Outfit-Bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontFamily: 'Outfit-Medium',
    opacity: 0.7,
  },
  welcomeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeySection: {
    marginBottom: 24,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Outfit-Medium',
    opacity: 0.7,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
    opacity: 0.3,
    marginHorizontal: 20,
  },
  bottomPadding: {
    height: 20,
  },
});