import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
  getAdminStats, 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser, 
  getListings, 
  deleteListing 
} from '../controllers/admin.controller.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Only admins have access to this resource' });
  }
  next();
};

router.get('/stats', verifyToken, isAdmin, getAdminStats);
router.get('/users', verifyToken, isAdmin, getUsers);
router.get('/users/:id', verifyToken, isAdmin, getUser);
router.put('/users/update/:id', verifyToken, isAdmin, updateUser);
router.delete('/users/delete/:id', verifyToken, isAdmin, deleteUser);
router.get('/listings', verifyToken, isAdmin, getListings);
router.delete('/listings/delete/:id', verifyToken, isAdmin, deleteListing);

export default router;