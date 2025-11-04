// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// 1. Import ALL necessary controller functions ONCE
const { 
    registerUser, 
    authUser, 
    getDashboardStats // <-- Dynamic Dashboard Stats
} = require('../controllers/user.controller');

// 2. Define Routes
// Public Routes (No 'protect' middleware)
router.post('/', registerUser); 
router.post('/login', authUser); 

// Protected Routes (Uses the 'protect' middleware)
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;