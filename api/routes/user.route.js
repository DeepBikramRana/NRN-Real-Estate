import express from 'express';
import { 
  deleteUser, 
  test, 
  updateUser,  
  getUserListings, 
  getUser,
  getAgents,
  uploadImage, // Add the new uploadImage function
  uploadMiddleware, // Add the new uploadMiddleware
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// IMPORTANT: Specific routes MUST come before parameterized routes
router.get('/test', test);
router.get('/agents', getAgents); // Move this BEFORE /:id route
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.post('/upload', verifyToken, uploadMiddleware, uploadImage);

// This parameterized route MUST be last among GET routes
router.get('/:id', verifyToken, getUser);

export default router;