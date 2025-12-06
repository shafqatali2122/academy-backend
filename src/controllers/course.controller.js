import Course from '../models/course.model.js';

// --- Public Functions ---

// @desc    Fetch all published courses
// @route   GET /api/courses
// @access  Public
export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Fetch a single course by its slug
// @route   GET /api/courses/slug/:slug
// @access  Public
export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ 
      slug: req.params.slug, 
      isPublished: true 
    });
    
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Admin/Content Manager Functions ---

// @desc    Get all courses (published and unpublished)
// @route   GET /api/courses/all
// @access  Private/Admin/ContentMgr
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single course by ID (for editing)
// @route   GET /api/courses/:id
// @access  Private/Admin/ContentMgr
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin/ContentMgr
export const createCourse = async (req, res) => {
  try {
    // Basic validation
    const { title, slug, description, price } = req.body;
    if (!title || !slug || !description) {
      return res.status(400).json({ message: 'Title, slug, and description are required' });
    }

    // Check if slug is unique
    const slugExists = await Course.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'Slug already exists. Please use a unique one.' });
    }

    const course = new Course({
      title,
      slug,
      description,
      price,
      fullContent: req.body.fullContent || '',
      image: req.body.image || null,
      isPublished: req.body.isPublished || false,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin/ContentMgr
export const updateCourse = async (req, res) => {
  try {
    const { title, slug, description, price, fullContent, image, isPublished } = req.body;
    
    const course = await Course.findById(req.params.id);

    if (course) {
      // Check for slug uniqueness if it's being changed
      if (slug && slug !== course.slug) {
        const slugExists = await Course.findOne({ slug });
        if (slugExists) {
          return res.status(400).json({ message: 'Slug already exists.' });
        }
        course.slug = slug;
      }

      course.title = title || course.title;
      course.description = description || course.description;
      course.price = price !== undefined ? price : course.price;
      course.fullContent = fullContent !== undefined ? fullContent : course.fullContent;
      course.image = image !== undefined ? image : course.image;
      course.isPublished = isPublished !== undefined ? isPublished : course.isPublished;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin/ContentMgr
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await course.deleteOne();
      // TODO: Add logic here to delete the 'image' from Cloudinary
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};