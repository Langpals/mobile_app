import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Doodle from './Doodle';

interface PlayfulCardProps {
  children: React.ReactNode;
  doodles?: Array<'stars' | 'hearts' | 'clouds' | 'paws'>;
}

export default function PlayfulCard({ children, doodles = ['stars'] }: PlayfulCardProps) {
  return (
    <View style={styles.container}>
      {doodles.includes('stars') && (
        <Doodle type="stars" position="top-right" size={30} />
      )}
      {doodles.includes('hearts') && (
        <Doodle type="hearts" position="bottom-left" size={25} />
      )}
      {doodles.includes('clouds') && (
        <Doodle type="clouds" position="top-left" size={35} />
      )}
      {doodles.includes('paws') && (
        <Doodle type="paws" position="bottom-right" size={28} />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    overflow: 'visible',
  },
});