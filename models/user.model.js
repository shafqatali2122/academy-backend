const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            default: 'admin', // Default role for this project
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Middleware to hash the password before saving a new user or updating an existing password
userSchema.pre('save', async function (next) {
    // Check if the password was modified; if not, move to the next middleware
    if (!this.isModified('password')) {
        return next();
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10); // 10 is the complexity (higher is slower but more secure)
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Add a method to compare an entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    // The `compare` function handles the hashing and comparison logic
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
