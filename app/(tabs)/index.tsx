import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockSeasons, mockProgressStats } from '@/data/mockData';
import TeddyMascot from '@/components/ui/TeddyMascot';
import ProgressPath from '@/components/ui/ProgressPath';
import SeasonCard from '@/components/ui/SeasonCard';
import ProgressSummary from '@/components/ui/ProgressSummary';
import { Episode } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTeddy } from '@/contexts/TeddyContext';
import { useLearning } from '@/contexts/LearningContext';

export default function LearningDashboard() {
  const [currentSeason] = useState(mockSeasons[0]);
  const [apiTest, setApiTest] = useState('Testing...');
  const { currentUser, logout } = useAuth();
  const { teddy, isConnected } = useTeddy();
  const { progress } = useLearning();

  // Test API connection
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API connection...');
        // Use the same IP as your .env file
        const response = await fetch('http://192.168.29.132:5000/api/test'); // Replace with your IP
        const data = await response.json();
        setApiTest('✅ API Connected: ' + data.message);
        console.log('API test successful:', data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setApiTest('❌ API Failed: ' + errorMessage);
        console.error('API test failed:', error);
      }
    };

    testAPI();
  }, []);

  const handleEpisodePress = (episode: Episode) => {
    router.push({
      pathname: "/episode/[id]",
      params: { id: episode.id }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back{currentUser?.displayName ? `, ${currentUser.displayName}` : ''}!</Text>
          <Text style={styles.title}>Learning Dashboard</Text>
          
          {/* API Test Status */}
          <View style={styles.apiTestContainer}>
            <Text style={styles.apiTestText}>{apiTest}</Text>
          </View>
          
          <TeddyMascot 
            message={isConnected ? "Ready to continue our learning journey?" : "Let's connect your teddy bear!"}
            size="small"
          />
        </View>

        <ProgressSummary stats={mockProgressStats} />

        <SeasonCard season={currentSeason} />

        <View style={styles.episodeSection}>
          <Text style={styles.sectionTitle}>Episodes</Text>
          <View style={styles.pathContainer}>
            <ProgressPath 
              episodes={currentSeason.episodes} 
              onEpisodePress={handleEpisodePress}
            />
          </View>
        </View>

        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => handleEpisodePress(currentSeason.episodes[1])}
          >
            <View style={styles.continueCardContent}>
              <View>
                <Text style={styles.continueTitle}>
                  Episode {currentSeason.episodes[1].number}: {currentSeason.episodes[1].title}
                </Text>
                <Text style={styles.continueDescription}>
                  {currentSeason.episodes[1].description}
                </Text>
                <Text style={styles.continueStats}>
                  {currentSeason.episodes[1].duration} MINS • {currentSeason.episodes[1].steps.length} STEPS
                </Text>
              </View>
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>START</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick logout for testing */}
        <View style={styles.debugSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.select({
      android: StatusBar.currentHeight,
      ios: 0,
      web: 0,
    }),
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.select({
      ios: 60,
      android: 16,
      web: 60,
    }),
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 16,
  },
  apiTestContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  apiTestText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
  },
  episodeSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 16,
  },
  pathContainer: {
    marginBottom: 16,
  },
  recommendedSection: {
    marginBottom: 40,
  },
  continueCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  continueCardContent: {
    padding: 16,
  },
  continueTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
  },
  continueDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 12,
  },
  continueStats: {
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
    color: Colors.light.primary,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: '#FFFFFF',
  },
  debugSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: Colors.light.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
});