// 1. Load environment variables (secrets)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ROUTE IMPORTS
const userRoute = require('./routes/user.routes');
const courseRoute = require('./routes/course.routes');
const blogRoute = require('./routes/blog.routes');
const enrollmentRoute = require('./routes/enrollment.routes');
const materialRoute = require('./routes/material.routes');
const homeRoute = require('./routes/home.routes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 2. Middleware setup
app.use(cors()); // Allow our frontend to communicate with this backend
app.use(express.json()); // Parse JSON requests

// 3. API ROUTES
app.use('/api/users', userRoute);
app.use('/api/courses', courseRoute);
app.use('/api/blogs', blogRoute);
app.use('/api/enrollments', enrollmentRoute);
app.use('/api/materials', materialRoute);
app.use('/api/home', homeRoute);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 4. Database Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB successfully connected!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// 5. Start the server (✅ Correct Order)
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
  });
