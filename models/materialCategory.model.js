// backend/models/materialCategory.model.js

const mongoose = require('mongoose');

const MaterialCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },        // e.g. "Cambridge > Islamiyat"
  slug: { type: String, required: true, unique: true },         // "cambridge-islamiyat"
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterialCategory', default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MaterialCategory', MaterialCategorySchema);