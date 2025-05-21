import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DifficultyLevel } from '@/types';
import { difficultyStyles } from '@/constants/Styles';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  size?: 'small' | 'medium';
}

export default function DifficultyBadge({ level, size = 'medium' }: DifficultyBadgeProps) {
  const difficulty = difficultyStyles[level];
  
  return (
    <View style={[
      styles.badge, 
      { backgroundColor: difficulty.backgroundColor },
      size === 'small' ? styles.smallBadge : styles.mediumBadge
    ]}>
      <Text style={[
        styles.text, 
        { color: difficulty.color },
        size === 'small' ? styles.smallText : styles.mediumText
      ]}>
        {difficulty.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  mediumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
  },
  mediumText: {
    fontSize: 12,
  },
  smallText: {
    fontSize: 10,
  },
});