// components/test/UserTestComponent.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers } from '@/api/userService';
import Colors from '@/constants/Colors';

export default function UserTestComponent() {
  const { currentUser, currentUserDocument, refreshUserDocument } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const users = await getAllUsers();
      setAllUsers(users);
      Alert.alert('Success', `Loaded ${users.length} users`);
    } catch (error) {
      Alert.alert('Error', `Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshCurrentUser = async () => {
    setLoading(true);
    try {
      await refreshUserDocument();
      Alert.alert('Success', 'User document refreshed');
    } catch (error) {
      Alert.alert('Error', `Failed to refresh: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testApiConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.29.132:5000/api/test'); // Update with your IP
      const data = await response.json();
      Alert.alert('API Test', `Status: ${data.success ? 'Success' : 'Failed'}\nMessage: ${data.message}`);
    } catch (error) {
      Alert.alert('API Test Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User System Test</Text>
      
      {/* Current User Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current User (Firebase)</Text>
        {currentUser ? (
          <View style={styles.userInfo}>
            <Text style={styles.infoText}>UID: {currentUser.uid}</Text>
            <Text style={styles.infoText}>Email: {currentUser.email}</Text>
            <Text style={styles.infoText}>Display Name: {currentUser.displayName || 'None'}</Text>
          </View>
        ) : (
          <Text style={styles.infoText}>No Firebase user</Text>
        )}
      </View>

      {/* Current User Document Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current User Document (Firestore)</Text>
        {currentUserDocument ? (
          <View style={styles.userInfo}>
            <Text style={styles.infoText}>Document ID: {currentUserDocument.id}</Text>
            <Text style={styles.infoText}>Email: {currentUserDocument.email}</Text>
            <Text style={styles.infoText}>Display Name: {currentUserDocument.displayName}</Text>
            <Text style={styles.infoText}>Role: {currentUserDocument.role}</Text>
            <Text style={styles.infoText}>Firebase UID: {currentUserDocument.firebaseUID}</Text>
          </View>
        ) : (
          <Text style={styles.infoText}>No Firestore user document</Text>
        )}
      </View>

      {/* Test Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Actions</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={testApiConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test API Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={refreshCurrentUser}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Refresh User Document</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.warningButton]} 
          onPress={fetchAllUsers}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Load All Users (Admin)</Text>
        </TouchableOpacity>
      </View>

      {/* All Users List */}
      {allUsers.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Users ({allUsers.length})</Text>
          {allUsers.map((user, index) => (
            <View key={user.id} style={styles.userItem}>
              <Text style={styles.userItemTitle}>{user.id}</Text>
              <Text style={styles.userItemText}>Email: {user.email}</Text>
              <Text style={styles.userItemText}>Name: {user.displayName}</Text>
              <Text style={styles.userItemText}>Role: {user.role}</Text>
            </View>
          ))}
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.light.text,
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primary,
  },
  userInfo: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  warningButton: {
    backgroundColor: Colors.light.warning,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.secondary,
  },
  userItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  userItemText: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.primary,
  },
});