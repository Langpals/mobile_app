// app/achievements/index.tsx - Complete Achievements Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Trophy, Star, Zap, Target, BookOpen, Clock, Heart, Award, ChevronDown, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { mockChildProfile } from '@/data/mockData';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'vocabulary' | 'streak' | 'time' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  progress: number;
  requirement: number;
  unlockedDate?: string;
  color: string;
}

interface CollapsibleSectionProps {
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  count: number;
  unlockedCount: number;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon: IconComponent, 
  color, 
  children, 
  defaultExpanded = false,
  count,
  unlockedCount
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity style={styles.categoryHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.categoryHeaderLeft}>
          <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
            <IconComponent size={18} color={color} />
          </View>
          <Text style={styles.categoryTitle}>{title}</Text>
          <View style={[styles.countBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.countText, { color: color }]}>
              {unlockedCount}/{count}
            </Text>
          </View>
        </View>
        {isExpanded ? (
          <ChevronDown size={20} color={Colors.light.text} />
        ) : (
          <ChevronRight size={20} color={Colors.light.text} />
        )}
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.categoryContent}>
          {children}
        </View>
      )}
    </View>
  );
};

const AchievementCard: React.FC<{ achievement: Achievement; onPress: () => void }> = ({ achievement, onPress }) => {
  const progressPercentage = Math.min((achievement.progress / achievement.requirement) * 100, 100);

  return (
    <TouchableOpacity style={styles.achievementCard} onPress={onPress}>
      <LinearGradient
        colors={achievement.unlocked ? 
          [achievement.color + '20', achievement.color + '05'] : 
          [Colors.light.border, Colors.light.cardBackground]
        }
        style={styles.achievementGradient}
      >
        <View style={styles.achievementHeader}>
          <View style={[
            styles.achievementIconContainer,
            { backgroundColor: achievement.unlocked ? achievement.color + '20' : Colors.light.border }
          ]}>
            {achievement.unlocked ? (
              <Trophy size={20} color={achievement.color} />
            ) : (
              <Target size={20} color={Colors.light.text} />
            )}
          </View>
          
          <View style={styles.achievementInfo}>
            <Text style={[
              styles.achievementTitle,
              { opacity: achievement.unlocked ? 1 : 0.6 }
            ]}>
              {achievement.title}
            </Text>
            <Text style={[
              styles.achievementDescription,
              { opacity: achievement.unlocked ? 0.8 : 0.5 }
            ]}>
              {achievement.description}
            </Text>
          </View>
          
          <View style={styles.achievementPoints}>
            <Text style={[
              styles.pointsText,
              { color: achievement.unlocked ? achievement.color : Colors.light.text }
            ]}>
              {achievement.points}
            </Text>
            <Text style={styles.pointsLabel}>pts</Text>
          </View>
        </View>
        
        {!achievement.unlocked && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: achievement.color
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {achievement.progress}/{achievement.requirement} - {Math.round(progressPercentage)}%
            </Text>
          </View>
        )}
        
        {achievement.unlocked && achievement.unlockedDate && (
          <View style={styles.unlockedContainer}>
            <Star size={14} color={achievement.color} />
            <Text style={[styles.unlockedText, { color: achievement.color }]}>
              Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function AchievementsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first episode',
      category: 'learning',
      rarity: 'common',
      points: 50,
      unlocked: true,
      progress: 1,
      requirement: 1,
      unlockedDate: '2024-01-15',
      color: Colors.light.primary,
    },
    {
      id: '2',
      title: 'Word Explorer',
      description: 'Learn 10 new words',
      category: 'vocabulary',
      rarity: 'common',
      points: 25,
      unlocked: true,
      progress: 15,
      requirement: 10,
      unlockedDate: '2024-01-16',
      color: Colors.light.secondary,
    },
    {
      id: '3',
      title: 'Streak Master',
      description: 'Maintain a 3-day learning streak',
      category: 'streak',
      rarity: 'rare',
      points: 75,
      unlocked: true,
      progress: 3,
      requirement: 3,
      unlockedDate: '2024-01-17',
      color: Colors.light.warning,
    },
    {
      id: '4',
      title: 'Vocabulary Champion',
      description: 'Learn 50 words',
      category: 'vocabulary',
      rarity: 'epic',
      points: 150,
      unlocked: false,
      progress: 15,
      requirement: 50,
      color: Colors.light.secondary,
    },
    {
      id: '5',
      title: 'Speed Learner',
      description: 'Complete an episode in under 10 minutes',
      category: 'time',
      rarity: 'rare',
      points: 100,
      unlocked: false,
      progress: 0,
      requirement: 1,
      color: Colors.light.accent,
    },
    {
      id: '6',
      title: 'Perfect Week',
      description: 'Complete learning activities every day for a week',
      category: 'streak',
      rarity: 'legendary',
      points: 300,
      unlocked: false,
      progress: 3,
      requirement: 7,
      color: Colors.light.warning,
    },
  ];

  const categories = [
    { id: 'learning', label: 'Learning', icon: Star, color: Colors.light.primary },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen, color: Colors.light.secondary },
    { id: 'streak', label: 'Streaks', icon: Zap, color: Colors.light.warning },
    { id: 'time', label: 'Time', icon: Clock, color: Colors.light.accent },
    { id: 'special', label: 'Special', icon: Heart, color: Colors.light.error },
  ];

  const getAchievementsByCategory = (category: string) => {
    return achievements.filter(a => a.category === category);
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const progressPercentage = Math.round((unlockedCount / achievements.length) * 100);

  const handleAchievementPress = (achievement: Achievement) => {
    // Show achievement detail modal or navigate to detail screen
    console.log('Achievement pressed:', achievement.title);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Achievements</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Overview Stats */}
        <View style={styles.overviewSection}>
          <LinearGradient
            colors={[Colors.light.warning + '15', Colors.light.cardBackground]}
            style={styles.overviewCard}
          >
            <View style={styles.overviewHeader}>
              <Trophy size={28} color={Colors.light.warning} />
              <Text style={styles.overviewTitle}>{mockChildProfile.name}'s Progress</Text>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{unlockedCount}</Text>
                <Text style={styles.statLabel}>Unlocked</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{achievements.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalPoints}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{progressPercentage}%</Text>
                <Text style={styles.statLabel}>Complete</Text>
              </View>
            </View>
            
            <View style={styles.overallProgressBar}>
              <View 
                style={[
                  styles.overallProgressFill,
                  { width: `${progressPercentage}%` }
                ]}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Achievement Categories */}
        {categories.map(category => {
          const categoryAchievements = getAchievementsByCategory(category.id);
          const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;
          
          return (
            <CollapsibleSection
              key={category.id}
              title={category.label}
              icon={category.icon}
              color={category.color}
              count={categoryAchievements.length}
              unlockedCount={categoryUnlocked}
              defaultExpanded={category.id === 'learning'}
            >
              {categoryAchievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onPress={() => handleAchievementPress(achievement)}
                />
              ))}
            </CollapsibleSection>
          );
        })}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  overviewSection: {
    marginBottom: 24,
  },
  overviewCard: {
    borderRadius: 16,
    padding: 20,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.warning,
    borderRadius: 4,
  },
  collapsibleContainer: {
    marginBottom: 16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    flex: 1,
  },
  countBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  categoryContent: {
    padding: 16,
    paddingTop: 0,
    gap: 8,
  },
  achievementCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  achievementGradient: {
    padding: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
    lineHeight: 16,
  },
  achievementPoints: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  pointsLabel: {
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  unlockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  unlockedText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
});