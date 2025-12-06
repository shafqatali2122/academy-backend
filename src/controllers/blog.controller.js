import Blog from '../models/blog.model.js';

// --- Public Functions ---

// @desc    Fetch all published blog posts
// @route   GET /api/blogs
// @access  Public
export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Fetch a single blog post by its slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      isPublished: true 
    });
    
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Admin/Content Manager Functions ---

// @desc    Get all blog posts (published and unpublished)
// @route   GET /api/blogs/all
// @access  Private/Admin/ContentMgr
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single blog post by ID (for editing)
// @route   GET /api/blogs/:id
// @access  Private/Admin/ContentMgr
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private/Admin/ContentMgr
export const createBlog = async (req, res) => {
  try {
    const { title, slug, summary } = req.body;
    if (!title || !slug || !summary) {
      return res.status(400).json({ message: 'Title, slug, and summary are required' });
    }

    const slugExists = await Blog.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'Slug already exists. Please use a unique one.' });
    }

    const blog = new Blog({
      title,
      slug,
      summary,
      content: req.body.content || '',
      image: req.body.image || null,
      isPublished: req.body.isPublished || false,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin/ContentMgr
export const updateBlog = async (req, res) => {
  try {
    const { title, slug, summary, content, image, isPublished } = req.body;
    
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      if (slug && slug !== blog.slug) {
        const slugExists = await Blog.findOne({ slug });
        if (slugExists) {
          return res.status(400).json({ message: 'Slug already exists.' });
        }
        blog.slug = slug;
      }

      blog.title = title || blog.title;
      blog.summary = summary || blog.summary;
      blog.content = content !== undefined ? content : blog.content;
      blog.image = image !== undefined ? image : blog.image;
      blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin/ContentMgr
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await blog.deleteOne();
      // TODO: Add logic here to delete the 'image' from Cloudinary
      res.json({ message: 'Blog post removed' });
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};