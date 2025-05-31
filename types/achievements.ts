// types/achievements.ts and components/achievements - Achievement System
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Zap, Target, BookOpen, Clock, Heart, Award, X, Lock } from 'lucide-react-native';
import Colors from '@/constants/Colors';

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'streak' | 'vocabulary' | 'time' | 'special';
  icon: any;
  color: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
}

// Mock Achievements Data
export const mockAchievements: Achievement[] = [
  {
    id: 'first_episode',
    title: 'First Adventure',
    description: 'Complete your first episode with Bern',
    category: 'learning',
    icon: Star,
    color: Colors.light.primary,
    requirement: 1,
    progress: 1,
    unlocked: true,
    unlockedDate: '2024-01-15',
    rarity: 'common',
    points: 10
  },
  {
    id: 'vocabulary_master_10',
    title: 'Word Collector',
    description: 'Learn 10 new Spanish words',
    category: 'vocabulary',
    icon: BookOpen,
    color: Colors.light.secondary,
    requirement: 10,
    progress: 15,
    unlocked: true,
    unlockedDate: '2024-01-16',
    rarity: 'common',
    points: 25
  },
  {
    id: 'streak_3',
    title: 'Learning Streak',
    description: 'Practice Spanish for 3 days in a row',
    category: 'streak',
    icon: Zap,
    color: Colors.light.warning,
    requirement: 3,
    progress: 3,
    unlocked: true,
    unlockedDate: '2024-01-17',
    rarity: 'rare',
    points: 50
  },
  {
    id: 'time_spent_60',
    title: 'Dedicated Learner',
    description: 'Spend 60 minutes learning Spanish',
    category: 'time',
    icon: Clock,
    color: Colors.light.accent,
    requirement: 60,
    progress: 85,
    unlocked: true,
    unlockedDate: '2024-01-18',
    rarity: 'rare',
    points: 75
  },
  {
    id: 'perfect_episode',
    title: 'Perfect Performance',
    description: 'Complete an episode with 100% accuracy',
    category: 'learning',
    icon: Target,
    color: Colors.light.success,
    requirement: 1,
    progress: 0,
    unlocked: false,
    rarity: 'epic',
    points: 100
  },
  {
    id: 'vocabulary_master_50',
    title: 'Vocabulary Wizard',
    description: 'Master 50 Spanish words',
    category: 'vocabulary',
    icon: Trophy,
    color: Colors.light.warning,
    requirement: 50,
    progress: 15,
    unlocked: false,
    rarity: 'epic',
    points: 150
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Practice Spanish for 7 days straight',
    category: 'streak',
    icon: Award,
    color: Colors.light.error,
    requirement: 7,
    progress: 3,
    unlocked: false,
    rarity: 'legendary',
    points: 200
  },
];

// Achievement Badge Component
interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  showProgress?: boolean;
}

export function AchievementBadge({ achievement, size = 'medium', onPress, showProgress = false }: AchievementBadgeProps) {
  const [bounceAnimation] = useState(new Animated.Value(1));

  const getSizeConfig = () => {
    const configs = {
      small: { size: 40, iconSize: 20, fontSize: 10 },
      medium: { size: 60, iconSize: 24, fontSize: 12 },
      large: { size: 80, iconSize: 32, fontSize: 14 }
    };
    return configs[size];
  };

  const getRarityConfig = (rarity: string) => {
    const configs = {
      common: { borderColor: '#B0BEC5', glowColor: '#ECEFF1' },
      rare: { borderColor: '#42A5F5', glowColor: '#E3F2FD' },
      epic: { borderColor: '#AB47BC', glowColor: '#F3E5F5' },
      legendary: { borderColor: '#FF7043', glowColor: '#FFF3E0' }
    };
    return configs[rarity] || configs.common;
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(bounceAnimation, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(bounceAnimation, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    if (onPress) onPress();
  };

  const sizeConfig = getSizeConfig();
  const rarityConfig = getRarityConfig(achievement.rarity);
  const IconComponent = achievement.icon;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View 
        style={[
          styles.achievementBadge,
          {
            width: sizeConfig.size,
            height: sizeConfig.size,
            borderRadius: sizeConfig.size / 2,
            transform: [{ scale: bounceAnimation }]
          }
        ]}
      >
        {achievement.unlocked ? (
          <LinearGradient
            colors={[achievement.color, achievement.color + 'CC']}
            style={[styles.achievementGradient, { borderColor: rarityConfig.borderColor }]}
          >
            <View style={[styles.achievementGlow, { backgroundColor: rarityConfig.glowColor }]} />
            <IconComponent size={sizeConfig.iconSize} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        ) : (
          <View style={[styles.achievementLocked, { borderColor: rarityConfig.borderColor }]}>
            <Lock size={sizeConfig.iconSize} color="#999" />
          </View>
        )}
        
        {showProgress && !achievement.unlocked && (
          <View style={styles.progressRing}>
            <View 
              style={[
                styles.progressSegment,
                { 
                  borderTopColor: achievement.color,
                  transform: [{ rotate: `${(achievement.progress / achievement.requirement) * 360}deg` }]
                }
              ]}
            />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

// Achievement Detail Modal
interface AchievementDetailModalProps {
  achievement: Achievement | null;
  visible: boolean;
  onClose: () => void;
}

export function AchievementDetailModal({ achievement, visible, onClose }: AchievementDetailModalProps) {
  if (!achievement) return null;

  const progressPercentage = (achievement.progress / achievement.requirement) * 100;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.light.text} />
          </TouchableOpacity>
          
          <View style={styles.modalHeader}>
            <AchievementBadge achievement={achievement} size="large" />
            <Text style={styles.modalTitle}>{achievement.title}</Text>
            <Text style={styles.modalDescription}>{achievement.description}</Text>
          </View>
          
          <View style={styles.modalStats}>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>Rarity</Text>
              <View style={[styles.rarityBadge, { backgroundColor: achievement.color + '20' }]}>
                <Text style={[styles.rarityText, { color: achievement.color }]}>
                  {achievement.rarity.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>Points</Text>
              <Text style={[styles.modalStatValue, { color: achievement.color }]}>
                {achievement.points}
              </Text>
            </View>
            
            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>Progress</Text>
              <Text style={styles.modalStatValue}>
                {achievement.progress}/{achievement.requirement}
              </Text>
            </View>
          </View>
          
          {!achievement.unlocked && (
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>Progress to unlock</Text>
              <View style={styles.progressBarLarge}>
                <View 
                  style={[
                    styles.progressFillLarge,
                    { 
                      width: `${Math.min(progressPercentage, 100)}%`,
                      backgroundColor: achievement.color
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(progressPercentage)}% complete
              </Text>
            </View>
          )}
          
          {achievement.unlocked && achievement.unlockedDate && (
            <View style={styles.unlockedSection}>
              <Text style={styles.unlockedLabel}>Unlocked on</Text>
              <Text style={styles.unlockedDate}>
                {new Date(achievement.unlockedDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// Main Achievements Screen Component
export function AchievementsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'learning', label: 'Learning', icon: Star },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
    { id: 'streak', label: 'Streaks', icon: Zap },
    { id: 'time', label: 'Time', icon: Clock },
    { id: 'special', label: 'Special', icon: Heart },
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? mockAchievements 
    : mockAchievements.filter(a => a.category === selectedCategory);

  const unlockedCount = mockAchievements.filter(a => a.unlocked).length;
  const totalPoints = mockAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  const handleAchievementPress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Trophy size={20} color={Colors.light.warning} />
            <Text style={styles.headerStatValue}>{unlockedCount}/{mockAchievements.length}</Text>
            <Text style={styles.headerStatLabel}>Unlocked</Text>
          </View>
          <View style={styles.headerStat}>
            <Star size={20} color={Colors.light.primary} />
            <Text style={styles.headerStatValue}>{totalPoints}</Text>
            <Text style={styles.headerStatLabel}>Points</Text>
          </View>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                isSelected && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <IconComponent 
                size={16} 
                color={isSelected ? '#FFFFFF' : Colors.light.text} 
              />
              <Text style={[
                styles.categoryButtonText,
                isSelected && styles.categoryButtonTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Achievements Grid */}
      <ScrollView style={styles.achievementsScroll}>
        <View style={styles.achievementsGrid}>
          {filteredAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <AchievementBadge 
                achievement={achievement}
                size="large"
                showProgress
                onPress={() => handleAchievementPress(achievement)}
              />
              <Text style={styles.achievementItemTitle} numberOfLines={2}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementItemProgress}>
                {achievement.unlocked ? 'Unlocked!' : `${achievement.progress}/${achievement.requirement}`}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Achievement Detail Modal */}
      <AchievementDetailModal 
        achievement={selectedAchievement}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 12,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 20,
  },
  headerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  headerStatValue: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
    marginHorizontal: 6,
  },
  headerStatLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryScrollContent: {
    paddingHorizontal: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    marginLeft: 6,
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  achievementsScroll: {
    flex: 1,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '48%',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementItemTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  achievementItemProgress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  achievementBadge: {
    position: 'relative',
  },
  achievementGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  achievementGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 999,
    opacity: 0.3,
  },
  achievementLocked: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  progressRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 999,
  },
  progressSegment: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 43,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transformOrigin: 'bottom',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  modalStatValue: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  progressBarLarge: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFillLarge: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  unlockedSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  unlockedLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  unlockedDate: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.success,
    marginTop: 4,
  },
});