// data/achievementsData.ts
import { Achievement } from '@/types/achievements';
import { Trophy, Star, Zap, Target, BookOpen, Clock, Heart, Award } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export const achievementsList: Achievement[] = [
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
  {
    id: 'season_complete',
    title: 'Island Explorer',
    description: 'Complete Season 1: Magic Island Adventures',
    category: 'special',
    icon: Trophy,
    color: Colors.light.primary,
    requirement: 1,
    progress: 0,
    unlocked: false,
    rarity: 'epic',
    points: 300
  },
  {
    id: 'pronunciation_master',
    title: 'Pronunciation Pro',
    description: 'Achieve 90% pronunciation accuracy',
    category: 'learning',
    icon: Target,
    color: Colors.light.secondary,
    requirement: 90,
    progress: 78,
    unlocked: false,
    rarity: 'rare',
    points: 125
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a lesson before 9 AM',
    category: 'special',
    icon: Star,
    color: Colors.light.warning,
    requirement: 1,
    progress: 0,
    unlocked: false,
    rarity: 'common',
    points: 20
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a lesson after 9 PM',
    category: 'special',
    icon: Star,
    color: Colors.light.accent,
    requirement: 1,
    progress: 0,
    unlocked: false,
    rarity: 'common',
    points: 20
  },
  {
    id: 'culture_enthusiast',
    title: 'Culture Enthusiast',
    description: 'Learn about 5 Spanish-speaking countries',
    category: 'special',
    icon: Heart,
    color: Colors.light.error,
    requirement: 5,
    progress: 1,
    unlocked: false,
    rarity: 'rare',
    points: 100
  }
];

// Helper functions
export const getUnlockedAchievements = (): Achievement[] => {
  return achievementsList.filter(achievement => achievement.unlocked);
};

export const getRecentAchievements = (count: number = 5): Achievement[] => {
  return achievementsList
    .filter(achievement => achievement.unlocked)
    .sort((a, b) => {
      if (!a.unlockedDate || !b.unlockedDate) return 0;
      return new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime();
    })
    .slice(0, count);
};

export const getTotalPoints = (): number => {
  return achievementsList
    .filter(achievement => achievement.unlocked)
    .reduce((total, achievement) => total + achievement.points, 0);
};

export const getAchievementsByCategory = (category: string): Achievement[] => {
  return achievementsList.filter(achievement => achievement.category === category);
};

export const getProgressPercentage = (): number => {
  const totalAchievements = achievementsList.length;
  const unlockedAchievements = achievementsList.filter(a => a.unlocked).length;
  return Math.round((unlockedAchievements / totalAchievements) * 100);
};

export const getNextAchievementToUnlock = (): Achievement | null => {
  const lockedAchievements = achievementsList
    .filter(achievement => !achievement.unlocked)
    .sort((a, b) => {
      const aProgress = (a.progress / a.requirement) * 100;
      const bProgress = (b.progress / b.requirement) * 100;
      return bProgress - aProgress;
    });
  
  return lockedAchievements[0] || null;
};

export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: Colors.light.text,
    rare: Colors.light.secondary,
    epic: Colors.light.warning,
    legendary: Colors.light.error
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

export const getRarityGradient = (rarity: string): string[] => {
  const gradients = {
    common: [Colors.light.background, Colors.light.border],
    rare: [Colors.light.secondary + '20', Colors.light.secondary + '10'],
    epic: [Colors.light.warning + '20', Colors.light.warning + '10'],
    legendary: [Colors.light.error + '20', Colors.light.error + '10']
  };
  return gradients[rarity as keyof typeof gradients] || gradients.common;
};