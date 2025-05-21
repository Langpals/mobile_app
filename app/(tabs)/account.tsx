import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Switch, Platform, StatusBar } from 'react-native';
import { ChevronRight, Wifi as WifiIcon, BatteryMedium, Clock, Info as InfoIcon, LogOut, Palette, Volume as VolumeIcon, Lock, Zap } from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockChildProfile, mockTeddyBear } from '@/data/mockData';

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>
        
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg' }} 
              style={styles.avatar} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{mockChildProfile.name}</Text>
              <Text style={styles.profileDetails}>
                {mockChildProfile.age} years old • {mockChildProfile.languages.join(', ')}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.teddySection}>
          <Text style={styles.sectionTitle}>Teddy Bear</Text>
          
          <View style={styles.teddyCard}>
            <View style={styles.teddyHeader}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/2767814/pexels-photo-2767814.jpeg' }} 
                style={styles.teddyImage} 
              />
              <View style={styles.teddyInfo}>
                <Text style={styles.teddyName}>{mockTeddyBear.name}</Text>
                <View style={styles.teddyStatus}>
                  <View style={[styles.statusDot, { backgroundColor: mockTeddyBear.connected ? Colors.light.success : Colors.light.error }]} />
                  <Text style={styles.statusText}>
                    {mockTeddyBear.connected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.teddyStats}>
              <View style={styles.statItem}>
                <BatteryMedium size={16} color={Colors.light.text} />
                <Text style={styles.statText}>{mockTeddyBear.batteryLevel}% Battery</Text>
              </View>
              
              <View style={styles.statItem}>
                <Clock size={16} color={Colors.light.text} />
                <Text style={styles.statText}>Last Sync: {new Date(mockTeddyBear.lastSyncDate).toLocaleString()}</Text>
              </View>
              
              <View style={styles.statItem}>
                <WifiIcon size={16} color={Colors.light.text} />
                <Text style={styles.statText}>Wi-Fi Connected</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Reconnect</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.light.secondary + '30' }]}>
                  <VolumeIcon size={20} color={Colors.light.secondary} />
                </View>
                <Text style={styles.settingText}>Volume</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.text} />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.light.accent + '30' }]}>
                  <Palette size={20} color={Colors.light.accent} />
                </View>
                <Text style={styles.settingText}>Appearance</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.text} />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.light.warning + '30' }]}>
                  <Zap size={20} color={Colors.light.warning} />
                </View>
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Switch 
                trackColor={{ false: '#E6E8EB', true: Colors.light.primary + '70' }}
                thumbColor={true ? Colors.light.primary : '#F4F3F4'}
                value={true}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.light.error + '30' }]}>
                  <Lock size={20} color={Colors.light.error} />
                </View>
                <Text style={styles.settingText}>Privacy</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.text} />
            </View>
          </View>
        </View>
        
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.supportButton}>
            <InfoIcon size={20} color={Colors.light.primary} />
            <Text style={styles.supportButtonText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color={Colors.light.error} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
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
  },
  profileSection: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 4,
  },
  profileDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.primary + '15',
  },
  editButtonText: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.primary,
  },
  teddySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 16,
  },
  teddyCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  teddyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teddyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  teddyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  teddyName: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 4,
  },
  teddyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  teddyStats: {
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 10,
  },
  connectButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectButtonText: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: '#FFFFFF',
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
  },
  supportSection: {
    marginBottom: 40,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  supportButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.error,
    marginLeft: 12,
  },
});