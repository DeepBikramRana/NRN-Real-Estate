import { errorHandler } from './error.js';

export const verifyAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admins can perform this action'));
  }
  next();
};