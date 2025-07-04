// api/metricsService.js - Connect to real backend
export const getChildMetrics = async (childId) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      // Get child's linked device ID
      const childProfile = await getChildProfile(childId);
      if (!childProfile.deviceId) {
        throw new Error('No device linked to this child');
      }
      
      // Fetch real metrics from backend
      const response = await fetch(`${API_BASE_URL}/users/${childProfile.deviceId}/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      return {
        wordsLearned: data.words_learnt || [],
        topicsLearned: data.topics_learnt || [],
        totalSessions: data.total_sessions || 0,
        totalMinutes: Math.round(data.total_session_time / 60) || 0,
        currentEpisode: data.current_episode || 1,
        currentSeason: data.current_season || 1
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  };
  
  export const getChildTranscripts = async (childId) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const childProfile = await getChildProfile(childId);
      const response = await fetch(`${API_BASE_URL}/users/${childProfile.deviceId}/transcripts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.json();
    } catch (error) {
      console.error('Error fetching transcripts:', error);
      return [];
    }
  };