import express from 'express';
import {
  getPublishedBlogs,
  getBlogBySlug,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Routes ---
// Get all published blog posts
router.get('/', getPublishedBlogs);
// Get a single blog post by its slug
router.get('/slug/:slug', getBlogBySlug);

// --- Admin/Content Manager Routes ---
const authorizedRoles = ['SuperAdmin', 'ContentAdmin'];

// Get all blog posts (published and unpublished)
router.get('/all', protect, authorizeRoles(...authorizedRoles), getAllBlogs);

// Get a single blog post by ID (for editing in admin)
router.get('/:id', protect, authorizeRoles(...authorizedRoles), getBlogById);

// Create a new blog post
router.post('/', protect, authorizeRoles(...authorizedRoles), createBlog);

// Update a blog post
router.put('/:id', protect, authorizeRoles(...authorizedRoles), updateBlog);

// Delete a blog post
router.delete('/:id', protect, authorizeRoles(...authorizedRoles), deleteBlog);

export default router;