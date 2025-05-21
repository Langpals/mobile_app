import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockMetricsData, mockChildProfile } from '@/data/mockData';

export default function MetricsScreen() {
  const renderActivityBars = () => {
    const maxMinutes = Math.max(...mockMetricsData.weeklyActivity.map(day => day.minutes));
    
    return mockMetricsData.weeklyActivity.map((day, index) => {
      const barHeight = (day.minutes / maxMinutes) * 120;
      
      return (
        <View key={index} style={styles.barContainer}>
          <Text style={styles.barValue}>{day.minutes}</Text>
          <View 
            style={[
              styles.bar, 
              { height: barHeight > 0 ? barHeight : 1 },
              day.minutes > (maxMinutes / 2) ? styles.barHigh : styles.barLow
            ]} 
          />
          <Text style={styles.barLabel}>{day.day}</Text>
        </View>
      );
    });
  };

  const renderProficiencyMeters = () => {
    const proficiencyData = mockMetricsData.proficiencyScores;
    
    return Object.entries(proficiencyData).map(([key, value], index) => (
      <View key={index} style={styles.proficiencyItem}>
        <View style={styles.proficiencyLabelContainer}>
          <Text style={styles.proficiencyLabel}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Text>
          <Text style={styles.proficiencyValue}>{value}%</Text>
        </View>
        <View style={styles.proficiencyBarContainer}>
          <View 
            style={[
              styles.proficiencyBar,
              { width: `${value}%` }
            ]} 
          />
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Learning Metrics</Text>
          <Text style={styles.subtitle}>
            Track {mockChildProfile.name}'s language development
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Activity</Text>
          <Text style={styles.cardSubtitle}>Minutes spent learning</Text>
          
          <View style={styles.chartContainer}>
            {renderActivityBars()}
          </View>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total this week</Text>
            <Text style={styles.totalValue}>
              {mockMetricsData.weeklyActivity.reduce((sum, day) => sum + day.minutes, 0)} minutes
            </Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vocabulary Growth</Text>
          <Text style={styles.cardSubtitle}>Words learned over time</Text>
          
          <View style={styles.vocabContainer}>
            <View style={styles.vocabCurrent}>
              <Text style={styles.vocabNumber}>
                {mockMetricsData.vocabularyGrowth[mockMetricsData.vocabularyGrowth.length - 1].words}
              </Text>
              <Text style={styles.vocabLabel}>Words</Text>
            </View>
            
            <View style={styles.vocabTrend}>
              <Text style={styles.vocabTrendTitle}>Growth Trend</Text>
              <Text style={styles.vocabTrendValue}>+13 words this month</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Language Proficiency</Text>
          <Text style={styles.cardSubtitle}>Current skill assessment</Text>
          
          <View style={styles.proficiencyContainer}>
            {renderProficiencyMeters()}
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommendations</Text>
          
          <View style={styles.recommendationItem}>
            <View style={[styles.recommendationDot, { backgroundColor: Colors.light.success }]} />
            <Text style={styles.recommendationText}>
              {mockChildProfile.name} is showing excellent progress in word recognition!
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <View style={[styles.recommendationDot, { backgroundColor: Colors.light.primary }]} />
            <Text style={styles.recommendationText}>
              Continue practicing animal words to reinforce vocabulary.
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <View style={[styles.recommendationDot, { backgroundColor: Colors.light.warning }]} />
            <Text style={styles.recommendationText}>
              More practice needed with question-answer patterns.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    paddingTop: Platform.select({
      ios: 60,
      android: 16,
      web: 60,
    }),
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  card: {
    ...globalStyles.card,
    padding: 20,
  },
  cardTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  barHigh: {
    backgroundColor: Colors.light.primary,
  },
  barLow: {
    backgroundColor: Colors.light.primary + '80',
  },
  barValue: {
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 4,
  },
  barLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  totalLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  totalValue: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.primary,
  },
  vocabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  vocabCurrent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary + '15',
    borderRadius: 12,
    padding: 16,
    width: '40%',
  },
  vocabNumber: {
    fontFamily: 'LilitaOne',
    fontSize: 32,
    color: Colors.light.primary,
  },
  vocabLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  vocabTrend: {
    width: '50%',
  },
  vocabTrendTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  vocabTrendValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.success,
  },
  proficiencyContainer: {
    marginTop: 16,
  },
  proficiencyItem: {
    marginBottom: 16,
  },
  proficiencyLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  proficiencyLabel: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
  },
  proficiencyValue: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.primary,
  },
  proficiencyBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  proficiencyBar: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 10,
  },
  recommendationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
});