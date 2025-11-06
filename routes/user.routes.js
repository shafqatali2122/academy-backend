// backend/routes/user.routes.js

import express from 'express';
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getDashboardStats,
    getUsers,
    deleteUser,
    updateUserRole,
} from '../controllers/user.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import User from '../models/user.model.js';

const router = express.Router();

// -------------------------------------------
// PUBLIC ROUTES
// -------------------------------------------

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/users/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   PATCH /api/users/reset-password/:token
// @desc    Reset password using token
// @access  Public
router.patch('/reset-password/:token', resetPassword);

// -------------------------------------------
// PROTECTED ROUTES
// -------------------------------------------

router.get(
    '/dashboard-stats',
    protect,
    authorizeRoles(
        'SuperAdmin',
        'AdmissionsAdmin',
        'ContentAdmin',
        'AudienceAdmin',
        'admin' // temporary allowance
    ),
    getDashboardStats
);

// -------------------------------------------
// SUPER ADMIN-ONLY ROUTES
// -------------------------------------------

router.get(
    '/',
    protect,
    authorizeRoles('SuperAdmin', 'admin'),
    getUsers
);

router.put(
    '/:id/role',
    protect,
    authorizeRoles('SuperAdmin', 'admin'),
    updateUserRole
);

router.delete(
    '/:id',
    protect,
    authorizeRoles('SuperAdmin', 'admin'),
    deleteUser
);

export default router;
