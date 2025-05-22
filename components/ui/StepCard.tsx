import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, Circle, Play } from 'lucide-react-native';
import { Step } from '@/types';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import DifficultyBadge from './DifficultyBadge';

interface StepCardProps {
  step: Step;
  stepNumber: number;
  onPress: () => void;
}

export default function StepCard({ step, stepNumber, onPress }: StepCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, step.completed && styles.completedContainer]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        {step.completed ? (
          <CheckCircle size={24} color={Colors.light.success} />
        ) : (
          <Circle size={24} color={Colors.light.primary} />
        )}
      </View>
      
      <View style={styles.middleContent}>
        <Text style={styles.title}>
          STEP {stepNumber}: {step.title}
        </Text>
        <Text style={styles.description}>{step.description}</Text>
        <View style={styles.badgeContainer}>
          <DifficultyBadge level={step.difficulty} size="small" />
        </View>
      </View>
      
      <TouchableOpacity style={styles.playButton} onPress={onPress}>
        <Play size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  completedContainer: {
    backgroundColor: '#F8FAF8',
    borderColor: Colors.light.success,
    borderWidth: 1,
  },
  leftContent: {
    marginRight: 12,
  },
  middleContent: {
    flex: 1,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});