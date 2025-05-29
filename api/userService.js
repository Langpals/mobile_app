// api/userService.js
import apiClient from './axiosConfig';

// Create user document in Firestore
export const createUserDocument = async (userData) => {
  try {
    console.log('Creating user document:', userData);
    const response = await apiClient.post('/users/create', userData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

// Get user document by Firebase UID
export const getUserByFirebaseUID = async (firebaseUID) => {
  try {
    const response = await apiClient.get(`/users/firebase/${firebaseUID}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user by Firebase UID:', error);
    throw error;
  }
};

// Get user document by incremental ID
export const getUserByIncrementalId = async (incrementalId) => {
  try {
    const response = await apiClient.get(`/users/${incrementalId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user by incremental ID:', error);
    throw error;
  }
};

// Update user document
export const updateUserDocument = async (incrementalId, userData) => {
  try {
    const response = await apiClient.put(`/users/${incrementalId}`, userData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};