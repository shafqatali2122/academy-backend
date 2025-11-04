// backend/routes/material.routes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createCategory, getCategories, toggleCategory,
  createMaterial, getMaterials, deleteMaterial, incrementDownload
} = require('../controllers/material.controller');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

// Configuration for Multer to upload files directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sa-academy/materials',
    resource_type: 'raw', // allows pdf, docx, zip (for materials)
    public_id: (req, file) => `${Date.now()}_${file.originalname}`
  }
});
const upload = multer({ storage });

// Categories CRUD
router.post('/categories', protect, createCategory);
router.get('/categories', getCategories);
router.put('/categories/:id/toggle', protect, toggleCategory);

// Materials CRUD (Note: POST uses the file upload middleware)
router.post('/', protect, upload.single('file'), createMaterial);
router.get('/', getMaterials);
router.delete('/:id', protect, deleteMaterial);

// Login-gated download (Increments download count)
router.post('/:id/download', protect, incrementDownload);

module.exports = router;