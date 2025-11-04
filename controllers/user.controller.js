// backend/controllers/user.controller.js

const asyncHandler = require('express-async-handler'); // Handles async errors
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (ADMIN ONLY - for initial setup)
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({ username, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});


// ✅ IMPORT MODELS for dashboard stats
const Course = require('../models/course.model');
const Blog = require('../models/blog.model');
const Enrollment = require('../models/enrollment.model');

// @desc    Get dashboard statistics (counts)
// @route   GET /api/users/dashboard-stats
// @access  Private (Admin Only)
const getDashboardStats = asyncHandler(async (req, res) => {
    const [
        totalCourses,
        publishedBlogCount,
        draftBlogCount, // NEW: unpublished blogs
        pendingEnrollmentCount,
        processedEnrollmentCount, // NEW: processed enrollments
        pendingCounsellingCount,
    ] = await Promise.all([
        Course.countDocuments({}),
        Blog.countDocuments({ isPublished: true }),
        Blog.countDocuments({ isPublished: false }),
        Enrollment.countDocuments({ courseOfInterest: { $regex: /^Counselling Request/ }, isProcessed: false }),
        Enrollment.countDocuments({ isProcessed: false }),
        Enrollment.countDocuments({ isProcessed: true }),
    ]);

    res.json({
        totalCourses,
        publishedBlogs: publishedBlogCount,
        draftBlogs: draftBlogCount,
        pendingCounselling: draftBlogCount,
        pendingEnrollments: pendingEnrollmentCount,
        processedEnrollments: processedEnrollmentCount,
        processedEnrollments: processedEnrollmentCount,
    });
});


// ✅ Export all controllers
module.exports = { 
    registerUser, 
    authUser, 
    getDashboardStats 
};
