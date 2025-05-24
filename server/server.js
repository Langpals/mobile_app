// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const admin = require('firebase-admin');

console.log('🔄 Starting server with real Firebase...');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin BEFORE creating the app
let db;
console.log('🔄 Initializing Firebase Admin...');

try {
  const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
  console.log('📁 Looking for service account at:', serviceAccountPath);
  
  // Check if service account file exists
  const fs = require('fs');
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error('firebase-service-account.json not found. Please download it from Firebase Console.');
  }
  
  console.log('✅ Service account file found!');
  const serviceAccount = require(serviceAccountPath);
  console.log('📋 Project ID:', serviceAccount.project_id);
  
  // Initialize Firebase Admin only if not already initialized
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🔥 Firebase Admin app initialized');
  }
  
  db = admin.firestore();
  console.log('✅ Firebase Admin initialized successfully');
  console.log('📊 Using real Firestore database');
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  console.log('📝 Please follow these steps:');
  console.log('   1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('   2. Click "Generate new private key"');
  console.log('   3. Save the file as "firebase-service-account.json" in the server folder');
  process.exit(1); // Exit if Firebase setup fails
}

// NOW export them before requiring routes
module.exports = { admin, db };

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'exp://localhost:8081', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working with real Firebase!',
    firebase: 'Real Firestore connected',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    firebase: 'Real Firestore connected',
    timestamp: new Date().toISOString()
  });
});

// Routes - require AFTER exports are set
app.use('/api/auth', require('./routes/auth'));
app.use('/api/teddy', require('./routes/teddy'));
app.use('/api/learning', require('./routes/learning'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});