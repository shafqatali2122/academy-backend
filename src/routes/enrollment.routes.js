import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  createEnrollment,
  listEnrollments,
  setStatus,
  removeEnrollment,
} from '../controllers/enrollment.controller.js';

const router = express.Router();

// @route   POST /api/enrollments
// Public route for submitting the form
router.post('/', createEnrollment);

// @route   GET /api/enrollments
// Protected route for admins, admissions, and marketing
router.get(
  '/',
  protect,
  authorizeRoles('SuperAdmin', 'AdmissionsAdmin', 'AudienceAdmin'),
  listEnrollments
);

// @route   PUT /api/enrollments/:id/status
// Protected route for admins and admissions to accept/reject
router.put(
  '/:id/status',
  protect,
  authorizeRoles('SuperAdmin', 'AdmissionsAdmin'),
  setStatus
);

// @route   DELETE /api/enrollments/:id
// Protected route for admins and admissions to delete
router.delete(
  '/:id',
  protect,
  // FIX: Updated to grant deletion access to current roles
  authorizeRoles('SuperAdmin', 'AdmissionsAdmin'),
  removeEnrollment
);

export default router;