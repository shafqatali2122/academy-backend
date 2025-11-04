// backend/models/enrollment.model.js

const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true,
        },
        studentEmail: {
            type: String,
            required: true,
        },
        studentPhone: {
            type: String,
            required: false, // Phone number is optional, but useful
        },
            studentCategory: {
            type: String, // Tracks if the submitter is a student, parent, or other
        required: false,
        },
        courseOfInterest: { // Captures the name of the course the student submitted the form for
            type: String,
            required: true,
        },
        message: {
            type: String,
        },
        isProcessed: { // A status flag for the admin to track if the lead has been contacted
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;