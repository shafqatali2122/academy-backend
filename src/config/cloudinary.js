import { v2 as cloudinary } from 'cloudinary';

// This configures the Cloudinary package with your secret keys
// We will get these keys from the Cloudinary website later
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;