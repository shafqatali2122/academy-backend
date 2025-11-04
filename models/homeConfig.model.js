// backend/models/homeConfig.model.js

const mongoose = require('mongoose');

const HomeConfigSchema = new mongoose.Schema({
  // Global configuration fields
  updatedAt: { type: Date, default: Date.now },

  // Hero Section
  hero: {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: "Master Full-Stack Development with Expert Guidance" },
    subtitle: { type: String, default: "Academic Authority meets Professional Pedagogy." },
    ctaText: { type: String, default: "View Course Catalog" },
    ctaHref: { type: String, default: "/courses" },
    bgImageUrl: { type: String, default: "/images/hero-default.jpg" }
  },

  // Announcement Bar
  announcement: {
    enabled: { type: Boolean, default: false },
    text: { type: String, default: "New O-Level Islamiyat Prep Course starts next month! Enroll Now." },
    href: { type: String, default: "/contact" }
  },

  // Testimonials Section
  testimonials: {
    enabled: { type: Boolean, default: true },
    items: [{ 
      name: String, 
      role: String, 
      quote: String 
    }]
  },

  // Course Spotlight
  coursesShowcase: {
    enabled: { type: Boolean, default: true },
    heading: { type: String, default: "Our Featured Programs" },
    limit: { type: Number, default: 3 } // How many courses to display
  },

  // Media Gallery (YouTube Videos)
  mediaGallery: {
    enabled: { type: Boolean, default: true },
    heading: { type: String, default: "Session Highlights & Expert Tips" },
    youtubeIds: [String]     // Array of YouTube video IDs (e.g., ['dQw4w9WgXcQ'])
  },

  // Blog Spotlight
  blogSpotlight: {
    enabled: { type: Boolean, default: true },
    heading: { type: String, default: "Latest Insights from Our Scholars" },
    limit: { type: Number, default: 3 }
  },

  // Owner/About Section (for the 'About Page' inspiration)
  ownerSection: {
    enabled: { type: Boolean, default: true },
    heading: { type: String, default: "Meet Your Instructor: Shafqat Ali" },
    bio: { type: String, default: "M.Phil Scholar, Cambridge Certified Educator, and Founder." },
    avatarUrl: { type: String, default: "/images/owner-avatar.jpg" }
  },

  // Donation Section
  donate: {
    enabled: { type: Boolean, default: false },
    text: { type: String, default: "Help us sponsor a student’s entire course fees." },
    donateHref: { type: String, default: "/donate" }
  },
  
  // Call for Teachers/Collaborators
  joinTeam: {
    enabled: { type: Boolean, default: true },
    text: { type: String, default: "Join our mission. Become a part of our expert teaching team." },
    joinHref: { type: String, default: "/contact?subject=Teaching%20Opportunity" }
  }

}, { minimize: false, timestamps: true });

module.exports = mongoose.model('HomeConfig', HomeConfigSchema);