// app/(tabs)/account.tsx - Enhanced Account Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Switch, Platform, StatusBar, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChevronRight, Wifi as WifiIcon, BatteryMedium, Clock, Info as InfoIcon, 
  LogOut, Palette, Volume as VolumeIcon, Lock, Zap, Settings, User, 
  Target, Trophy, Bell, Moon, Globe, HelpCircle, Heart, Edit3, Camera
} from 'lucide-react-native';
import { globalStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { mockChildProfile, mockTeddyBear, mockProgressStats } from '@/data/mockData';
import { mockAchievements, AchievementBadge } from './achievements_system';
import TeddyMascot from '@/components/ui/TeddyMascot';

export default function AccountScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showTeddyCustomization, setShowTeddyCustomization] = useState(false);

  const recentAchievements = mockAchievements.filter(a => a.unlocked).slice(0, 3);
  const totalPoints = mockAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  const renderProfileModal = () => (
    <Modal visible={showProfileModal} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowProfileModal(false)}>
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity>
            <Text style={styles.modalSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.profileEditSection}>
            <View style={styles.avatarEditContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg' }} 
                style={styles.avatarEdit} 
              />
              <TouchableOpacity style={styles.avatarEditButton}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileFields}>
              <View style={styles.profileField}>
                <Text style={styles.profileFieldLabel}>Name</Text>
                <View style={styles.profileFieldInput}>
                  <Text style={styles.profileFieldValue}>{mockChildProfile.name}</Text>
                  <Edit3 size={16} color={Colors.light.text} />
                </View>
              </View>
              
              <View style={styles.profileField}>
                <Text style={styles.profileFieldLabel}>Age</Text>
                <View style={styles.profileFieldInput}>
                  <Text style={styles.profileFieldValue}>{mockChildProfile.age} years old</Text>
                  <Edit3 size={16} color={Colors.light.text} />
                </View>
              </View>
              
              <View style={styles.profileField}>
                <Text style={styles.profileFieldLabel}>Languages</Text>
                <View style={styles.languageChips}>
                  {mockChildProfile.languages.map((lang, index) => (
                    <View key={index} style={styles.languageChip}>
                      <Text style={styles.languageChipText}>{lang}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.learningPreferences}>
            <Text style={styles.sectionTitle}>Learning Preferences</Text>
            
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Preferred Difficulty</Text>
              <View style={styles.difficultySelector}>
                {['Very Easy', 'Easy', 'Medium', 'Hard'].map((level) => (
                  <TouchableOpacity 
                    key={level}
                    style={[
                      styles.difficultyOption,
                      level === 'Easy' && styles.difficultyOptionSelected
                    ]}
                  >
                    <Text style={[
                      styles.difficultyOptionText,
                      level === 'Easy' && styles.difficultyOptionTextSelected
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Daily Goal (minutes)</Text>
              <View style={styles.goalSelector}>
                {[10, 15, 20, 30].map((minutes) => (
                  <TouchableOpacity 
                    key={minutes}
                    style={[
                      styles.goalOption,
                      minutes === 15 && styles.goalOptionSelected
                    ]}
                  >
                    <Text style={[
                      styles.goalOptionText,
                      minutes === 15 && styles.goalOptionTextSelected
                    ]}>
                      {minutes}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderTeddyCustomization = () => (
    <Modal visible={showTeddyCustomization} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowTeddyCustomization(false)}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Customize Bern</Text>
          <TouchableOpacity>
            <Text style={styles.modalSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.teddyCustomizationSection}>
            <TeddyMascot mood="happy" size="large" />
            
            <View style={styles.customizationOptions}>
              <Text style={styles.customizationSectionTitle}>Appearance</Text>
              
              <View style={styles.customizationGroup}>
                <Text style={styles.customizationLabel}>Color</Text>
                <View style={styles.colorOptions}>
                  {['Brown', 'Cream', 'Gray', 'White'].map((color) => (
                    <TouchableOpacity 
                      key={color}
                      style={[
                        styles.colorOption,
                        color === 'Brown' && styles.colorOptionSelected,
                        { backgroundColor: color.toLowerCase() === 'brown' ? '#8D6E63' : 
                                            color.toLowerCase() === 'cream' ? '#F5E6D3' :
                                            color.toLowerCase() === 'gray' ? '#9E9E9E' : '#FFFFFF' }
                      ]}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.customizationGroup}>
                <Text style={styles.customizationLabel}>Accessories</Text>
                <View style={styles.accessoryOptions}>
                  {['Explorer Hat', 'Bowtie', 'Scarf', 'Glasses'].map((accessory) => (
                    <TouchableOpacity 
                      key={accessory}
                      style={[
                        styles.accessoryOption,
                        accessory === 'Explorer Hat' && styles.accessoryOptionSelected
                      ]}
                    >
                      <Text style={[
                        styles.accessoryOptionText,
                        accessory === 'Explorer Hat' && styles.accessoryOptionTextSelected
                      ]}>
                        {accessory}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.customizationGroup}>
                <Text style={styles.customizationLabel}>Outfit</Text>
                <View style={styles.outfitOptions}>
                  {['Adventure Vest', 'Casual', 'Formal', 'Pirate'].map((outfit) => (
                    <TouchableOpacity 
                      key={outfit}
                      style={[
                        styles.outfitOption,
                        outfit === 'Adventure Vest' && styles.outfitOptionSelected
                      ]}
                    >
                      <Text style={[
                        styles.outfitOptionText,
                        outfit === 'Adventure Vest' && styles.outfitOptionTextSelected
                      ]}>
                        {outfit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.light.background, Colors.light.primary + '05', Colors.light.background]}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Account</Text>
          </View>
          
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <LinearGradient
              colors={[Colors.light.cardBackground, Colors.light.primary + '05']}
              style={styles.profileCard}
            >
              <View style={styles.profileHeader}>
                <View style={styles.profileImageContainer}>
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg' }} 
                    style={styles.avatar} 
                  />
                  <View style={styles.avatarBadge}>
                    <Text style={styles.avatarBadgeText}>{mockChildProfile.age}</Text>
                  </View>
                </View>
                
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{mockChildProfile.name}</Text>
                  <Text style={styles.profileDetails}>
                    {mockChildProfile.languages.join(' • ')}
                  </Text>
                  <View style={styles.profileStats}>
                    <View style={styles.profileStat}>
                      <Trophy size={14} color={Colors.light.warning} />
                      <Text style={styles.profileStatText}>{totalPoints} points</Text>
                    </View>
                    <View style={styles.profileStat}>
                      <Target size={14} color={Colors.light.success} />
                      <Text style={styles.profileStatText}>{mockProgressStats.completedEpisodes} episodes</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setShowProfileModal(true)}
                >
                  <Edit3 size={16} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Recent Achievements */}
          <View style={styles.achievementsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
              <TouchableOpacity>
                <Text style={styles.sectionViewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.achievementsList}>
              {recentAchievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <AchievementBadge achievement={achievement} size="medium" />
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Teddy Section */}
          <View style={styles.teddySection}>
            <Text style={styles.sectionTitle}>Bern the Bear</Text>
            
            <View style={styles.teddyCard}>
              <LinearGradient
                colors={[Colors.light.cardBackground, Colors.light.secondary + '05']}
                style={styles.teddyCardGradient}
              >
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
                    <Text style={styles.teddyDescription}>
                      Your magical Spanish learning companion
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.customizeButton}
                    onPress={() => setShowTeddyCustomization(true)}
                  >
                    <Palette size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.teddyStats}>
                  <View style={styles.teddyStatItem}>
                    <BatteryMedium size={16} color={Colors.light.text} />
                    <Text style={styles.teddyStatText}>{mockTeddyBear.batteryLevel}%</Text>
                  </View>
                  
                  <View style={styles.teddyStatItem}>
                    <Clock size={16} color={Colors.light.text} />
                    <Text style={styles.teddyStatText}>
                      {new Date(mockTeddyBear.lastSyncDate).toLocaleTimeString()}
                    </Text>
                  </View>
                  
                  <View style={styles.teddyStatItem}>
                    <WifiIcon size={16} color={Colors.light.text} />
                    <Text style={styles.teddyStatText}>Wi-Fi</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>
          
          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.settingsCard}>
              {/* Audio & Visual */}
              <View style={styles.settingGroup}>
                <Text style={styles.settingGroupTitle}>Audio & Visual</Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: Colors.light.secondary + '30' }]}>
                      <VolumeIcon size={20} color={Colors.light.secondary} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingText}>Volume</Text>
                      <Text style={styles.settingDescription}>Adjust audio levels</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={Colors.light.text} />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: Colors.light.accent + '30' }]}>
                      <Palette size={20} color={Colors.light.accent} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingText}>Theme</Text>
                      <Text style={styles.settingDescription}>Light or dark mode</Text>
                    </View>
                  </View>
                  <Switch 
                    trackColor={{ false: '#E6E8EB', true: Colors.light.primary + '70' }}
                    thumbColor={darkModeEnabled ? Colors.light.primary : '#F4F3F4'}
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: Colors.light.primary + '30' }]}>
                      <Zap size={20} color={Colors.light.primary} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingText}>Auto-play</Text>
                      <Text style={styles.settingDescription}>Automatically continue episodes</Text>
                    </View>
                  </View>
                  <Switch 
                    trackColor={{ false: '#E6E8EB', true: Colors.light.primary + '70' }}
                    thumbColor={autoPlayEnabled ? Colors.light.primary : '#F4F3F4'}
                    value={autoPlayEnabled}
                    onValueChange={setAutoPlayEnabled}
                  />
                </View>
              </View>

              {/* Notifications */}
              <View style={styles.settingGroup}>
                <Text style={styles.settingGroupTitle}>Notifications</Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: Colors.light.warning + '30' }]}>
                      <Bell size={20} color={Colors.light.warning} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingText}>Learning Reminders</Text>
                      <Text style={styles.settingDescription}>Daily practice notifications</Text>
                    </View>
                  </View>
                  <Switch 
                    trackColor={{ false: '#E6E8EB', true: Colors.light.primary + '70' }}
                    thumbColor={notificationsEnabled ? Colors.light.primary : '#F4F3F4'}
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                  />
                </View>
              </View>

              {/* Account & Privacy */}
              <View style={styles.settingGroup}>
                <Text style={styles.settingGroupTitle}>Account & Privacy</Text>
                
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: Colors.light.error + '30' }]}>
                      <Lock size={20} color={Colors.light.error} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingText}>Privacy Settings</Text>
                      <Text style={styles.settingDescription}>Data and privacy controls</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={Colors.light.text} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: Colors.light.success + '30' }]}>
                      <Globe size={20} color={Colors.light.success} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingText}>Language</Text>
                      <Text style={styles.settingDescription}>App display language</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Support Section */}
          <View style={styles.supportSection}>
            <Text style={styles.sectionTitle}>Support & About</Text>
            
            <TouchableOpacity style={styles.supportButton}>
              <View style={styles.supportButtonLeft}>
                <HelpCircle size={20} color={Colors.light.primary} />
                <Text style={styles.supportButtonText}>Help & Support</Text>
              </View>
              <ChevronRight size={16} color={Colors.light.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportButton}>
              <View style={styles.supportButtonLeft}>
                <Heart size={20} color={Colors.light.error} />
                <Text style={styles.supportButtonText}>Rate the App</Text>
              </View>
              <ChevronRight size={16} color={Colors.light.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportButton}>
              <View style={styles.supportButtonLeft}>
                <InfoIcon size={20} color={Colors.light.secondary} />
                <Text style={styles.supportButtonText}>About</Text>
              </View>
              <ChevronRight size={16} color={Colors.light.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.logoutButton}>
              <LogOut size={20} color={Colors.light.error} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Modals */}
      {renderProfileModal()}
      {renderTeddyCustomization()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.select({
      android: StatusBar.currentHeight,
      ios: 0,
      web: 0,
    }),
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.select({
      ios: 60,
      android: 16,
      web: 60,
    }),
    paddingBottom: 40,
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
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.light.warning,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.cardBackground,
  },
  avatarBadgeText: {
    fontFamily: 'LilitaOne',
    fontSize: 10,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 4,
  },
  profileDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 12,
  },
  profileStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileStatText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    marginLeft: 4,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 20,
    color: Colors.light.text,
  },
  sectionViewAll: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.primary,
  },
  achievementsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.light.text,
    marginTop: 8,
    textAlign: 'center',
  },
  teddySection: {
    marginBottom: 24,
  },
  teddyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  teddyCardGradient: {
    padding: 20,
  },
  teddyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teddyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  teddyInfo: {
    flex: 1,
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
    marginBottom: 4,
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
  teddyDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.6,
  },
  customizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teddyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 12,
  },
  teddyStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teddyStatText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    marginLeft: 6,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingGroup: {
    paddingVertical: 8,
  },
  settingGroupTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.light.background,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  settingDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.6,
  },
  supportSection: {
    marginBottom: 40,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  supportButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.error + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.light.error + '30',
  },
  logoutButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalCloseText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  modalTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
  },
  modalSaveText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.light.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  profileEditSection: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  avatarEditContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatarEdit: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.light.primary,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.light.cardBackground,
  },
  profileFields: {
    gap: 16,
  },
  profileField: {
    marginBottom: 8,
  },
  profileFieldLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 6,
  },
  profileFieldInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  profileFieldValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  languageChips: {
    flexDirection: 'row',
    gap: 8,
  },
  languageChip: {
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  languageChipText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.primary,
  },
  learningPreferences: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
  },
  preferenceItem: {
    marginBottom: 20,
  },
  preferenceLabel: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyOption: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  difficultyOptionSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  difficultyOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
  },
  difficultyOptionTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  goalSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  goalOption: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  goalOptionSelected: {
    backgroundColor: Colors.light.success,
    borderColor: Colors.light.success,
  },
  goalOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.light.text,
  },
  goalOptionTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  teddyCustomizationSection: {
    alignItems: 'center',
  },
  customizationOptions: {
    width: '100%',
    marginTop: 20,
  },
  customizationSectionTitle: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  customizationGroup: {
    marginBottom: 24,
  },
  customizationLabel: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: Colors.light.primary,
  },
  accessoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accessoryOption: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  accessoryOptionSelected: {
    backgroundColor: Colors.light.secondary,
    borderColor: Colors.light.secondary,
  },
  accessoryOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
  },
  accessoryOptionTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  outfitOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  outfitOption: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  outfitOptionSelected: {
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.accent,
  },
  outfitOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.text,
  },
  outfitOptionTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
});