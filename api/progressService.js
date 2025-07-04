// api/progressService.js
import apiClient from './axiosConfig';

// Get child's complete progress data
export const getChildProgress = async (childId) => {
  try {
    const response = await apiClient.get(`/progress/child/${childId || 'current'}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching child progress:', error);
    // Return default progress data if error
    return {
      wordsLearnt: [],
      topicsLearnt: [],
      timeSpentWithBear: 0,
      currentSeason: 1,
      currentEpisode: 1,
      completedEpisodes: [],
      learningStreak: 0,
      totalPoints: 0,
      achievements: [],
      dailyProgress: {
        wordsToday: 0,
        minutesToday: 0,
        goalsCompleted: false
      }
    };
  }
};

// Update child's progress
export const updateChildProgress = async (progressData) => {
  try {
    const response = await apiClient.post('/progress/update', progressData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

// Get learning statistics
export const getLearningStats = async (timeFrame = 'week') => {
  try {
    const response = await apiClient.get(`/progress/stats?timeFrame=${timeFrame}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching learning stats:', error);
    throw error;
  }
};

// Track learning session
export const trackLearningSession = async (sessionData) => {
  try {
    const response = await apiClient.post('/progress/session', {
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      episodeId: sessionData.episodeId,
      wordsLearnt: sessionData.wordsLearnt,
      completionRate: sessionData.completionRate
    });
    return response.data.data;
  } catch (error) {
    console.error('Error tracking session:', error);
    throw error;
  }
};

// Get vocabulary progress
export const getVocabularyProgress = async () => {
  try {
    const response = await apiClient.get('/progress/vocabulary');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching vocabulary progress:', error);
    return {
      totalWords: 0,
      masteredWords: 0,
      learningWords: 0,
      recentWords: []
    };
  }
};

// Get achievements
export const getAchievements = async () => {
  try {
    const response = await apiClient.get('/progress/achievements');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
};