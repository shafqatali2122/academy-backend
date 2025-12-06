import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // <-- ADDED

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6 
    },
    role: { 
      type: String, 
      enum: ['SuperAdmin', 'AdmissionsAdmin', 'ContentAdmin', 'AudienceAdmin', 'User'], 
      default: 'User' 
    },

    // --- NEW FIELDS FOR PASSWORD RESET ---
    passwordResetToken: String,
    passwordResetExpires: Date,

  },
  { 
    timestamps: true 
  }
);

// --- Model Methods (UNCHANGED) ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- NEW METHOD ---
// This function creates a reset token, but hashes it before saving to DB
userSchema.methods.createPasswordResetToken = function () {
  // 1. Create a simple, random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2. Hash the token and save it to the database (more secure)
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Set token to expire in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // 4. Return the *unhashed* token (this is what we email to the user)
  return resetToken;
};

// --- Middleware (Hooks) (UNCHANGED) ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;