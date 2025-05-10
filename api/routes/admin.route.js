import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import {
  getAdminStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getListings,
  deleteListing,
  addAgent
} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/stats', verifyToken, verifyAdmin, getAdminStats);
router.get('/users', verifyToken, verifyAdmin, getUsers);
router.get('/users/:id', verifyToken, verifyAdmin, getUser);
router.put('/users/update/:id', verifyToken, verifyAdmin, updateUser);
router.delete('/users/delete/:id', verifyToken, verifyAdmin, deleteUser);
router.get('/listings', verifyToken, verifyAdmin, getListings);
router.delete('/listings/delete/:id', verifyToken, verifyAdmin, deleteListing);
router.post('/add-agent', verifyToken, verifyAdmin, addAgent);

export default router;