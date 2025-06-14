// app/(tabs)/placeholder.tsx - Coming Soon Screen
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Heart, Star, Zap } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import TeddyMascot from '@/components/ui/TeddyMascot';

export default function PlaceholderScreen() {
  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      <LinearGradient
        colors={[Colors.light.primary + '10', Colors.light.background, Colors.light.secondary + '05']}
        style={styles.gradientBackground}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.sparkleIcon}>
              <Sparkles size={32} color={Colors.light.primary} />
            </View>
            <Text style={styles.title}>Coming Soon!</Text>
            <Text style={styles.subtitle}>Exciting new features on the way</Text>
          </View>

          {/* Teddy Mascot */}
          <View style={styles.mascotContainer}>
            <TeddyMascot 
              mood="excited" 
              size="large" 
              message="¡Hola! Amazing new features are coming soon! Keep learning and stay tuned! 🎉"
            />
          </View>

          {/* Feature Previews */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What's Coming:</Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.secondary + '20' }]}>
                  <Heart size={20} color={Colors.light.secondary} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Social Learning</Text>
                  <Text style={styles.featureDescription}>Connect with friends and family</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.success + '20' }]}>
                  <Star size={20} color={Colors.light.success} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Advanced Analytics</Text>
                  <Text style={styles.featureDescription}>Deeper insights into learning progress</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.warning + '20' }]}>
                  <Zap size={20} color={Colors.light.warning} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Mini Games</Text>
                  <Text style={styles.featureDescription}>Fun interactive learning games</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.light.accent + '20' }]}>
                  <Sparkles size={20} color={Colors.light.accent} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Story Mode</Text>
                  <Text style={styles.featureDescription}>Interactive storytelling adventures</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Encouragement */}
          <View style={styles.encouragementContainer}>
            <Text style={styles.encouragementText}>
              Keep learning with Bern and be the first to try these amazing new features!
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  gradientBackground: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sparkleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.8,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  encouragementContainer: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
});