// backend/controllers/blog.controller.js

const asyncHandler = require('express-async-handler');
const Blog = require('../models/blog.model');

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (Admin Only)
const createBlogPost = asyncHandler(async (req, res) => {
    const { title, slug, summary, content, isPublished, image } = req.body;

    const blog = new Blog({
        title,
        slug,
        summary,
        content,
        isPublished,
        image,
        author: req.user._id, // Set the author from authMiddleware req.user
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
});

// @desc    Get all blog posts (Admin List View - shows published and draft)
// @route   GET /api/blogs
// @access  Public (Initially, but filters should be applied later if used publicly)
const getBlogPosts = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({}).populate('author', 'username'); // Fetch author's name
    res.json(blogs);
});

// @desc    Get single blog post by ID (For Admin Edit Page)
// @route   GET /api/blogs/:id
// @access  Private (Admin Only)
const getBlogPostById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
        res.json(blog);
    } else {
        res.status(404);
        throw new Error('Blog post not found');
    }
});


// @desc    Get single blog post by slug (For public post detail page)
// @route   GET /api/blogs/slug/:slug
// @access  Public
const getBlogPostBySlug = asyncHandler(async (req, res) => {
    // Public view only gets published posts
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).populate('author', 'username');

    if (blog) {
        res.json(blog);
    } else {
        res.status(404);
        throw new Error('Blog post not found or not published');
    }
});

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin Only)
const updateBlogPost = asyncHandler(async (req, res) => {
    const { title, slug, summary, content, isPublished, image } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (blog) {
        // Update fields
        blog.title = title || blog.title;
        blog.slug = slug || blog.slug;
        blog.summary = summary || blog.summary;
        blog.content = content || blog.content;
        blog.isPublished = isPublished ?? blog.isPublished;
        blog.image = image || blog.image;

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } else {
        res.status(404);
        throw new Error('Blog post not found');
    }
});

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin Only)
const deleteBlogPost = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
        await blog.deleteOne();
        res.json({ message: 'Blog post removed' });
    } else {
        res.status(404);
        throw new Error('Blog post not found');
    }
});

module.exports = { 
    createBlogPost, 
    getBlogPosts, 
    getBlogPostById,
    getBlogPostBySlug, 
    updateBlogPost, 
    deleteBlogPost 
};