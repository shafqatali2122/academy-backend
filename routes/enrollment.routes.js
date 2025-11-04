// backend/routes/enrollment.routes.js

const express = require('express');
const router = express.Router();
const {
    submitEnrollment,
    getEnrollments,
    updateEnrollmentStatus,
    updateEnrollmentStatusExplicit, // <-- ADD NEW CONTROLLER HERE
    deleteEnrollment,
} = require('../controllers/enrollment.controller');

const { protect } = require('../middleware/authMiddleware'); // Admin protection
const { 
    submitCounsellingRequest, 
    getCounsellingRequests 
} = require('../controllers/specialForms.controller'); // Counselling Form Controller

// -----------------------------
// Enrollment Routes
// -----------------------------

// Route for submitting the form (POST, public) and reading all (GET, protected)
router.route('/')
    .post(submitEnrollment) // PUBLIC ROUTE
    .get(protect, getEnrollments); // PRIVATE ROUTE

// Route for specific record deletion (protected)
router.route('/:id')
    .delete(protect, deleteEnrollment);

// Route for toggling status (legacy)
router.route('/:id/process')
    .put(protect, updateEnrollmentStatus);

// ✅ NEW: Route for explicit Accept/Reject status (separate buttons)
router.route('/:id/status')
    .put(protect, updateEnrollmentStatusExplicit);

// -----------------------------
// Counselling Routes
// -----------------------------

router.route('/counselling')
    .post(submitCounsellingRequest) // PUBLIC Submission
    .get(protect, getCounsellingRequests); // PRIVATE Admin View

// ✅ Always export router at the end
module.exports = router;
