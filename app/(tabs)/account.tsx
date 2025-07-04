// app/(tabs)/account.tsx - Complete Account Management Screen
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Animated,
  RefreshControl,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import {
  User,
  Settings,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Wifi,
  WifiOff,
  Star,
  Shield,
  Calendar,
  Clock
} from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAccountDetails,
  updateAccountInfo,
  addChildProfile,
  updateChildProfile,
  getChildProfiles,
  updateNotificationSettings,
  getSubscriptionStatus
} from '@/api/accountService';
import { DeviceService } from '@/api/deviceService';
import DeviceRegistrationFlow from '@/components/DeviceRegisterationFlow';

const { width, height } = Dimensions.get('window');

const CompleteAccountScreen = () => {
  const { user, logout } = useAuth();
  const [accountData, setAccountData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    subscription: 'free',
    avatar: null
  });
  const [childProfiles, setChildProfiles] = useState([]);
  const [deviceStatuses, setDeviceStatuses] = useState({});
  const [subscriptionData, setSubscriptionData] = useState(null);
  
  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  
  // Form states
  const [childFormData, setChildFormData] = useState({ name: '', age: '' });
  const [editingProfile, setEditingProfile] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    dailyProgress: true,
    weeklyReports: true,
    milestones: true,
    deviceStatus: true
  });
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadAccountData();
    animateIn();
  }, []);

  const animateIn = () => {
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
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  };

  const loadAccountData = async () => {
    setLoading(true);
    try {
      const [account, children, subscription] = await Promise.all([
        getAccountDetails(),
        getChildProfiles(),
        getSubscriptionStatus()
      ]);

      setAccountData(account);
      setChildProfiles(children);
      setSubscriptionData(subscription);

      // Load device statuses for children with devices
      await loadDeviceStatuses(children);
    } catch (error) {
      console.error('Error loading account data:', error);
      Alert.alert('Error', 'Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const loadDeviceStatuses = async (children) => {
    const statusPromises = children
      .filter(child => child.deviceId)
      .map(async (child) => {
        try {
          const status = await DeviceService.getDeviceStatus(child.deviceId);
          return { [child.id]: status };
        } catch (error) {
          return { [child.id]: { connected: false, lastSeen: null } };
        }
      });

    const statuses = await Promise.all(statusPromises);
    setDeviceStatuses(Object.assign({}, ...statuses));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAccountData();
    setRefreshing(false);
  };

  const handleUpdateProfile = async () => {
    setActionLoading(true);
    try {
      await updateAccountInfo({
        displayName: accountData.displayName,
        phoneNumber: accountData.phoneNumber
      });
      
      Haptics.successAsync();
      Alert.alert('Success', 'Profile updated successfully!');
      setEditingProfile(false);
    } catch (error) {
      Haptics.errorAsync();
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddChild = async () => {
    if (!childFormData.name || !childFormData.age) {
      Alert.alert('Missing Information', 'Please enter both name and age');
      return;
    }

    setActionLoading(true);
    try {
      const newChild = await addChildProfile({
        name: childFormData.name,
        age: parseInt(childFormData.age),
        avatar: 'bear'
      });

      setChildProfiles([...childProfiles, newChild]);
      setChildFormData({ name: '', age: '' });
      setShowChildModal(false);
      
      Haptics.successAsync();
      Alert.alert('Success', 'Child profile added successfully!');
    } catch (error) {
      Haptics.errorAsync();
      Alert.alert('Error', 'Failed to add child profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteChild = (child) => {
    Alert.alert(
      'Delete Child Profile',
      `Are you sure you want to delete ${child.name}'s profile? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // If child has a device, disconnect it first
              if (child.deviceId) {
                await DeviceService.disconnectDevice(child.deviceId);
              }
              
              // Remove from local state (you'd call API here)
              setChildProfiles(childProfiles.filter(c => c.id !== child.id));
              Haptics.successAsync();
            } catch (error) {
              Haptics.errorAsync();
              Alert.alert('Error', 'Failed to delete child profile');
            }
          }
        }
      ]
    );
  };

  const handleDeviceRegistrationSuccess = (deviceId) => {
    // Update the child with the new device ID
    const updatedChildren = childProfiles.map(child =>
      child.id === selectedChild.id ? { ...child, deviceId } : child
    );
    setChildProfiles(updatedChildren);
    setShowDeviceModal(false);
    setSelectedChild(null);
    
    // Refresh device statuses
    loadDeviceStatuses(updatedChildren);
  };

  const handleLogout = () => {
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
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={[Colors.light.primary + '20', Colors.light.secondary + '10']}
        style={styles.headerGradient}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={accountData.avatar ? { uri: accountData.avatar } : require('../../assets/icon.png')}
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
            <Text style={styles.userName}>
              {accountData.displayName || 'Parent'}
            </Text>
            <Text style={styles.userEmail}>
              {accountData.email}
            </Text>
            <View style={styles.subscriptionBadge}>
              <Star size={12} color={subscriptionData?.status === 'premium' ? '#FFD700' : '#999'} />
              <Text style={[styles.subscriptionText, { 
                color: subscriptionData?.status === 'premium' ? '#FFD700' : '#999' 
              }]}>
                {subscriptionData?.status === 'premium' ? 'Premium' : 'Free Plan'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderChildrenSection = () => (
    <Animated.View style={[styles.section, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Children</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowChildModal(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {childProfiles.map((child, index) => (
        <Animated.View
          key={child.id}
          style={[
            styles.childCard,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50 * (index + 1)]
                })
              }]
            }
          ]}
        >
          <View style={styles.childHeader}>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childAge}>{child.age} years old</Text>
            </View>
            
            <View style={styles.childActions}>
              {child.deviceId ? (
                <View style={styles.deviceStatus}>
                  {deviceStatuses[child.id]?.connected ? (
                    <Wifi size={20} color="#4CAF50" />
                  ) : (
                    <WifiOff size={20} color="#FF5722" />
                  )}
                  <Text style={[styles.deviceStatusText, {
                    color: deviceStatuses[child.id]?.connected ? '#4CAF50' : '#FF5722'
                  }]}>
                    {deviceStatuses[child.id]?.connected ? 'Online' : 'Offline'}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.connectDeviceButton}
                  onPress={() => {
                    setSelectedChild(child);
                    setShowDeviceModal(true);
                  }}
                >
                  <Text style={styles.connectDeviceText}>Connect Teddy</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.deleteChildButton}
                onPress={() => handleDeleteChild(child)}
              >
                <Trash2 size={18} color="#FF5722" />
              </TouchableOpacity>
            </View>
          </View>

          {child.deviceId && (
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceId}>Device: {child.deviceId}</Text>
              {deviceStatuses[child.id]?.lastSeen && (
                <Text style={styles.lastSeen}>
                  Last seen: {new Date(deviceStatuses[child.id].lastSeen).toLocaleString()}
                </Text>
              )}
            </View>
          )}
        </Animated.View>
      ))}

      {childProfiles.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No children added yet</Text>
          <Text style={styles.emptyStateSubtext}>Add your first child to get started</Text>
        </View>
      )}
    </Animated.View>
  );

  const renderSettingsSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Settings</Text>
      
      <TouchableOpacity style={styles.settingItem} onPress={() => setEditingProfile(true)}>
        <User size={24} color={Colors.light.primary} />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Edit Profile</Text>
          <Text style={styles.settingSubtitle}>Update your personal information</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem} onPress={() => setShowSettingsModal(true)}>
        <Bell size={24} color={Colors.light.primary} />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Notifications</Text>
          <Text style={styles.settingSubtitle}>Manage your notification preferences</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <CreditCard size={24} color={Colors.light.primary} />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Subscription</Text>
          <Text style={styles.settingSubtitle}>
            {subscriptionData?.status === 'premium' ? 'Manage premium plan' : 'Upgrade to premium'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Shield size={24} color={Colors.light.primary} />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Privacy & Security</Text>
          <Text style={styles.settingSubtitle}>Manage your data and security settings</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <HelpCircle size={24} color={Colors.light.primary} />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Help & Support</Text>
          <Text style={styles.settingSubtitle}>Get help and contact support</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
        <LogOut size={24} color="#FF5722" />
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: '#FF5722' }]}>Sign Out</Text>
          <Text style={styles.settingSubtitle}>Sign out of your account</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderProfileEditModal = () => (
    <Modal visible={editingProfile} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setEditingProfile(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleUpdateProfile} disabled={actionLoading}>
            {actionLoading ? (
              <ActivityIndicator size="small" color={Colors.light.primary} />
            ) : (
              <Text style={styles.modalSaveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Display Name</Text>
            <TextInput
              style={styles.formInput}
              value={accountData.displayName}
              onChangeText={(text) => setAccountData({ ...accountData, displayName: text })}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={[styles.formInput, styles.formInputDisabled]}
              value={accountData.email}
              editable={false}
            />
            <Text style={styles.formHint}>Email cannot be changed</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Phone Number</Text>
            <TextInput
              style={styles.formInput}
              value={accountData.phoneNumber}
              onChangeText={(text) => setAccountData({ ...accountData, phoneNumber: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderAddChildModal = () => (
    <Modal visible={showChildModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowChildModal(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Child</Text>
          <TouchableOpacity onPress={handleAddChild} disabled={actionLoading}>
            {actionLoading ? (
              <ActivityIndicator size="small" color={Colors.light.primary} />
            ) : (
              <Text style={styles.modalSaveText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Child's Name</Text>
            <TextInput
              style={styles.formInput}
              value={childFormData.name}
              onChangeText={(text) => setChildFormData({ ...childFormData, name: text })}
              placeholder="Enter child's name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Age</Text>
            <TextInput
              style={styles.formInput}
              value={childFormData.age}
              onChangeText={(text) => setChildFormData({ ...childFormData, age: text })}
              placeholder="Enter age"
              keyboardType="number-pad"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderNotificationSettingsModal = () => (
    <Modal visible={showSettingsModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Notifications</Text>
          <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
            <Text style={styles.modalSaveText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {Object.entries(notificationSettings).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.notificationItem}
              onPress={() => setNotificationSettings({
                ...notificationSettings,
                [key]: !value
              })}
            >
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
              </View>
              <View style={[styles.toggle, value && styles.toggleActive]}>
                <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading account...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderChildrenSection()}
        {renderSettingsSection()}
      </ScrollView>

      {/* Modals */}
      {renderProfileEditModal()}
      {renderAddChildModal()}
      {renderNotificationSettingsModal()}

      {/* Device Registration Flow */}
      <DeviceRegistrationFlow
        visible={showDeviceModal}
        child={selectedChild}
        onSuccess={handleDeviceRegistrationSuccess}
        onCancel={() => {
          setShowDeviceModal(false);
          setSelectedChild(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 8,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  childAge: {
    fontSize: 14,
    color: '#666',
  },
  childActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  deviceStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  connectDeviceButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  connectDeviceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteChildButton: {
    padding: 8,
  },
  deviceInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  lastSeen: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalSaveText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  formInputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  formHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: Colors.light.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleThumbActive: {
    marginLeft: 'auto',
  },
});

export default CompleteAccountScreen;