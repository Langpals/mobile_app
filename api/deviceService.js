// api/deviceService.js
import apiClient from './axiosConfig';
import * as SecureStore from 'expo-secure-store';

// Register device with user
export const registerDevice = async (deviceId) => {
  try {
    console.log('📱 Registering device:', deviceId);
    
    // Store device ID locally
    await SecureStore.setItemAsync('device_id', deviceId);
    
    // Update user document with device ID
    const response = await apiClient.post('/users/device', {
      deviceId
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error registering device:', error);
    throw error;
  }
};

// Get stored device ID
export const getStoredDeviceId = async () => {
  try {
    const deviceId = await SecureStore.getItemAsync('device_id');
    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    return null;
  }
};

// Connect device to teddy bear
export const connectDeviceToTeddy = async (deviceId) => {
  try {
    console.log('🔌 Connecting device to teddy:', deviceId);
    
    const response = await apiClient.post('/teddy/connect', {
      deviceId,
      connectionType: 'bluetooth' // or 'wifi' based on your implementation
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error connecting device to teddy:', error);
    throw error;
  }
};

// Get device connection status
export const getDeviceConnectionStatus = async () => {
  try {
    const response = await apiClient.get('/teddy/connection-status');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching connection status:', error);
    throw error;
  }
};

// Disconnect device from teddy
export const disconnectDeviceFromTeddy = async () => {
  try {
    const response = await apiClient.post('/teddy/disconnect');
    return response.data.data;
  } catch (error) {
    console.error('Error disconnecting device:', error);
    throw error;
  }
};