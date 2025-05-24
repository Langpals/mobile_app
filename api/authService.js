// api/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../firebase/firebaseConfig';
import apiClient from './axiosConfig';

// Get fresh ID token
const getFreshToken = async () => {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true); // Force refresh
      await SecureStore.setItemAsync('auth_token', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting fresh token:', error);
    return null;
  }
};

// Register a new user
export const registerUser = async (email, password, displayName) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });
    
    // Get fresh ID token
    const idToken = await getFreshToken();
    
    // Set default role as 'parent'
    try {
      await apiClient.post('/auth/set-role', { role: 'parent' });
    } catch (error) {
      console.log('Role setting failed (this is OK for testing):', error.message);
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get fresh ID token
    const idToken = await getFreshToken();
    
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    // Sign out from Firebase Auth
    await signOut(auth);
    
    // Remove token from secure storage
    await SecureStore.deleteItemAsync('auth_token');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get current user data from backend
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/user');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Set user role
export const setUserRole = async (role) => {
  try {
    const response = await apiClient.post('/auth/set-role', { role });
    return response.data;
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
};

// Export the token refresh function
export { getFreshToken };