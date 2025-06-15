// app/(tabs)/account.tsx - Account Page with Full Theme Integration
import React, { useState, useEffect } from 'react';
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
  Switch,
  Modal,
  TextInput,
  Pressable
} from 'react-native';
import { 
  Settings, 
  User, 
  Wifi, 
  Battery, 
  Heart, 
  LogOut, 
  Moon,
  Sun,
  Monitor,
  Bell,
  Clock,
  Save,
  X
} from 'lucide-react-native';
import { router } from 'expo-router';
import { mockChildProfile, mockTeddyBear } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function AccountScreen() {
  const { logout, currentUser } = useAuth();
  const { themeMode, colors, setThemeMode, activeTheme } = useTheme();
  
  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('19:00'); // Default 7 PM
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [tempReminderTime, setTempReminderTime] = useState('19:00');

  // Load saved settings on component mount
  useEffect(() => {
    loadReminderSettings();
  }, []);

  const loadReminderSettings = async () => {
    try {
      const savedReminderEnabled = await SecureStore.getItemAsync('reminder_enabled');
      const savedReminderTime = await SecureStore.getItemAsync('reminder_time');
      
      if (savedReminderEnabled) setReminderEnabled(savedReminderEnabled === 'true');
      if (savedReminderTime) {
        setReminderTime(savedReminderTime);
        setTempReminderTime(savedReminderTime);
      }
    } catch (error) {
      console.error('Error loading reminder settings:', error);
    }
  };

  const handleThemeChange = async (mode: ThemeMode) => {
    try {
      await setThemeMode(mode);
      Alert.alert('Theme Updated', `Theme set to ${mode} mode`);
    } catch (error) {
      console.error('Error saving theme:', error);
      Alert.alert('Error', 'Failed to save theme preference');
    }
  };

  const toggleReminder = async (newValue: boolean) => {
    setReminderEnabled(newValue);
    try {
      await SecureStore.setItemAsync('reminder_enabled', String(newValue));
      if (newValue) {
        await scheduleDailyReminder(reminderTime);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        Alert.alert('Reminder Disabled', 'Daily learning reminders are now off.');
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
      Alert.alert('Error', 'Failed to save reminder preference.');
    }
  };

  const scheduleDailyReminder = async (time: string) => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear existing

    const [hours, minutes] = time.split(':').map(Number);

    const trigger = {
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to learn Spanish! 🇪🇸",
        body: 'Your daily dose of language learning awaits! 🔥',
      },
      trigger,
    });
    Alert.alert('Reminder Set', `Daily reminder scheduled for ${formatTime(time)}.`);
  };

  const updateReminderTime = async () => {
    // Basic validation for HH:MM format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(tempReminderTime)) {
      Alert.alert('Invalid Time', 'Please enter time in HH:MM format (e.g., 19:00).');
      return;
    }

    setReminderTime(tempReminderTime);
    try {
      await SecureStore.setItemAsync('reminder_time', tempReminderTime);
      if (reminderEnabled) {
        await scheduleDailyReminder(tempReminderTime);
      }
      setShowReminderModal(false);
      Alert.alert('Reminder Time Updated', `Daily reminder set for ${formatTime(tempReminderTime)}.`);
    } catch (error) {
      console.error('Error updating reminder time:', error);
      Alert.alert('Error', 'Failed to update reminder time.');
    }
  };

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon(themeMode);

  // Create dynamic styles based on current theme
  const dynamicStyles = createStyles(colors);

  return (
    <SafeAreaView style={[dynamicStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar 
        backgroundColor={colors.background} 
        barStyle={activeTheme === 'dark' ? 'light-content' : 'dark-content'} 
      />
      
      <ScrollView style={dynamicStyles.scrollView}>
        {/* Header */}
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.title}>Settings</Text>
          {currentUser && (
            <Text style={dynamicStyles.userEmail}>{currentUser.email}</Text>
          )}
        </View>

        {/* Child Profile */}
        <View style={dynamicStyles.section}>
          <View style={dynamicStyles.profileCard}>
            <View style={dynamicStyles.profileIcon}>
              <Text style={dynamicStyles.profileEmoji}>👶</Text>
            </View>
            <View style={dynamicStyles.profileInfo}>
              <Text style={dynamicStyles.profileName}>{mockChildProfile.name}</Text>
              <Text style={dynamicStyles.profileDetail}>Age: {mockChildProfile.age}</Text>
              <Text style={dynamicStyles.profileDetail}>Learning: Spanish</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Teddy Status with theme-aware styling */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Hola, {mockChildProfile.name}! 👋</Text>
          <View style={dynamicStyles.enhancedTeddyCard}>
            <View style={dynamicStyles.teddyInfo}>
              <Text style={dynamicStyles.teddyEmoji}>🧸</Text>
              <View style={dynamicStyles.teddyDetails}>
                <Text style={dynamicStyles.teddyName}>{mockTeddyBear.name}</Text>
                <View style={dynamicStyles.statusRow}>
                  <Wifi size={16} color={mockTeddyBear.connected ? colors.success : colors.error} />
                  <Text style={dynamicStyles.statusText}>
                    {mockTeddyBear.connected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
                <View style={dynamicStyles.statusRow}>
                  <Battery size={16} color={colors.warning} />
                  <Text style={dynamicStyles.statusText}>{mockTeddyBear.batteryLevel}% Battery</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* App Preferences */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>App Preferences</Text>
          
          {/* Theme Setting */}
          <View style={dynamicStyles.preferenceCard}>
            <View style={dynamicStyles.preferenceHeader}>
              <View style={dynamicStyles.preferenceIconContainer}>
                <ThemeIcon size={20} color={colors.primary} />
              </View>
              <View style={dynamicStyles.preferenceInfo}>
                <Text style={dynamicStyles.preferenceTitle}>Theme</Text>
                <Text style={dynamicStyles.preferenceSubtitle}>Choose your preferred appearance</Text>
              </View>
            </View>
            
            <View style={dynamicStyles.themeOptions}>
              {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
                const Icon = getThemeIcon(mode);
                return (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      dynamicStyles.themeOption,
                      themeMode === mode && dynamicStyles.themeOptionSelected
                    ]}
                    onPress={() => handleThemeChange(mode)}
                  >
                    <Icon 
                      size={18} 
                      color={themeMode === mode ? colors.primary : colors.text} 
                    />
                    <Text style={[
                      dynamicStyles.themeOptionText,
                      themeMode === mode && dynamicStyles.themeOptionTextSelected
                    ]}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Daily Reminder Setting */}
          <View style={dynamicStyles.preferenceCard}>
            <View style={dynamicStyles.preferenceHeader}>
              <View style={dynamicStyles.preferenceIconContainer}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View style={dynamicStyles.preferenceInfo}>
                <Text style={dynamicStyles.preferenceTitle}>Daily Reminder</Text>
                <Text style={dynamicStyles.preferenceSubtitle}>
                  Get notified when it's time to learn
                </Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{ false: colors.border, true: colors.primary + '40' }}
                thumbColor={reminderEnabled ? colors.primary : colors.text}
              />
            </View>

            {reminderEnabled && (
              <TouchableOpacity 
                style={dynamicStyles.reminderTimeButton}
                onPress={() => setShowReminderModal(true)}
              >
                <Clock size={16} color={colors.text} />
                <Text style={dynamicStyles.reminderTimeText}>
                  Reminder time: {formatTime(reminderTime)}
                </Text>
                <Text style={dynamicStyles.changeText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Settings */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={dynamicStyles.settingItem}>
            <User size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingText}>Child Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={dynamicStyles.settingItem}>
            <Heart size={20} color={colors.error} />
            <Text style={dynamicStyles.settingText}>Customize Teddy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={dynamicStyles.settingItem}>
            <Settings size={20} color={colors.secondary} />
            <Text style={dynamicStyles.settingText}>App Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={[dynamicStyles.settingItem, dynamicStyles.logoutButton]} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={[dynamicStyles.settingText, dynamicStyles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Reminder Time Modal with theme support */}
      <Modal
        visible={showReminderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReminderModal(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Set Reminder Time</Text>
              <TouchableOpacity
                onPress={() => setShowReminderModal(false)}
                style={dynamicStyles.modalCloseButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={dynamicStyles.timeInputContainer}>
              <Text style={dynamicStyles.timeInputLabel}>Reminder Time (24-hour format)</Text>
              <TextInput
                style={dynamicStyles.timeInput}
                value={tempReminderTime}
                onChangeText={setTempReminderTime}
                placeholder="19:00"
                placeholderTextColor={colors.text + '60'}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
              />
              <Text style={dynamicStyles.timeInputHelp}>
                Current: {formatTime(tempReminderTime)}
              </Text>
            </View>

            <TouchableOpacity
              style={dynamicStyles.saveButton}
              onPress={updateReminderTime}
            >
              <Save size={20} color={colors.background} />
              <Text style={dynamicStyles.saveButtonText}>Save Reminder Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Dynamic styles function that uses theme colors
function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.text,
      fontFamily: 'Cubano',
    },
    userEmail: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      fontFamily: 'OpenSans',
      marginTop: 4,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Cubano',
      marginBottom: 16,
    },
    profileCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    profileIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary + '20',
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
      color: colors.text,
      fontFamily: 'Cubano',
      marginBottom: 4,
    },
    profileDetail: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      fontFamily: 'OpenSans',
    },
    enhancedTeddyCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      borderWidth: 2,
      borderColor: colors.primary + '20',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
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
      color: colors.text,
      fontFamily: 'Cubano',
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
      color: colors.text,
      fontFamily: 'OpenSans',
    },
    preferenceCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    preferenceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    preferenceIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    preferenceInfo: {
      flex: 1,
    },
    preferenceTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: 'Poppins-SemiBold',
      marginBottom: 2,
    },
    preferenceSubtitle: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      fontFamily: 'Poppins-Regular',
    },
    themeOptions: {
      flexDirection: 'row',
      marginTop: 16,
      gap: 8,
    },
    themeOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      gap: 8,
    },
    themeOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    themeOptionText: {
      fontSize: 14,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
    },
    themeOptionTextSelected: {
      color: colors.primary,
      fontFamily: 'Poppins-SemiBold',
    },
    reminderTimeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 8,
    },
    reminderTimeText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
    },
    changeText: {
      fontSize: 14,
      color: colors.primary,
      fontFamily: 'Poppins-SemiBold',
    },
    settingItem: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 2,
      elevation: 1,
    },
    settingText: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
    },
    logoutButton: {
      borderColor: colors.error + '30',
      borderWidth: 1,
    },
    logoutText: {
      color: colors.error,
      fontFamily: 'Poppins-SemiBold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 24,
      width: '100%',
      maxWidth: 350,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Cubano',
    },
    modalCloseButton: {
      padding: 4,
    },
    timeInputContainer: {
      marginBottom: 24,
    },
    timeInputLabel: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'Poppins-SemiBold',
      marginBottom: 8,
    },
    timeInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
      backgroundColor: colors.background,
    },
    timeInputHelp: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      fontFamily: 'Poppins-Regular',
      marginTop: 8,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    saveButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Poppins-SemiBold',
    },
  });
}