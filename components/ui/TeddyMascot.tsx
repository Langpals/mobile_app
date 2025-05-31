// components/ui/TeddyMascot.tsx - Enhanced Version
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Volume2, Heart, Star, Sparkles } from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

type MascotMood = 'happy' | 'excited' | 'thinking' | 'sleepy' | 'encouraging' | 'teaching' | 'celebrating' | 'curious';

interface TeddyMascotProps {
  mood?: MascotMood;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showSpeakButton?: boolean;
  onSpeak?: () => void;
}

export default function TeddyMascot({ 
  mood = 'happy', 
  message, 
  size = 'medium',
  animated = true,
  showSpeakButton = false,
  onSpeak
}: TeddyMascotProps) {
  const [bounceAnimation] = useState(new Animated.Value(0));
  const [blinkAnimation] = useState(new Animated.Value(1));
  const [messageAnimation] = useState(new Animated.Value(0));
  const [sparkleAnimations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);

  useEffect(() => {
    if (animated) {
      // Bouncing animation
      const bounceLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      bounceLoop.start();

      // Blinking animation
      const blinkLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnimation, {
            toValue: 0.3,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnimation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.delay(3000),
        ])
      );
      blinkLoop.start();

      // Sparkle animations for excited mood
      if (mood === 'excited' || mood === 'celebrating') {
        sparkleAnimations.forEach((anim, index) => {
          const sparkleLoop = Animated.loop(
            Animated.sequence([
              Animated.delay(index * 500),
              Animated.timing(anim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(anim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          );
          sparkleLoop.start();
        });
      }

      return () => {
        bounceLoop.stop();
        blinkLoop.stop();
        sparkleAnimations.forEach(anim => anim.stopAnimation());
      };
    }
  }, [animated, mood]);

  useEffect(() => {
    if (message) {
      // Message entrance animation
      Animated.spring(messageAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [message]);

  const getMascotImages = () => {
    // In a real app, you'd have different teddy bear images for different moods
    const baseImage = 'https://images.pexels.com/photos/2767814/pexels-photo-2767814.jpeg';
    
    return {
      happy: baseImage,
      excited: baseImage,
      thinking: 'https://images.pexels.com/photos/1019471/pexels-photo-1019471.jpeg',
      sleepy: 'https://images.pexels.com/photos/175766/pexels-photo-175766.jpeg',
      encouraging: baseImage,
      teaching: 'https://images.pexels.com/photos/264917/pexels-photo-264917.jpeg',
      celebrating: baseImage,
      curious: baseImage,
    };
  };

  const getSizeStyles = () => {
    const sizes = {
      small: { width: 80, height: 80, borderRadius: 40 },
      medium: { width: 120, height: 120, borderRadius: 60 },
      large: { width: 160, height: 160, borderRadius: 80 },
    };
    return sizes[size];
  };

  const getMoodEmoji = () => {
    const emojis = {
      happy: '😊',
      excited: '🎉',
      thinking: '🤔',
      sleepy: '😴',
      encouraging: '💪',
      teaching: '🎓',
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

  const getMoodMessage = () => {
    if (message) return message;
    
    const defaultMessages = {
      happy: "¡Hola! I'm ready to learn with you!",
      excited: "¡Increíble! This is going to be so much fun!",
      thinking: "Hmm, let me think about this...",
      sleepy: "I'm a little sleepy, but ready to learn!",
      encouraging: "¡Tú puedes! You can do this!",
      teaching: "Let me show you something amazing!",
      celebrating: "¡Felicidades! You did it!",
      curious: "Ooh, what are we going to discover today?",
    };
    return defaultMessages[mood];
  };

  const handleTeddyPress = () => {
    // Add a little bounce when pressed
    Animated.sequence([
      Animated.timing(bounceAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onSpeak) {
      onSpeak();
    }
  };

  const sizeStyle = getSizeStyles();
  const moodColor = getMoodColor();

  return (
    <View style={styles.container}>
      {/* Sparkles for excited/celebrating moods */}
      {(mood === 'excited' || mood === 'celebrating') && (
        <View style={styles.sparklesContainer}>
          {sparkleAnimations.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.sparkle,
                {
                  opacity: anim,
                  transform: [{
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2]
                    })
                  }],
                  top: `${20 + index * 15}%`,
                  left: `${30 + index * 20}%`,
                }
              ]}
            >
              <Sparkles size={16} color={Colors.light.warning} />
            </Animated.View>
          ))}
        </View>
      )}

      {/* Teddy Bear */}
      <TouchableOpacity 
        style={styles.mascotContainer} 
        onPress={handleTeddyPress}
        activeOpacity={0.9}
      >
        <Animated.View 
          style={[
            styles.mascotImageContainer,
            sizeStyle,
            {
              transform: [{
                translateY: bounceAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10]
                })
              }, {
                scale: bounceAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05]
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={[moodColor + '20', moodColor + '10', 'transparent']}
            style={[styles.mascotGlow, sizeStyle]}
          />
          
          <Animated.Image 
            source={{ uri: getMascotImages()[mood] }} 
            style={[
              styles.mascotImage, 
              sizeStyle,
              {
                opacity: blinkAnimation
              }
            ]}
          />
          
          <View style={[styles.moodIndicator, { backgroundColor: moodColor }]}>
            <Text style={styles.emoji}>{getMoodEmoji()}</Text>
          </View>

          {/* Accessories based on mood */}
          {mood === 'teaching' && (
            <View style={styles.accessory}>
              <Text style={styles.accessoryText}>🎓</Text>
            </View>
          )}
          
          {mood === 'celebrating' && (
            <View style={styles.accessory}>
              <Text style={styles.accessoryText}>🎉</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
      
      {/* Message Bubble */}
      {getMoodMessage() && (
        <Animated.View 
          style={[
            styles.messageContainer,
            {
              opacity: messageAnimation,
              transform: [{
                scale: messageAnimation.interpolate({
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
              <Text style={styles.messageText}>{getMoodMessage()}</Text>
              
              {showSpeakButton && (
                <TouchableOpacity 
                  style={[styles.speakButton, { backgroundColor: moodColor + '20' }]}
                  onPress={onSpeak}
                >
                  <Volume2 size={16} color={moodColor} />
                  <Text style={[styles.speakButtonText, { color: moodColor }]}>
                    Listen
                  </Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>
          
          <View style={[styles.bubbleTriangle, { borderTopColor: moodColor + '30' }]} />
        </Animated.View>
      )}

      {/* Mood-specific effects */}
      {mood === 'encouraging' && (
        <View style={styles.encouragingHearts}>
          <Heart size={12} color={Colors.light.error} />
          <Heart size={10} color={Colors.light.error} />
        </View>
      )}

      {mood === 'celebrating' && (
        <View style={styles.celebratingStars}>
          <Star size={14} color={Colors.light.warning} />
          <Star size={12} color={Colors.light.warning} />
          <Star size={16} color={Colors.light.warning} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  sparklesContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    zIndex: 0,
  },
  sparkle: {
    position: 'absolute',
  },
  mascotContainer: {
    position: 'relative',
  },
  mascotImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
  },
  mascotImage: {
    borderWidth: 4,
    borderColor: Colors.light.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  moodIndicator: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.light.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  emoji: {
    fontSize: 16,
  },
  accessory: {
    position: 'absolute',
    top: -10,
    left: -10,
  },
  accessoryText: {
    fontSize: 20,
  },
  messageContainer: {
    marginTop: 16,
    alignItems: 'center',
    maxWidth: 280,
  },
  messageBubble: {
    borderRadius: 20,
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
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  speakButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    marginLeft: 4,
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
  encouragingHearts: {
    position: 'absolute',
    top: 20,
    right: -20,
    flexDirection: 'column',
    gap: 4,
  },
  celebratingStars: {
    position: 'absolute',
    top: 10,
    left: -25,
    flexDirection: 'column',
    gap: 6,
  },
});