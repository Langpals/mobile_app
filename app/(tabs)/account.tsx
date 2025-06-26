// app/(tabs)/account.tsx - Updated Account Page
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
  Pressable,
  Image
} from 'react-native';
import { 
  User, 
  Wifi, 
  Battery, 
  LogOut, 
  Bell,
  Clock,
  Save,
  X,
  Info,
  FileText
} from 'lucide-react-native';
import { router } from 'expo-router';
import { mockChildProfile, mockTeddyBear } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Markdown, { Renderer } from 'react-native-marked';
import Colors from '@/constants/Colors';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function AccountScreen() {
  const { logout, currentUser } = useAuth();
  const { colors, activeTheme } = useTheme();
  
  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('19:00'); // Default 7 PM
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [tempReminderTime, setTempReminderTime] = useState('19:00');

  // State for Privacy Policy and Terms Modal
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const privacyPolicyContent = `Bern Technologies Inc. Privacy Policy
Last modified: April 22, 2025

I. Introduction
Bern Technologies Inc. ("Company" or "We") respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes:
* The types of information we may collect or that you may provide when you access or use the Bern AI Teddy Bear (the "Product").
* Our practices for collecting, using, maintaining, protecting, and disclosing that information.

This policy applies only to information we collect through the Product.

This policy DOES NOT apply to information that:
* We collect offline or on any other Company apps or websites.
Our websites and apps may have their own privacy policies, which we encourage you to read before providing information on or through them.

Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, do not use the Product. By using the Product, you agree to this privacy policy. This policy may change from time to time (see Changes to Our Privacy Policy).

II. Children Under the Age of 13
The Children's Online Privacy Protection Act of 1998 and its rules (collectively, "COPPA") require us to inform parents and legal guardians about our practices for collecting, using, and disclosing personal information from children under the age of 13.

This section notifies parents of:
* The types of personal information we may collect from children
* How we use the information we collect
* Our practices for disclosing that information
* Our practices for notifying and obtaining parents' consent when we collect personal information from children

III. Information We Collect
We collect information about your child in several ways:
* Information you provide directly
* Information we collect automatically through technology
* Information from third-party sources

IV. How We Use Your Information
We use the information we collect to:
* Provide personalized learning experiences
* Track learning progress
* Improve our services
* Communicate with parents
* Ensure child safety

V. Information Sharing and Disclosure
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

VI. Data Security
We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.

VII. Your Rights and Choices
You have certain rights regarding your personal information, including:
* Access to your information
* Correction of inaccurate information
* Deletion of information
* Restriction of processing

VIII. Contact Information
For questions about this privacy policy, contact us at:
Email: berndottech@gmail.com

IX. Changes to This Policy
We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

This policy is effective as of the date listed above and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.`;

  const termsOfServiceContent = `Bern Technologies Inc. Terms of Service
Last modified: April 22, 2025

I. Acceptance of Terms
By accessing or using the Bern AI Teddy Bear product and associated services ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

II. Description of Service
Bern provides an AI-powered educational teddy bear designed to help children learn Spanish through interactive conversations and activities. The Service includes:
* Interactive learning sessions
* Progress tracking
* Parental insights and controls
* Educational content and games

III. User Accounts and Responsibilities
* You must provide accurate information when creating an account
* You are responsible for maintaining the security of your account
* You must be at least 18 years old to create an account
* Parent or guardian consent is required for children under 13
* You are responsible for all activities that occur under your account

IV. Privacy and Data Protection
Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information. By using the Service, you consent to the collection and use of information as described in our Privacy Policy.

V. Acceptable Use
You agree not to:
* Use the Service for any unlawful purposes
* Attempt to gain unauthorized access to our systems
* Share inappropriate content through the Service
* Violate any applicable laws or regulations
* Interfere with the proper functioning of the Service
* Use the Service to harm, threaten, or harass others

VI. Intellectual Property Rights
The Service and its original content, features, and functionality are owned by Bern Technologies Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

VII. Limitation of Liability
Bern Technologies Inc. shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you for the Service.

VIII. Indemnification
You agree to defend, indemnify, and hold harmless Bern Technologies Inc. from and against any claims, damages, costs, and expenses arising from your use of the Service.

IX. Termination
We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the Service.

X. Governing Law
These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Bern Technologies Inc. is incorporated.

XI. Changes to Terms
We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.

XII. Contact Information
For questions about these Terms, contact us at:
Email: berndottech@gmail.com

By using the Service, you acknowledge that you have read and understood these Terms and agree to be bound by them.`;

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
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      const [hour, minute] = time.split(':').map(Number);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time for Spanish! 🐻",
          body: `${mockChildProfile.name} is ready for today's adventure with Bern!`,
          sound: true,
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        } as any,
      });
      
      Alert.alert('Reminder Set!', `Daily reminder set for ${formatTime(time)}`);
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      Alert.alert('Error', 'Failed to schedule reminder.');
    }
  };

  const saveReminderTime = async () => {
    try {
      setReminderTime(tempReminderTime);
      await SecureStore.setItemAsync('reminder_time', tempReminderTime);
      if (reminderEnabled) {
        await scheduleDailyReminder(tempReminderTime);
      }
      setShowReminderModal(false);
    } catch (error) {
      console.error('Error saving reminder time:', error);
      Alert.alert('Error', 'Failed to save reminder time.');
    }
  };

  const formatTime = (time24: string) => {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  // Dynamic styles that adapt to theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 24,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 28,
      color: colors.text,
      fontFamily: 'Cubano',
      marginBottom: 8,
    },
    section: {
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    sectionTitle: {
      fontSize: 18,
      color: colors.text,
      fontFamily: 'Cubano',
      marginBottom: 5,
    },
    profileCard: {
      backgroundColor: Colors.light.background,
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
      backgroundColor: Colors.light.background,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      borderWidth: 0,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    teddyInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    teddyImage: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
      borderRadius: 13,
    },
    teddyDetails: {
      flex: 1,
    },
    teddyName: {
      fontSize: 18,
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
      backgroundColor: Colors.light.background,
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
    preferenceContent: {
      flex: 1,
    },
    preferenceTitle: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'Cubano',
      marginBottom: 4,
    },
    preferenceDescription: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
      fontFamily: 'OpenSans',
    },
    preferenceAction: {
      marginLeft: 'auto',
    },
    reminderTimeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '10',
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
      gap: 8,
    },
    reminderTimeText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      fontFamily: 'OpenSans',
    },
    changeText: {
      fontSize: 12,
      color: colors.primary,
      fontFamily: 'OpenSans-Bold',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 0,
      gap: 16,
    },
    settingText: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'OpenSans',
      flex: 1,
    },
    logoutButton: {
      // borderTopWidth: 1,
      // borderTopColor: colors.border,
      marginTop: 0,
    },
    logoutText: {
      color: colors.error,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      width: '100%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 18,
      color: colors.text,
      fontFamily: 'Cubano',
    },
    timeInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '10',
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
    },
    timeInput: {
      flex: 1,
      fontSize: 18,
      color: colors.text,
      fontFamily: 'OpenSans',
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontFamily: 'OpenSans-Bold',
    },
    cancelButtonText: {
      color: colors.text,
    },
    saveButtonText: {
      color: '#FFFFFF',
    },
    policyModalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 0,
      width: '90%',
      height: '85%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
      overflow: 'hidden',
    },
    policyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    policyTitle: {
      fontSize: 18,
      color: colors.text,
      fontFamily: 'Cubano',
    },
    policyScrollView: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    policyText: {
      fontSize: 14,
      color: colors.text,
      fontFamily: 'OpenSans',
      lineHeight: 22,
      paddingBottom: 40,
    },
    profileModalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 0,
      width: '100%',
      maxHeight: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    profileModalSection: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    profileModalSectionTitle: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'Cubano',
      marginBottom: 12,
    },
    profileModalCard: {
      backgroundColor: Colors.light.background,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    profileModalEmail: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'OpenSans',
    },
  });

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
        </View>

        {/* Profile */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={dynamicStyles.settingItem} onPress={() => setShowProfileModal(true)}>
            <User size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Teddy Bear Status */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Your Bear</Text>
          <View style={dynamicStyles.enhancedTeddyCard}>
            <View style={dynamicStyles.teddyInfo}>
              <Image 
                source={require('../../assets/bernlogo.jpg')}
                style={dynamicStyles.teddyImage}
              />
              <View style={dynamicStyles.teddyDetails}>
                <Text style={dynamicStyles.teddyName}>Teddy</Text>
                <View style={dynamicStyles.statusRow}>
                  <Wifi size={16} color={mockTeddyBear.connected ? colors.success : colors.error} />
                  <Text style={dynamicStyles.statusText}>
                    {mockTeddyBear.connected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
                <View style={dynamicStyles.statusRow}>
                  <Battery size={16} color={colors.text} />
                  <Text style={dynamicStyles.statusText}>{mockTeddyBear.batteryLevel}% Battery</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Notifications & Preferences */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Preferences</Text>
          
          <View style={dynamicStyles.preferenceCard}>
            <View style={dynamicStyles.preferenceHeader}>
              <View style={dynamicStyles.preferenceIconContainer}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View style={dynamicStyles.preferenceContent}>
                <Text style={dynamicStyles.preferenceTitle}>Daily Learning Reminders</Text>
                <Text style={dynamicStyles.preferenceDescription}>
                  Get notified when it's time for {mockChildProfile.name}'s Spanish practice
                </Text>
              </View>
              <View style={dynamicStyles.preferenceAction}>
                <Switch
                  value={reminderEnabled}
                  onValueChange={toggleReminder}
                  trackColor={{ false: colors.border, true: colors.primary + '30' }}
                  thumbColor={reminderEnabled ? colors.primary : colors.text}
                />
              </View>
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

        {/* Legal & Support */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Legal & Support</Text>
          
          <TouchableOpacity style={dynamicStyles.settingItem} onPress={() => setShowPrivacyPolicyModal(true)}>
            <Info size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={dynamicStyles.settingItem} onPress={() => setShowTermsModal(true)}>
            <FileText size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity style={[dynamicStyles.settingItem, dynamicStyles.logoutButton]} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={[dynamicStyles.settingText, dynamicStyles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="fade"
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.profileModalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {/* Email Section */}
            <View style={dynamicStyles.profileModalSection}>
              <Text style={dynamicStyles.profileModalSectionTitle}>Account Email</Text>
              <View style={[dynamicStyles.profileModalCard, { justifyContent: 'center' }]}>
                <Text style={dynamicStyles.profileModalEmail}>
                  {currentUser?.email || 'No email available'}
                </Text>
              </View>
            </View>

            {/* Child Profile Section */}
            <View style={dynamicStyles.profileModalSection}>
              <Text style={dynamicStyles.profileModalSectionTitle}>Child Profile</Text>
              <View style={dynamicStyles.profileModalCard}>
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
          </View>
        </View>
      </Modal>

      {/* Reminder Time Modal */}
      <Modal
        visible={showReminderModal}
        transparent
        animationType="fade"
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Set Reminder Time</Text>
              <TouchableOpacity onPress={() => setShowReminderModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={dynamicStyles.timeInputContainer}>
              <Clock size={20} color={colors.primary} />
              <TextInput
                style={dynamicStyles.timeInput}
                value={tempReminderTime}
                onChangeText={setTempReminderTime}
                placeholder="19:00"
                placeholderTextColor={colors.text + '50'}
              />
            </View>
            
            <View style={dynamicStyles.modalButtons}>
              <TouchableOpacity 
                style={[dynamicStyles.modalButton, dynamicStyles.cancelButton]}
                onPress={() => setShowReminderModal(false)}
              >
                <Text style={[dynamicStyles.modalButtonText, dynamicStyles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[dynamicStyles.modalButton, dynamicStyles.saveButton]}
                onPress={saveReminderTime}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={[dynamicStyles.modalButtonText, dynamicStyles.saveButtonText]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyPolicyModal}
        transparent
        animationType="slide"
        statusBarTranslucent={true}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.policyModalContent}>
            <View style={dynamicStyles.policyHeader}>
              <Text style={dynamicStyles.policyTitle}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setShowPrivacyPolicyModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={dynamicStyles.policyScrollView} 
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingTop: 10 }}
            >
              <Text style={dynamicStyles.policyText}>
                {privacyPolicyContent}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        visible={showTermsModal}
        transparent
        animationType="slide"
        statusBarTranslucent={true}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.policyModalContent}>
            <View style={dynamicStyles.policyHeader}>
              <Text style={dynamicStyles.policyTitle}>Terms of Service</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={dynamicStyles.policyScrollView} 
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingTop: 10 }}
            >
              <Text style={dynamicStyles.policyText}>
                {termsOfServiceContent}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}