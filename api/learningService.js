// api/learningService.js
import apiClient from './axiosConfig';

// Get learning progress
export const getLearningProgress = async () => {
  try {
    const response = await apiClient.get('/learning/progress');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching learning progress:', error);
    throw error;
  }
};

// Update learning progress
export const updateLearningProgress = async (progressData) => {
  try {
    const response = await apiClient.post('/learning/progress', progressData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating learning progress:', error);
    throw error;
  }
};

// Mark a step as complete
export const completeStep = async (stepId) => {
  try {
    const response = await apiClient.post(`/learning/step/${stepId}/complete`);
    return response.data.data;
  } catch (error) {
    console.error('Error completing step:', error);
    throw error;
  }
};

// Get proficiency metrics
export const getProficiencyMetrics = async () => {
  try {
    const progress = await getLearningProgress();
    return progress.metrics || {
      proficiency: 'EASY',
      englishCapacity: null,
      foreignLanguageCapacity: null
    };
  } catch (error) {
    console.error('Error fetching proficiency metrics:', error);
    throw error;
  }
};