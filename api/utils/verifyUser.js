import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    token = req.cookies.access_token;
  }

  if (!token || token === 'null' || typeof token !== 'string') {
    console.log('Invalid or no token found:', token);
    return next(errorHandler(401, 'Unauthorized'));
  }

  console.log('Token received:', token);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.name, err.message);
      return next(errorHandler(403, 'Forbidden'));
    }
    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      console.log('Invalid user ID in token:', user.id);
      return next(errorHandler(400, 'Invalid user ID in token'));
    }
    req.user = user;
    console.log('Token verified, user:', user);
    next();
  });
};