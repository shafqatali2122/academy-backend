// backend/controllers/specialForms.controller.js

const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/enrollment.model'); // Reusing this model for simplicity
const { sendEnrollmentConfirmation } = require('../utils/email');

// @desc    Submit a new Counselling request
// @route   POST /api/special/counselling
// @access  Public (Anyone can submit a form)
const submitCounsellingRequest = asyncHandler(async (req, res) => {
    const { studentName, studentEmail, subject } = req.body; // 'subject' is the counselling topic

    const request = new Enrollment({
        studentName,
        studentEmail,
        courseOfInterest: `Counselling Request: ${subject}`, // Distinguish from normal enrollments
        message: `Topic: ${subject}`,
        isProcessed: false,
    });

    const createdRequest = await request.save();
    // 1. TRIGGER EMAIL: Notify the student their request was received
    sendEnrollmentConfirmation({
        toEmail: createdRequest.studentEmail,
        subject: `Request Received: ${createdRequest.courseOfInterest}`,
        status: 'Received', // Custom status for 'Counselling' received
        courseName: createdRequest.courseOfInterest,
    }); // <-- ADD THIS LINE
    res.status(201).json(createdRequest);
});

// @desc    Get all Counselling requests (Admin View)
// @route   GET /api/special/counselling
// @access  Private (Admin Only)
const getCounsellingRequests = asyncHandler(async (req, res) => {
    // Filter enrollments specifically tagged as 'Counselling Request'
    const requests = await Enrollment.find({ courseOfInterest: { $regex: /^Counselling Request/ } })
        .sort({ createdAt: -1 }); 
    res.json(requests);
});

module.exports = { submitCounsellingRequest, getCounsellingRequests };