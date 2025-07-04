// app/(tabs)/account.tsx - Enhanced with Modern UI and Full Functionality
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  Platform,
  StatusBar,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import {
  User,
  Wifi,
  WifiOff,
  Battery,
  Edit2,
  Save,
  X,
  ChevronRight,
  Smartphone,
  Trophy,
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  Settings,
  LogOut,
  Plus,
  Baby,
  Bell,
  Moon,
  Sun
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTeddy } from '@/contexts/TeddyContext';
import { 
  getAccountDetails, 
  updateAccountInfo, 
  addChildProfile,
  updateChildProfile,
  getChildProfiles 
} from '@/api/accountService';
import { getChildProgress } from '@/api/progressService';
import { registerDevice, getStoredDeviceId } from '@/api/deviceService';

const { width, height } = Dimensions.get('window');

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  progress: {
    wordsLearnt: string[];
    topicsLearnt: string[];
    timeSpentWithBear: number;
    currentSeason: number;
    currentEpisode: number;
    learningStreak: number;
  };
}

export default function AccountScreen() {
  const { currentUserDocument, logout, refreshUserDocument } = useAuth();
  const { colors, activeTheme, toggleTheme } = useTheme();
  const { teddy, isConnected, batteryLevel, connectTeddy, disconnectTeddy } = useTeddy();
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  
  // Account data
  const [accountData, setAccountData] = useState({
    displayName: currentUserDocument?.displayName || '',
    email: currentUserDocument?.email || '',
    phoneNumber: '',
    deviceId: '',
    subscription: 'free'
  });
  
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
  const [deviceId, setDeviceId] = useState('');
  const [tempDeviceId, setTempDeviceId] = useState('');
  
  // Child form data
  const [childFormData, setChildFormData] = useState({
    name: '',
    age: ''
  });
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const cardAnimations = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  
  useEffect(() => {
    loadAccountData();
    animateEntry();
  }, []);
  
  const animateEntry = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
    
    // Animate cards
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  };
  
  const loadAccountData = async () => {
    setLoading(true);
    try {
      // Load device ID
      const storedDeviceId = await getStoredDeviceId();
      if (storedDeviceId) {
        setDeviceId(storedDeviceId);
        setAccountData(prev => ({ ...prev, deviceId: storedDeviceId }));
      }
      
      // Load child profiles
      const profiles = await getChildProfiles();
      
      // Load progress for each child
      const profilesWithProgress = await Promise.all(
        profiles.map(async (child) => {
          const progress = await getChildProgress(child.id);
          return { ...child, progress };
        })
      );
      
      setChildProfiles(profilesWithProgress);
    } catch (error) {
      console.error('Error loading account data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProfile = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    
    try {
      await updateAccountInfo({
        displayName: accountData.displayName,
        phoneNumber: accountData.phoneNumber
      });
      
      await refreshUserDocument();
      
      Alert.alert('Success', 'Profile updated successfully!');
      setEditingProfile(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegisterDevice = async () => {
    if (!tempDeviceId || tempDeviceId.length !== 8) {
      Alert.alert('Invalid Device ID', 'Please enter a valid 8-character device ID (e.g., ABCD1234)');
      return;
    }
    
    if (!/^[A-Z]{4}[0-9]{4}$/.test(tempDeviceId)) {
      Alert.alert('Invalid Format', 'Device ID must be 4 uppercase letters followed by 4 numbers');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    
    try {
      await registerDevice(tempDeviceId);
      setDeviceId(tempDeviceId);
      setAccountData(prev => ({ ...prev, deviceId: tempDeviceId }));
      
      // Try to connect to teddy
      await connectTeddy();
      
      Alert.alert('Success', 'Device registered successfully!');
      setShowDeviceModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to register device. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddChild = async () => {
    if (!childFormData.name || !childFormData.age) {
      Alert.alert('Missing Information', 'Please enter both name and age');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    
    try {
      const newChild = await addChildProfile({
        name: childFormData.name,
        age: parseInt(childFormData.age),
        avatar: 'bear' // Default avatar
      });
      
      await loadAccountData();
      
      Alert.alert('Success', 'Child profile added successfully!');
      setShowChildModal(false);
      setChildFormData({ name: '', age: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to add child profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={[colors.primary + '20', colors.secondary + '10']}
        style={styles.headerGradient}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={() => setShowProfileModal(true)}
            >
              <Edit2 size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {accountData.displayName || 'Parent'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.text + '80' }]}>
              {accountData.email}
            </Text>
            <View style={styles.subscriptionBadge}>
              <Star size={12} color={colors.warning} />
              <Text style={[styles.subscriptionText, { color: colors.warning }]}>
                {accountData.subscription === 'premium' ? 'Premium' : 'Free Plan'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
  
  const renderDeviceSection = () => (
    <Animated.View 
      style={[
        styles.section, 
        { 
          opacity: cardAnimations[0],
          transform: [{ translateY: cardAnimations[0].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Smartphone size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Device & Teddy Bear</Text>
        </View>
        {!deviceId && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowDeviceModal(true)}
          >
            <Plus size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {deviceId ? (
          <>
            <View style={styles.deviceInfo}>
              <Text style={[styles.deviceLabel, { color: colors.text + '80' }]}>Device ID</Text>
              <Text style={[styles.deviceId, { color: colors.text }]}>{deviceId}</Text>
            </View>
            
            <View style={styles.connectionStatus}>
              <View style={styles.statusRow}>
                {isConnected ? (
                  <>
                    <Wifi size={20} color={colors.success} />
                    <Text style={[styles.statusText, { color: colors.success }]}>Connected</Text>
                  </>
                ) : (
                  <>
                    <WifiOff size={20} color={colors.error} />
                    <Text style={[styles.statusText, { color: colors.error }]}>Disconnected</Text>
                  </>
                )}
              </View>
              
              {isConnected && (
                <View style={styles.batteryRow}>
                  <Battery size={20} color={batteryLevel > 20 ? colors.success : colors.error} />
                  <Text style={[styles.batteryText, { color: colors.text }]}>{batteryLevel}%</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={[
                styles.connectionButton,
                { backgroundColor: isConnected ? colors.error + '20' : colors.primary }
              ]}
              onPress={isConnected ? disconnectTeddy : connectTeddy}
            >
              <Text style={[
                styles.connectionButtonText,
                { color: isConnected ? colors.error : '#fff' }
              ]}>
                {isConnected ? 'Disconnect' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.registerDevicePrompt}
            onPress={() => setShowDeviceModal(true)}
          >
            <Smartphone size={32} color={colors.primary + '40'} />
            <Text style={[styles.registerPromptText, { color: colors.text }]}>
              Register your device to connect with Teddy
            </Text>
            <View style={[styles.registerButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.registerButtonText}>Register Device</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
  
  const renderChildrenSection = () => (
    <Animated.View 
      style={[
        styles.section, 
        { 
          opacity: cardAnimations[1],
          transform: [{ translateY: cardAnimations[1].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Baby size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Children</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowChildModal(true)}
        >
          <Plus size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {childProfiles.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {childProfiles.map((child, index) => (
            <TouchableOpacity
              key={child.id}
              style={[styles.childCard, { backgroundColor: colors.card }]}
              onPress={() => setSelectedChild(child)}
            >
              <LinearGradient
                colors={[colors.primary + '20', colors.secondary + '10']}
                style={styles.childCardGradient}
              >
                <View style={styles.childAvatar}>
                  <Text style={styles.childAvatarText}>{child.name[0]}</Text>
                </View>
                <Text style={[styles.childName, { color: colors.text }]}>{child.name}</Text>
                <Text style={[styles.childAge, { color: colors.text + '80' }]}>Age {child.age}</Text>
                
                <View style={styles.childStats}>
                  <View style={styles.statItem}>
                    <BookOpen size={14} color={colors.primary} />
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {child.progress.wordsLearnt.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text + '60' }]}>Words</Text>
                  </View>
                  
                  <View style={styles.statDivider} />
                  
                  <View style={styles.statItem}>
                    <Trophy size={14} color={colors.warning} />
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {child.progress.currentEpisode}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text + '60' }]}>Episode</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity
          style={[styles.emptyCard, { backgroundColor: colors.card }]}
          onPress={() => setShowChildModal(true)}
        >
          <Baby size={32} color={colors.primary + '40'} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Add your child's profile to track progress
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
  
  const renderSettingsSection = () => (
    <Animated.View 
      style={[
        styles.section, 
        { 
          opacity: cardAnimations[2],
          transform: [{ translateY: cardAnimations[2].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Settings size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setShowProfileModal(true)}
        >
          <User size={20} color={colors.primary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Edit Profile</Text>
          <ChevronRight size={20} color={colors.text + '40'} />
        </TouchableOpacity>
        
        <View style={styles.settingDivider} />
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => {/* Handle notifications */}}
        >
          <Bell size={20} color={colors.primary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
          <ChevronRight size={20} color={colors.text + '40'} />
        </TouchableOpacity>
        
        <View style={styles.settingDivider} />
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={toggleTheme}
        >
          {activeTheme === 'light' ? (
            <Moon size={20} color={colors.primary} />
          ) : (
            <Sun size={20} color={colors.primary} />
          )}
          <Text style={[styles.settingText, { color: colors.text }]}>
            {activeTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <ChevronRight size={20} color={colors.text + '40'} />
        </TouchableOpacity>
        
        <View style={styles.settingDivider} />
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={logout}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.settingText, { color: colors.error }]}>Logout</Text>
          <ChevronRight size={20} color={colors.error + '40'} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
  
  const renderChildProgressModal = () => (
    <Modal
      visible={!!selectedChild}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedChild(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {selectedChild?.name}'s Progress
            </Text>
            <TouchableOpacity onPress={() => setSelectedChild(null)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {selectedChild && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.progressGrid}>
                <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
                  <BookOpen size={24} color={colors.primary} />
                  <Text style={[styles.progressValue, { color: colors.text }]}>
                    {selectedChild.progress.wordsLearnt.length}
                  </Text>
                  <Text style={[styles.progressLabel, { color: colors.text + '80' }]}>
                    Words Learnt
                  </Text>
                </View>
                
                <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
                  <Trophy size={24} color={colors.warning} />
                  <Text style={[styles.progressValue, { color: colors.text }]}>
                    {selectedChild.progress.topicsLearnt.length}
                  </Text>
                  <Text style={[styles.progressLabel, { color: colors.text + '80' }]}>
                    Topics Mastered
                  </Text>
                </View>
                
                <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
                  <Clock size={24} color={colors.secondary} />
                  <Text style={[styles.progressValue, { color: colors.text }]}>
                    {Math.floor(selectedChild.progress.timeSpentWithBear / 60)}h
                  </Text>
                  <Text style={[styles.progressLabel, { color: colors.text + '80' }]}>
                    Time with Teddy
                  </Text>
                </View>
                
                <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
                  <TrendingUp size={24} color={colors.success} />
                  <Text style={[styles.progressValue, { color: colors.text }]}>
                    {selectedChild.progress.learningStreak}
                  </Text>
                  <Text style={[styles.progressLabel, { color: colors.text + '80' }]}>
                    Day Streak
                  </Text>
                </View>
              </View>
              
              <View style={styles.currentProgress}>
                <Text style={[styles.progressSectionTitle, { color: colors.text }]}>
                  Current Progress
                </Text>
                <View style={[styles.seasonCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.seasonText, { color: colors.text }]}>
                    Season {selectedChild.progress.currentSeason}
                  </Text>
                  <Text style={[styles.episodeText, { color: colors.primary }]}>
                    Episode {selectedChild.progress.currentEpisode}
                  </Text>
                </View>
              </View>
              
              {selectedChild.progress.wordsLearnt.length > 0 && (
                <View style={styles.recentWords}>
                  <Text style={[styles.progressSectionTitle, { color: colors.text }]}>
                    Recent Words
                  </Text>
                  <View style={styles.wordsList}>
                    {selectedChild.progress.wordsLearnt.slice(-6).map((word, index) => (
                      <View key={index} style={[styles.wordChip, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.wordText, { color: colors.primary }]}>{word}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
  
  const renderProfileModal = () => (
    <Modal
      visible={showProfileModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowProfileModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowProfileModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={accountData.displayName}
                onChangeText={(text) => setAccountData(prev => ({ ...prev, displayName: text }))}
                placeholder="Enter your name"
                placeholderTextColor={colors.text + '60'}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={accountData.phoneNumber}
                onChangeText={(text) => setAccountData(prev => ({ ...prev, phoneNumber: text }))}
                placeholder="Enter phone number"
                placeholderTextColor={colors.text + '60'}
                keyboardType="phone-pad"
              />
            </View>
            
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Save size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  
  const renderDeviceModal = () => (
    <Modal
      visible={showDeviceModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDeviceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Register Device</Text>
            <TouchableOpacity onPress={() => setShowDeviceModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={[styles.deviceInstructions, { color: colors.text + '80' }]}>
              Enter the 8-character device ID found on your Teddy Bear
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Device ID</Text>
              <TextInput
                style={[styles.input, styles.deviceInput, { backgroundColor: colors.card, color: colors.text }]}
                value={tempDeviceId}
                onChangeText={(text) => setTempDeviceId(text.toUpperCase())}
                placeholder="ABCD1234"
                placeholderTextColor={colors.text + '60'}
                maxLength={8}
                autoCapitalize="characters"
              />
              <Text style={[styles.deviceFormat, { color: colors.text + '60' }]}>
                Format: 4 letters + 4 numbers
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleRegisterDevice}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Smartphone size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Register Device</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  
  const renderChildModal = () => (
    <Modal
      visible={showChildModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowChildModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Child Profile</Text>
            <TouchableOpacity onPress={() => setShowChildModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Child's Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={childFormData.name}
                onChangeText={(text) => setChildFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter child's name"
                placeholderTextColor={colors.text + '60'}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Age</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={childFormData.age}
                onChangeText={(text) => setChildFormData(prev => ({ ...prev, age: text }))}
                placeholder="Enter age"
                placeholderTextColor={colors.text + '60'}
                keyboardType="number-pad"
              />
            </View>
            
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleAddChild}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Baby size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Add Child</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor={colors.background} 
        barStyle={activeTheme === 'dark' ? 'light-content' : 'dark-content'} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={loadAccountData}
      >
        {renderHeader()}
        {renderDeviceSection()}
        {renderChildrenSection()}
        {renderSettingsSection()}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {renderProfileModal()}
      {renderDeviceModal()}
      {renderChildModal()}
      {renderChildProgressModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    marginBottom: 8,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    marginLeft: 4,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  deviceInfo: {
    marginBottom: 16,
  },
  deviceLabel: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    letterSpacing: 1,
  },
  connectionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    marginLeft: 8,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    marginLeft: 8,
  },
  connectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  connectionButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
  },
  registerDevicePrompt: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  registerPromptText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  registerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
  },
  childCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  childCardGradient: {
    padding: 16,
    alignItems: 'center',
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  childAvatarText: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
  },
  childName: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    marginBottom: 4,
  },
  childAge: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    marginBottom: 16,
  },
  childStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Outfit-Regular',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.light.border,
    marginHorizontal: 8,
  },
  emptyCard: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginLeft: 16,
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
  },
  deviceInput: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  deviceFormat: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
  deviceInstructions: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
    marginLeft: 8,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  progressCard: {
    width: '48%',
    margin: '1%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    marginTop: 4,
  },
  currentProgress: {
    marginBottom: 24,
  },
  progressSectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    marginBottom: 12,
  },
  seasonCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  seasonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginBottom: 4,
  },
  episodeText: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
  },
  recentWords: {
    marginBottom: 24,
  },
  wordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  wordText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
  },
  bottomPadding: {
    height: 40,
  },
});