import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Platform, StatusBar } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

export default function PlaceholderScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Sparkles size={60} color={Colors.light.primary} />
        
        <Text style={styles.title}>Coming Soon!</Text>
        <Text style={styles.subtitle}>
          We're working on exciting new features for this section
        </Text>
        
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/2767814/pexels-photo-2767814.jpeg' }}
          style={styles.teddyImage}
        />
        
        <Text style={styles.description}>
          Bernie is busy preparing something special for you and your child.
          Check back in a future update!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.select({
      android: StatusBar.currentHeight,
      ios: 0,
      web: 0,
    }),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingTop: Platform.select({
      ios: 60,
      android: 16,
      web: 60,
    }),
  },
  title: {
    fontFamily: 'LilitaOne',
    fontSize: 32,
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 32,
  },
  teddyImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 32,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
    maxWidth: '80%',
  },
});