// api/axiosConfig.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../firebase/firebaseConfig';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('=== API CONFIG DEBUG ===');
console.log('API_URL configured as:', API_URL);
console.log('Environment variable:', process.env.EXPO_PUBLIC_API_URL);
console.log('=======================');

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get fresh token
const getFreshToken = async () => {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true); // Force refresh
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

// Add a request interceptor to attach the auth token to each request
apiClient.interceptors.request.use(
  async (config) => {
    console.log('Making API request to:', config.baseURL + config.url);
    
    try {
      // Get token from secure storage
      let token = await SecureStore.getItemAsync('auth_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added auth token to request');
      } else {
        console.log('No auth token found');
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

// Add response interceptor for debugging and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.message);
    
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      
      // If we get a 401 (Unauthorized), try to refresh the token
      if (error.response.status === 401 && error.response.data?.message?.includes('expired')) {
        console.log('🔄 Token expired, attempting to refresh...');
        
        const freshToken = await getFreshToken();
        if (freshToken) {
          // Retry the original request with the fresh token
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          
          console.log('🔄 Retrying request with fresh token');
          return apiClient(originalRequest);
        } else {
          console.log('❌ Could not refresh token, user may need to login again');
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;