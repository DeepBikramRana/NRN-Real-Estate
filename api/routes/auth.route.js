import express from 'express';
import { signin, signup } from '../controllers/auth.controller.js';

const router = express.Router(); // Use express.Router() here

// Define your route
router.post('/signup', signup);
// Define your route
router.post('/signin', signin);

export default router; // Export the router as the default export
