import mongoose from 'mongoose';

const homeConfigSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    enabled: { type: Boolean, default: true },
    title: String,
    subtitle: String,
    ctaText: String, // e.g., "Enroll Now"
    ctaHref: String, // e.g., "/enroll"
    bgImageUrl: String // URL from Cloudinary
  },
  
  // Announcement Bar
  announcement: { 
    enabled: Boolean, 
    text: String, 
    href: String 
  },
  
  // Featured Courses Section
  coursesShowcase: { 
    enabled: Boolean, 
    heading: String, 
    limit: Number // e.g., show 3 courses
  },
  
  // YouTube Media Gallery
  mediaGallery: { 
    enabled: Boolean, 
    heading: String, 
    youtubeIds: [String] // An array of YouTube video IDs
  },
  
  // Featured Blog Posts
  blogSpotlight: { 
    enabled: Boolean, 
    heading: String, 
    limit: Number // e.g., show 2 posts
  },
  
  // Owner/About Section
  ownerSection: { 
    enabled: Boolean, 
    heading: String, 
    bio: String, 
    avatarUrl: String // URL from Cloudinary
  },
  
  // Simple "Donate" link
  donate: { 
    enabled: Boolean, 
    text: String, 
    donateHref: String 
  },
  
  // Simple "Join Team" link
  joinTeam: { 
    enabled: Boolean, 
    text: String, 
    joinHref: String 
  }
}, { 
  timestamps: true 
});

const HomeConfig = mongoose.model('HomeConfig', homeConfigSchema);

export default HomeConfig;