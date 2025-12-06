import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
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
  summary: {
    type: String,
    required: true, // Short description for blog list page
  },
  content: {
    type: String, // Full HTML content from Rich Text Editor
  },
  image: {
    type: String, // URL from Cloudinary
    default: '/default-blog-image.png',
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;