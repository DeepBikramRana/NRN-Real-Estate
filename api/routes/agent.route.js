import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

// GET all agents - Updated to use isAgent field instead of role
router.get('/', async (req, res) => {
  try {
    const agents = await User.find({ isAgent: true }).select('-password');
    
    if (!agents || agents.length === 0) {
      return res.status(200).json([]); // Return empty array instead of error
    }
    
    res.status(200).json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;