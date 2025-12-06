import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  // This links to our other model
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaterialCategory',
    required: true,
  },
  fileUrl: {
    type: String, // URL from Cloudinary
    required: true,
  },
  fileType: {
    type: String, // e.g., 'PDF', 'DOCX', 'Image'
  },
  sizeKB: {
    type: Number, // File size in kilobytes
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  cloudinaryPublicId: {
    type: String, // This is needed so we can delete the file from Cloudinary
  },
}, {
  timestamps: true,
});

const Material = mongoose.model('Material', materialSchema);

export default Material;