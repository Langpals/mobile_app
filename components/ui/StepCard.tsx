// components/ui/StepCard.tsx - Complete Enhanced Version
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Circle, Play, Clock, BookOpen, Mic, Target, Star, Users, Volume2 } from 'lucide-react-native';
import { Step } from '@/types';
import Colors from '@/constants/Colors';
import DifficultyBadge from './DifficultyBadge';

interface StepCardProps {
  step: Step;
  stepNumber: number;
  onPress: () => void;
  showPreview?: boolean;
  isNext?: boolean;
}

export default function StepCard({ step, stepNumber, onPress, showPreview = false, isNext = false }: StepCardProps) {
  const [pressAnimation] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(pressAnimation, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressAnimation, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getStepTypeIcon = () => {
    switch (step.type) {
      case 'vocabulary': return BookOpen;
      case 'interaction': return Mic;
      case 'assessment': return Target;
      case 'review': return Star;
      case 'introduction': return Play;
      default: return Play;
    }
  };

  const getStepTypeColor = () => {
    switch (step.type) {
      case 'vocabulary': return Colors.light.primary;
      case 'interaction': return Colors.light.secondary;
      case 'assessment': return Colors.light.success;
      case 'review': return Colors.light.accent;
      case 'introduction': return Colors.light.warning;
      default: return Colors.light.primary;
    }
  };

  const getStepTypeLabel = () => {
    return step.type.charAt(0).toUpperCase() + step.type.slice(1);
  };

  const IconComponent = getStepTypeIcon();
  const stepColor = getStepTypeColor();

  return (
    <Animated.View 
      style={[
        styles.container,
        step.completed && styles.completedContainer,
        isNext && styles.nextContainer,
        {
          transform: [{ scale: pressAnimation }]
        }
      ]}
    >
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.touchable}
      >
        <LinearGradient
          colors={
            step.completed 
              ? [Colors.light.success + '10', Colors.light.cardBackground]
              : isNext
              ? [Colors.light.primary + '10', Colors.light.cardBackground]
              : [Colors.light.cardBackground, Colors.light.cardBackground]
          }
          style={styles.cardGradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.leftHeader}>
              {/* Step Status Icon */}
              <View style={[
                styles.statusIcon,
                { 
                  backgroundColor: step.completed ? Colors.light.success + '20' : 
                                   isNext ? Colors.light.primary + '20' : Colors.light.border
                }
              ]}>
                {step.completed ? (
                  <CheckCircle size={16} color={Colors.light.success} />
                ) : isNext ? (
                  <Play size={16} color={Colors.light.primary} />
                ) : (
                  <Text style={[styles.stepNumberText, { 
                    color: Colors.light.text, 
                    opacity: 0.6 
                  }]}>
                    {stepNumber}
                  </Text>
                )}
              </View>

              {/* Step Info */}
              <View style={styles.stepInfo}>
                <View style={styles.stepTitleRow}>
                  <Text style={[
                    styles.stepTitle,
                    step.completed && styles.completedText,
                    isNext && styles.nextText
                  ]}>
                    {step.title}
                  </Text>
                  
                  {/* Step Type Badge */}
                  <View style={[styles.typeBadge, { backgroundColor: stepColor + '20' }]}>
                    <IconComponent size={12} color={stepColor} />
                    <Text style={[styles.typeText, { color: stepColor }]}>
                      {getStepTypeLabel()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Difficulty Badge */}
            <DifficultyBadge level={step.difficulty} size="small" />
          </View>

          {/* Description */}
          {showPreview && (
            <Text style={[
              styles.description,
              { opacity: step.completed ? 0.8 : isNext ? 1 : 0.6 }
            ]} numberOfLines={2}>
              {step.description}
            </Text>
          )}

          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Clock size={12} color={Colors.light.text} />
                <Text style={styles.metaText}>{step.estimatedDuration} min</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Users size={12} color={Colors.light.text} />
                <Text style={styles.metaText}>{step.interactionCount} interactions</Text>
              </View>
              
              {step.vocabularyWords.length > 0 && (
                <View style={styles.metaItem}>
                  <BookOpen size={12} color={Colors.light.text} />
                  <Text style={styles.metaText}>{step.vocabularyWords.length} words</Text>
                </View>
              )}
            </View>
          </View>

          {/* Vocabulary Preview */}
          {showPreview && step.vocabularyWords.length > 0 && (
            <View style={styles.vocabularyPreview}>
              <Text style={styles.vocabularyTitle}>New Words:</Text>
              <View style={styles.vocabularyChips}>
                {step.vocabularyWords.slice(0, 4).map((word, index) => (
                  <View key={index} style={[styles.vocabularyChip, { borderColor: stepColor + '30' }]}>
                    <Text style={[styles.vocabularyWord, { color: stepColor }]}>{word}</Text>
                    <TouchableOpacity style={styles.pronunciationIcon}>
                      <Volume2 size={10} color={stepColor} />
                    </TouchableOpacity>
                  </View>
                ))}
                {step.vocabularyWords.length > 4 && (
                  <Text style={styles.vocabularyMore}>
                    +{step.vocabularyWords.length - 4} more
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Status Footer */}
          <View style={styles.footer}>
            {step.completed ? (
              <View style={styles.completedStatus}>
                <CheckCircle size={14} color={Colors.light.success} />
                <Text style={[styles.statusText, { color: Colors.light.success }]}>
                  Completed
                </Text>
              </View>
            ) : isNext ? (
              <View style={styles.nextStatus}>
                <Play size={14} color={Colors.light.primary} />
                <Text style={[styles.statusText, { color: Colors.light.primary }]}>
                  Ready to Start
                </Text>
              </View>
            ) : (
              <View style={styles.lockedStatus}>
                <Circle size={14} color={Colors.light.text} />
                <Text style={[styles.statusText, { color: Colors.light.text, opacity: 0.6 }]}>
                  Locked
                </Text>
              </View>
            )}

            {/* Quick Action Button */}
            {(step.completed || isNext) && (
              <TouchableOpacity 
                style={[
                  styles.quickActionButton,
                  { backgroundColor: step.completed ? Colors.light.success + '20' : Colors.light.primary + '20' }
                ]}
                onPress={onPress}
              >
                <Text style={[
                  styles.quickActionText,
                  { color: step.completed ? Colors.light.success : Colors.light.primary }
                ]}>
                  {step.completed ? 'Review' : 'Start'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedContainer: {
    borderWidth: 1,
    borderColor: Colors.light.success + '30',
  },
  nextContainer: {
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
  },
  touchable: {
    width: '100%',
  },
  cardGradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    color: Colors.light.success,
  },
  nextText: {
    color: Colors.light.primary,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
  description: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  metadata: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
  },
  vocabularyPreview: {
    marginBottom: 12,
  },
  vocabularyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Outfit-Medium',
    marginBottom: 6,
  },
  vocabularyChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  vocabularyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  vocabularyWord: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  pronunciationIcon: {
    padding: 2,
  },
  vocabularyMore: {
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lockedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Outfit-Medium',
  },
  quickActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'LilitaOne',
  },
});