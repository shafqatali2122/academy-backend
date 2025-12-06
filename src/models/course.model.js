import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  fullContent: {
    type: String, // This will store HTML from the Rich Text Editor
  },
  image: {
    type: String, // This will be a URL from Cloudinary
    default: '/default-course-image.png',
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

export default Course;