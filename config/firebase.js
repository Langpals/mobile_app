// config/firebase.js - Fixed Firebase Configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase app is already initialized
let app;
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
} else {
  app = getApp(); // Use existing app
  console.log('✅ Using existing Firebase app');
}

// Initialize Auth with proper error handling
let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    // Check if auth is already initialized
    try {
      auth = getAuth(app);
    } catch (error) {
      // If not initialized, initialize with persistence
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    }
  }
  console.log('✅ Firebase Auth ready');
} catch (error) {
  console.error('❌ Firebase Auth initialization failed:', error);
  // Fallback to basic auth
  auth = getAuth(app);
}

// Initialize Firestore
let db;
try {
  db = getFirestore(app);
  console.log('✅ Firestore ready');
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
  throw error;
}

export { auth, db };
export default app;