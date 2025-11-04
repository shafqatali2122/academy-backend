// backend/utils/generateToken.js

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // We sign the JWT with the user's ID and our secret key from the .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token is valid for 30 days
    });
};

module.exports = generateToken;