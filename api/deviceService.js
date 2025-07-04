// api/deviceService.js - Complete device management service
import apiClient from './axiosConfig';
import { auth } from '../config/firebase.js';

const API_BASE_URL = 'https://realtimeserver-uhvw.onrender.com'; // Replace with your backend URL

export class DeviceService {
  // Link a device to a child account
  static async linkDeviceToAccount(deviceId, childId) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/link-device`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_id: deviceId,
          child_id: childId,
          firebase_uid: user.uid,
          parent_email: user.email
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to link device');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Device linking error:', error);
      throw error;
    }
  }

  // Validate device ID format
  static async validateDeviceId(deviceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-device-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ device_id: deviceId })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Device validation error:', error);
      throw error;
    }
  }

  // Check if device is registered
  static async checkDeviceRegistration(deviceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify/${deviceId}`);
      return await response.json();
    } catch (error) {
      console.error('Device check error:', error);
      return { registered: false };
    }
  }

  // Get device connection status
  static async getDeviceStatus(deviceId) {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/ws/connection/${deviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        return { connected: false, lastSeen: null };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Device status error:', error);
      return { connected: false, lastSeen: null };
    }
  }

  // Get device metrics and statistics
  static async getDeviceMetrics(deviceId) {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/users/${deviceId}/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch device metrics');
      }
      
      const data = await response.json();
      
      return {
        wordsLearned: data.words_learnt || [],
        topicsLearned: data.topics_learnt || [],
        totalSessions: data.total_sessions || 0,
        totalMinutes: Math.round(data.total_session_time / 60) || 0,
        currentEpisode: data.current_episode || 1,
        currentSeason: data.current_season || 1,
        lastActivity: data.last_activity || null,
        streakDays: data.streak_days || 0
      };
    } catch (error) {
      console.error('Device metrics error:', error);
      throw error;
    }
  }

  // Get conversation transcripts
  static async getDeviceTranscripts(deviceId, limit = 10) {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/users/${deviceId}/transcripts?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        return [];
      }
      
      const data = await response.json();
      return data.transcripts || [];
    } catch (error) {
      console.error('Device transcripts error:', error);
      return [];
    }
  }

  // Test device connection
  static async testDeviceConnection(deviceId) {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/ws/test-connection/${deviceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Connection test error:', error);
      return { success: false, error: error.message };
    }
  }

  // Disconnect device
  static async disconnectDevice(deviceId) {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/ws/disconnect/${deviceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Device disconnect error:', error);
      throw error;
    }
  }

  // Get all connected devices for user
  static async getUserDevices() {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/users/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error('User devices error:', error);
      return [];
    }
  }
}

// Export individual functions for easier importing
export const {
  linkDeviceToAccount,
  validateDeviceId,
  checkDeviceRegistration,
  getDeviceStatus,
  getDeviceMetrics,
  getDeviceTranscripts,
  testDeviceConnection,
  disconnectDevice,
  getUserDevices
} = DeviceService;