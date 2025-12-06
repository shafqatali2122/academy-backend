import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  // --- THIS LINE IS RENAMED ---
  isActive: { 
    type: Boolean, 
    default: true 
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MaterialCategory', 
    default: null 
  }
}, { 
  timestamps: true 
});

const MaterialCategory = mongoose.model('MaterialCategory', categorySchema);

export default MaterialCategory;
