// routes/teddy.js
const express = require('express');
const { db, admin } = require('../server');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/teddy
// @desc    Get user's teddy
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const uid = req.user.uid;
    
    // Handle mock database
    if (global.mockFirebaseAdmin) {
      // Mock response for testing - return a default teddy
      console.log('Mock: Getting teddy for user', uid);
      return res.status(200).json({
        success: true,
        data: {
          name: 'Bernie',
          appearance: {
            color: 'brown',
            accessories: [],
            outfit: 'default'
          },
          connectionStatus: {
            isConnected: false,
            batteryLevel: 0,
            lastSyncTime: new Date().toISOString()
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    // Real Firestore logic
    const teddyDoc = await db.collection('teddies').doc(uid).get();
    
    if (!teddyDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'No teddy found for this user'
      });
    }
    
    res.status(200).json({
      success: true,
      data: teddyDoc.data()
    });
  } catch (error) {
    console.error('Error fetching teddy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teddy'
    });
  }
});

// @route   POST /api/teddy
// @desc    Create or update teddy
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name, appearance, connectionStatus } = req.body;
    
    // Validate request
    if (!name && !appearance && !connectionStatus) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (name, appearance, or connectionStatus) is required'
      });
    }
    
    if (global.mockFirebaseAdmin) {
      // Mock response for testing
      console.log('Mock: Saving teddy for user', uid, req.body);
      return res.status(200).json({
        success: true,
        data: {
          name: name || 'Bernie',
          appearance: appearance || {
            color: 'brown',
            accessories: [],
            outfit: 'default'
          },
          connectionStatus: connectionStatus || {
            isConnected: false,
            batteryLevel: 0,
            lastSyncTime: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    // Real Firestore logic
    const teddyData = {
      updatedAt: new Date().toISOString()
    };
    
    if (name) teddyData.name = name;
    if (appearance) teddyData.appearance = appearance;
    if (connectionStatus) teddyData.connectionStatus = connectionStatus;
    
    const existingTeddyDoc = await db.collection('teddies').doc(uid).get();
    
    if (!existingTeddyDoc.exists) {
      teddyData.createdAt = new Date().toISOString();
      // Set defaults if not provided
      if (!name) teddyData.name = 'Bernie';
      if (!appearance) teddyData.appearance = {
        color: 'brown',
        accessories: [],
        outfit: 'default'
      };
      if (!connectionStatus) teddyData.connectionStatus = {
        isConnected: false,
        batteryLevel: 0,
        lastSyncTime: new Date().toISOString()
      };
    }
    
    await db.collection('teddies').doc(uid).set(teddyData, { merge: true });
    const updatedTeddyDoc = await db.collection('teddies').doc(uid).get();
    
    res.status(200).json({
      success: true,
      data: updatedTeddyDoc.data()
    });
  } catch (error) {
    console.error('Error saving teddy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save teddy'
    });
  }
});

module.exports = router;