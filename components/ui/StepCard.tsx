// components/ui/StepCard.tsx - Enhanced Version
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Circle, Play, Clock, BookOpen, Mic, Target, Star, Users } from 'lucide-react-native';
import { Step } from '@/types';
import { globalStyles } from '@/constants/Styles';
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
      default: return Play;
    }
  };

  const getStepTypeColor = () => {
    switch (step.type) {
      case 'vocabulary': return Colors.light.primary;
      case 'interaction': return Colors.light.secondary;
      case 'assessment': return Colors.light.success;
      case 'review': return Colors.light.accent;
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
                { backgroundColor: step.completed ? Colors.light.success : stepColor + '20' }
              ]}>
                {step.completed ? (
                  <CheckCircle size={20} color="#FFFFFF" />
                ) : (
                  <Circle size={20} color={stepColor} />
                )}
              </View>
              
              {/* Step Info */}
              <View style={styles.stepInfo}>
                <View style={styles.stepNumberContainer}>
                  <Text style={[styles.stepNumber, { color: stepColor }]}>
                    STEP {stepNumber}
                  </Text>
                  <View style={[styles.stepTypeBadge, { backgroundColor: stepColor + '15' }]}>
                    <IconComponent size={12} color={stepColor} />
                    <Text style={[styles.stepTypeText, { color: stepColor }]}>
                      {getStepTypeLabel()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
            </View>
            
            {/* Right Side - Play Button */}
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: stepColor }]} 
              onPress={onPress}
            >
              <Play size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description} numberOfLines={showPreview ? 3 : 2}>
            {step.description}
          </Text>

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
            
            <DifficultyBadge level={step.difficulty} size="small" />
          </View>

          {/* Vocabulary Preview */}
          {showPreview && step.vocabularyWords.length > 0 && (
            <View style={styles.vocabularyPreview}>
              <Text style={styles.vocabularyTitle}>New Words:</Text>
              <View style={styles.vocabularyChips}>
                {step.vocabularyWords.slice(0, 4).map((word, index) => (
                  <View key={index} style={[styles.vocabularyChip, { borderColor: stepColor + '30' }]}>
                    <Text style={[styles.vocabularyWord, { color: stepColor }]}>{word}</Text>
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
                <Star size={14} color={Colors.light.primary} />
                <Text style={[styles.statusText, { color: Colors.light.primary }]}>
                  Up Next
                </Text>
              </View>
            ) : (
              <View style={styles.pendingStatus}>
                <Circle size={14} color={Colors.light.text} />
                <Text style={[styles.statusText, { color: Colors.light.text }]}>
                  Not Started
                </Text>
              </View>
            )}
            
            {/* Progress Indicator */}
            <View style={styles.progressIndicator}>
              <View style={[
                styles.progressDot,
                { backgroundColor: step.completed ? Colors.light.success : Colors.light.border }
              ]} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  completedContainer: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.success,
  },
  nextContainer: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  touchable: {
    flex: 1,
  },
  cardGradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftHeader: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
    marginRight: 8,
  },
  stepTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  stepTypeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    marginLeft: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stepTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 20,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.light.text,
    opacity: 0.8,
    lineHeight: 18,
    marginBottom: 12,
  },
  metadata: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.7,
    marginLeft: 4,
  },
  vocabularyPreview: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  vocabularyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 8,
  },
  vocabularyChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  vocabularyChip: {
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  vocabularyWord: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
  },
  vocabularyMore: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 8,
  },
  completedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginLeft: 6,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});