// backend/routes/course.routes.js

const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    getCourseBySlug,
    updateCourse,
    deleteCourse,
} = require('../controllers/course.controller');

const { protect } = require('../middleware/authMiddleware');

// =========================
// ROUTES
// =========================

// CREATE (Protected) + READ ALL (Public)
router.route('/')
    .post(protect, createCourse)
    .get(getCourses);

// =========================
// NEW: GET SINGLE COURSE BY ID
// =========================
router.get('/:id', async (req, res) => {
    try {
        const Course = require('../models/course.model');
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course by ID:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// UPDATE (Protected) + DELETE (Protected)
router.route('/:id')
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

// PUBLIC: GET BY SLUG (used for frontend display)
router.get('/slug/:slug', getCourseBySlug);

module.exports = router;
