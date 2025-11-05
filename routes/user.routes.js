// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const {
  registerUser,
  authUser,
  getDashboardStats,
  getUsers,
  deleteUser,
  updateUserRole,
} = require('../controllers/user.controller');

// -------------------------------------------
// PUBLIC ROUTES
// -------------------------------------------
router.post('/', registerUser);
router.post('/login', authUser);

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
    'admin' // <-- TEMPORARY FIX ADDED
  ),
  getDashboardStats
);

// -------------------------------------------
// SUPER ADMIN-ONLY ROUTES
// -------------------------------------------

router.get(
  '/',
  protect,
  authorizeRoles('SuperAdmin', 'admin'), // <-- TEMPORARY FIX ADDED
  getUsers
);

router.put(
  '/:id/role',
  protect,
  authorizeRoles('SuperAdmin', 'admin'), // <-- TEMPORARY FIX ADDED
  updateUserRole
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('SuperAdmin', 'admin'), // <-- TEMPORARY FIX ADDED
  deleteUser
);

module.exports = router;