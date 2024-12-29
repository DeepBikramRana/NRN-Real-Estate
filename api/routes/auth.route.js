import express from 'express';
import { signup } from '../controllers/auth.controller.js';

const router = express.Router(); // Use express.Router() here

// Define your route
router.post('/signup', signup);

export default router; // Export the router as the default export
