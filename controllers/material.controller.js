// backend/controllers/material.controller.js

const asyncHandler = require('express-async-handler');
const Material = require('../models/material.model');
const MaterialCategory = require('../models/materialCategory.model');
const cloudinary = require('../utils/cloudinary'); // Note: This utility must also exist!

// ----- Categories -----
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, slug, parent } = req.body;
  const exists = await MaterialCategory.findOne({ slug });
  if (exists) return res.status(400).json({ message: 'Slug already exists' });
  const cat = await MaterialCategory.create({ name, slug, parent: parent || null });
  res.status(201).json(cat);
});

exports.getCategories = asyncHandler(async (_req, res) => {
  const cats = await MaterialCategory.find({}).sort({ name: 1 });
  res.json(cats);
});

exports.toggleCategory = asyncHandler(async (req, res) => {
  const cat = await MaterialCategory.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  cat.isActive = !cat.isActive;
  await cat.save();
  res.json(cat);
});

// ----- Materials -----
exports.createMaterial = asyncHandler(async (req, res) => {
  // multer already handled file upload to Cloudinary (see route)
  const { title, description, category, isPublished, fileType } = req.body;
  if (!req.file || !req.file.path || !req.file.filename) {
    return res.status(400).json({ message: 'Upload failed' });
  }
  const sizeKB = Math.round((req.file.size || 0) / 1024);
  const mat = await Material.create({
    title, description, category, isPublished: isPublished !== 'false',
    fileUrl: req.file.path, filePublicId: req.file.filename,
    fileType: fileType || 'pdf', sizeKB
  });
  res.status(201).json(mat);
});

exports.getMaterials = asyncHandler(async (req, res) => {
  const { q, category, status } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (status === 'published') filter.isPublished = true;
  if (status === 'unpublished') filter.isPublished = false;

  const materials = await Material.find(filter)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });
  res.json(materials);
});

exports.deleteMaterial = asyncHandler(async (req, res) => {
  const mat = await Material.findById(req.params.id);
  if (!mat) return res.status(404).json({ message: 'Not found' });
  // delete from cloudinary
  try { await cloudinary.uploader.destroy(mat.filePublicId, { resource_type: 'raw' }); } catch (e) {
      console.error("Cloudinary deletion failed (might already be gone):", e.message);
  }
  await mat.deleteOne();
  res.json({ message: 'Deleted' });
});

exports.incrementDownload = asyncHandler(async (req, res) => {
  // Note: downloads are gated by protect middleware on this route in the router file
  const mat = await Material.findById(req.params.id);
  if (!mat) return res.status(404).json({ message: 'Not found' });
  mat.downloads += 1;
  await mat.save();
  res.json({ fileUrl: mat.fileUrl });
});