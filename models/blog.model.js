// backend/models/blog.model.js

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: { // Critical for SEO-friendly blog post URLs
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        summary: { // Short snippet for blog index and SEO meta description
            type: String,
            required: true,
        },
        content: { // The full body of the blog article (will eventually use a Rich Text Editor)
            type: String,
            required: true,
        },
        author: { // Reference to the Admin user who wrote the post
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        image: { // Feature image URL (placeholder for Cloudinary)
            type: String,
            default: '/images/default-blog.jpg',
        },
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;