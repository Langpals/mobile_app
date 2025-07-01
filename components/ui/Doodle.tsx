import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

type DoodleType = 'stars' | 'hearts' | 'clouds' | 'paws';
type DoodlePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface DoodleProps {
  type: DoodleType;
  position: DoodlePosition;
  size?: number;
}

export default function Doodle({ type, position, size = 40 }: DoodleProps) {
  const doodleImages = {
    stars: 'https://images.pexels.com/photos/3309878/pexels-photo-3309878.jpeg',
    hearts: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg',
    clouds: 'https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg',
    paws: 'https://images.pexels.com/photos/4588052/pexels-photo-4588052.jpeg',
  };

  return (
    <View style={[styles.container, styles[position], { width: size, height: size }]}>
      <Image
        source={{ uri: doodleImages[type] }}
        style={[styles.image, { width: size, height: size }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
  },
  'top-left': {
    top: 10,
    left: 10,
  },
  'top-right': {
    top: 10,
    right: 10,
  },
  'bottom-left': {
    bottom: 10,
    left: 10,
  },
  'bottom-right': {
    bottom: 10,
    right: 10,
  },
  image: {
    resizeMode: 'contain',
  },
});