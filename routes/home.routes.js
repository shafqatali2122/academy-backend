// backend/routes/home.routes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getHomeConfig, upsertHomeConfig } = require('../controllers/home.controller');

// Public Read, Private Write
router.route('/')
    .get(getHomeConfig) // Public
    .put(protect, upsertHomeConfig); // Protected Admin Update

module.exports = router;