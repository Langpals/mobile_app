// routes/learning.js
const express = require('express');
const { db, admin } = require('../server');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/learning/progress
// @desc    Get learning progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const uid = req.user.uid;
    
    // Get learning progress from Firestore
    const progressDoc = await db.collection('learning').doc(uid).get();
    
    if (!progressDoc.exists) {
      // Return default progress
      return res.status(200).json({
        success: true,
        data: {
          currentEpisode: 1,
          progress: {
            completedSteps: [],
            currentStep: 1
          },
          metrics: {
            proficiency: 'EASY',
            englishCapacity: null,
            foreignLanguageCapacity: null
          }
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: progressDoc.data()
    });
  } catch (error) {
    console.error('Error fetching learning progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learning progress'
    });
  }
});

// @route   POST /api/learning/progress
// @desc    Update learning progress
// @access  Private
router.post('/progress', protect, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { currentEpisode, progress, metrics } = req.body;
    
    // Prepare learning data
    const learningData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (currentEpisode) learningData.currentEpisode = currentEpisode;
    if (progress) learningData.progress = progress;
    if (metrics) learningData.metrics = metrics;
    
    // Check if learning record exists
    const learningDoc = await db.collection('learning').doc(uid).get();
    
    if (!learningDoc.exists) {
      // Create new learning record
      learningData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      // Set defaults if not provided
      if (!currentEpisode) learningData.currentEpisode = 1;
      if (!progress) learningData.progress = { completedSteps: [], currentStep: 1 };
      if (!metrics) learningData.metrics = { proficiency: 'EASY', englishCapacity: null, foreignLanguageCapacity: null };
    }
    
    // Save learning progress
    await db.collection('learning').doc(uid).set(learningData, { merge: true });
    
    // Get updated learning progress
    const updatedLearningDoc = await db.collection('learning').doc(uid).get();
    
    res.status(200).json({
      success: true,
      data: updatedLearningDoc.data()
    });
  } catch (error) {
    console.error('Error saving learning progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save learning progress'
    });
  }
});

// @route   POST /api/learning/step/:stepId/complete
// @desc    Mark a step as complete
// @access  Private
router.post('/step/:stepId/complete', protect, async (req, res) => {
  try {
    const uid = req.user.uid;
    const stepId = parseInt(req.params.stepId);
    
    // Get learning progress
    const learningDoc = await db.collection('learning').doc(uid).get();
    
    let learningData = {};
    
    if (learningDoc.exists) {
      // Get existing data
      learningData = learningDoc.data();
      
      // Update data
      const completedSteps = learningData.progress?.completedSteps || [];
      if (!completedSteps.includes(stepId)) {
        completedSteps.push(stepId);
      }
      
      await db.collection('learning').doc(uid).update({
        'progress.completedSteps': completedSteps,
        'progress.currentStep': stepId + 1,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Create new learning record
      learningData = {
        currentEpisode: 1,
        progress: {
          completedSteps: [stepId],
          currentStep: stepId + 1
        },
        metrics: {
          proficiency: 'EASY',
          englishCapacity: null,
          foreignLanguageCapacity: null
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection('learning').doc(uid).set(learningData);
    }
    
    // Get updated learning progress
    const updatedLearningDoc = await db.collection('learning').doc(uid).get();
    
    res.status(200).json({
      success: true,
      data: updatedLearningDoc.data()
    });
  } catch (error) {
    console.error('Error completing step:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete step'
    });
  }
});

module.exports = router;