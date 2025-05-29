// server/scripts/migrate-users.js
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Helper function to get next incremental ID
const getNextIncrementalId = async () => {
  try {
    const counterDoc = await db.collection('metadata').doc('userCounter').get();
    
    let nextId = 1;
    if (counterDoc.exists) {
      nextId = counterDoc.data().currentId + 1;
    }
    
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

// Main migration function
const migrateExistingUsers = async () => {
  try {
    console.log('🔄 Starting migration of existing Firebase users to Firestore...');
    
    // Get all Firebase users
    const listUsersResult = await admin.auth().listUsers();
    console.log(`📊 Found ${listUsersResult.users.length} Firebase users`);
    
    const migratedUsers = [];
    const skippedUsers = [];
    
    for (const userRecord of listUsersResult.users) {
      try {
        console.log(`\n🔍 Processing user: ${userRecord.uid}`);
        
        // Check if user already exists in Firestore
        const existingUserQuery = await db.collection('Users')
          .where('firebaseUID', '==', userRecord.uid)
          .limit(1)
          .get();
        
        if (!existingUserQuery.empty) {
          console.log(`✅ User ${userRecord.uid} already exists in Firestore as ${existingUserQuery.docs[0].id}`);
          skippedUsers.push({
            firebaseUID: userRecord.uid,
            firestoreID: existingUserQuery.docs[0].id,
            email: userRecord.email
          });
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
          lastLoginAt: userRecord.metadata.lastSignInTime ? 
            admin.firestore.Timestamp.fromDate(new Date(userRecord.metadata.lastSignInTime)) : 
            admin.firestore.FieldValue.serverTimestamp(),
          profile: {
            children: [],
            preferences: {
              notifications: true,
              theme: 'light'
            }
          },
          metadata: {
            creationTime: userRecord.metadata.creationTime,
            lastSignInTime: userRecord.metadata.lastSignInTime,
            emailVerified: userRecord.emailVerified,
            disabled: userRecord.disabled
          }
        };
        
        await db.collection('Users').doc(incrementalId).set(userData);
        
        migratedUsers.push({
          firebaseUID: userRecord.uid,
          firestoreID: incrementalId,
          email: userRecord.email || 'No email',
          displayName: userRecord.displayName || 'No display name'
        });
        
        console.log(`✅ Successfully created user document ${incrementalId}`);
        
      } catch (error) {
        console.error(`❌ Error migrating user ${userRecord.uid}:`, error);
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Total users migrated: ${migratedUsers.length}`);
    console.log(`⏭️ Users skipped (already exist): ${skippedUsers.length}`);
    
    if (migratedUsers.length > 0) {
      console.log('\n🆔 Newly migrated users:');
      migratedUsers.forEach(user => {
        console.log(`   ${user.firestoreID}: ${user.email} (${user.displayName})`);
      });
    }
    
    if (skippedUsers.length > 0) {
      console.log('\n⏭️ Skipped users (already exist):');
      skippedUsers.forEach(user => {
        console.log(`   ${user.firestoreID}: ${user.email}`);
      });
    }
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Run the migration
if (require.main === module) {
  migrateExistingUsers()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateExistingUsers };