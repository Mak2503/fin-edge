const jwt = require('jsonwebtoken');

// Protect routes: Only allow users with valid JWT
const protect = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer') 
    ? req.headers.authorization.split(' ')[1] 
    : null;

  if (!token) {
    const err = new Error('Access denied: No token provided');
    err.statusCode = 401;
    return next(err);
  }

  try {
    // Verify token and attach user payload to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded; 
    next();
  } catch (error) {
    const err = new Error('Invalid or expired token');
    err.statusCode = 401;
    return next(err);
  }
};

module.exports = { protect };