import express from 'express';
import {
  getHomeConfig,
  updateHomeConfig,
} from '../controllers/home.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/home
// Public route to get homepage content
router.get('/', getHomeConfig);

// @route   PUT /api/home
// Private route to update homepage content
router.put(
  '/',
  protect,
  authorizeRoles('SuperAdmin', 'ContentAdmin'),
  updateHomeConfig
);

export default router;