// contexts/TeddyContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTeddy, saveTeddy, updateTeddyConnection } from '../api/teddyService';
import { useAuth } from './AuthContext';

// Create context
const TeddyContext = createContext();

// Provider component
export const TeddyProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [teddy, setTeddy] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teddy data when user changes
  useEffect(() => {
    const fetchTeddy = async () => {
      if (!currentUser) {
        setTeddy(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const teddyData = await getTeddy();
        setTeddy(teddyData);
        
        // Update connection status
        if (teddyData?.connectionStatus) {
          setIsConnected(teddyData.connectionStatus.isConnected || false);
          setBatteryLevel(teddyData.connectionStatus.batteryLevel || 0);
          setLastSync(teddyData.connectionStatus.lastSyncTime || null);
        }
        
        setLoading(false);
      } catch (err) {
        // If no teddy is found, don't show error
        if (err.response && err.response.status === 404) {
          setTeddy(null);
          setLoading(false);
          return;
        }
        
        console.error('Error fetching teddy:', err);
        setError('Failed to load teddy');
        setLoading(false);
      }
    };

    fetchTeddy();
  }, [currentUser]);

  // Create or update teddy
  const updateTeddy = async (teddyData) => {
    setLoading(true);
    try {
      const updatedTeddy = await saveTeddy(teddyData);
      setTeddy(updatedTeddy);
      setLoading(false);
      return updatedTeddy;
    } catch (err) {
      console.error('Error updating teddy:', err);
      setError('Failed to update teddy');
      setLoading(false);
      throw err;
    }
  };

  // Connect to teddy
  const connectTeddy = async (mockBatteryLevel = 78) => {
    setLoading(true);
    try {
      const updatedTeddy = await updateTeddyConnection(true, mockBatteryLevel);
      setTeddy(updatedTeddy);
      
      if (updatedTeddy?.connectionStatus) {
        setIsConnected(true);
        setBatteryLevel(updatedTeddy.connectionStatus.batteryLevel || mockBatteryLevel);
        setLastSync(updatedTeddy.connectionStatus.lastSyncTime || new Date().toISOString());
      }
      
      setLoading(false);
      return updatedTeddy;
    } catch (err) {
      console.error('Error connecting to teddy:', err);
      setError('Failed to connect to teddy');
      setLoading(false);
      throw err;
    }
  };

  // Disconnect from teddy
  const disconnectTeddy = async () => {
    setLoading(true);
    try {
      const updatedTeddy = await updateTeddyConnection(false, batteryLevel);
      setTeddy(updatedTeddy);
      
      if (updatedTeddy?.connectionStatus) {
        setIsConnected(false);
        setLastSync(updatedTeddy.connectionStatus.lastSyncTime || new Date().toISOString());
      }
      
      setLoading(false);
      return updatedTeddy;
    } catch (err) {
      console.error('Error disconnecting from teddy:', err);
      setError('Failed to disconnect from teddy');
      setLoading(false);
      throw err;
    }
  };

  const value = {
    teddy,
    isConnected,
    batteryLevel,
    lastSync,
    loading,
    error,
    updateTeddy,
    connectTeddy,
    disconnectTeddy
  };

  return <TeddyContext.Provider value={value}>{children}</TeddyContext.Provider>;
};

// Create a hook to use the teddy context
export const useTeddy = () => {
  const context = useContext(TeddyContext);
  if (context === undefined) {
    throw new Error('useTeddy must be used within a TeddyProvider');
  }
  return context;
};