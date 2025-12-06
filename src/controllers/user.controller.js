import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/email.js';
import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
import Course from '../models/course.model.js';
import Blog from '../models/blog.model.js';
import Enrollment from '../models/enrollment.model.js';

// --- THIS IS THE NEW FUNCTION ---
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create the new user
    const user = await User.create({
      username,
      email,
      password,
      role: 'User' // Default role for all signups
    });

    // If user was created, log them in immediately
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username, // --- UPDATED from name ---
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/SuperAdmin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/SuperAdmin
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    // --- UPDATED Role List ---
    const allowedRoles = ['SuperAdmin', 'AdmissionsAdmin', 'ContentAdmin', 'AudienceAdmin', 'User'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = role;
    await user.save();
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- NEW FUNCTION ---
// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Prevent deleting a SuperAdmin
    if (user.role === 'SuperAdmin') {
      return res.status(400).json({ message: 'Cannot delete a SuperAdmin' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// --- END NEW FUNCTION ---

// --- NEW FUNCTION 1: FORGOT PASSWORD ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // IMPORTANT: For security, always send a success message
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // 1. Generate the reset token (unhashed)
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // Save hashed token to DB

    // 2. Send the email with the unhashed token
    await sendPasswordResetEmail(user.email, resetToken);

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    // Clear tokens if something failed
    if (req.user) {
      req.user.passwordResetToken = undefined;
      req.user.passwordResetExpires = undefined;
      await req.user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ message: 'Error sending reset email' });
  }
};

// --- NEW FUNCTION 2: RESET PASSWORD ---
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // 1. Hash the token from URL to match DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 2. Find user by hashed token and check expiry
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // 3. Set new password and clear token fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 4. Log the user in by returning new JWT
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/users/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ isPublished: true });
    const draftBlogs = await Blog.countDocuments({ isPublished: false });
    const pendingCounselling = await Enrollment.countDocuments({ 
      status: 'Pending', 
      courseOfInterest: 'Academic Counseling' 
    });
    const pendingEnrollments = await Enrollment.countDocuments({ 
      status: 'Pending', 
      courseOfInterest: { $ne: 'Academic Counseling' } 
    });
    const processedEnrollments = await Enrollment.countDocuments({ 
      status: { $ne: 'Pending' } 
    });

    res.json({
      totalCourses,
      publishedBlogs,
      draftBlogs,
      pendingCounselling,
      pendingEnrollments,
      processedEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
