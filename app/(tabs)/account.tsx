// app/(tabs)/account.tsx - ULTRA SIMPLE Account Page
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, ScrollView } from 'react-native';
import { Settings, User, Wifi, Battery, Heart } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockChildProfile, mockTeddyBear } from '@/data/mockData';

export default function AccountScreen() {
  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Child Profile */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileEmoji}>👶</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{mockChildProfile.name}</Text>
              <Text style={styles.profileDetail}>Age: {mockChildProfile.age}</Text>
              <Text style={styles.profileDetail}>Learning: Spanish</Text>
            </View>
          </View>
        </View>

        {/* Teddy Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bern the Teddy</Text>
          <View style={styles.teddyCard}>
            <View style={styles.teddyInfo}>
              <Text style={styles.teddyEmoji}>🧸</Text>
              <View style={styles.teddyDetails}>
                <Text style={styles.teddyName}>{mockTeddyBear.name}</Text>
                <View style={styles.statusRow}>
                  <Wifi size={16} color={mockTeddyBear.connected ? Colors.light.success : Colors.light.error} />
                  <Text style={styles.statusText}>
                    {mockTeddyBear.connected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
                <View style={styles.statusRow}>
                  <Battery size={16} color={Colors.light.warning} />
                  <Text style={styles.statusText}>{mockTeddyBear.batteryLevel}% Battery</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Simple Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <User size={20} color={Colors.light.primary} />
            <Text style={styles.settingText}>Child Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Heart size={20} color={Colors.light.error} />
            <Text style={styles.settingText}>Customize Teddy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Settings size={20} color={Colors.light.secondary} />
            <Text style={styles.settingText}>App Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  teddyCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
  },
  teddyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  teddyEmoji: {
    fontSize: 40,
  },
  teddyDetails: {
    flex: 1,
  },
  teddyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'LilitaOne',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
  },
  settingItem: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Poppins-Regular',
  },
});