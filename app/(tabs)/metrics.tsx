// app/(tabs)/metrics.tsx - Simplified for Single Child
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  MessageCircle,
  Wifi,
  WifiOff,
  Calendar,
  Award
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { DeviceService } from '@/api/deviceService';
import { getChildProfiles } from '@/api/accountService';

const SimplifiedMetricsScreen = () => {
  // State for single child
  const [childProfile, setChildProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChildData();
  }, []);

  const loadChildData = async () => {
    setLoading(true);
    try {
      // Get the first child (assuming single child per parent)
      const profiles = await getChildProfiles();
      const firstChild = profiles[0];
      
      if (!firstChild) {
        setLoading(false);
        return;
      }

      setChildProfile(firstChild);

      // If child has a device, load metrics
      if (firstChild.deviceId) {
        const [metricsData, transcriptsData, statusData] = await Promise.all([
          DeviceService.getDeviceMetrics(firstChild.deviceId),
          DeviceService.getDeviceTranscripts(firstChild.deviceId, 5),
          DeviceService.getDeviceStatus(firstChild.deviceId)
        ]);

        setMetrics(metricsData);
        setTranscripts(transcriptsData);
        setDeviceStatus(statusData);
      }
    } catch (error) {
      console.error('Error loading child data:', error);
      Alert.alert('Error', 'Failed to load learning data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadChildData();
    setRefreshing(false);
  }, []);

  const renderNoChild = () => (
    <View style={styles.noChildContainer}>
      <Text style={styles.noChildTitle}>No Child Profile Found</Text>
      <Text style={styles.noChildSubtitle}>
        Please add a child profile in the Account tab to see learning progress
      </Text>
    </View>
  );

  const renderNoDevice = () => (
    <View style={styles.noDeviceCard}>
      <WifiOff size={48} color="#999" />
      <Text style={styles.noDeviceTitle}>No Teddy Bear Connected</Text>
      <Text style={styles.noDeviceSubtitle}>
        Connect a teddy bear to see {childProfile?.name}'s learning progress
      </Text>
      <Text style={styles.deviceHint}>
        Go to Account → Connect Teddy Bear
      </Text>
    </View>
  );

  const renderDeviceStatus = () => (
    <View style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{childProfile?.name}'s Progress</Text>
          <Text style={styles.childAge}>{childProfile?.age} years old</Text>
        </View>
        
        <View style={styles.statusIcon}>
          {deviceStatus?.connected ? (
            <Wifi size={24} color="#4CAF50" />
          ) : (
            <WifiOff size={24} color="#FF5722" />
          )}
        </View>
      </View>
      
      <View style={styles.deviceDetails}>
        <Text style={styles.statusTitle}>
          Teddy Bear {deviceStatus?.connected ? 'Online' : 'Offline'}
        </Text>
        <Text style={styles.deviceId}>Device: {childProfile?.deviceId}</Text>
        {deviceStatus?.lastSeen && (
          <Text style={styles.lastSeen}>
            Last seen: {new Date(deviceStatus.lastSeen).toLocaleString()}
          </Text>
        )}
      </View>
    </View>
  );

  const renderMetricsCards = () => {
    if (!metrics) return null;

    const cards = [
      {
        icon: BookOpen,
        title: 'Words Learned',
        value: metrics.wordsLearned.length,
        subtitle: `Latest: ${metrics.wordsLearned.slice(-3).join(', ')}`,
        color: '#2196F3'
      },
      {
        icon: Target,
        title: 'Topics Mastered',
        value: metrics.topicsLearned.length,
        subtitle: metrics.topicsLearned.slice(-1).join(', ') || 'Getting started',
        color: '#4CAF50'
      },
      {
        icon: Clock,
        title: 'Learning Time',
        value: `${metrics.totalMinutes}m`,
        subtitle: `${metrics.totalSessions} sessions total`,
        color: '#FF9800'
      },
      {
        icon: TrendingUp,
        title: 'Current Episode',
        value: `S${metrics.currentSeason}E${metrics.currentEpisode}`,
        subtitle: `${metrics.streakDays} day streak`,
        color: '#9C27B0'
      }
    ];

    return (
      <View style={styles.metricsGrid}>
        {cards.map((card, index) => (
          <View key={index} style={[styles.metricCard, { borderLeftColor: card.color }]}>
            <View style={styles.metricHeader}>
              <card.icon size={24} color={card.color} />
              <Text style={styles.metricTitle}>{card.title}</Text>
            </View>
            <Text style={styles.metricValue}>{card.value}</Text>
            <Text style={styles.metricSubtitle} numberOfLines={1}>{card.subtitle}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderRecentTranscripts = () => {
    if (!transcripts || transcripts.length === 0) {
      return (
        <View style={styles.noTranscripts}>
          <MessageCircle size={48} color="#999" />
          <Text style={styles.noTranscriptsText}>No conversations yet</Text>
          <Text style={styles.noTranscriptsSubtext}>
            Conversations will appear here after {childProfile?.name} talks with their teddy bear
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.transcriptsSection}>
        <Text style={styles.sectionTitle}>Recent Conversations</Text>
        {transcripts.map((transcript) => (
          <TouchableOpacity key={transcript.id} style={styles.transcriptCard}>
            <View style={styles.transcriptHeader}>
              <Text style={styles.transcriptDate}>
                {new Date(transcript.date).toLocaleDateString()}
              </Text>
              <Text style={styles.transcriptDuration}>{transcript.duration}</Text>
            </View>
            <Text style={styles.transcriptTitle}>{transcript.episodeTitle}</Text>
            <Text style={styles.transcriptPreview} numberOfLines={2}>
              {transcript.preview}
            </Text>
            <Text style={styles.transcriptStats}>
              {transcript.conversationCount} exchanges
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading learning data...</Text>
        </View>
      );
    }

    if (!childProfile) {
      return renderNoChild();
    }

    if (!childProfile.deviceId) {
      return renderNoDevice();
    }

    return (
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderDeviceStatus()}
        {renderMetricsCards()}
        {renderRecentTranscripts()}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning Progress</Text>
        {childProfile && (
          <Text style={styles.headerSubtitle}>
            Tracking {childProfile.name}'s language journey
          </Text>
        )}
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  noChildContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noChildTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  noChildSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  statusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  childAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusIcon: {
    marginLeft: 12,
  },
  deviceDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  lastSeen: {
    fontSize: 11,
    color: '#999',
  },
  noDeviceCard: {
    margin: 16,
    padding: 32,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noDeviceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    textAlign: 'center',
  },
  noDeviceSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  deviceHint: {
    fontSize: 14,
    color: Colors.light.primary,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  metricCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  transcriptsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  transcriptCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transcriptDate: {
    fontSize: 14,
    color: '#666',
  },
  transcriptDuration: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  transcriptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  transcriptPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  transcriptStats: {
    fontSize: 12,
    color: '#999',
  },
  noTranscripts: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noTranscriptsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
  },
  noTranscriptsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default SimplifiedMetricsScreen;