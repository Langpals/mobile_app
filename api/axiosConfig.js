// api/axiosConfig.js - Fixed configuration
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebase';

// Use the production URL directly to avoid confusion
const API_URL = 'https://realtimeserver-uhvw.onrender.com';

console.log('=== API CONFIG DEBUG ===');
console.log('API_URL configured as:', API_URL);
console.log('=======================');

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout for remote server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get fresh token
const getFreshToken = async () => {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      await SecureStore.setItemAsync('auth_token', token);
      console.log('🔄 Got fresh token');
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting fresh token:', error);
    return null;
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    console.log('Making API request to:', config.baseURL + config.url);
    
    try {
      let token = await SecureStore.getItemAsync('auth_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added auth token to request');
      }
      
      return config;
    } catch (error) {
      console.error('Error attaching auth token:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.message);
    
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      
      // Handle token refresh
      if (error.response.status === 401) {
        console.log('🔄 Token expired, attempting to refresh...');
        
        const freshToken = await getFreshToken();
        if (freshToken) {
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return apiClient(originalRequest);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;