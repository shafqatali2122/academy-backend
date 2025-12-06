import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign(
    { id }, // This is the data we are "signing" into the token
    process.env.JWT_SECRET, // This is your secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' } // Token expiration
  );
};

export default generateToken;