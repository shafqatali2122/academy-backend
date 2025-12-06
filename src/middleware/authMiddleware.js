import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// --- This is our main "Logged In" check ---
export const protect = async (req, res, next) => {
  let token;

  // Read the token from the request headers
  const authHeader = req.headers.authorization || '';
  
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = authHeader.split(' ')[1];

      // Verify the token is real
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the token's ID and attach them to the request
      // We exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // User is valid, proceed to the next function
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// --- This is our "Role" check (e.g., Admin only) ---
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // We assume 'protect' middleware ran first, so req.user exists
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not authorized to access this resource` 
      });
    }
    next(); // User has the correct role, proceed
  };
};