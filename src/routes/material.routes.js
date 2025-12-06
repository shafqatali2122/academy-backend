import express from 'express';
import {
  createCategory,
  getCategories,
  deleteCategory,
  toggleCategoryStatus, 
  createMaterial,
  getPublishedMaterials,
  deleteMaterial,
  downloadMaterial,
} from '../controllers/material.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { uploadFile } from '../middleware/uploadMiddleware.js'; // --- IMPORT THE UPLOAD MIDDLEWARE ---

const router = express.Router();

const authorizedRoles = ['SuperAdmin', 'ContentAdmin'];

// --- Category Routes (UNCHANGED) ---
router.get('/categories', getCategories);
router.post('/categories', protect, authorizeRoles(...authorizedRoles), createCategory);
router.delete('/categories/:id', protect, authorizeRoles(...authorizedRoles), deleteCategory);
router.put('/categories/:id/toggle', protect, authorizeRoles(...authorizedRoles), toggleCategoryStatus);


// --- Material Routes (UPDATED) ---
router.get('/', getPublishedMaterials);

// --- THIS ROUTE IS NOW UPDATED ---
// It will first 'protect', then 'authorize', then 'uploadFile', THEN 'createMaterial'
router.post('/', protect, authorizeRoles(...authorizedRoles), uploadFile, createMaterial);

router.delete('/:id', protect, authorizeRoles(...authorizedRoles), deleteMaterial);
router.post('/:id/download', protect, downloadMaterial);

export default router;