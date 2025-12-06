import HomeConfig from '../models/homeConfig.model.js';

// Helper function to get or create the config
const getOrCreateConfig = async () => {
  let config = await HomeConfig.findOne(); // Find the one config
  if (!config) {
    // If it doesn't exist, create the first one
    config = await HomeConfig.create({});
  }
  return config;
};

// @desc    Get the homepage configuration
// @route   GET /api/home
// @access  Public
export const getHomeConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update the homepage configuration
// @route   PUT /api/home
// @access  Private/Admin/ContentMgr
export const updateHomeConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    
    // Update the config with whatever data is sent in the body
    const updatedConfig = await HomeConfig.findByIdAndUpdate(
      config._id,
      req.body,
      { new: true } // Return the updated document
    );
    
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};