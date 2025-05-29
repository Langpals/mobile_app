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
import { createUserDocument, getUserByFirebaseUID } from './userService';

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

// Create user document in Firestore
const ensureUserDocument = async (userData) => {
  try {
    console.log('🔄 Ensuring user document exists...');
    
    // First try to get the user
    try {
      const existingUser = await getUserByFirebaseUID(userData.firebaseUID);
      console.log('✅ User document already exists:', existingUser.id);
      return existingUser;
    } catch (error) {
      // User doesn't exist, create it
      if (error.response && error.response.status === 404) {
        console.log('📝 Creating new user document...');
        const newUser = await createUserDocument(userData);
        console.log('✅ User document created:', newUser.id);
        return newUser;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ Error ensuring user document:', error);
    throw error;
  }
};

// Register a new user
export const registerUser = async (email, password, displayName) => {
  try {
    console.log('📝 Registering new user:', email);
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });
    
    // Get fresh ID token
    const idToken = await getFreshToken();
    
    // Create user document in Firestore
    const userData = {
      firebaseUID: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: displayName || 'User'
    };
    
    const firestoreUser = await ensureUserDocument(userData);
    
    // Set default role as 'parent'
    try {
      await apiClient.post('/auth/set-role', { role: 'parent' });
    } catch (error) {
      console.log('Role setting failed (this is OK for testing):', error.message);
    }
    
    return {
      firebaseUser: userCredential.user,
      firestoreUser: firestoreUser
    };
  } catch (error) {
    console.error('❌ Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    console.log('🔑 Logging in user:', email);
    
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get fresh ID token
    const idToken = await getFreshToken();
    
    // Ensure user document exists in Firestore (for existing users who don't have one yet)
    const userData = {
      firebaseUID: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName || 'User'
    };
    
    const firestoreUser = await ensureUserDocument(userData);
    
    return {
      firebaseUser: userCredential.user,
      firestoreUser: firestoreUser
    };
  } catch (error) {
    console.error('❌ Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    console.log('🚪 Logging out user');
    
    // Sign out from Firebase Auth
    await signOut(auth);
    
    // Remove token from secure storage
    await SecureStore.deleteItemAsync('auth_token');
  } catch (error) {
    console.error('❌ Error logging out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    throw error;
  }
};

// Get current user data from backend
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/user');
    return response.data.data;
  } catch (error) {
    console.error('❌ Error fetching user data:', error);
    throw error;
  }
};

// Get current user's Firestore document
export const getCurrentUserDocument = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }
    
    const firestoreUser = await getUserByFirebaseUID(auth.currentUser.uid);
    return firestoreUser;
  } catch (error) {
    console.error('❌ Error fetching user document:', error);
    throw error;
  }
};

// Set user role
export const setUserRole = async (role) => {
  try {
    const response = await apiClient.post('/auth/set-role', { role });
    return response.data;
  } catch (error) {
    console.error('❌ Error setting user role:', error);
    throw error;
  }
};

// Export the token refresh function
export { getFreshToken };