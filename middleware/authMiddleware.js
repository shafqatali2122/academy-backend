// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model'); // Path is correct relative to middleware folder

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (format is "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using our secret key (from .env)
            // This is the core security check
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            
            // 3. Fetch the user associated with the token ID (excluding password)
            // req.user will now hold the logged-in user's details for the controller to use
            req.user = await User.findById(decoded.id).select('-password');
            
            // If verification and user lookup succeed, proceed to the next function (the controller)
            next();

        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401);
            // Throwing an error here triggers Express's error handler
            throw new Error('Not authorized, token failed');
        }
    }

    // 4. If no token is found in the header
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };