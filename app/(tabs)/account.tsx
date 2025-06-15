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
  Pressable,
  Image
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
  X,
  Info
} from 'lucide-react-native';
import { router } from 'expo-router';
import { mockChildProfile, mockTeddyBear } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Markdown, { Renderer } from 'react-native-marked';

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

  // State for Privacy Policy Modal
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);

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
Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, do not use the Product. By using the Product, you agree to this privacy policy. This policy may change from time to time (see Changes to Our Privacy Policy). Your continued use of the Product after we revise this policy means you accept those changes, so please check the policy periodically for updates.

II. Children Under the Age of 13
The Children's Online Privacy Protection Act of 1998 and its rules (collectively, "COPPA") require us to inform parents and legal guardians (as used in this section, "parents") about our practices for collecting, using, and disclosing personal information from children under the age of 13 ("children"). It also requires us to obtain verifiable consent from a child's parent for certain collection, use, and disclosure of the child's personal information.
This section notifies parents of:
* The types of personal information we may collect from children.
* How we use the information we collect.
* Our practices for disclosing that information.
* Our practices for notifying and obtaining parents' consent when we collect personal information from children, including how a parent may revoke consent.
* All operators that collect or maintain information from children through this Product.
This section only applies to children under the age of 13 and supplements the other provisions of this privacy policy. Only the other provisions of this privacy policy apply to teens and adults.
Terms that are defined in the general privacy policy have the same meanings as used in this Privacy Policy for Children Under the Age of 13.

A. Information We Collect from Children
Children can access many features of the Product and its content without providing us with personal information beyond the audio of children speaking to the device. However, a child may provide personal information while speaking to the Product during some interactions which would cause use to collect the personal information.
We only collect as much information about a child as is reasonably necessary for the child to participate in an activity, and we do not condition his or her participation on the disclosure of more personal information than is reasonably necessary.

1. Information We Collect Directly
A child or the child's parent must provide us with the following information to use the Product: the child's age, language preference and language proficiency level and a parent's email address. We also request the child's first name, but this is optional, and a child does not need to provide a first name to use the Product. During interactions with the Product, we may request the same information or additional information from your child, but this information is also optional, and the interaction can proceed even if the child does not provide it.
We enable children to control and interact with the Product using their voice ("Voice Activated Commands"). Use of Voice Activated Commands results in the temporary collection voice commands. We only use the audio generated from the Voice Activated Commands to execute those instructions and do not make other uses of the audio. We do not store any audio files.


2. Automatic Information Collection
We use technology to automatically collect information from our users, including children, when they interact with the Product. The information we collect through the Product may include:
* One or more persistent identifiers that can be used to recognize a user over time.
* Product usage information, such as time spent using the Product, time spent on an activity, activities played, and language learning progress.
We also may combine non-personal information we collect through these technologies with personal information about you or your child that we collect online.
For information about our automatic information collection practices, including how you can opt out of certain information collection, see the "Information We Collect Through Automatic Data Collection Technologies" and "Choices About How We Use and Disclose Your Information" sections of this privacy policy.

B. How We Use Your Child's Information
We use the personal information we collect from parents about their children and from children to:
* register him or her with the Product;
* personalize his or her language-learning experience;
* track his or her language-learning process;
* give parents insights into how their children use the Product, if they have opted in; and
* improve the Product.

We use the audio of the Voice Activated Commands streamed by the Product to transcribe that speech into text using a third-party speech-to-text service. No audio file is stored.
If a child provides personal information to the Product during a Voice Activated Command, we may use that information to enrich the Product's conversation with the child. These conversations are only retained by a third-party artificial intelligence service through the length of a particular conversation and this third-party does not retain information for any purposes, including for training purposes. We do this by passing that information to a third-party artificial intelligence language model that produces responses to the child's Voice Activated Commands. The language model's responses may be affected by or contain the personal information provided in the Voice Activated Command. Those responses are produced in text form and then passed to a text-to-speech service to produce audio output for the Product.
The Product may keep a written representation of the history of the child's interactions with the Product for up to 90 days to provide a better conversational experience and to provide parents with a transcript of their child's interactions with the Product, if they have opted into parental insights. We may retain a written representation of the Voice Activated Command, including personal information provided by the child as part of those interactions for up to 90 days, to study and process them to improve Product.

We use the information we collect automatically through technology (see Automatic Information Collection) and other non-personal information we collect to improve our Product and to deliver a better and more personalized experience by enabling us to:
* Estimate our audience size and usage patterns.
* Personalize language-learning experiences.
* Enhance and improve the Product's features.
* Identify bugs in the Product.
* Give parents insights into how their children use the Product, if they have opted in to parental insights.

C. Our Practices for Disclosing Children's Information
We do not share, sell, rent, or transfer children's personal information other than as described in this section.
We may disclose aggregated information about our users, and information that does not identify any individual. In addition, we may disclose children's personal information:
* To third parties we use to support the internal operations of our Product and who are bound by contractual or other obligations to use the information only for such purpose and to keep the information confidential.
* If we are required to do so by law or legal process, such as to comply with any court order or subpoena or to respond to any government or regulatory request.
* If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of the Company, our customers or others, including to:
* protect the safety of a child;
* protect the safety and security of the Product; or
* enable us to take precautions against liability.
* To law enforcement agencies or for an investigation related to public safety.
If the Company is involved in a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of the Company's assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding or event, we may transfer the personal information we have collected or maintain to the buyer or other successor.

D. Accessing and Correcting Your Child's Personal Information
At any time, you may review the child's personal information maintained by us, require us to correct or delete the personal information, and/or refuse to permit us from further collecting or using the child's information.
You can review, change, or delete your child's personal information by:
* Sending us an email at berndottech@gmail.com. To protect your privacy and security, we may require you to take certain steps or provide additional information to verify your identity before we provide any information or make corrections.

Operators That Collect or Maintain Information from Children
The following are all operators that may collect or maintain personal information from children through the Product:



Operator Name
Amazon Web Services
OpenAI
Google LLC, for backend services via Firebase

Please direct inquiries about any third-party operator's privacy practices and use of children's information to the following operator:
Bern Technologies Inc.
420 Chapel Drive, Durham, North Carolina 27708, PO 94396
berndottech@gmail.com

Residents of certain states under 13, 16, or 18 years of age may have additional rights regarding the collection and sale of their personal information. Please see Your State Privacy Rights for more information.

III. Information We Collect and How We Collect It
We collect information from and about users of our Product:
* Directly from you when you provide it to us.
* Automatically when you use the Product.

A. Information You Provide to Us
When you create an account, or use this Product, we may ask you to provide information:
* By which you may be personally identified, such as name, postal address, email address, telephone number, or any other information the Product collects that is defined as personal or personally identifiable information under an applicable law ("personal information").
* That is about you but individually does not identify you, such as language preference and language proficiency level.
This information includes:
* Information that you provide at the time of creating an account for the Product. We may also ask you for information when you report a problem with the Product.
* Records and copies of your correspondence (including email addresses and phone numbers), if you contact us.
* Your responses to surveys that we might ask you to complete for research purposes.
* Details of transactions you carry out with Bern and of the fulfillment of your orders.

B. Information We Collect Through Automatic Data Collection Technologies
As you interact with our Product, we may use automatic data collection technologies to collect certain information about your device and your usage activity and patterns, including:
* Usage Details. When you access and use the Product, we may automatically collect certain details of your access to and use of the Product, including logs and other communication data and the resources that you access and use on the Product.

If you do not want us to collect this information do not use the Product. For more information, see Your Choices About Our Collection, Use, and Disclosure of Your Information.
The technologies we use for automatic information collection may include:
* Cookies (or mobile cookies). A cookie is a small file placed on your smartphone. It may be possible to refuse to accept mobile cookies by activating the appropriate setting on your smartphone. However, if you select this setting you may be unable to access certain parts of our App.
* Web Beacons. Pages of the App [and our emails] may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages [or opened an email] and for other related app statistics (for example, recording the popularity of certain app content and verifying system and server integrity).

C. Third-Party Information Collection
When you use the Product, certain third parties may use automatic information collection technologies to collect information about you or your device. These third parties may include:
* App store and platform providers.
* Wireless network providers.

These third parties may use tracking technologies to collect information about you when you use this app. The information they collect may be associated with your personal information or they may collect information, including personal information, about your online activities over time and across different websites, apps, and other online services websites. They may use this information to provide you with interest-based (behavioral) advertising or other targeted content.
We do not control these third parties' tracking technologies or how they may be used. If you have any questions about an advertisement or other targeted content, you should contact the responsible provider directly.

IV. How We Use Your Information
We use information that we collect about you or that you provide to us, including any personal information, to:
* Provide you with the Product and its contents, and any other information, products, or services that you request from us.
* Verify your identity as the parent of a child using the Product.
* Persist a connection between the Product and our software services via WiFi.
* Fulfill any other purpose for which you provide it.
* Give you notices about your account, including expiration and renewal notices.
* Carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.
* Notify you when Product updates are available, and of changes to any products or services we offer or provide though it.

The usage information we collect helps us to improve our Product and to deliver a better and more personalized experience by enabling us to:
* Estimate our audience size and usage patterns.
* Store information about your preferences, allowing us to customize our Product according to your individual interests.
* Recognize you when you use the Product.
* Improve the Product for all users.

V. Disclosure of Your Information
We may disclose aggregated information about our users, and information that does not identify any individual or device, without restriction.
In addition, we may disclose personal information that we collect or you provide:
* To contractors, service providers, and other third parties we use to support our business and who are bound by contractual obligations to keep personal information confidential and use it only for the purposes for which we disclose it to them.
* To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of the Company's assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which personal information held by the Company about our Product users is among the assets transferred.
* To our subsidiaries and affiliates.
* To fulfill the purpose for which you provide it.
* For any other purpose disclosed by us when you provide the information.
* With your consent.
We may also disclose your personal information:
* To comply with any court order, law, or legal process, including to respond to any government or regulatory request.
* To enforce our rights arising from any contracts entered into between you and us, including billing and collection.
* If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of the Company, our customers, or others. This includes exchanging information with other companies and organizations for the purposes of fraud protection and credit risk reduction.

VI. Choices About How We Use and Disclose Your Information
We strive to provide you with choices regarding the personal information you provide to us. This section describes mechanisms we provide for you to control certain uses and disclosures of your information.
* Tracking Technologies. You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. If you disable or refuse cookies or block the use of other tracking technologies, some parts of the App may then be inaccessible or not function properly.
* Promotion by the Company. If you do not want us to use your email address or other contract information to promote our own or third parties' products or services, you can opt-out by sending us an email stating your request to berndottech@gmail.com.
Residents in certain states, such as California, may have additional personal information rights and choices. Please see Your State Privacy Rights for more information.

VII. Accessing and Correcting Your Personal Information
You may send us an email at berndottech@gmail.com to request access to, correct, or delete any personal information that you have provided to us. We cannot delete certain personal information except by also deleting your user account. We may not accommodate a request to change information if we believe the change would violate any law or legal requirement or cause the information to be incorrect.
Residents in certain states, such as California, may have additional personal information rights and choices. Please see Your State Privacy Rights for more information.

VIII. Your State Privacy Rights
State consumer privacy laws may provide their residents with additional rights regarding our use of their personal information.
Many states, including California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Montana, Oregon, Tennessee, Texas, Utah, and Virginia provide (now or in the future) their state residents with rights to:
* Confirm whether we process their personal information.
* Access and delete certain personal information.
* Correct inaccuracies in their personal information, taking into account the information's nature processing purpose (excluding Iowa and Utah).
* Data portability.
* Opt-out of personal data processing for:
* targeted advertising (excluding Iowa);
* sales; or
* profiling in furtherance of decisions that produce legal or similarly significant effects (excluding Iowa and Utah).
* Either limit (opt-out of) or require consent to process sensitive personal data or process personal data of minors under 18, 17, or 16 years old.
The exact scope of these rights may vary by state. To exercise any of these rights, send us an email at berndottech@gmail.com. To appeal a decision regarding a consumer rights request, send us an email at berndottech@gmail.com with "Appeal" in the subject line.
Nevada provides its residents with a limited right to opt-out of certain personal information sales. Residents who wish to exercise this sale opt-out rights may submit a request to this designated address: berndottech@gmail.com. However, please know we do not currently sell data triggering that statute's opt-out requirements.

IX. Data Security
We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. These measures include using:
* Encryption: AES-256 encryption (at rest) and TLS 1.2+ (in transit).
* Access Controls: Role-Based Access Control (RBAC) for authorized access.
* Data Minimization: Only storing necessary data for the Product's functioning and improvement.
* Secure Data Deletion: Inactive accounts are automatically deleted after [90 days] or upon parental request.
Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted through our Product. Any transmission of personal information is at your own risk. We are not responsible for circumvention of any privacy settings or security measures included through the Product.

X. Changes to Our Privacy Policy
We may update our privacy policy from time to time. If we make material changes to how we treat our users' personal information, it is our policy to notify you, by email to the primary email address specified in your account, as required by applicable law. You understand and agree that you will be deemed to have accepted the updated privacy policy if you continue to use the Product after the new privacy policy takes effect.
The date the privacy policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date active and deliverable email address for you and for periodically visiting this privacy policy to check for any changes.

XI. Contact Information
To ask questions or comment about this privacy policy and our privacy practices, contact us at:
berndottech@gmail.com
`;

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

  // Custom renderer for privacy policy markdown
  class PrivacyPolicyRenderer extends Renderer {
    heading1(text: string, _styles?: any): React.ReactNode {
      return (
        <Text key={this.getKey()} style={dynamicStyles.markdownContent}>
          {text}
        </Text>
      );
    }

    paragraph(children: React.ReactNode[], _styles?: any): React.ReactNode {
      return (
        <Text key={this.getKey()} style={dynamicStyles.markdownContent}>
          {children}
        </Text>
      );
    }

    list_item(text: string, _styles?: any): React.ReactNode {
      return (
        <Text key={this.getKey()} style={dynamicStyles.markdownContent}>
          {text}
        </Text>
      );
    }
  }

  const privacyPolicyRenderer = new PrivacyPolicyRenderer();

  const renderPrivacyPolicyModal = () => (
    <Modal visible={showPrivacyPolicyModal} transparent animationType="slide">
      <View style={dynamicStyles.privacyPolicyModalOverlay}>
        <View style={dynamicStyles.privacyPolicyModalContent}>
          <View style={dynamicStyles.privacyPolicyModalHeader}>
            <Text style={dynamicStyles.privacyPolicyModalTitle}>Privacy Policy</Text>
            <TouchableOpacity onPress={() => setShowPrivacyPolicyModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={dynamicStyles.privacyPolicyModalScroll}>
            <Markdown value={privacyPolicyContent} renderer={privacyPolicyRenderer} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

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
              <Image 
                source={require('../../assets/bernlogo.jpg')}
                style={dynamicStyles.teddyImage}
              />
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

          {/* Privacy Policy Link */}
          <TouchableOpacity style={dynamicStyles.settingItem} onPress={() => setShowPrivacyPolicyModal(true)}>
            <Info size={20} color={colors.primary} />
            <Text style={dynamicStyles.settingText}>Privacy Policy</Text>
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

      {/* Privacy Policy Modal */}
      {renderPrivacyPolicyModal()}
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
    teddyImage: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
      borderRadius: 20,
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
      fontFamily: 'OpenSans-Bold',
      marginBottom: 2,
    },
    preferenceSubtitle: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      fontFamily: 'OpenSans-Regular',
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
      fontFamily: 'OpenSans-Bold',
    },
    themeOptionTextSelected: {
      color: colors.primary,
      fontFamily: 'OpenSans-Bold',
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
      fontFamily: 'OpenSans-Bold',
    },
    logoutButton: {
      borderColor: colors.error + '30',
      borderWidth: 1,
    },
    logoutText: {
      color: colors.error,
      fontFamily: 'OpenSans-Bold',
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
    privacyPolicyModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    privacyPolicyModalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
      paddingTop: 20,
    },
    privacyPolicyModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    privacyPolicyModalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      fontFamily: 'Poppins-SemiBold',
    },
    privacyPolicyModalScroll: {
      padding: 20,
    },
    markdownContent: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
    },
  });
}