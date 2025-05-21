import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Season } from '@/types';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

interface SeasonCardProps {
  season: Season;
}

export default function SeasonCard({ season }: SeasonCardProps) {
  const [expanded, setExpanded] = useState(false);
  const rotateAnimation = useState(new Animated.Value(0))[0];

  const toggleExpand = () => {
    Animated.timing(rotateAnimation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <Text style={styles.seasonNumber}>SEASON {season.number}</Text>
          <Text style={styles.title}>{season.title}</Text>
        </View>
        <Animated.View style={animatedStyle}>
          <ChevronDown size={24} color={Colors.light.text} />
        </Animated.View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={globalStyles.text}>{season.description}</Text>
          
          <Text style={[styles.sectionTitle, styles.marginTop]}>Learning Objectives</Text>
          {season.learningObjectives.map((objective, index) => (
            <View key={index} style={styles.objectiveItem}>
              <View style={styles.bullet} />
              <Text style={[globalStyles.text, styles.objectiveText]}>{objective}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0,
    borderBottomColor: Colors.light.border,
  },
  headerContent: {
    flex: 1,
  },
  seasonNumber: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
    color: Colors.light.text,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: Colors.light.cardBackground,
  },
  sectionTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
    marginTop: 16,
  },
  marginTop: {
    marginTop: 20,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    marginRight: 8,
  },
  objectiveText: {
    flex: 1,
  },
});