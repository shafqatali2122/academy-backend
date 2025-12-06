import express from 'express';
import {
  registerUser,
  login,
  getUsers,
  updateRole,
  deleteUser, // --- ADD THIS ---
  getDashboardStats,
  forgotPassword,
  resetPassword
} from '../controllers/user.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- UPDATE ROLE NAME ---
const SuperAdmin = 'SuperAdmin';

// @route   POST /api/users/register
// Public route for anyone to sign up
router.post('/register', registerUser);

router.post('/login', login);

// --- PASSWORD RESET ROUTES ---
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/', protect, authorizeRoles(SuperAdmin), getUsers);
router.get('/dashboard-stats', protect, authorizeRoles(SuperAdmin, 'AdmissionsAdmin', 'ContentAdmin', 'AudienceAdmin'), getDashboardStats); // Allow all admins to see stats

// --- CHANGE TO PUT ---
router.put('/:id/role', protect, authorizeRoles(SuperAdmin), updateRole);

// --- ADD THIS ---
router.delete('/:id', protect, authorizeRoles(SuperAdmin), deleteUser);

export default router;
