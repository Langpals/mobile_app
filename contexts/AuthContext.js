// contexts/AuthContext.js - Updated to work with new backend
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebase';
import { 
  registerUser as firebaseRegister, 
  loginUser as firebaseLogin, 
  logoutUser as firebaseLogout,
  resetPassword as firebaseResetPassword 
} from '../api/authService';
import { ensureUserDocument } from '../api/userService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserDocument, setCurrentUserDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔥 Auth state changed:', user ? user.uid : 'No user');
      
      try {
        if (user) {
          // User is signed in
          setCurrentUser(user);
          
          // Get and store the auth token
          const token = await user.getIdToken();
          await SecureStore.setItemAsync('auth_token', token);
          console.log('✅ Token saved to secure storage');
          
          // Ensure user document exists in backend
          try {
            console.log('🔄 Ensuring user document exists...');
            const userDocument = await ensureUserDocument();
            setCurrentUserDocument(userDocument);
            console.log('✅ User document ready');
          } catch (docError) {
            console.error('❌ Error loading user document:', docError);
            // Don't block authentication for this
          }
        } else {
          // User is signed out
          setCurrentUser(null);
          setCurrentUserDocument(null);
          
          // Remove token
          await SecureStore.deleteItemAsync('auth_token');
          console.log('🗑️ Token removed from secure storage');
        }
      } catch (error) {
        console.error('❌ Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Register a new user
  const register = async (email, password, displayName) => {
    setError(null);
    setLoading(true);
    
    try {
      console.log('📝 Registering user:', email);
      const result = await firebaseRegister(email, password, displayName);
      console.log('✅ User registered successfully:', result.firebaseUser.uid);
      
      // User document will be created automatically by onAuthStateChanged
      setLoading(false);
      return result;
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
      const result = await firebaseLogin(email, password);
      console.log('✅ User logged in successfully:', result.firebaseUser.uid);
      
      // User document will be loaded automatically by onAuthStateChanged
      setLoading(false);
      return result;
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
      await firebaseLogout();
      // State will be updated automatically by onAuthStateChanged
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
      await firebaseResetPassword(email);
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
    } catch (error) {
      console.error('❌ Error checking authentication:', error);
      return false;
    }
  };

  // Refresh user document
  const refreshUserDocument = async () => {
    try {
      if (currentUser) {
        console.log('🔄 Refreshing user document...');
        const userDocument = await ensureUserDocument();
        setCurrentUserDocument(userDocument);
        console.log('✅ User document refreshed');
        return userDocument;
      }
    } catch (error) {
      console.error('❌ Error refreshing user document:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    currentUserDocument,
    loading,
    error,
    register,
    login,
    logout,
    resetUserPassword,
    isAuthenticated,
    refreshUserDocument
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};