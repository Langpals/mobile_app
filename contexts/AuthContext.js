// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../firebase/firebaseConfig';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword,
  getCurrentUser 
} from '../api/authService';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔥 Auth state changed:', user ? user.uid : 'No user');
      
      if (user) {
        // User is signed in, get fresh token
        try {
          const token = await user.getIdToken(true);
          await SecureStore.setItemAsync('auth_token', token);
          console.log('✅ Token saved to secure storage');
        } catch (error) {
          console.error('❌ Error saving token:', error);
        }
      } else {
        // User is signed out, remove token
        try {
          await SecureStore.deleteItemAsync('auth_token');
          console.log('🗑️ Token removed from secure storage');
        } catch (error) {
          console.error('❌ Error removing token:', error);
        }
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register a new user
  const register = async (email, password, displayName) => {
    setError(null);
    setLoading(true);
    
    try {
      console.log('📝 Registering user:', email);
      const user = await registerUser(email, password, displayName);
      console.log('✅ User registered successfully:', user.uid);
      setLoading(false);
      return user;
    } catch (err) {
      console.error('❌ Registration error:', err.message);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      console.log('🔑 Logging in user:', email);
      const user = await loginUser(email, password);
      console.log('✅ User logged in successfully:', user.uid);
      setLoading(false);
      return user;
    } catch (err) {
      console.error('❌ Login error:', err.message);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    setError(null);
    
    try {
      console.log('🚪 Logging out user');
      await logoutUser();
      setCurrentUser(null);
      console.log('✅ User logged out successfully');
    } catch (err) {
      console.error('❌ Logout error:', err.message);
      setError(err.message);
      throw err;
    }
  };

  // Reset password
  const resetUserPassword = async (email) => {
    setError(null);
    setLoading(true);
    
    try {
      console.log('🔄 Resetting password for:', email);
      await resetPassword(email);
      setLoading(false);
      console.log('✅ Password reset email sent');
    } catch (err) {
      console.error('❌ Password reset error:', err.message);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const hasToken = !!token;
      console.log('🔍 Checking authentication:', hasToken ? 'Has token' : 'No token');
      return hasToken;
    } catch (err) {
      console.error('Error checking authentication:', err);
      return false;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    resetUserPassword,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};