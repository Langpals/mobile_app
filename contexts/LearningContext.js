// contexts/LearningContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getLearningProgress, 
  updateLearningProgress, 
  completeStep,
  getProficiencyMetrics
} from '../api/learningService';
import { useAuth } from './AuthContext';

// Create context
const LearningContext = createContext();

// Provider component
export const LearningProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [proficiency, setProficiency] = useState('EASY');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch learning progress when user changes
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) {
        setProgress(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const progressData = await getLearningProgress();
        setProgress(progressData);
        
        // Update state with fetched data
        if (progressData) {
          setCurrentEpisode(progressData.currentEpisode || 1);
          setCompletedSteps(progressData.progress?.completedSteps || []);
          setCurrentStep(progressData.progress?.currentStep || 1);
          setProficiency(progressData.metrics?.proficiency || 'EASY');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching learning progress:', err);
        setError('Failed to load learning progress');
        setLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser]);

  // Update progress
  const updateProgress = async (progressData) => {
    setLoading(true);
    try {
      const updatedProgress = await updateLearningProgress(progressData);
      setProgress(updatedProgress);
      
      // Update state with new data
      if (updatedProgress) {
        if (progressData.currentEpisode) {
          setCurrentEpisode(updatedProgress.currentEpisode);
        }
        
        if (progressData.progress) {
          setCompletedSteps(updatedProgress.progress.completedSteps || []);
          setCurrentStep(updatedProgress.progress.currentStep || 1);
        }
        
        if (progressData.metrics) {
          setProficiency(updatedProgress.metrics.proficiency || 'EASY');
        }
      }
      
      setLoading(false);
      return updatedProgress;
    } catch (err) {
      console.error('Error updating learning progress:', err);
      setError('Failed to update learning progress');
      setLoading(false);
      throw err;
    }
  };

  // Mark step as complete
  const markStepComplete = async (stepId) => {
    setLoading(true);
    try {
      const updatedProgress = await completeStep(stepId);
      setProgress(updatedProgress);
      
      // Update completed steps
      if (updatedProgress?.progress?.completedSteps) {
        setCompletedSteps(updatedProgress.progress.completedSteps);
      }
      
      // Update current step
      if (updatedProgress?.progress?.currentStep) {
        setCurrentStep(updatedProgress.progress.currentStep);
      }
      
      setLoading(false);
      return updatedProgress;
    } catch (err) {
      console.error('Error completing step:', err);
      setError('Failed to complete step');
      setLoading(false);
      throw err;
    }
  };

  // Check if step is completed
  const isStepCompleted = (stepId) => {
    return completedSteps.includes(stepId);
  };

  // Calculate progress percentage
  const getProgressPercentage = (totalSteps) => {
    if (!totalSteps) return 0;
    return Math.round((completedSteps.length / totalSteps) * 100);
  };

  const value = {
    progress,
    currentEpisode,
    completedSteps,
    currentStep,
    proficiency,
    loading,
    error,
    updateProgress,
    markStepComplete,
    isStepCompleted,
    getProgressPercentage
  };

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
};

// Create a hook to use the learning context
export const useLearning = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};