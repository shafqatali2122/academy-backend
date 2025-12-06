import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';

// We will import these routes later, one by one
import userRoutes from './src/routes/user.routes.js';
import enrollmentRoutes from './src/routes/enrollment.routes.js';
import courseRoutes from './src/routes/course.routes.js';
import blogRoutes from './src/routes/blog.routes.js';
import materialRoutes from './src/routes/material.routes.js';
import homeRoutes from './src/routes/home.routes.js';

import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

const app = express();

// --- Middleware ---
// CORS (allows frontend to talk to this backend)
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));

// Body parsers (so we can read JSON data from requests)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger (shows API requests in your terminal)
app.use(morgan('dev'));

// --- API Routes ---
// We will uncomment these as we build them
app.use('/api/users', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/home', homeRoutes);


// --- Error Handling ---
// We will create these files soon
app.use(notFound);
app.use(errorHandler);


// --- Start Server ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // We will create the connectDB function soon
    await connectDB(); 
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

// Note: We will uncomment connectDB() later, after we set up our database.
startServer();