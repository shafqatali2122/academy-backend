// backend/controllers/home.controller.js

const asyncHandler = require('express-async-handler');
const HomeConfig = require('../models/homeConfig.model');

// @desc    Get homepage configuration (Public & Admin Read)
// @route   GET /api/home
// @access  Public
exports.getHomeConfig = asyncHandler(async (_req, res) => {
  // Finds the single configuration document. Creates it if it doesn't exist yet (upsert: true)
  const doc = await HomeConfig.findOne({});
  
  // If the document is found, return it. If not, mongoose will create it on the first PUT/update.
  res.json(doc || null);
});

// @desc    Update/Save homepage configuration (Admin Write)
// @route   PUT /api/home
// @access  Private (Admin Only)
exports.upsertHomeConfig = asyncHandler(async (req, res) => {
  const body = req.body || {};
  // Find one, update with request body, create if it doesn't exist (upsert: true), return new doc (new: true)
  const doc = await HomeConfig.findOneAndUpdate({}, body, { upsert: true, new: true, setDefaultsOnInsert: true });
  res.json(doc);
});