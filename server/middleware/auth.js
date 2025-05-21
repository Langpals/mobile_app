// middleware/auth.js
const { admin } = require('../server');

// The middleware function needs to be properly defined
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};