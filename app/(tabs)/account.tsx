// app/(tabs)/account.tsx - Simplified Account Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Switch, Platform, StatusBar, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChevronRight, Wifi as WifiIcon, BatteryMedium, Clock, Info as InfoIcon, 
  LogOut, Palette, Volume as VolumeIcon, Lock, Zap, Settings, User, 
  Target, Trophy, Bell, Moon, Globe, HelpCircle, Heart, Edit3, Camera
} from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockChildProfile, mockTeddyBear, mockProgressStats } from '@/data/mockData';
import TeddyMascot from '@/components/ui/TeddyMascot';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function AccountScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showTeddyCustomization, setShowTeddyCustomization] = useState(false);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (err) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleProfileEdit = () => {
    setShowProfileModal(true);
  };

  const ProfileModal = () => (
    <Modal
      visible={showProfileModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowProfileModal(false)}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={() => setShowProfileModal(false)}>
            <Text style={styles.modalSave}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.profileEditSection}>
            <Text style={styles.sectionTitle}>Child's Information</Text>
            <View style={styles.editField}>
              <Text style={styles.fieldLabel}>Name</Text>
              <Text style={styles.fieldValue}>{mockChildProfile.name}</Text>
            </View>
            <View style={styles.editField}>
              <Text style={styles.fieldLabel}>Age</Text>
              <Text style={styles.fieldValue}>{mockChildProfile.age} years old</Text>
            </View>
            <View style={styles.editField}>
              <Text style={styles.fieldLabel}>Languages</Text>
              <Text style={styles.fieldValue}>{mockChildProfile.languages.join(', ')}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const TeddyCustomizationModal = () => (
    <Modal
      visible={showTeddyCustomization}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowTeddyCustomization(false)}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Customize Bern</Text>
          <TouchableOpacity onPress={() => setShowTeddyCustomization(false)}>
            <Text style={styles.modalSave}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.teddyPreview}>
            <TeddyMascot mood="happy" size="large" />
            <Text style={styles.teddyName}>{mockTeddyBear.name}</Text>
          </View>
          
          <View style={styles.customizationSection}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.colorOptions}>
              {['#8B4513', '#D2691E', '#F4A460', '#DEB887'].map((color, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.colorOption, { backgroundColor: color }]}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={[globalStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar backgroundColor={Colors.light.background} barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileGradient}
            >
              <View style={styles.profileContent}>
                <View style={styles.profileAvatar}>
                  <TeddyMascot mood="happy" size="medium" />
                </View>
                
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{mockChildProfile.name}</Text>
                  <Text style={styles.profileDetails}>
                    {mockChildProfile.languages.join(' • ')}
                  </Text>
                  <View style={styles.profileStats}>
                    <View style={styles.profileStat}>
                      <Target size={14} color={Colors.light.warning} />
                      <Text style={styles.profileStatText}>{mockProgressStats.completedEpisodes} episodes completed</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleProfileEdit}
                >
                  <Edit3 size={16} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => setShowTeddyCustomization(true)}
          >
            <View style={styles.actionIconContainer}>
              <Palette size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Customize Bern</Text>
              <Text style={styles.actionDescription}>Change how your teddy looks</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.text} opacity={0.3} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/progress')}
          >
            <View style={styles.actionIconContainer}>
              <Trophy size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Progress</Text>
              <Text style={styles.actionDescription}>See learning milestones</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.text} opacity={0.3} />
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D1D1', true: Colors.light.primary }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <VolumeIcon size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>Auto-play Episodes</Text>
            </View>
            <Switch
              value={autoPlayEnabled}
              onValueChange={setAutoPlayEnabled}
              trackColor={{ false: '#D1D1D1', true: Colors.light.primary }}
              thumbColor={autoPlayEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Globe size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>Language Preferences</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.text} opacity={0.3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.text} opacity={0.3} />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.light.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ProfileModal />
      <TeddyCustomizationModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 28,
    color: Colors.light.text,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileGradient: {
    padding: 20,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  profileStatText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 2,
  },
  actionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 12,
  },
  signOutSection: {
    marginTop: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.error + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.error + '30',
  },
  signOutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.error,
    marginLeft: 8,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
  },
  modalCancel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
  },
  modalSave: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  profileEditSection: {
    marginBottom: 24,
  },
  editField: {
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  fieldLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
  },
  teddyPreview: {
    alignItems: 'center',
    marginBottom: 32,
  },
  teddyName: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginTop: 12,
  },
  customizationSection: {
    marginBottom: 24,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});