// api/accountService.js
import apiClient from './axiosConfig';
import { updateUserDocument } from './userService';

// Get complete account details
export const getAccountDetails = async () => {
  try {
    const response = await apiClient.get('/account/details');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching account details:', error);
    throw error;
  }
};

// Update account information
export const updateAccountInfo = async (accountData) => {
  try {
    const response = await apiClient.put('/account/update', accountData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating account info:', error);
    throw error;
  }
};

// Add child profile
export const addChildProfile = async (childData) => {
  try {
    const response = await apiClient.post('/account/children', {
      name: childData.name,
      age: childData.age,
      avatar: childData.avatar || 'default',
      preferences: childData.preferences || {}
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding child profile:', error);
    throw error;
  }
};

// Update child profile
export const updateChildProfile = async (childId, childData) => {
  try {
    const response = await apiClient.put(`/account/children/${childId}`, childData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating child profile:', error);
    throw error;
  }
};

// Get all child profiles
export const getChildProfiles = async () => {
  try {
    const response = await apiClient.get('/account/children');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching child profiles:', error);
    return [];
  }
};

// Update parent preferences
export const updateParentPreferences = async (preferences) => {
  try {
    const response = await apiClient.put('/account/preferences', preferences);
    return response.data.data;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Get subscription status
export const getSubscriptionStatus = async () => {
  try {
    const response = await apiClient.get('/account/subscription');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return {
      status: 'free',
      expiresAt: null,
      features: ['basic_learning']
    };
  }
};

// Update notification settings
export const updateNotificationSettings = async (settings) => {
  try {
    const response = await apiClient.put('/account/notifications', settings);
    return response.data.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};