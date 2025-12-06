import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { connectDB } from '../config/db.js';

const ADMIN_EMAIL = 'admin@saa.com';
const ADMIN_PASSWORD = 'Admin@12345';

const seedAdmin = async () => {
  try {
    await connectDB();
    const exists = await User.findOne({ email: ADMIN_EMAIL });

    if (exists) {
      // --- UPDATE EXISTING ADMIN ---
      exists.username = 'Super Admin';
      exists.role = 'SuperAdmin';
      await exists.save();
      console.log('✅ Admin user UPDATED successfully!');
    } else {
      // --- CREATE NEW ADMIN ---
      await User.create({
        username: 'Super Admin', // --- UPDATED ---
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'SuperAdmin', // --- UPDATED ---
      });
      console.log('✅ Admin user CREATED successfully!');
    }
    
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: (The one you set)`);

  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();