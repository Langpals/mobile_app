// routes/auth.js
const express = require('express');
const { admin } = require('../server');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/auth/user
// @desc    Get current user data
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    // User ID is available from the middleware
    const uid = req.user.uid;
    
    // Get user from Firebase Auth
    const userRecord = await admin.auth().getUser(uid);
    
    res.status(200).json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: userRecord.customClaims?.role || 'user'
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data'
    });
  }
});

// @route   POST /api/auth/set-role
// @desc    Set user role (e.g., parent or child)
// @access  Private
router.post('/set-role', protect, async (req, res) => {
  try {
    const { role } = req.body;
    const uid = req.user.uid;
    
    // Validate role
    if (!role || !['parent', 'child'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "parent" or "child"'
      });
    }
    
    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, { role });
    
    res.status(200).json({
      success: true,
      message: `Role set to ${role} successfully`
    });
  } catch (error) {
    console.error('Error setting user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set user role'
    });
  }
});

module.exports = router;