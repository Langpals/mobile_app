// components/DeviceRegistrationFlow.js - Complete device registration UX
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { DeviceService } from '@/api/deviceService';
import { updateChildProfile } from '@/api/accountService';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

const DeviceRegistrationFlow = ({ 
  visible, 
  child, 
  onSuccess, 
  onCancel 
}) => {
  const [step, setStep] = useState(1); // 1: Enter ID, 2: Validating, 3: Testing, 4: Success
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  
  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (visible) {
      resetFlow();
      animateIn();
    }
  }, [visible]);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  };

  const resetFlow = () => {
    setStep(1);
    setDeviceId('');
    setLoading(false);
    setError('');
    setValidationResult(null);
  };

  const handleDeviceIdChange = (text) => {
    // Auto-format: ensure uppercase letters and numbers only
    const formatted = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (formatted.length <= 8) {
      setDeviceId(formatted);
      setError('');
    }
  };

  const validateDeviceFormat = () => {
    if (deviceId.length !== 8) {
      setError('Device ID must be exactly 8 characters');
      return false;
    }
    
    const format = /^[A-Z]{4}[0-9]{4}$/;
    if (!format.test(deviceId)) {
      setError('Format: 4 letters + 4 numbers (e.g., ABCD1234)');
      return false;
    }
    
    return true;
  };

  const handleContinue = async () => {
    if (!validateDeviceFormat()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setStep(2);

    try {
      // Step 1: Validate device ID format
      const validation = await DeviceService.validateDeviceId(deviceId);
      if (!validation.is_valid) {
        setError(validation.error_message);
        setStep(1);
        return;
      }

      // Step 2: Check if device is registered
      const registration = await DeviceService.checkDeviceRegistration(deviceId);
      if (!registration.registered) {
        setError('Device not found. Please check the ID and try again.');
        setStep(1);
        return;
      }

      setValidationResult(registration);
      setStep(3);

      // Step 3: Link device to child account
      await DeviceService.linkDeviceToAccount(deviceId, child.id);

      // Step 4: Update child profile with device ID
      await updateChildProfile(child.id, { deviceId });

      // Step 5: Test connection
      const connectionTest = await DeviceService.testDeviceConnection(deviceId);
      
      setStep(4);
      
      if (connectionTest.success) {
        Haptics.successAsync();
        setTimeout(() => {
          onSuccess(deviceId);
        }, 2000);
      } else {
        Alert.alert(
          'Device Linked Successfully',
          'Your teddy bear is linked but currently offline. It will connect automatically when powered on.',
          [{ text: 'OK', onPress: () => onSuccess(deviceId) }]
        );
      }

    } catch (error) {
      console.error('Device registration error:', error);
      setError(error.message || 'Failed to register device');
      setStep(1);
      Haptics.errorAsync();
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Ionicons name="hardware-chip-outline" size={60} color={Colors.light.primary} />
            <Text style={styles.title}>Connect {child?.name}'s Teddy Bear</Text>
            <Text style={styles.subtitle}>
              Enter the device ID found on the bottom of your teddy bear
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={deviceId}
                onChangeText={handleDeviceIdChange}
                placeholder="ABCD1234"
                placeholderTextColor="#999"
                maxLength={8}
                autoCapitalize="characters"
                autoCorrect={false}
                autoFocus={true}
              />
              {deviceId.length > 0 && (
                <View style={styles.formatHelper}>
                  <Text style={styles.formatText}>
                    Format: {deviceId.slice(0, 4)}{deviceId.length > 4 ? deviceId.slice(4) : '____'}
                  </Text>
                </View>
              )}
            </View>
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
            
            <TouchableOpacity
              style={[styles.button, deviceId.length !== 8 && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={deviceId.length !== 8 || loading}
            >
              <Text style={styles.buttonText}>Connect Teddy Bear</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.title}>Validating Device</Text>
            <Text style={styles.subtitle}>
              Checking device ID: {deviceId}
            </Text>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.title}>Connecting to Teddy Bear</Text>
            <Text style={styles.subtitle}>
              Linking {deviceId} to {child?.name}'s account
            </Text>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.light.success || '#4CAF50'} />
            <Text style={styles.title}>Successfully Connected!</Text>
            <Text style={styles.subtitle}>
              {child?.name}'s teddy bear is ready for learning
            </Text>
            <Text style={styles.deviceInfo}>Device ID: {deviceId}</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.stepIndicator}>
              {[1, 2, 3, 4].map((stepNum) => (
                <View
                  key={stepNum}
                  style={[
                    styles.stepDot,
                    step >= stepNum && styles.stepDotActive
                  ]}
                />
              ))}
            </View>
            
            {step === 1 && (
              <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          {renderStepContent()}

          {/* Cancel button for step 1 only */}
          {step === 1 && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: Colors.light.primary,
  },
  closeButton: {
    padding: 4,
  },
  stepContent: {
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
    backgroundColor: '#F8F8F8',
  },
  inputError: {
    borderColor: '#FF5252',
  },
  formatHelper: {
    marginTop: 8,
    alignItems: 'center',
  },
  formatText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'monospace',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  deviceInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontFamily: 'monospace',
  },
});

export default DeviceRegistrationFlow;