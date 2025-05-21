import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heading1: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 16,
  },
  heading2: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 12,
  },
  heading3: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
  },
  subtitle: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.8,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 22,
  },
  textSmall: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  buttonPrimary: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineText: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.primary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.light.primary + '20',
  },
  badgeText: {
    fontFamily: 'LilitaOne',
    fontSize: 12,
    color: Colors.light.primary,
  },
});

// Difficulty level styles
export const difficultyStyles = {
  easy: {
    backgroundColor: '#E0F7EA',
    color: '#4ADE80',
    text: 'EASY',
  },
  medium: {
    backgroundColor: '#FFF8E6',
    color: '#FFC40B',
    text: 'MEDIUM',
  },
  hard: {
    backgroundColor: '#FFEAEF',
    color: '#EB858C',
    text: 'HARD',
  },
  veryHard: {
    backgroundColor: '#FFE9E9',
    color: '#FF5A5A',
    text: 'VERY HARD',
  },
};