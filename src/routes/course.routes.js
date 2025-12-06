import express from 'express';
import {
  getPublishedCourses,
  getCourseBySlug,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Routes ---
// Get all published courses
router.get('/', getPublishedCourses);
// Get a single course by its slug
router.get('/slug/:slug', getCourseBySlug);

// --- Admin/Content Manager Routes ---
const authorizedRoles = ['SuperAdmin', 'ContentAdmin'];

// Get all courses (published and unpublished)
router.get('/all', protect, authorizeRoles(...authorizedRoles), getAllCourses);

// Get a single course by ID (for editing in admin)
router.get('/:id', protect, authorizeRoles(...authorizedRoles), getCourseById);

// Create a new course
router.post('/', protect, authorizeRoles(...authorizedRoles), createCourse);

// Update a course
router.put('/:id', protect, authorizeRoles(...authorizedRoles), updateCourse);

// Delete a course
router.delete('/:id', protect, authorizeRoles(...authorizedRoles), deleteCourse);

export default router;