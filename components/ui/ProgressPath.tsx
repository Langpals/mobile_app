import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, CheckCircle, Lock, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Episode } from '@/types';

interface ProgressPathProps {
  episodes: Episode[];
  onEpisodePress: (episode: Episode) => void;
}

export default function ProgressPath({ episodes, onEpisodePress }: ProgressPathProps) {
  return (
    <View style={styles.container}>
      {episodes.map((episode, index) => (
        <View 
          key={episode.id} 
          style={[
            styles.episodeContainer,
            { marginLeft: index % 2 === 0 ? 0 : 100 }
          ]}
        >
          {index > 0 && (
            <View 
              style={[
                styles.pathLine,
                index % 2 === 0 ? styles.pathLineLeft : styles.pathLineRight,
                episode.locked ? styles.pathLineLocked : (episode.completed ? styles.pathLineCompleted : styles.pathLineActive)
              ]}
            />
          )}
          
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              disabled={episode.locked}
              style={[
                styles.episodeButton,
                episode.locked ? styles.episodeLocked : (episode.completed ? styles.episodeCompleted : styles.episodeActive)
              ]}
              onPress={() => onEpisodePress(episode)}
            >
              {episode.locked ? (
                <Lock size={24} color="#8E8E8E" />
              ) : episode.completed ? (
                <Star size={24} color="#FFFFFF" strokeWidth={2.5} />
              ) : (
                <Play size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            {!episode.locked && !episode.completed && (
              <View style={styles.progressRing}>
                <View style={styles.progressDot} />
              </View>
            )}
            
            <View style={styles.labelContainer}>
              {episode.completed && (
                <Text style={[styles.label, styles.completedLabel]}>COMPLETE!</Text>
              )}
              {!episode.locked && !episode.completed && (
                <Text style={[styles.label, styles.startLabel]}>START</Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  episodeContainer: {
    position: 'relative',
    marginVertical: 40,
  },
  buttonWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  episodeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  episodeActive: {
    backgroundColor: Colors.light.primary,
    borderColor: '#FFFFFF',
  },
  episodeCompleted: {
    backgroundColor: Colors.light.success,
    borderColor: '#FFFFFF',
  },
  episodeLocked: {
    backgroundColor: '#D1D1D1',
    borderColor: '#BEBEBE',
  },
  labelContainer: {
    position: 'absolute',
    top: -30,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  startLabel: {
    backgroundColor: Colors.light.secondary,
    color: Colors.light.text,
  },
  completedLabel: {
    backgroundColor: Colors.light.success,
    color: '#FFFFFF',
  },
  pathLine: {
    position: 'absolute',
    width: 120,
    height: 6,
    backgroundColor: Colors.light.primary,
    zIndex: 1,
  },
  pathLineLeft: {
    right: -80,
    top: 37,
    transform: [{ rotate: '30deg' }],
  },
  pathLineRight: {
    left: -80,
    top: 37,
    transform: [{ rotate: '-30deg' }],
  },
  pathLineActive: {
    backgroundColor: Colors.light.primary,
  },
  pathLineCompleted: {
    backgroundColor: Colors.light.success,
  },
  pathLineLocked: {
    backgroundColor: '#D1D1D1',
  },
  progressRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.light.secondary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDot: {
    position: 'absolute',
    top: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.secondary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});