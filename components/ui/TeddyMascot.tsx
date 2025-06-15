// components/ui/TeddyMascot.tsx - Simplified Version
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Volume2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface TeddyMascotProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'sleepy' | 'encouraging' | 'teaching' | 'celebrating' | 'curious';
  size?: 'small' | 'medium' | 'large';
  message?: string;
  animated?: boolean;
  onPress?: () => void;
}

export default function TeddyMascot({ 
  mood = 'happy', 
  size = 'medium', 
  message, 
  animated = true, 
  onPress 
}: TeddyMascotProps) {
  const [bounceAnim] = useState(new Animated.Value(1));
  const [messageAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (animated) {
      // Gentle bouncing animation
      const bounceLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      bounceLoop.start();

      return () => bounceLoop.stop();
    }
  }, [animated]);

  useEffect(() => {
    if (message) {
      Animated.spring(messageAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      messageAnim.setValue(0);
    }
  }, [message]);

  const getSizeStyles = () => {
    const sizes = {
      small: { width: 60, height: 60, borderRadius: 30 },
      medium: { width: 100, height: 100, borderRadius: 50 },
      large: { width: 140, height: 140, borderRadius: 70 },
    };
    return sizes[size];
  };

  const getMoodEmoji = () => {
    const emojis = {
      happy: '🧸',
      excited: '🎉',
      thinking: '🤔',
      sleepy: '😴',
      encouraging: '💪',
      teaching: '📚',
      celebrating: '🎊',
      curious: '🧐',
    };
    return emojis[mood];
  };

  const getMoodColor = () => {
    const colors = {
      happy: Colors.light.primary,
      excited: Colors.light.warning,
      thinking: Colors.light.secondary,
      sleepy: Colors.light.accent,
      encouraging: Colors.light.success,
      teaching: Colors.light.primary,
      celebrating: Colors.light.warning,
      curious: Colors.light.secondary,
    };
    return colors[mood];
  };

  const sizeStyle = getSizeStyles();
  const moodColor = getMoodColor();

  return (
    <View style={styles.container}>
      {/* Teddy Bear */}
      <TouchableOpacity 
        style={styles.mascotContainer} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.mascot,
            sizeStyle,
            {
              transform: [{ scale: bounceAnim }]
            }
          ]}
        >
          {/* Glow effect */}
          <LinearGradient
            colors={[moodColor + '30', moodColor + '10', 'transparent']}
            style={[styles.mascotGlow, sizeStyle]}
          />
          
          {/* Simple Teddy representation */}
          <View style={[styles.teddyBody, sizeStyle, { backgroundColor: '#D2691E' }]}>
            <Text style={[styles.teddyEmoji, { fontSize: size === 'large' ? 48 : size === 'medium' ? 36 : 24 }]}>
              🧸
            </Text>
          </View>
          
          {/* Mood indicator */}
          <View style={[styles.moodIndicator, { backgroundColor: moodColor }]}>
            <Text style={styles.moodEmoji}>{getMoodEmoji()}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
      
      {/* Message Bubble */}
      {message && (
        <Animated.View 
          style={[
            styles.messageContainer,
            {
              opacity: messageAnim,
              transform: [{
                scale: messageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}
        >
          <View style={[styles.messageBubble, { borderColor: moodColor + '30' }]}>
            <LinearGradient
              colors={[moodColor + '05', Colors.light.cardBackground]}
              style={styles.messageBubbleGradient}
            >
              <Text style={styles.messageText}>{message}</Text>
              
              <TouchableOpacity 
                style={[styles.speakButton, { backgroundColor: moodColor + '20' }]}
              >
                <Volume2 size={12} color={moodColor} />
                <Text style={[styles.speakButtonText, { color: moodColor }]}>
                  Listen
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          
          {/* Speech bubble triangle */}
          <View style={[styles.bubbleTriangle, { borderTopColor: Colors.light.cardBackground }]} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mascotGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  teddyBody: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  teddyEmoji: {
    textAlign: 'center',
  },
  moodIndicator: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  moodEmoji: {
    fontSize: 12,
  },
  messageContainer: {
    marginTop: 16,
    alignItems: 'center',
    maxWidth: 280,
  },
  messageBubble: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageBubbleGradient: {
    padding: 16,
    alignItems: 'center',
  },
  messageText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  speakButtonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
  },
  bubbleTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});