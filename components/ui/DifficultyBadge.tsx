// components/ui/DifficultyBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DifficultyLevel } from '@/types';
import Colors from '@/constants/Colors';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  size?: 'small' | 'medium' | 'large';
}

export default function DifficultyBadge({ level, size = 'medium' }: DifficultyBadgeProps) {
  const getDifficultyConfig = () => {
    switch (level) {
      case 'veryEasy':
        return {
          label: 'VERY EASY',
          backgroundColor: Colors.light.success + '20',
          textColor: Colors.light.success,
          borderColor: Colors.light.success + '30',
        };
      case 'easy':
        return {
          label: 'EASY',
          backgroundColor: Colors.light.success + '20',
          textColor: Colors.light.success,
          borderColor: Colors.light.success + '30',
        };
      case 'medium':
        return {
          label: 'MEDIUM',
          backgroundColor: Colors.light.warning + '20',
          textColor: Colors.light.warning,
          borderColor: Colors.light.warning + '30',
        };
      case 'hard':
        return {
          label: 'HARD',
          backgroundColor: Colors.light.primary + '20',
          textColor: Colors.light.primary,
          borderColor: Colors.light.primary + '30',
        };
      case 'veryHard':
        return {
          label: 'VERY HARD',
          backgroundColor: Colors.light.error + '20',
          textColor: Colors.light.error,
          borderColor: Colors.light.error + '30',
        };
      default:
        return {
          label: 'EASY',
          backgroundColor: Colors.light.success + '20',
          textColor: Colors.light.success,
          borderColor: Colors.light.success + '30',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 6,
          paddingVertical: 2,
          fontSize: 9,
          borderRadius: 6,
        };
      case 'medium':
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          fontSize: 10,
          borderRadius: 8,
        };
      case 'large':
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          fontSize: 12,
          borderRadius: 10,
        };
      default:
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          fontSize: 10,
          borderRadius: 8,
        };
    }
  };

  const config = getDifficultyConfig();
  const sizeStyle = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
          borderRadius: sizeStyle.borderRadius,
        }
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: config.textColor,
            fontSize: sizeStyle.fontSize,
          }
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'LilitaOne',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});