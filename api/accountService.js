// api/accountService.js - Updated to work with new backend endpoints
import apiClient from './axiosConfig';
import { auth } from '../config/firebase';

// Get complete account details
export const getAccountDetails = async () => {
  try {
    const response = await apiClient.get('/mobile/account/details');
    return response.data;
  } catch (error) {
    console.error('Error fetching account details:', error);
    // Return fallback data
    return {
      displayName: auth.currentUser?.displayName || 'User',
      email: auth.currentUser?.email || '',
      phoneNumber: auth.currentUser?.phoneNumber,
      subscription: 'free',
      avatar: auth.currentUser?.photoURL
    };
  }
};

// Update account information
export const updateAccountInfo = async (accountData) => {
  try {
    const response = await apiClient.put('/mobile/account/details', accountData);
    return response.data;
  } catch (error) {
    console.error('Error updating account info:', error);
    throw error;
  }
};

// Add child profile
export const addChildProfile = async (childData) => {
  try {
    const response = await apiClient.post('/mobile/account/children', {
      name: childData.name,
      age: childData.age,
      avatar: childData.avatar || 'bear'
    });
    return response.data;
  } catch (error) {
    console.error('Error adding child profile:', error);
    throw error;
  }
};

// Update child profile
export const updateChildProfile = async (childId, childData) => {
  try {
    const response = await apiClient.put(`/mobile/account/children/${childId}`, childData);
    return response.data;
  } catch (error) {
    console.error('Error updating child profile:', error);
    throw error;
  }
};

// Get all child profiles
export const getChildProfiles = async () => {
  try {
    const response = await apiClient.get('/mobile/account/children');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching child profiles:', error);
    // Return mock data for development
    return [
      {
        id: "mock_child_1",
        name: "Emma",
        age: 6,
        avatar: "bear",
        deviceId: null,
        created_at: new Date().toISOString()
      }
    ];
  }
};

// Update parent preferences
export const updateParentPreferences = async (preferences) => {
  try {
    const response = await apiClient.put('/mobile/account/preferences', preferences);
    return response.data;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Get subscription status
export const getSubscriptionStatus = async () => {
  try {
    const response = await apiClient.get('/mobile/account/subscription');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return {
      status: 'free',
      expiresAt: null,
      features: ['basic_learning', 'single_device']
    };
  }
};

// Update notification settings
export const updateNotificationSettings = async (settings) => {
  try {
    const response = await apiClient.put('/mobile/account/notifications', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

// Get teddy bear information
export const getTeddy = async () => {
  try {
    const response = await apiClient.get('/mobile/teddy');
    return response.data;
  } catch (error) {
    console.error('Error fetching teddy:', error);
    // Return mock teddy data
    return {
      connectionStatus: {
        isConnected: false,
        batteryLevel: 85,
        lastSyncTime: new Date().toISOString()
      },
      name: "Bern",
      personality: "friendly_teacher"
    };
  }
};

// Save teddy configuration
export const saveTeddy = async (teddyData) => {
  try {
    const response = await apiClient.post('/mobile/teddy', teddyData);
    return response.data;
  } catch (error) {
    console.error('Error saving teddy:', error);
    throw error;
  }
};

// Get learning progress
export const getLearningProgress = async () => {
  try {
    const response = await apiClient.get('/mobile/learning/progress');
    return response.data;
  } catch (error) {
    console.error('Error fetching learning progress:', error);
    // Return mock progress data
    return {
      completedEpisodes: [
        {
          id: "ep_1",
          title: "First Meeting",
          season: 1,
          episode: 1,
          completedAt: new Date().toISOString(),
          score: 85
        }
      ],
      currentEpisode: {
        id: "ep_2",
        title: "Learning Colors",
        season: 1,
        episode: 2,
        progress: 60
      }
    };
  }
};