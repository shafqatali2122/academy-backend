// backend/models/course.model.js

const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: { // Critical for SEO-friendly URLs (e.g., /courses/mern-mastery)
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: { // Short description used for SEO Meta Tag and card preview
            type: String,
            required: true,
        },
        fullContent: { // Detailed course content
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        image: { // URL for the course thumbnail (we will update this for Cloudinary later)
            type: String,
            default: '/images/default-course.jpg',
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        // Reference to the Admin who created the course (optional but good practice)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true, // createdAt and updatedAt
    }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;