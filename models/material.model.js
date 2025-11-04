// backend/models/material.model.js

const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterialCategory', required: true },
  fileUrl: { type: String, required: true },   // Cloudinary secure_url
  filePublicId: { type: String, required: true }, // Cloudinary public_id for deletion
  fileType: { type: String, default: 'pdf' },  // pdf, docx, pptx, zip, etc.
  isPublished: { type: Boolean, default: true },
  downloads: { type: Number, default: 0 },
  sizeKB: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);