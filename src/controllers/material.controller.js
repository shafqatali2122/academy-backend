import MaterialCategory from '../models/materialCategory.model.js';
import Material from '../models/material.model.js';
import cloudinary from '../config/cloudinary.js'; // --- IMPORT CLOUDINARY ---
import streamifier from 'streamifier'; // --- HELPER FOR UPLOADING BUFFER ---

// --- Category Functions (These are UNCHANGED) ---

export const createCategory = async (req, res) => {
  try {
    const { name, slug, parent } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }
    const slugExists = await MaterialCategory.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    const category = await MaterialCategory.create({ 
      name, 
      slug, 
      parent: parent || null 
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await MaterialCategory.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await MaterialCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    category.isActive = !category.isActive;
    await category.save();
    res.json({ message: 'Category status updated', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await MaterialCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Material Functions (These are NEW or UPDATED) ---

// --- THIS IS THE FULLY REBUILT UPLOAD FUNCTION ---
// @desc    Create a new material (file upload)
// @route   POST /api/materials
// @access  Private/Admin/ContentMgr
export const createMaterial = async (req, res) => {
  // 1. Get text data from the form body
  const { title, category, description, isPublished } = req.body;

  // 2. Get the file buffer from req.file (thanks to uploadMiddleware)
  const fileBuffer = req.file.buffer;

  if (!title || !category || !fileBuffer) {
    return res.status(400).json({ message: 'Title, Category, and File are required' });
  }

  try {
    // 3. Create a promise-based upload stream to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        
        // We tell Cloudinary to expect a 'raw' file (like PDF/ZIP)
        // and store it in a folder called 'saa_materials'
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            resource_type: 'raw',
            folder: 'saa_materials',
            public_id: req.file.originalname.split('.')[0] // Use original name
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        // We send the file buffer to the stream
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    };

    // 4. Execute the upload
    const uploadResult = await uploadToCloudinary();

    // 5. Create the document in our MongoDB database
    const material = await Material.create({
      title,
      category,
      description: description || '',
      isPublished: isPublished === 'true' ? true : false,
      
      // Data from Cloudinary
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      fileType: uploadResult.format || req.file.mimetype,
      sizeKB: Math.round(uploadResult.bytes / 1024), // Convert bytes to KB
    });

    res.status(201).json(material);

  } catch (error) {
    console.error('File upload failed:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

// --- THIS IS THE UPDATED DELETE FUNCTION ---
// @desc    Delete a material
// @route   DELETE /api/materials/:id
// @access  Private/Admin/ContentMgr
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (material) {
      // 1. Delete the file from Cloudinary
      // We must specify 'raw' to delete non-image files
      await cloudinary.uploader.destroy(material.cloudinaryPublicId, { 
        resource_type: 'raw' 
      });

      // 2. Delete the document from MongoDB
      await material.deleteOne();
      
      res.json({ message: 'Material and Cloudinary file removed' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    console.error('Delete material failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// --- THESE FUNCTIONS ARE UNCHANGED ---

export const getPublishedMaterials = async (req, res) => {
  try {
    const filter = { isPublished: true };
    if (req.query.category) {
      const category = await MaterialCategory.findOne({ slug: req.query.category, isActive: true });
      if (category) {
        filter.category = category._id;
      } else {
        return res.json([]); 
      }
    }
    const materials = await Material.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (material) {
      material.downloads += 1;
      await material.save();
      res.json({ fileUrl: material.fileUrl });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};