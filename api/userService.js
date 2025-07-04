// api/userService.js - Updated user service for Firebase integration
import apiClient from './axiosConfig';
import { auth } from '../config/firebase';

// Get user by Firebase UID
export const getUserByFirebaseUID = async (firebaseUID) => {
  try {
    const response = await apiClient.get(`/mobile/users/firebase/${firebaseUID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by Firebase UID:', error);
    throw error;
  }
};

// Create user document
export const createUserDocument = async (userData) => {
  try {
    const response = await apiClient.post('/mobile/users/create', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

// Ensure user document exists (create if doesn't exist)
export const ensureUserDocument = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // First try to get existing user document
    try {
      const existingUser = await getUserByFirebaseUID(user.uid);
      console.log('✅ User document exists');
      return existingUser;
    } catch (error) {
      // If user doesn't exist, create new document
      console.log('📝 Creating new user document...');
      
      const userData = {
        displayName: user.displayName || 'User',
        email: user.email,
        firebaseUID: user.uid
      };
      
      console.log('Creating user document:', userData);
      const newUser = await createUserDocument(userData);
      console.log('✅ User document created successfully');
      return newUser;
    }
  } catch (error) {
    console.error('❌ Error ensuring user document:', error);
    throw error;
  }
};

// Update user document
export const updateUserDocument = async (userData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const response = await apiClient.put(`/mobile/users/firebase/${user.uid}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

// Get user devices
export const getUserDevices = async () => {
  try {
    const response = await apiClient.get('/mobile/user/devices');
    return response.data;
  } catch (error) {
    console.error('Error fetching user devices:', error);
    return { devices: [], count: 0 };
  }
};

// Link device to user account
export const linkDeviceToAccount = async (deviceId, childId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const response = await apiClient.post('/auth/link-device', {
      device_id: deviceId,
      child_id: childId,
      firebase_uid: user.uid,
      parent_email: user.email
    });

    return response.data;
  } catch (error) {
    console.error('Error linking device to account:', error);
    throw error;
  }
};

// Get device metrics
export const getDeviceMetrics = async (deviceId) => {
  try {
    const response = await apiClient.get(`/mobile/device/${deviceId}/metrics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device metrics:', error);
    // Return mock data as fallback
    return {
      wordsLearned: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
      topicsLearned: ['Greetings', 'Politeness'],
      totalSessions: 5,
      totalMinutes: 45,
      currentEpisode: 2,
      currentSeason: 1,
      lastActivity: new Date().toISOString(),
      streakDays: 3
    };
  }
};

// Get device status
export const getDeviceStatus = async (deviceId) => {
  try {
    const response = await apiClient.get(`/mobile/device/${deviceId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device status:', error);
    return {
      connected: false,
      lastSeen: null,
      device_id: deviceId
    };
  }
};

// Get device transcripts
export const getDeviceTranscripts = async (deviceId, limit = 10) => {
  try {
    const response = await apiClient.get(`/mobile/device/${deviceId}/transcripts?limit=${limit}`);
    return response.data.transcripts || [];
  } catch (error) {
    console.error('Error fetching device transcripts:', error);
    return [];
  }
};

// Test device connection
export const testDeviceConnection = async (deviceId) => {
  try {
    const response = await apiClient.post(`/mobile/device/${deviceId}/test-connection`);
    return response.data;
  } catch (error) {
    console.error('Error testing device connection:', error);
    return {
      success: false,
      error: error.message,
      device_id: deviceId
    };
  }
};