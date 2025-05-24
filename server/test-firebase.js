// test-firebase.js - Quick test to see if Firebase file works
const path = require('path');
const fs = require('fs');

console.log('Testing Firebase service account file...');

const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
console.log('Looking for file at:', serviceAccountPath);

if (fs.existsSync(serviceAccountPath)) {
  console.log('✅ File exists!');
  
  try {
    const serviceAccount = require(serviceAccountPath);
    console.log('✅ File can be loaded!');
    console.log('Project ID:', serviceAccount.project_id);
    console.log('Client Email:', serviceAccount.client_email);
    
    // Try initializing Firebase Admin
    const admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error loading or initializing:', error.message);
  }
} else {
  console.error('❌ File not found at:', serviceAccountPath);
}