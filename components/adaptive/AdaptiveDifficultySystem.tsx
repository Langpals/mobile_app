// components/adaptive/AdaptiveDifficultySystem.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Target, Brain, Clock, Star, Zap } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { DifficultyLevel } from '@/types';

// Adaptive Difficulty Types
export interface AdaptiveMetrics {
  responseAccuracy: number; // 0-100
  averageResponseTime: number; // seconds
  completionRate: number; // 0-100
  engagementLevel: number; // 0-100
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  sessionProgress: number; // 0-100
  vocabularyRetention: number; // 0-100
}

export interface DifficultyAdjustment {
  currentLevel: DifficultyLevel;
  suggestedLevel: DifficultyLevel;
  reason: string;
  confidence: number; // 0-100
  adjustmentType: 'increase' | 'decrease' | 'maintain';
  factors: {
    accuracy: number;
    speed: number;
    engagement: number;
    retention: number;
  };
}

// Adaptive Difficulty Engine
export class AdaptiveDifficultyEngine {
  private static instance: AdaptiveDifficultyEngine;
  
  static getInstance(): AdaptiveDifficultyEngine {
    if (!AdaptiveDifficultyEngine.instance) {
      AdaptiveDifficultyEngine.instance = new AdaptiveDifficultyEngine();
    }
    return AdaptiveDifficultyEngine.instance;
  }

  // Analyze current performance and suggest difficulty adjustment
  analyzePerformance(metrics: AdaptiveMetrics, currentLevel: DifficultyLevel): DifficultyAdjustment {
    const factors = this.calculateFactorScores(metrics);
    const overallScore = this.calculateOverallScore(factors);
    
    const adjustment = this.determineDifficultyAdjustment(overallScore, currentLevel, factors);
    
    return {
      currentLevel,
      suggestedLevel: adjustment.level,
      reason: adjustment.reason,
      confidence: adjustment.confidence,
      adjustmentType: adjustment.type,
      factors
    };
  }

  private calculateFactorScores(metrics: AdaptiveMetrics) {
    // Accuracy factor (0-100)
    let accuracyScore = metrics.responseAccuracy;
    
    // Speed factor - normalize response time (optimal range: 2-6 seconds)
    const optimalTime = 4;
    const timeDiff = Math.abs(metrics.averageResponseTime - optimalTime);
    const speedScore = Math.max(0, 100 - (timeDiff * 20));
    
    // Engagement factor
    const engagementScore = metrics.engagementLevel;
    
    // Retention factor - combination of completion rate and vocabulary retention
    const retentionScore = (metrics.completionRate + metrics.vocabularyRetention) / 2;
    
    return {
      accuracy: accuracyScore,
      speed: speedScore,
      engagement: engagementScore,
      retention: retentionScore
    };
  }

  private calculateOverallScore(factors: any): number {
    // Weighted average - accuracy and retention are most important
    return (
      factors.accuracy * 0.35 +
      factors.retention * 0.35 +
      factors.engagement * 0.20 +
      factors.speed * 0.10
    );
  }

  private determineDifficultyAdjustment(
    score: number, 
    currentLevel: DifficultyLevel, 
    factors: any
  ): { level: DifficultyLevel; reason: string; confidence: number; type: 'increase' | 'decrease' | 'maintain' } {
    
    const levels: DifficultyLevel[] = ['veryEasy', 'easy', 'medium', 'hard', 'veryHard'];
    const currentIndex = levels.indexOf(currentLevel);
    
    // High performance - consider increasing difficulty
    if (score >= 85 && factors.accuracy >= 90) {
      if (currentIndex < levels.length - 1) {
        return {
          level: levels[currentIndex + 1],
          reason: "Excellent performance! Ready for more challenge.",
          confidence: Math.min(95, score),
          type: 'increase'
        };
      }
    }
    
    // Very high performance - jump up more
    if (score >= 95 && factors.accuracy >= 95 && factors.engagement >= 90) {
      if (currentIndex < levels.length - 2) {
        return {
          level: levels[currentIndex + 2],
          reason: "Outstanding mastery! Jumping to higher difficulty.",
          confidence: 98,
          type: 'increase'
        };
      }
    }
    
    // Low performance - consider decreasing difficulty
    if (score <= 60 || factors.accuracy <= 50) {
      if (currentIndex > 0) {
        return {
          level: levels[currentIndex - 1],
          reason: "Let's make this easier to build confidence.",
          confidence: Math.max(70, 100 - score),
          type: 'decrease'
        };
      }
    }
    
    // Very low performance - bigger decrease
    if (score <= 40 || factors.accuracy <= 30) {
      if (currentIndex > 1) {
        return {
          level: levels[Math.max(0, currentIndex - 2)],
          reason: "Taking a step back to ensure solid foundation.",
          confidence: 95,
          type: 'decrease'
        };
      }
    }
    
    // Maintain current level
    return {
      level: currentLevel,
      reason: "Current difficulty level is perfect!",
      confidence: 75,
      type: 'maintain'
    };
  }

  // Get difficulty settings for a specific level
  getDifficultySettings(level: DifficultyLevel) {
    const settings = {
      veryEasy: {
        responseTimeLimit: 10,
        repetitionCount: 3,
        hintsAvailable: true,
        vocabularyPerSession: 3,
        confidenceThreshold: 30,
        encouragementFrequency: 'high'
      },
      easy: {
        responseTimeLimit: 8,
        repetitionCount: 2,
        hintsAvailable: true,
        vocabularyPerSession: 5,
        confidenceThreshold: 40,
        encouragementFrequency: 'medium'
      },
      medium: {
        responseTimeLimit: 6,
        repetitionCount: 1,
        hintsAvailable: true,
        vocabularyPerSession: 7,
        confidenceThreshold: 50,
        encouragementFrequency: 'medium'
      },
      hard: {
        responseTimeLimit: 5,
        repetitionCount: 1,
        hintsAvailable: false,
        vocabularyPerSession: 10,
        confidenceThreshold: 60,
        encouragementFrequency: 'low'
      },
      veryHard: {
        responseTimeLimit: 4,
        repetitionCount: 0,
        hintsAvailable: false,
        vocabularyPerSession: 12,
        confidenceThreshold: 70,
        encouragementFrequency: 'low'
      }
    };
    
    return settings[level];
  }
}

// Adaptive Difficulty Display Component
interface AdaptiveDifficultyDisplayProps {
  currentMetrics: AdaptiveMetrics;
  currentLevel: DifficultyLevel;
  onAdjustmentAccepted?: (newLevel: DifficultyLevel) => void;
  showDetailedAnalysis?: boolean;
}

export function AdaptiveDifficultyDisplay({ 
  currentMetrics, 
  currentLevel, 
  onAdjustmentAccepted,
  showDetailedAnalysis = false 
}: AdaptiveDifficultyDisplayProps) {
  const [analysis, setAnalysis] = useState<DifficultyAdjustment | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const engine = AdaptiveDifficultyEngine.getInstance();
    const newAnalysis = engine.analyzePerformance(currentMetrics, currentLevel);
    setAnalysis(newAnalysis);
    
    // Show suggestion if there's a recommended change
    if (newAnalysis.adjustmentType !== 'maintain' && newAnalysis.confidence >= 80) {
      setShowSuggestion(true);
      Animated.spring(animationValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8
      }).start();
    }
  }, [currentMetrics, currentLevel]);

  const handleAcceptAdjustment = () => {
    if (analysis && onAdjustmentAccepted) {
      onAdjustmentAccepted(analysis.suggestedLevel);
      setShowSuggestion(false);
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  };

  const handleDeclineAdjustment = () => {
    setShowSuggestion(false);
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const getAdjustmentIcon = () => {
    if (!analysis) return Target;
    
    switch (analysis.adjustmentType) {
      case 'increase': return TrendingUp;
      case 'decrease': return TrendingDown;
      default: return Target;
    }
  };

  const getAdjustmentColor = () => {
    if (!analysis) return Colors.light.primary;
    
    switch (analysis.adjustmentType) {
      case 'increase': return Colors.light.success;
      case 'decrease': return Colors.light.warning;
      default: return Colors.light.primary;
    }
  };

  if (!analysis) return null;

  return (
    <View style={styles.container}>
      {/* Current Performance Indicators */}
      <View style={styles.performanceIndicators}>
        <View style={styles.indicator}>
          <Target size={16} color={Colors.light.primary} />
          <Text style={styles.indicatorLabel}>Accuracy</Text>
          <Text style={styles.indicatorValue}>{Math.round(currentMetrics.responseAccuracy)}%</Text>
        </View>
        
        <View style={styles.indicator}>
          <Clock size={16} color={Colors.light.secondary} />
          <Text style={styles.indicatorLabel}>Speed</Text>
          <Text style={styles.indicatorValue}>{currentMetrics.averageResponseTime.toFixed(1)}s</Text>
        </View>
        
        <View style={styles.indicator}>
          <Star size={16} color={Colors.light.warning} />
          <Text style={styles.indicatorLabel}>Engagement</Text>
          <Text style={styles.indicatorValue}>{Math.round(currentMetrics.engagementLevel)}%</Text>
        </View>
        
        <View style={styles.indicator}>
          <Brain size={16} color={Colors.light.success} />
          <Text style={styles.indicatorLabel}>Retention</Text>
          <Text style={styles.indicatorValue}>{Math.round(currentMetrics.vocabularyRetention)}%</Text>
        </View>
      </View>

      {/* Difficulty Adjustment Suggestion */}
      {showSuggestion && (
        <Animated.View 
          style={[
            styles.suggestionCard,
            {
              opacity: animationValue,
              transform: [{
                scale: animationValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={[getAdjustmentColor() + '10', Colors.light.cardBackground]}
            style={styles.suggestionGradient}
          >
            <View style={styles.suggestionHeader}>
              <View style={[styles.suggestionIcon, { backgroundColor: getAdjustmentColor() + '20' }]}>
                {React.createElement(getAdjustmentIcon(), {
                  size: 20,
                  color: getAdjustmentColor()
                })}
              </View>
              <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionTitle}>
                  {analysis.adjustmentType === 'increase' ? 'Ready for More Challenge!' :
                   analysis.adjustmentType === 'decrease' ? 'Let\'s Make This Easier' :
                   'Perfect Difficulty Level'}
                </Text>
                <Text style={styles.suggestionReason}>{analysis.reason}</Text>
              </View>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{Math.round(analysis.confidence)}%</Text>
              </View>
            </View>
            
            <View style={styles.suggestionActions}>
              <TouchableOpacity 
                style={styles.declineButton}
                onPress={handleDeclineAdjustment}
              >
                <Text style={styles.declineButtonText}>Keep Current</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.acceptButton, { backgroundColor: getAdjustmentColor() }]}
                onPress={handleAcceptAdjustment}
              >
                <Text style={styles.acceptButtonText}>
                  {analysis.adjustmentType === 'increase' ? 'Make Harder' :
                   analysis.adjustmentType === 'decrease' ? 'Make Easier' :
                   'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Detailed Analysis */}
      {showDetailedAnalysis && (
        <View style={styles.detailedAnalysis}>
          <Text style={styles.analysisTitle}>Performance Analysis</Text>
          
          <View style={styles.factorScores}>
            {Object.entries(analysis.factors).map(([factor, score]) => (
              <View key={factor} style={styles.factorScore}>
                <Text style={styles.factorLabel}>
                  {factor.charAt(0).toUpperCase() + factor.slice(1)}
                </Text>
                <View style={styles.factorBar}>
                  <View 
                    style={[
                      styles.factorFill,
                      { 
                        width: `${score}%`,
                        backgroundColor: score >= 80 ? Colors.light.success :
                                       score >= 60 ? Colors.light.warning :
                                       Colors.light.error
                      }
                    ]}
                  />
                </View>
                <Text style={styles.factorValue}>{Math.round(score)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  performanceIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  indicator: {
    alignItems: 'center',
  },
  indicatorLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    opacity: 0.7,
    marginTop: 4,
  },
  indicatorValue: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 2,
  },
  suggestionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  suggestionGradient: {
    padding: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 2,
  },
  suggestionReason: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontFamily: 'LilitaOne',
    fontSize: 12,
    color: Colors.light.text,
  },
  suggestionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  declineButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  detailedAnalysis: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 16,
  },
  analysisTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
  },
  factorScores: {
    gap: 8,
  },
  factorScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factorLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    width: 70,
  },
  factorBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  factorFill: {
    height: '100%',
    borderRadius: 3,
  },
  factorValue: {
    fontFamily: 'LilitaOne',
    fontSize: 11,
    color: Colors.light.text,
    width: 25,
    textAlign: 'right',
  },
});