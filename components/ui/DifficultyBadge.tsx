// components/ui/DifficultyBadge.tsx - Enhanced Version
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Zap, Target, Flame, Sparkles } from 'lucide-react-native';
import { DifficultyLevel } from '@/types';
import { difficultyStyles } from '@/constants/Styles';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  showDescription?: boolean;
  animated?: boolean;
}

export default function DifficultyBadge({ 
  level, 
  size = 'medium',
  showIcon = true,
  showDescription = false,
  animated = false
}: DifficultyBadgeProps) {
  
  const getDifficultyConfig = (level: DifficultyLevel) => {
    const configs = {
      veryEasy: {
        text: 'VERY EASY',
        icon: Star,
        colors: ['#E8F5E8', '#C8E6C9'],
        textColor: '#2E7D32',
        borderColor: '#4CAF50',
        description: 'Perfect for beginners',
        emoji: '🌱'
      },
      easy: {
        text: 'EASY',
        icon: Target,
        colors: ['#E0F7FA', '#B2EBF2'],
        textColor: '#00695C',
        borderColor: '#26A69A',
        description: 'Great for building confidence',
        emoji: '🎯'
      },
      medium: {
        text: 'MEDIUM',
        icon: Zap,
        colors: ['#FFF8E1', '#FFECB3'],
        textColor: '#E65100',
        borderColor: '#FF9800',
        description: 'Standard challenge level',
        emoji: '⚡'
      },
      hard: {
        text: 'HARD',
        icon: Flame,
        colors: ['#FFF3E0', '#FFE0B2'],
        textColor: '#E65100',
        borderColor: '#FF5722',
        description: 'For confident learners',
        emoji: '🔥'
      },
      veryHard: {
        text: 'VERY HARD',
        icon: Sparkles,
        colors: ['#FCE4EC', '#F8BBD9'],
        textColor: '#C2185B',
        borderColor: '#E91E63',
        description: 'Master level challenge',
        emoji: '💎'
      }
    };
    return configs[level];
  };

  const getSizeConfig = (size: string) => {
    const configs = {
      small: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 10,
        iconSize: 12,
        borderWidth: 1
      },
      medium: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        fontSize: 12,
        iconSize: 14,
        borderWidth: 1.5
      },
      large: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        fontSize: 14,
        iconSize: 16,
        borderWidth: 2
      }
    };
    return configs[size];
  };

  const difficulty = getDifficultyConfig(level);
  const sizeConfig = getSizeConfig(size);
  const IconComponent = difficulty.icon;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={difficulty.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.badge,
          {
            paddingHorizontal: sizeConfig.paddingHorizontal,
            paddingVertical: sizeConfig.paddingVertical,
            borderRadius: sizeConfig.borderRadius,
            borderWidth: sizeConfig.borderWidth,
            borderColor: difficulty.borderColor,
          }
        ]}
      >
        <View style={styles.badgeContent}>
          {showIcon && (
            <View style={styles.iconContainer}>
              <Text style={[styles.emoji, { fontSize: sizeConfig.iconSize }]}>
                {difficulty.emoji}
              </Text>
              <IconComponent 
                size={sizeConfig.iconSize} 
                color={difficulty.textColor}
                strokeWidth={2}
              />
            </View>
          )}
          
          <Text style={[
            styles.text,
            {
              color: difficulty.textColor,
              fontSize: sizeConfig.fontSize,
            }
          ]}>
            {difficulty.text}
          </Text>
        </View>
      </LinearGradient>
      
      {showDescription && (
        <Text style={[styles.description, { color: difficulty.textColor }]}>
          {difficulty.description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  emoji: {
    marginRight: 2,
  },
  text: {
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    marginTop: 4,
    opacity: 0.8,
  },
});