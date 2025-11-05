const express = require('express');
const router = express.Router();
const {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blog.controller');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// --- Public Routes ---
// Anyone can view blogs or read by slug
router.get('/', getBlogPosts);
router.get('/slug/:slug', getBlogPostBySlug);

// --- Protected Routes ---
// Only Admin and Content Manager can create blogs
router.post(
  '/',
  protect,
  authorizeRoles('admin', 'content_manager'),
  createBlogPost
);

// Only Admin and Content Manager can update blogs
router.put(
  '/:id',
  protect,
  authorizeRoles('admin', 'content_manager'),
  updateBlogPost
);

// Only Admin and Content Manager can get blog by ID (for edit forms)
router.get(
  '/:id',
  protect,
  authorizeRoles('admin', 'content_manager'),
  getBlogPostById
);

// Only Admin can delete blogs
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  deleteBlogPost
);

module.exports = router;
