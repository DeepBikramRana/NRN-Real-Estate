import { errorHandler } from './error.js';

export const verifyAgent = (req, res, next) => {
    if (!req.user?.isAgent && !req.user?.isAdmin) {
        return next(errorHandler(403, 'Agent privileges required'));
    }
    next();
};