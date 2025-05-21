import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

type MascotMood = 'happy' | 'excited' | 'thinking' | 'sleepy';

interface TeddyMascotProps {
  mood?: MascotMood;
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function TeddyMascot({ 
  mood = 'happy', 
  message, 
  size = 'medium' 
}: TeddyMascotProps) {
  const mascotImages = {
    happy: 'https://images.pexels.com/photos/2767814/pexels-photo-2767814.jpeg',
    excited: 'https://images.pexels.com/photos/264917/pexels-photo-264917.jpeg',
    thinking: 'https://images.pexels.com/photos/1019471/pexels-photo-1019471.jpeg',
    sleepy: 'https://images.pexels.com/photos/175766/pexels-photo-175766.jpeg',
  };

  const sizeStyles = {
    small: { width: 60, height: 60 },
    medium: { width: 100, height: 100 },
    large: { width: 150, height: 150 },
  };

  const emojis = {
    happy: '😊',
    excited: '🎉',
    thinking: '🤔',
    sleepy: '😴',
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mascotContainer, sizeStyles[size]]}>
        <Image 
          source={{ uri: mascotImages[mood] }} 
          style={[styles.mascotImage, sizeStyles[size]]}
        />
        <Text style={styles.emoji}>{emojis[mood]}</Text>
      </View>
      {message && (
        <View style={styles.messageContainer}>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
          <View style={styles.bubbleTriangle} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  mascotContainer: {
    position: 'relative',
  },
  mascotImage: {
    borderRadius: 999,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  emoji: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    fontSize: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  messageBubble: {
    backgroundColor: Colors.light.primary + '15',
    borderRadius: 16,
    padding: 12,
    maxWidth: 200,
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
  },
  bubbleTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.light.primary + '15',
    transform: [{ rotate: '180deg' }],
    marginTop: -1,
  },
});