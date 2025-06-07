// app/achievements/index.tsx - Full Achievements Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Trophy, Star, Zap, Target, BookOpen, Clock, Heart, Award } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { 
  AchievementBadge, 
  AchievementDetailModal, 
  AchievementProgressCard,
  AchievementCategoryHeader 
} from '@/components/achievements/AchievementComponents';
import { 
  achievementsList, 
  getUnlockedAchievements, 
  getTotalPoints, 
  getAchievementsByCategory,
  getProgressPercentage,
  getNextAchievementToUnlock
} from '@/data/achievementsData';
import { Achievement } from '@/types/achievements';

const { width } = Dimensions.get('window');

export default function AchievementsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const categories = [
    { id: 'all', label: 'All', icon: Trophy, color: Colors.light.primary },
    { id: 'learning', label: 'Learning', icon: Star, color: Colors.light.primary },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen, color: Colors.light.secondary },
    { id: 'streak', label: 'Streaks', icon: Zap, color: Colors.light.warning },
    { id: 'time', label: 'Time', icon: Clock, color: Colors.light.accent },
    { id: 'special', label: 'Special', icon: Heart, color: Colors.light.error },
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievementsList 
    : getAchievementsByCategory(selectedCategory);

  const unlockedCount = getUnlockedAchievements().length;
  const totalPoints = getTotalPoints();
  const progressPercentage = getProgressPercentage();
  const nextAchievement = getNextAchievementToUnlock();

  const handleAchievementPress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setModalVisible(true);
  };

  const renderOverviewStats = () => (
    <View style={styles.overviewSection}>
      <LinearGradient
        colors={[Colors.light.primary + '15', Colors.light.cardBackground]}
        style={styles.overviewCard}
      >
        <View style={styles.overviewHeader}>
          <Trophy size={28} color={Colors.light.warning} />
          <Text style={styles.overviewTitle}>Achievement Progress</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{unlockedCount}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{achievementsList.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.light.primary }]}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
        
        <View style={styles.progressOverview}>
          <View style={styles.progressOverviewHeader}>
            <Text style={styles.progressOverviewText}>Overall Progress</Text>
            <Text style={[styles.progressPercentageText, { color: Colors.light.primary }]}>
              {progressPercentage}%
            </Text>
          </View>
          
          <View style={styles.progressBarLarge}>
            <View 
              style={[
                styles.progressFillLarge,
                { width: `${progressPercentage}%` }
              ]}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderNextToUnlock = () => {
    if (!nextAchievement) return null;
    
    return (
      <View style={styles.nextToUnlockSection}>
        <Text style={styles.sectionTitle}>Next to Unlock</Text>
        <AchievementProgressCard 
          achievement={nextAchievement}
          onPress={() => handleAchievementPress(nextAchievement)}
        />
      </View>
    );
  };

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryScroll}
      contentContainerStyle={styles.categoryScrollContent}
    >
      {categories.map((category) => {
        const IconComponent = category.icon;
        const isSelected = selectedCategory === category.id;
        const categoryAchievements = category.id === 'all' ? achievementsList : getAchievementsByCategory(category.id);
        const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;
        
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              isSelected && [styles.categoryButtonActive, { borderColor: category.color }]
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <View style={[
              styles.categoryIconContainer,
              isSelected && { backgroundColor: category.color }
            ]}>
              <IconComponent 
                size={18} 
                color={isSelected ? '#FFFFFF' : category.color} 
              />
            </View>
            <Text style={[
              styles.categoryButtonText,
              isSelected && { color: category.color, fontFamily: 'Poppins-SemiBold' }
            ]}>
              {category.label}
            </Text>
            <Text style={[
              styles.categoryCount,
              isSelected && { color: category.color }
            ]}>
              {categoryUnlocked}/{categoryAchievements.length}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderAchievementsByCategory = () => {
    if (selectedCategory === 'all') {
      // Group achievements by category when showing all
      const groupedCategories = ['learning', 'vocabulary', 'streak', 'time', 'special'];
      
      return (
        <View style={styles.achievementsContainer}>
          {groupedCategories.map(categoryId => {
            const categoryAchievements = getAchievementsByCategory(categoryId);
            if (categoryAchievements.length === 0) return null;
            
            const category = categories.find(c => c.id === categoryId)!;
            
            return (
              <View key={categoryId} style={styles.categorySection}>
                <AchievementCategoryHeader
                  category={categoryId}
                  achievements={categoryAchievements}
                  color={category.color}
                  icon={category.icon}
                />
                
                <View style={styles.achievementsGrid}>
                  {categoryAchievements.map((achievement) => (
                    <View key={achievement.id} style={styles.achievementGridItem}>
                      <AchievementBadge 
                        achievement={achievement}
                        size="large"
                        showProgress
                        onPress={() => handleAchievementPress(achievement)}
                      />
                      <Text style={styles.achievementGridTitle} numberOfLines={2}>
                        {achievement.title}
                      </Text>
                      <Text style={styles.achievementGridPoints}>
                        {achievement.points} pts
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      );
    } else {
      // Show selected category
      const category = categories.find(c => c.id === selectedCategory)!;
      
      return (
        <View style={styles.achievementsContainer}>
          <AchievementCategoryHeader
            category={selectedCategory}
            achievements={filteredAchievements}
            color={category.color}
            icon={category.icon}
          />
          
          <View style={styles.achievementsGrid}>
            {filteredAchievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementGridItem}>
                <AchievementBadge 
                  achievement={achievement}
                  size="large"
                  showProgress
                  onPress={() => handleAchievementPress(achievement)}
                />
                <Text style={styles.achievementGridTitle} numberOfLines={2}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementGridPoints}>
                  {achievement.points} pts
                </Text>
              </View>
            ))}
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.light.background, Colors.light.warning + '05', Colors.light.background]}
        style={styles.gradientBackground}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Achievements</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Overview Stats */}
          {renderOverviewStats()}

          {/* Next to Unlock */}
          {renderNextToUnlock()}

          {/* Category Filter */}
          <View style={styles.categoryFilterSection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {renderCategoryFilter()}
          </View>

          {/* Achievements Grid */}
          {renderAchievementsByCategory()}
        </ScrollView>

        {/* Achievement Detail Modal */}
        <AchievementDetailModal 
          achievement={selectedAchievement}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.select({
      android: StatusBar.currentHeight,
      ios: 0,
      web: 0,
    }),
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.light.cardBackground,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: Colors.light.text,
  },
  headerRight: {
    width: 40,
  },
  overviewSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 24,
  },
  overviewCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.light.border,
  },
  progressOverview: {
    marginTop: 8,
  },
  progressOverviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressOverviewText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
  },
  progressPercentageText: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
  },
  progressBarLarge: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  nextToUnlockSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 16,
  },
  categoryFilterSection: {
    marginBottom: 24,
  },
  categoryScroll: {
    paddingLeft: 16,
  },
  categoryScrollContent: {
    paddingRight: 16,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: Colors.light.cardBackground,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: Colors.light.text,
    opacity: 0.6,
  },
  achievementsContainer: {
    paddingHorizontal: 16,
  },
  categorySection: {
    marginBottom: 32,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  achievementGridItem: {
    width: (width - 48) / 3,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementGridTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    lineHeight: 14,
  },
  achievementGridPoints: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.7,
  },
});