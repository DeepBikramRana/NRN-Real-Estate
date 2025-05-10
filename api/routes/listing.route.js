import express from 'express';
import { 
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getListings,
    getAgentListings,
    getFeaturedListings,
    searchListings
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAgent } from '../utils/verifyAgent.js';

const router = express.Router();

// Public routes
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.get('/featured', getFeaturedListings);
router.get('/search', searchListings);

// Protected routes
router.post('/create', verifyToken, verifyAgent, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);

// Agent-specific routes
router.get('/agent', verifyToken, verifyAgent, getAgentListings);

export default router;