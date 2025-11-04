// backend/routes/blog.routes.js

const express = require('express');
const router = express.Router();
const {
    createBlogPost,
    getBlogPosts,
    getBlogPostById, // <-- Added for Admin Edit
    getBlogPostBySlug,
    updateBlogPost,
    deleteBlogPost,
} = require('../controllers/blog.controller');
const { protect } = require('../middleware/authMiddleware');

// Route for creating (POST, protected) and reading all (GET, public)
router.route('/')
    .post(protect, createBlogPost)
    .get(getBlogPosts); 

// Routes for specific blogs by ID (protected for admin CRUD)
router.route('/:id')
    .get(protect, getBlogPostById) // <-- Protected GET by ID for Edit Form
    .put(protect, updateBlogPost)
    .delete(protect, deleteBlogPost);

// Route for reading a single blog by slug (used by the public frontend)
router.get('/slug/:slug', getBlogPostBySlug); 

module.exports = router;