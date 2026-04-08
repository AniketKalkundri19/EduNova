const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the header (Format: "Bearer <token>")
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // 2. Verify the token
    // If the 2 hours have passed, this will throw an error automatically
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach user payload to the request object
    req.user = decoded; 
    next(); // Pass control to the actual route (e.g., aiRoutes)
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;