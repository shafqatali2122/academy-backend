// backend/controllers/enrollment.controller.js

const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/enrollment.model');
const { sendEnrollmentConfirmation } = require('../utils/email');

// @desc    Submit a new enrollment form
// @route   POST /api/enrollments
// @access  Public (Anyone can submit a form)
const submitEnrollment = asyncHandler(async (req, res) => {
    const { studentName, studentEmail, courseOfInterest, message } = req.body;

    const enrollment = new Enrollment({
        studentName,
        studentEmail,
        courseOfInterest,
        message,
    });

    const createdEnrollment = await enrollment.save();
    res.status(201).json(createdEnrollment);
});

// @desc    Get all enrollments (Admin List View)
// @route   GET /api/enrollments
// @access  Private (Admin Only)
const getEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({}).sort({ createdAt: -1 }); // Show newest first
    res.json(enrollments);
});

// @desc    Update enrollment status (toggle version — legacy support)
// @route   PUT /api/enrollments/:id/process
// @access  Private (Admin Only)
const updateEnrollmentStatus = asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id);

    if (enrollment) {
        enrollment.isProcessed = !enrollment.isProcessed; 
        const updatedEnrollment = await enrollment.save();
        const newStatus = updatedEnrollment.isProcessed ? 'Accepted' : 'Rejected'; 

        // Trigger email
        sendEnrollmentConfirmation({
            toEmail: updatedEnrollment.studentEmail,
            subject: `${newStatus} for ${updatedEnrollment.courseOfInterest}`,
            status: newStatus,
            courseName: updatedEnrollment.courseOfInterest,
        });

        res.json(updatedEnrollment);
    } else {
        res.status(404);
        throw new Error('Enrollment record not found');
    }
});

// @desc    Explicitly set enrollment status (Accept / Reject)
// @route   PUT /api/enrollments/:id/status
// @access  Private (Admin Only)
const updateEnrollmentStatusExplicit = asyncHandler(async (req, res) => {
    const { status } = req.body; // status = 'Accepted' or 'Rejected'
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
        res.status(404);
        throw new Error('Enrollment record not found');
    }

    // Mark processed regardless of acceptance or rejection
    enrollment.isProcessed = true;

    const updatedEnrollment = await enrollment.save();

    // Send email notification
    sendEnrollmentConfirmation({
        toEmail: updatedEnrollment.studentEmail,
        subject: `Decision: ${status} for ${updatedEnrollment.courseOfInterest}`,
        status,
        courseName: updatedEnrollment.courseOfInterest,
    });

    res.json(updatedEnrollment);
});

// @desc    Delete an enrollment record
// @route   DELETE /api/enrollments/:id
// @access  Private (Admin Only)
const deleteEnrollment = asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id);

    if (enrollment) {
        await enrollment.deleteOne();
        res.json({ message: 'Enrollment record removed' });
    } else {
        res.status(404);
        throw new Error('Enrollment record not found');
    }
});

// ✅ Export all controllers
module.exports = { 
    submitEnrollment, 
    getEnrollments, 
    updateEnrollmentStatus, 
    updateEnrollmentStatusExplicit, 
    deleteEnrollment 
};
