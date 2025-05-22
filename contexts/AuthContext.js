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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // We'll fetch the additional user data only when needed, not on initial load
    });

    return unsubscribe;
  }, []);

  // Register a new user
  const register = async (email, password, displayName) => {
    setError(null);
    setLoading(true);
    
    try {
      const user = await registerUser(email, password, displayName);
      setLoading(false);
      return user;
    } catch (err) {
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
      const user = await loginUser(email, password);
      setLoading(false);
      return user;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    setError(null);
    
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset password
  const resetUserPassword = async (email) => {
    setError(null);
    setLoading(true);
    
    try {
      await resetPassword(email);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      return !!token;
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