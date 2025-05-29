// server/routes/users.js
const express = require('express');
const { db, admin } = require('../server');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Helper function to get next incremental ID
const getNextIncrementalId = async () => {
  try {
    // Get the metadata document that tracks the current ID counter
    const counterDoc = await db.collection('metadata').doc('userCounter').get();
    
    let nextId = 1;
    if (counterDoc.exists) {
      nextId = counterDoc.data().currentId + 1;
    }
    
    // Update the counter
    await db.collection('metadata').doc('userCounter').set({
      currentId: nextId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return `ID${nextId}`;
  } catch (error) {
    console.error('Error getting next incremental ID:', error);
    throw error;
  }
};

// @route   POST /api/users/create
// @desc    Create a new user document in Firestore
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const firebaseUID = req.user.uid;
    const { email, displayName } = req.body;
    
    console.log('🔄 Creating user document for:', firebaseUID);
    
    // Check if user already exists
    const existingUserQuery = await db.collection('Users')
      .where('firebaseUID', '==', firebaseUID)
      .limit(1)
      .get();
    
    if (!existingUserQuery.empty) {
      console.log('✅ User document already exists');
      return res.status(200).json({
        success: true,
        data: existingUserQuery.docs[0].data(),
        message: 'User document already exists'
      });
    }
    
    // Get next incremental ID
    const incrementalId = await getNextIncrementalId();
    console.log('🆔 Generated incremental ID:', incrementalId);
    
    // Create user document
    const userData = {
      firebaseUID,
      email: email || req.user.email,
      displayName: displayName || req.user.name || 'User',
      role: 'parent', // Default role
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      profile: {
        children: [],
        preferences: {
          notifications: true,
          theme: 'light'
        }
      }
    };
    
    // Save user document with incremental ID as document name
    await db.collection('Users').doc(incrementalId).set(userData);
    
    console.log('✅ User document created successfully:', incrementalId);
    
    // Return the created user data
    const createdUser = await db.collection('Users').doc(incrementalId).get();
    
    res.status(201).json({
      success: true,
      data: {
        id: incrementalId,
        ...createdUser.data()
      }
    });
  } catch (error) {
    console.error('❌ Error creating user document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user document'
    });
  }
});

// @route   GET /api/users/firebase/:firebaseUID
// @desc    Get user by Firebase UID
// @access  Private
router.get('/firebase/:firebaseUID', protect, async (req, res) => {
  try {
    const firebaseUID = req.params.firebaseUID;
    
    // Make sure user can only access their own data (unless admin)
    if (req.user.uid !== firebaseUID && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const userQuery = await db.collection('Users')
      .where('firebaseUID', '==', firebaseUID)
      .limit(1)
      .get();
    
    if (userQuery.empty) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userDoc = userQuery.docs[0];
    res.status(200).json({
      success: true,
      data: {
        id: userDoc.id,
        ...userDoc.data()
      }
    });
  } catch (error) {
    console.error('❌ Error fetching user by Firebase UID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// @route   GET /api/users/:incrementalId
// @desc    Get user by incremental ID
// @access  Private
router.get('/:incrementalId', protect, async (req, res) => {
  try {
    const incrementalId = req.params.incrementalId;
    
    const userDoc = await db.collection('Users').doc(incrementalId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user can access this data
    const userData = userDoc.data();
    if (req.user.uid !== userData.firebaseUID && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: incrementalId,
        ...userData
      }
    });
  } catch (error) {
    console.error('❌ Error fetching user by incremental ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// @route   PUT /api/users/:incrementalId
// @desc    Update user document
// @access  Private
router.put('/:incrementalId', protect, async (req, res) => {
  try {
    const incrementalId = req.params.incrementalId;
    const updates = req.body;
    
    // Get user document to check permissions
    const userDoc = await db.collection('Users').doc(incrementalId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userData = userDoc.data();
    if (req.user.uid !== userData.firebaseUID && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Prepare update data
    const updateData = {
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.firebaseUID;
    delete updateData.createdAt;
    delete updateData.id;
    
    // Update user document
    await db.collection('Users').doc(incrementalId).update(updateData);
    
    // Get updated user data
    const updatedUserDoc = await db.collection('Users').doc(incrementalId).get();
    
    res.status(200).json({
      success: true,
      data: {
        id: incrementalId,
        ...updatedUserDoc.data()
      }
    });
  } catch (error) {
    console.error('❌ Error updating user document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    const usersSnapshot = await db.collection('Users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('❌ Error fetching all users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @route   POST /api/users/migrate-existing
// @desc    Migrate existing Firebase users to Firestore (one-time operation)
// @access  Private (Admin)
router.post('/migrate-existing', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    console.log('🔄 Starting migration of existing Firebase users...');
    
    // Get all Firebase users
    const listUsersResult = await admin.auth().listUsers();
    const migratedUsers = [];
    
    for (const userRecord of listUsersResult.users) {
      try {
        // Check if user already exists in Firestore
        const existingUserQuery = await db.collection('Users')
          .where('firebaseUID', '==', userRecord.uid)
          .limit(1)
          .get();
        
        if (!existingUserQuery.empty) {
          console.log(`✅ User ${userRecord.uid} already exists in Firestore`);
          continue;
        }
        
        // Create user document
        const incrementalId = await getNextIncrementalId();
        console.log(`🆔 Creating user document ${incrementalId} for ${userRecord.uid}`);
        
        const userData = {
          firebaseUID: userRecord.uid,
          email: userRecord.email || '',
          displayName: userRecord.displayName || 'User',
          role: 'parent', // Default role
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
          profile: {
            children: [],
            preferences: {
              notifications: true,
              theme: 'light'
            }
          }
        };
        
        await db.collection('Users').doc(incrementalId).set(userData);
        migratedUsers.push(incrementalId);
        
      } catch (error) {
        console.error(`❌ Error migrating user ${userRecord.uid}:`, error);
      }
    }
    
    console.log(`✅ Migration completed. ${migratedUsers.length} users migrated.`);
    
    res.status(200).json({
      success: true,
      data: {
        migratedUsers,
        totalMigrated: migratedUsers.length
      }
    });
  } catch (error) {
    console.error('❌ Error during migration:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed'
    });
  }
});

module.exports = router;