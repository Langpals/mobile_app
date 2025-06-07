// components/achievements/AchievementComponents.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Zap, Target, BookOpen, Clock, Heart, Award, X, Lock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Achievement } from '@/types/achievements';

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

  type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
  const getRarityConfig = (rarity: string) => {
    const configs: Record<Rarity, { borderColor: string; glowColor: string }> = {
      common: { borderColor: '#B0BEC5', glowColor: '#ECEFF1' },
      rare: { borderColor: '#42A5F5', glowColor: '#E3F2FD' },
      epic: { borderColor: '#AB47BC', glowColor: '#F3E5F5' },
      legendary: { borderColor: '#FF7043', glowColor: '#FFF3E0' }
    };
    if (['common', 'rare', 'epic', 'legendary'].includes(rarity)) {
      return configs[rarity as Rarity];
    }
    return configs.common;
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

// Achievement Progress Card
interface AchievementProgressCardProps {
  achievement: Achievement;
  onPress?: () => void;
}

export function AchievementProgressCard({ achievement, onPress }: AchievementProgressCardProps) {
  const progressPercentage = (achievement.progress / achievement.requirement) * 100;
  const IconComponent = achievement.icon;

  return (
    <TouchableOpacity style={styles.progressCard} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={achievement.unlocked ? 
          [achievement.color + '10', Colors.light.cardBackground] :
          [Colors.light.cardBackground, Colors.light.background]
        }
        style={styles.progressCardGradient}
      >
        <View style={styles.progressCardHeader}>
          <View style={[
            styles.progressCardIcon,
            { backgroundColor: achievement.unlocked ? achievement.color : Colors.light.border }
          ]}>
            {achievement.unlocked ? (
              <IconComponent size={20} color="#FFFFFF" />
            ) : (
              <Lock size={20} color={Colors.light.text} />
            )}
          </View>
          
          <View style={styles.progressCardInfo}>
            <Text style={[
              styles.progressCardTitle,
              !achievement.unlocked && styles.progressCardTitleLocked
            ]}>
              {achievement.title}
            </Text>
            <Text style={[
              styles.progressCardDescription,
              !achievement.unlocked && styles.progressCardDescriptionLocked
            ]}>
              {achievement.description}
            </Text>
          </View>
          
          <View style={styles.progressCardPoints}>
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
          <View style={styles.progressCardProgress}>
            <View style={styles.progressCardBar}>
              <View 
                style={[
                  styles.progressCardFill,
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: achievement.color
                  }
                ]}
              />
            </View>
            <Text style={styles.progressCardText}>
              {achievement.progress}/{achievement.requirement} - {Math.round(progressPercentage)}%
            </Text>
          </View>
        )}
        
        {achievement.unlocked && achievement.unlockedDate && (
          <View style={styles.progressCardUnlocked}>
            <Star size={14} color={achievement.color} />
            <Text style={[styles.unlockedText, { color: achievement.color }]}>
              Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// Achievement Category Header
interface AchievementCategoryHeaderProps {
  category: string;
  achievements: Achievement[];
  color: string;
  icon: any;
}

export function AchievementCategoryHeader({ category, achievements, color, icon }: AchievementCategoryHeaderProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const percentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
  const IconComponent = icon;

  return (
    <View style={styles.categoryHeader}>
      <View style={styles.categoryHeaderLeft}>
        <View style={[styles.categoryHeaderIcon, { backgroundColor: color + '20' }]}>
          <IconComponent size={20} color={color} />
        </View>
        <View style={styles.categoryHeaderInfo}>
          <Text style={styles.categoryHeaderTitle}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
          <Text style={styles.categoryHeaderCount}>
            {unlockedCount}/{totalCount} completed
          </Text>
        </View>
      </View>
      
      <View style={styles.categoryHeaderRight}>
        <Text style={[styles.categoryHeaderPercentage, { color }]}>
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  progressCard: {
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  progressCardGradient: {
    padding: 16,
  },
  progressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressCardInfo: {
    flex: 1,
  },
  progressCardTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 2,
  },
  progressCardTitleLocked: {
    opacity: 0.6,
  },
  progressCardDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
  },
  progressCardDescriptionLocked: {
    opacity: 0.5,
  },
  progressCardPoints: {
    alignItems: 'center',
  },
  pointsText: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
  },
  pointsLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.6,
  },
  progressCardProgress: {
    marginTop: 8,
  },
  progressCardBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressCardFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressCardText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.7,
  },
  progressCardUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  unlockedText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    marginLeft: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryHeaderInfo: {
    flex: 1,
  },
  categoryHeaderTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
  },
  categoryHeaderCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  categoryHeaderRight: {
    alignItems: 'center',
  },
  categoryHeaderPercentage: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
  },
});