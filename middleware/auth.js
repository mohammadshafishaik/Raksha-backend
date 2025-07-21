// backend/middleware/auth.js
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// Load environment variables (for JWT secret)
require('dotenv').config();

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token'); // Frontend will send token in 'x-auth-token' header

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // Verify the token using our JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID from the token payload to the request object
    // This makes the user ID available in subsequent route handlers (e.g., req.user.id)
    req.user = decoded.user;
    next(); // Move to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' }); // Token is invalid
  }
};
