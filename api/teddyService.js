// api/teddyService.js
import apiClient from './axiosConfig';

// Get teddy for current user
export const getTeddy = async () => {
  try {
    const response = await apiClient.get('/teddy');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching teddy:', error);
    throw error;
  }
};

// Create or update teddy
export const saveTeddy = async (teddyData) => {
  try {
    const response = await apiClient.post('/teddy', teddyData);
    return response.data.data;
  } catch (error) {
    console.error('Error saving teddy:', error);
    throw error;
  }
};

// Update teddy connection status (mock for device connection)
export const updateTeddyConnection = async (isConnected, batteryLevel = 100) => {
  try {
    // This would typically send data to your backend
    // For now, we'll just update the teddy data
    const updateData = {
      connectionStatus: {
        isConnected,
        batteryLevel,
        lastSyncTime: new Date().toISOString()
      }
    };
    
    const response = await apiClient.post('/teddy', updateData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating teddy connection:', error);
    throw error;
  }
};