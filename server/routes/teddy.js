// routes/teddy.js
const express = require('express');
const { db } = require('../server');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/teddy
// @desc    Get user's teddy
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const uid = req.user.uid;
    
    // Get teddy from Firestore
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
    const { name, appearance } = req.body;
    
    // Validate request
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    // Prepare teddy data
    const teddyData = {
      name,
      appearance: appearance || {
        color: 'brown',
        accessories: [],
        outfit: 'default'
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Check if teddy exists
    const teddyDoc = await db.collection('teddies').doc(uid).get();
    
    if (!teddyDoc.exists) {
      // Create new teddy
      teddyData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }
    
    // Save teddy
    await db.collection('teddies').doc(uid).set(teddyData, { merge: true });
    
    // Get updated teddy
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