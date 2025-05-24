// middleware/auth.js
const admin = require('firebase-admin');

exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to access this route. No token provided.' 
      });
    }

    try {
      // Verify Firebase token with real Firebase Admin
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      console.log('✅ Token verified for user:', decodedToken.uid);
      next();
    } catch (firebaseError) {
      console.error('❌ Firebase token verification failed:', firebaseError.message);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
};